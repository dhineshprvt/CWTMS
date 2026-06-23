package com.cwtms.dto.request;

import com.cwtms.entity.enums.TaskStatus;
import jakarta.validation.constraints.NotNull;

public record UpdateTaskStatusRequest(
        @NotNull TaskStatus status,
        String remarks
) {}
