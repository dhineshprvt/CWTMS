package com.cwtms.dto.request;

import jakarta.validation.constraints.NotNull;

public record AssignTaskRequest(@NotNull Long workerId) {}
