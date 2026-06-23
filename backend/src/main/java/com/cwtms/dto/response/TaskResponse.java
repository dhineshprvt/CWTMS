package com.cwtms.dto.response;

import com.cwtms.entity.Task;
import com.cwtms.entity.enums.TaskCategory;
import com.cwtms.entity.enums.TaskPriority;
import com.cwtms.entity.enums.TaskStatus;

import java.time.LocalDate;
import java.time.LocalDateTime;

public record TaskResponse(
        Long id,
        String title,
        String description,
        TaskCategory category,
        String customCategory,
        TaskPriority priority,
        String location,
        TaskStatus status,
        Long createdById,
        String createdByName,
        Long assignedToId,
        String assignedToName,
        LocalDate dueDate,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {
    public static TaskResponse from(Task t) {
        return new TaskResponse(
                t.getId(),
                t.getTitle(),
                t.getDescription(),
                t.getCategory(),
                t.getCustomCategory(),
                t.getPriority(),
                t.getLocation(),
                t.getStatus(),
                t.getCreatedBy() != null ? t.getCreatedBy().getId() : null,
                t.getCreatedBy() != null ? t.getCreatedBy().getFullName() : null,
                t.getAssignedTo() != null ? t.getAssignedTo().getId() : null,
                t.getAssignedTo() != null ? t.getAssignedTo().getFullName() : null,
                t.getDueDate(),
                t.getCreatedAt(),
                t.getUpdatedAt()
        );
    }
}
