package com.cwtms.dto.response;

public record SupervisorStatsResponse(
        long totalTasksCreated,
        long pendingReview,
        long approved,
        long rejected,
        long inProgress
) {}
