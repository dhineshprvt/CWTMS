package com.cwtms.dto.response;

public record WorkerStatsResponse(
        long assigned,
        long inProgress,
        long submitted,
        long approved,
        long rejected
) {}
