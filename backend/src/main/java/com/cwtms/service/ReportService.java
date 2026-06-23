package com.cwtms.service;

import com.cwtms.dto.response.TaskSummaryResponse;
import com.cwtms.dto.response.WorkerPerformanceResponse;
import com.cwtms.entity.User;
import com.cwtms.entity.enums.Role;
import com.cwtms.entity.enums.TaskCategory;
import com.cwtms.entity.enums.TaskStatus;
import com.cwtms.repository.TaskRepository;
import com.cwtms.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class ReportService {

    private final TaskRepository taskRepository;
    private final UserRepository userRepository;

    public List<WorkerPerformanceResponse> workerPerformance() {
        List<User> workers = userRepository.findByRole(Role.WORKER);

        return workers.stream().map(w -> {
            long total = taskRepository.countByAssignedTo_Id(w.getId());
            long approved = taskRepository.countByAssignedTo_IdAndStatus(w.getId(), TaskStatus.APPROVED);
            long rejected = taskRepository.countByAssignedTo_IdAndStatus(w.getId(), TaskStatus.REJECTED);
            long rework = taskRepository.countByAssignedTo_IdAndStatus(w.getId(), TaskStatus.REWORK_REQUIRED);
            long pending = total - approved - rejected - rework;
            double approvalRate = total == 0 ? 0.0 : (approved * 100.0) / total;

            return new WorkerPerformanceResponse(
                    w.getId(), w.getFullName(), total, approved, rejected, rework, pending,
                    Math.round(approvalRate * 100) / 100.0
            );
        }).toList();
    }

    public TaskSummaryResponse taskSummary() {
        Map<String, Long> byStatus = new LinkedHashMap<>();
        for (TaskStatus s : TaskStatus.values()) {
            byStatus.put(s.name(), taskRepository.countByStatus(s));
        }

        Map<String, Long> byCategory = new LinkedHashMap<>();
        for (TaskCategory c : TaskCategory.values()) {
            byCategory.put(c.name(), taskRepository.countByCategory(c));
        }

        return new TaskSummaryResponse(byStatus, byCategory);
    }
}
