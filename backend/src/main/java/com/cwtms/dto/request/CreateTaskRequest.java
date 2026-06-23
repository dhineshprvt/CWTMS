package com.cwtms.dto.request;

import com.cwtms.entity.enums.TaskCategory;
import com.cwtms.entity.enums.TaskPriority;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;

public record CreateTaskRequest(
        @NotBlank String title,
        String description,
        @NotNull TaskCategory category,
        String customCategory,
        @NotNull TaskPriority priority,
        String location,
        Long assignedToId,
        LocalDate dueDate
) {}
