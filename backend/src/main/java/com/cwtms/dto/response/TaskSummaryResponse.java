package com.cwtms.dto.response;

import java.util.Map;

public record TaskSummaryResponse(
        Map<String, Long> byStatus,
        Map<String, Long> byCategory
) {}
