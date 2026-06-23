package com.cwtms.service;

import com.cwtms.dto.response.AdminStatsResponse;
import com.cwtms.dto.response.SupervisorStatsResponse;
import com.cwtms.dto.response.WorkerStatsResponse;
import com.cwtms.entity.User;
import com.cwtms.entity.enums.Role;
import com.cwtms.entity.enums.TaskStatus;
import com.cwtms.entity.enums.UserStatus;
import com.cwtms.repository.TaskRepository;
import com.cwtms.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final UserRepository userRepository;
    private final TaskRepository taskRepository;

    public AdminStatsResponse adminStats() {
        return new AdminStatsResponse(
                userRepository.count(),
                userRepository.countByRole(Role.SUPERVISOR),
                userRepository.countByRole(Role.WORKER),
                userRepository.countByStatus(UserStatus.ACTIVE)
        );
    }

    public SupervisorStatsResponse supervisorStats(User supervisor) {
        Long id = supervisor.getId();
        return new SupervisorStatsResponse(
                taskRepository.countByCreatedBy_Id(id),
                taskRepository.countByCreatedBy_IdAndStatus(id, TaskStatus.SUBMITTED_FOR_REVIEW),
                taskRepository.countByCreatedBy_IdAndStatus(id, TaskStatus.APPROVED),
                taskRepository.countByCreatedBy_IdAndStatus(id, TaskStatus.REJECTED),
                taskRepository.countByCreatedBy_IdAndStatus(id, TaskStatus.IN_PROGRESS)
        );
    }

    public WorkerStatsResponse workerStats(User worker) {
        Long id = worker.getId();
        return new WorkerStatsResponse(
                taskRepository.countByAssignedTo_IdAndStatus(id, TaskStatus.ASSIGNED),
                taskRepository.countByAssignedTo_IdAndStatus(id, TaskStatus.IN_PROGRESS),
                taskRepository.countByAssignedTo_IdAndStatus(id, TaskStatus.SUBMITTED_FOR_REVIEW),
                taskRepository.countByAssignedTo_IdAndStatus(id, TaskStatus.APPROVED),
                taskRepository.countByAssignedTo_IdAndStatus(id, TaskStatus.REJECTED)
        );
    }
}
