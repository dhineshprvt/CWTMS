package com.cwtms.controller;

import com.cwtms.dto.request.LoginRequest;
import com.cwtms.dto.response.LoginResponse;
import com.cwtms.dto.response.UserResponse;
import com.cwtms.security.CustomUserDetailsService;
import com.cwtms.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final CustomUserDetailsService userDetailsService;

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

    @GetMapping("/me")
    public ResponseEntity<UserResponse> me(Authentication authentication) {
        var user = userDetailsService.loadDomainUser(authentication.getName());
        return ResponseEntity.ok(UserResponse.from(user));
    }
}
