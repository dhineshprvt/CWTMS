package com.cwtms.dto.response;

public record LoginResponse(String token, Long userId, String fullName, String role) {}
