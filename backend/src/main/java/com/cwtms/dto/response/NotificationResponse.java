package com.cwtms.dto.response;

import com.cwtms.entity.Notification;

import java.time.LocalDateTime;

public record NotificationResponse(
        Long id,
        String message,
        Long relatedTaskId,
        boolean isRead,
        LocalDateTime createdAt
) {
    public static NotificationResponse from(Notification n) {
        return new NotificationResponse(
                n.getId(), n.getMessage(),
                n.getRelatedTask() != null ? n.getRelatedTask().getId() : null,
                n.isRead(), n.getCreatedAt()
        );
    }
}
