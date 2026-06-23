package com.cwtms.dto.request;

import com.cwtms.entity.enums.TaskStatus;
import jakarta.validation.constraints.NotNull;

public record ReviewTaskRequest(
        @NotNull(message = "Decision must be APPROVED, REJECTED, or REWORK_REQUIRED") TaskStatus decision,
        String remarks
) {}
