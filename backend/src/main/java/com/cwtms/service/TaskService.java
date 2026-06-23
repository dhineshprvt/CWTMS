package com.cwtms.service;

import com.cwtms.dto.request.CreateTaskRequest;
import com.cwtms.dto.response.AttachmentResponse;
import com.cwtms.dto.response.TaskHistoryResponse;
import com.cwtms.dto.response.TaskResponse;
import com.cwtms.dto.response.UserResponse;
import com.cwtms.entity.*;
import com.cwtms.entity.enums.FileType;
import com.cwtms.entity.enums.Role;
import com.cwtms.entity.enums.TaskCategory;
import com.cwtms.entity.enums.TaskPriority;
import com.cwtms.entity.enums.TaskStatus;
import com.cwtms.exception.BadRequestException;
import com.cwtms.exception.ResourceNotFoundException;
import com.cwtms.exception.UnauthorizedActionException;
import com.cwtms.repository.TaskAttachmentRepository;
import com.cwtms.repository.TaskHistoryRepository;
import com.cwtms.repository.TaskRepository;
import com.cwtms.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TaskService {

    private final TaskRepository taskRepository;
    private final TaskHistoryRepository historyRepository;
    private final TaskAttachmentRepository attachmentRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;
    private final FileStorageService fileStorageService;

    // ---------------------------------------------------------------
    // Create / update / delete / assign (Supervisor)
    // ---------------------------------------------------------------

    @Transactional
    public TaskResponse createTask(CreateTaskRequest req, User supervisor) {
        Task task = Task.builder()
                .title(req.title())
                .description(req.description())
                .category(req.category())
                .customCategory(req.customCategory())
                .priority(req.priority())
                .location(req.location())
                .dueDate(req.dueDate())
                .status(TaskStatus.ASSIGNED)
                .createdBy(supervisor)
                .build();

        if (req.assignedToId() != null) {
            task.setAssignedTo(getWorkerOrThrow(req.assignedToId()));
        }

        Task saved = taskRepository.save(task);
        logHistory(saved, supervisor, null, TaskStatus.ASSIGNED, "Task created.");

        if (saved.getAssignedTo() != null) {
            notificationService.notify(saved.getAssignedTo(),
                    "You have been assigned a new task: \"" + saved.getTitle() + "\"", saved);
        }
        return TaskResponse.from(saved);
    }

    @Transactional
    public TaskResponse updateTask(Long taskId, CreateTaskRequest req, User supervisor) {
        Task task = getOwnedBySupervisorOrThrow(taskId, supervisor);
        task.setTitle(req.title());
        task.setDescription(req.description());
        task.setCategory(req.category());
        task.setCustomCategory(req.customCategory());
        task.setPriority(req.priority());
        task.setLocation(req.location());
        task.setDueDate(req.dueDate());
        return TaskResponse.from(taskRepository.save(task));
    }

    @Transactional
    public void deleteTask(Long taskId, User supervisor) {
        Task task = getOwnedBySupervisorOrThrow(taskId, supervisor);
        taskRepository.delete(task);
    }

    @Transactional
    public TaskResponse assignTask(Long taskId, Long workerId, User supervisor) {
        Task task = getOwnedBySupervisorOrThrow(taskId, supervisor);
        User worker = getWorkerOrThrow(workerId);

        TaskStatus old = task.getStatus();
        task.setAssignedTo(worker);
        task.setStatus(TaskStatus.ASSIGNED);
        Task saved = taskRepository.save(task);

        logHistory(saved, supervisor, old, TaskStatus.ASSIGNED, "Re-assigned to " + worker.getFullName() + ".");
        notificationService.notify(worker,
                "You have been assigned a task: \"" + saved.getTitle() + "\"", saved);
        return TaskResponse.from(saved);
    }

    // ---------------------------------------------------------------
    // Worker actions
    // ---------------------------------------------------------------

    @Transactional
    public TaskResponse updateStatusByWorker(Long taskId, TaskStatus newStatus, String remarks, User worker) {
        Task task = getAssignedToWorkerOrThrow(taskId, worker);

        if (!isValidWorkerTransition(task.getStatus(), newStatus)) {
            throw new IllegalStateException(
                    "Invalid status transition: " + task.getStatus() + " -> " + newStatus);
        }

        TaskStatus old = task.getStatus();
        task.setStatus(newStatus);
        Task saved = taskRepository.save(task);
        logHistory(saved, worker, old, newStatus, remarks);

        return TaskResponse.from(saved);
    }

    @Transactional
    public TaskResponse submitForReview(Long taskId, String remarks, User worker) {
        Task task = getAssignedToWorkerOrThrow(taskId, worker);

        if (task.getStatus() != TaskStatus.IN_PROGRESS) {
            throw new IllegalStateException("Only an IN_PROGRESS task can be submitted for review.");
        }

        List<TaskAttachment> attachments = attachmentRepository.findByTask_IdOrderByUploadedAtAsc(taskId);
        if (attachments.isEmpty()) {
            throw new BadRequestException("Please upload at least one photo before submitting.");
        }

        TaskStatus old = task.getStatus();
        task.setStatus(TaskStatus.SUBMITTED_FOR_REVIEW);
        Task saved = taskRepository.save(task);
        logHistory(saved, worker, old, TaskStatus.SUBMITTED_FOR_REVIEW, remarks);

        notificationService.notify(task.getCreatedBy(),
                "Worker " + worker.getFullName() + " submitted \"" + task.getTitle() + "\" for review.", saved);
        return TaskResponse.from(saved);
    }

    @Transactional
    public List<AttachmentResponse> uploadAttachments(Long taskId, List<MultipartFile> images,
                                                        MultipartFile video, User worker) {
        Task task = getAssignedToWorkerOrThrow(taskId, worker);

        if (task.getStatus() != TaskStatus.IN_PROGRESS && task.getStatus() != TaskStatus.REWORK_REQUIRED
                && task.getStatus() != TaskStatus.ASSIGNED) {
            throw new IllegalStateException("Cannot upload files once the task has been submitted or closed.");
        }

        List<TaskAttachment> saved = new java.util.ArrayList<>();

        if (images != null) {
            for (MultipartFile image : images) {
                if (image.isEmpty()) continue;
                String path = fileStorageService.store(image, taskId);
                saved.add(attachmentRepository.save(TaskAttachment.builder()
                        .task(task).uploadedBy(worker)
                        .fileName(image.getOriginalFilename())
                        .filePath(path).fileType(FileType.IMAGE)
                        .build()));
            }
        }

        if (video != null && !video.isEmpty()) {
            String path = fileStorageService.store(video, taskId);
            saved.add(attachmentRepository.save(TaskAttachment.builder()
                    .task(task).uploadedBy(worker)
                    .fileName(video.getOriginalFilename())
                    .filePath(path).fileType(FileType.VIDEO)
                    .build()));
        }

        return saved.stream().map(AttachmentResponse::from).toList();
    }

    // ---------------------------------------------------------------
    // Supervisor review
    // ---------------------------------------------------------------

    @Transactional
    public TaskResponse reviewTask(Long taskId, TaskStatus decision, String remarks, User supervisor) {
        Task task = getOwnedBySupervisorOrThrow(taskId, supervisor);

        if (task.getStatus() != TaskStatus.SUBMITTED_FOR_REVIEW) {
            throw new IllegalStateException("Task is not awaiting review.");
        }
        if (decision != TaskStatus.APPROVED && decision != TaskStatus.REJECTED
                && decision != TaskStatus.REWORK_REQUIRED) {
            throw new BadRequestException("Review decision must be APPROVED, REJECTED, or REWORK_REQUIRED.");
        }

        TaskStatus old = task.getStatus();
        task.setStatus(decision);
        Task saved = taskRepository.save(task);
        logHistory(saved, supervisor, old, decision, remarks);

        notificationService.notify(task.getAssignedTo(),
                "Your task \"" + task.getTitle() + "\" was " + decision + "."
                        + (remarks != null && !remarks.isBlank() ? " Remarks: " + remarks : ""),
                saved);
        return TaskResponse.from(saved);
    }

    // ---------------------------------------------------------------
    // Reads
    // ---------------------------------------------------------------

    public TaskResponse getById(Long taskId, User currentUser) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found."));
        assertCanView(task, currentUser);
        return TaskResponse.from(task);
    }

    public List<TaskResponse> search(TaskStatus status, TaskCategory category, String keyword, User currentUser) {
        List<Task> tasks;
        if (currentUser.getRole() == Role.WORKER) {
            tasks = taskRepository.searchForWorker(currentUser.getId(), status, category, keyword);
        } else {
            tasks = taskRepository.search(status, category, keyword);
            // A supervisor only sees tasks they created
            tasks = tasks.stream().filter(t -> t.getCreatedBy().getId().equals(currentUser.getId())).toList();
        }
        return tasks.stream().map(TaskResponse::from).toList();
    }

    public List<TaskResponse> myTasks(User worker) {
        return taskRepository.findByAssignedTo_IdOrderByCreatedAtDesc(worker.getId())
                .stream().map(TaskResponse::from).toList();
    }

    public List<TaskHistoryResponse> getHistory(Long taskId, User currentUser) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found."));
        assertCanView(task, currentUser);
        return historyRepository.findByTask_IdOrderByChangedAtAsc(taskId)
                .stream().map(TaskHistoryResponse::from).toList();
    }

    public List<AttachmentResponse> getAttachments(Long taskId, User currentUser) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found."));
        assertCanView(task, currentUser);
        return attachmentRepository.findByTask_IdOrderByUploadedAtAsc(taskId)
                .stream().map(AttachmentResponse::from).toList();
    }

    // ---------------------------------------------------------------
    // Helpers
    // ---------------------------------------------------------------

    private boolean isValidWorkerTransition(TaskStatus from, TaskStatus to) {
        return (from == TaskStatus.ASSIGNED && to == TaskStatus.IN_PROGRESS)
            || (from == TaskStatus.REWORK_REQUIRED && to == TaskStatus.IN_PROGRESS);
    }

    private Task getOwnedBySupervisorOrThrow(Long taskId, User supervisor) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found."));
        if (!task.getCreatedBy().getId().equals(supervisor.getId())) {
            throw new UnauthorizedActionException("You did not create this task.");
        }
        return task;
    }

    private Task getAssignedToWorkerOrThrow(Long taskId, User worker) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found."));
        if (task.getAssignedTo() == null || !task.getAssignedTo().getId().equals(worker.getId())) {
            throw new UnauthorizedActionException("This task is not assigned to you.");
        }
        return task;
    }

    private void assertCanView(Task task, User currentUser) {
        boolean isOwnerSupervisor = task.getCreatedBy().getId().equals(currentUser.getId());
        boolean isAssignedWorker = task.getAssignedTo() != null
                && task.getAssignedTo().getId().equals(currentUser.getId());
        if (currentUser.getRole() == Role.ADMIN) return; // admins can view for support purposes
        if (!isOwnerSupervisor && !isAssignedWorker) {
            throw new UnauthorizedActionException("You do not have access to this task.");
        }
    }

    private User getWorkerOrThrow(Long workerId) {
        User worker = userRepository.findById(workerId)
                .orElseThrow(() -> new ResourceNotFoundException("Worker not found."));
        if (worker.getRole() != Role.WORKER) {
            throw new BadRequestException("Selected user is not a Worker.");
        }
        return worker;
    }

    public List<UserResponse> getWorkers() {
        return userRepository.findByRole(Role.WORKER)
                .stream()
                .map(UserResponse::from)
                .toList();
    }

    private void logHistory(Task task, User changedBy, TaskStatus oldStatus, TaskStatus newStatus, String remarks) {
        historyRepository.save(TaskHistory.builder()
                .task(task).changedBy(changedBy)
                .oldStatus(oldStatus).newStatus(newStatus)
                .remarks(remarks).build());
    }
}
