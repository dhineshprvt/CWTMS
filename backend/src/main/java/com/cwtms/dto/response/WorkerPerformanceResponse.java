package com.cwtms.dto.response;

public record WorkerPerformanceResponse(
        Long workerId,
        String workerName,
        long totalAssigned,
        long approved,
        long rejected,
        long reworkRequired,
        long pending,
        double approvalRate
) {}
