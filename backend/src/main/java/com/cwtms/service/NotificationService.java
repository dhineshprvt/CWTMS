package com.cwtms.service;

import com.cwtms.dto.response.NotificationResponse;
import com.cwtms.entity.Notification;
import com.cwtms.entity.Task;
import com.cwtms.entity.User;
import com.cwtms.exception.ResourceNotFoundException;
import com.cwtms.exception.UnauthorizedActionException;
import com.cwtms.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final EmailService emailService;

    @Transactional
    public void notify(User recipient, String message, Task relatedTask) {
        if (recipient == null) return; // no one to notify (e.g. task not yet assigned)
        Notification n = Notification.builder()
                .user(recipient)
                .message(message)
                .relatedTask(relatedTask)
                .isRead(false)
                .build();
        notificationRepository.save(n);

        // Construct email subject and body
        String subject = "CWTMS Task Update: " + (relatedTask != null ? relatedTask.getTitle() : "New Notification");
        StringBuilder body = new StringBuilder();
        body.append("Dear ").append(recipient.getFullName()).append(",\n\n");
        body.append(message).append("\n\n");
        if (relatedTask != null) {
            body.append("Task Details:\n");
            body.append("- Title: ").append(relatedTask.getTitle()).append("\n");
            body.append("- Category: ").append(relatedTask.getCategory()).append("\n");
            body.append("- Due Date: ").append(relatedTask.getDueDate()).append("\n");
        }
        body.append("\nBest Regards,\nCampus Workforce Task Management System");

        emailService.sendNotificationEmail(recipient.getEmail(), subject, body.toString());
    }

    public List<NotificationResponse> getForUser(Long userId, boolean unreadOnly) {
        List<Notification> list = unreadOnly
                ? notificationRepository.findByUser_IdAndIsReadFalseOrderByCreatedAtDesc(userId)
                : notificationRepository.findByUser_IdOrderByCreatedAtDesc(userId);
        return list.stream().map(NotificationResponse::from).toList();
    }

    @Transactional
    public void markRead(Long notificationId, User currentUser) {
        Notification n = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new ResourceNotFoundException("Notification not found."));
        if (!n.getUser().getId().equals(currentUser.getId())) {
            throw new UnauthorizedActionException("This notification does not belong to you.");
        }
        n.setRead(true);
        notificationRepository.save(n);
    }

    @Transactional
    public void markAllRead(User currentUser) {
        List<Notification> unread = notificationRepository
                .findByUser_IdAndIsReadFalseOrderByCreatedAtDesc(currentUser.getId());
        unread.forEach(n -> n.setRead(true));
        notificationRepository.saveAll(unread);
    }
}
