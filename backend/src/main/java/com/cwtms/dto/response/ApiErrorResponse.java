package com.cwtms.dto.response;

import java.time.LocalDateTime;

public record ApiErrorResponse(int status, String message, LocalDateTime timestamp) {}
