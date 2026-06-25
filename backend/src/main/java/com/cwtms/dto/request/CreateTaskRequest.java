package com.cwtms.dto.request;

import com.cwtms.entity.enums.TaskCategory;
import com.cwtms.entity.enums.TaskPriority;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;

public record CreateTaskRequest(
        @NotBlank(message = "Title is required") String title,
        @NotBlank(message = "Description is required") String description,
        @NotNull(message = "Category is required") TaskCategory category,
        String customCategory,
        @NotNull(message = "Priority is required") TaskPriority priority,
        @NotBlank(message = "Location is required") String location,
        @NotNull(message = "Worker assignment is required") Long assignedToId,
        @NotNull(message = "Due date is required") LocalDate dueDate
) {}
