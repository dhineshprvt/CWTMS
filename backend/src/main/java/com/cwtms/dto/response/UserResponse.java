package com.cwtms.dto.response;

import com.cwtms.entity.User;
import com.cwtms.entity.enums.Role;
import com.cwtms.entity.enums.UserStatus;

import java.time.LocalDateTime;

public record UserResponse(
        Long id,
        String username,
        String fullName,
        String email,
        String phone,
        Role role,
        UserStatus status,
        LocalDateTime createdAt
) {
    public static UserResponse from(User u) {
        return new UserResponse(
                u.getId(), u.getUsername(), u.getFullName(), u.getEmail(),
                u.getPhone(), u.getRole(), u.getStatus(), u.getCreatedAt()
        );
    }
}
