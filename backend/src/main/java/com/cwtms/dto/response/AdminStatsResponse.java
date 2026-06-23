package com.cwtms.dto.response;

public record AdminStatsResponse(
        long totalUsers,
        long totalSupervisors,
        long totalWorkers,
        long activeUsers
) {}
