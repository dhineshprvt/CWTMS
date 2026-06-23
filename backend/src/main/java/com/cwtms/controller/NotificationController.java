package com.cwtms.controller;

import com.cwtms.dto.response.NotificationResponse;
import com.cwtms.security.CustomUserDetailsService;
import com.cwtms.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;
    private final CustomUserDetailsService userDetailsService;

    @GetMapping
    public ResponseEntity<List<NotificationResponse>> getAll(
            @RequestParam(defaultValue = "false") boolean unreadOnly, Authentication auth) {
        var user = userDetailsService.loadDomainUser(auth.getName());
        return ResponseEntity.ok(notificationService.getForUser(user.getId(), unreadOnly));
    }

    @PutMapping("/{id}/read")
    public ResponseEntity<Void> markRead(@PathVariable Long id, Authentication auth) {
        var user = userDetailsService.loadDomainUser(auth.getName());
        notificationService.markRead(id, user);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/read-all")
    public ResponseEntity<Void> markAllRead(Authentication auth) {
        var user = userDetailsService.loadDomainUser(auth.getName());
        notificationService.markAllRead(user);
        return ResponseEntity.ok().build();
    }
}
