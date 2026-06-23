package com.cwtms.controller;

import com.cwtms.dto.request.*;
import com.cwtms.dto.response.AttachmentResponse;
import com.cwtms.dto.response.TaskHistoryResponse;
import com.cwtms.dto.response.TaskResponse;
import com.cwtms.dto.response.UserResponse;
import com.cwtms.entity.enums.TaskCategory;
import com.cwtms.entity.enums.TaskStatus;
import com.cwtms.security.CustomUserDetailsService;
import com.cwtms.service.TaskService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/tasks")
@RequiredArgsConstructor
public class TaskController {

    private final TaskService taskService;
    private final CustomUserDetailsService userDetailsService;

    @PostMapping
    @PreAuthorize("hasRole('SUPERVISOR')")
    public ResponseEntity<TaskResponse> create(@Valid @RequestBody CreateTaskRequest req, Authentication auth) {
        var supervisor = userDetailsService.loadDomainUser(auth.getName());
        return ResponseEntity.status(HttpStatus.CREATED).body(taskService.createTask(req, supervisor));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('SUPERVISOR')")
    public ResponseEntity<TaskResponse> update(@PathVariable Long id, @Valid @RequestBody CreateTaskRequest req,
                                                Authentication auth) {
        var supervisor = userDetailsService.loadDomainUser(auth.getName());
        return ResponseEntity.ok(taskService.updateTask(id, req, supervisor));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('SUPERVISOR')")
    public ResponseEntity<Void> delete(@PathVariable Long id, Authentication auth) {
        var supervisor = userDetailsService.loadDomainUser(auth.getName());
        taskService.deleteTask(id, supervisor);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}/assign")
    @PreAuthorize("hasRole('SUPERVISOR')")
    public ResponseEntity<TaskResponse> assign(@PathVariable Long id, @Valid @RequestBody AssignTaskRequest req,
                                                Authentication auth) {
        var supervisor = userDetailsService.loadDomainUser(auth.getName());
        return ResponseEntity.ok(taskService.assignTask(id, req.workerId(), supervisor));
    }

    @PutMapping("/{id}/review")
    @PreAuthorize("hasRole('SUPERVISOR')")
    public ResponseEntity<TaskResponse> review(@PathVariable Long id, @Valid @RequestBody ReviewTaskRequest req,
                                                Authentication auth) {
        var supervisor = userDetailsService.loadDomainUser(auth.getName());
        return ResponseEntity.ok(taskService.reviewTask(id, req.decision(), req.remarks(), supervisor));
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasRole('WORKER')")
    public ResponseEntity<TaskResponse> updateStatus(@PathVariable Long id,
                                                       @Valid @RequestBody UpdateTaskStatusRequest req,
                                                       Authentication auth) {
        var worker = userDetailsService.loadDomainUser(auth.getName());
        return ResponseEntity.ok(taskService.updateStatusByWorker(id, req.status(), req.remarks(), worker));
    }

    @PostMapping("/{id}/submit")
    @PreAuthorize("hasRole('WORKER')")
    public ResponseEntity<TaskResponse> submit(@PathVariable Long id, @RequestBody SubmitTaskRequest req,
                                                Authentication auth) {
        var worker = userDetailsService.loadDomainUser(auth.getName());
        return ResponseEntity.ok(taskService.submitForReview(id, req.remarks(), worker));
    }

    @PostMapping(value = "/{id}/attachments", consumes = "multipart/form-data")
    @PreAuthorize("hasRole('WORKER')")
    public ResponseEntity<List<AttachmentResponse>> upload(
            @PathVariable Long id,
            @RequestParam(value = "images", required = false) List<MultipartFile> images,
            @RequestParam(value = "video", required = false) MultipartFile video,
            Authentication auth) {
        var worker = userDetailsService.loadDomainUser(auth.getName());
        return ResponseEntity.ok(taskService.uploadAttachments(id, images, video, worker));
    }

    @GetMapping("/{id}/attachments")
    @PreAuthorize("hasAnyRole('SUPERVISOR','WORKER','ADMIN')")
    public ResponseEntity<List<AttachmentResponse>> attachments(@PathVariable Long id, Authentication auth) {
        var user = userDetailsService.loadDomainUser(auth.getName());
        return ResponseEntity.ok(taskService.getAttachments(id, user));
    }

    @GetMapping("/{id}/history")
    @PreAuthorize("hasAnyRole('SUPERVISOR','WORKER','ADMIN')")
    public ResponseEntity<List<TaskHistoryResponse>> history(@PathVariable Long id, Authentication auth) {
        var user = userDetailsService.loadDomainUser(auth.getName());
        return ResponseEntity.ok(taskService.getHistory(id, user));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('SUPERVISOR','WORKER','ADMIN')")
    public ResponseEntity<TaskResponse> getOne(@PathVariable Long id, Authentication auth) {
        var user = userDetailsService.loadDomainUser(auth.getName());
        return ResponseEntity.ok(taskService.getById(id, user));
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('SUPERVISOR','WORKER')")
    public ResponseEntity<List<TaskResponse>> search(
            @RequestParam(required = false) TaskStatus status,
            @RequestParam(required = false) TaskCategory category,
            @RequestParam(required = false) String keyword,
            Authentication auth) {
        var user = userDetailsService.loadDomainUser(auth.getName());
        return ResponseEntity.ok(taskService.search(status, category, keyword, user));
    }

    @GetMapping("/my")
    @PreAuthorize("hasRole('WORKER')")
    public ResponseEntity<List<TaskResponse>> myTasks(Authentication auth) {
        var worker = userDetailsService.loadDomainUser(auth.getName());
        return ResponseEntity.ok(taskService.myTasks(worker));
    }

    @GetMapping("/workers")
    @PreAuthorize("hasAnyRole('SUPERVISOR', 'ADMIN')")
    public ResponseEntity<List<UserResponse>> getWorkers() {
        return ResponseEntity.ok(taskService.getWorkers());
    }
}
