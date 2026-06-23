package com.cwtms.controller;

import com.cwtms.dto.request.CreateUserRequest;
import com.cwtms.dto.request.ResetPasswordRequest;
import com.cwtms.dto.request.UpdateUserRequest;
import com.cwtms.dto.response.UserResponse;
import com.cwtms.entity.enums.Role;
import com.cwtms.security.CustomUserDetailsService;
import com.cwtms.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/users")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class UserController {

    private final UserService userService;
    private final CustomUserDetailsService userDetailsService;

    @GetMapping
    public ResponseEntity<List<UserResponse>> getAll(@RequestParam(required = false) Role role) {
        return ResponseEntity.ok(userService.getAll(role));
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(userService.getById(id));
    }

    @PostMapping
    public ResponseEntity<UserResponse> create(@Valid @RequestBody CreateUserRequest request,
                                                Authentication authentication) {
        var admin = userDetailsService.loadDomainUser(authentication.getName());
        return ResponseEntity.status(HttpStatus.CREATED).body(userService.createUser(request, admin));
    }

    @PutMapping("/{id}")
    public ResponseEntity<UserResponse> update(@PathVariable Long id,
                                                @Valid @RequestBody UpdateUserRequest request) {
        return ResponseEntity.ok(userService.updateUser(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id, org.springframework.security.core.Authentication authentication) {
        var admin = userDetailsService.loadDomainUser(authentication.getName());
        userService.deleteUser(id, admin);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}/reset-password")
    public ResponseEntity<Void> resetPassword(@PathVariable Long id,
                                               @Valid @RequestBody ResetPasswordRequest request) {
        userService.resetPassword(id, request);
        return ResponseEntity.ok().build();
    }
}
