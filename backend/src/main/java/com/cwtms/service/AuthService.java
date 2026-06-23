package com.cwtms.service;

import com.cwtms.dto.request.LoginRequest;
import com.cwtms.dto.response.LoginResponse;
import com.cwtms.entity.User;
import com.cwtms.repository.UserRepository;
import com.cwtms.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;

    public LoginResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.username(), request.password())
        );

        User user = userRepository.findByUsername(request.username())
                .orElseThrow(() -> new IllegalStateException("User not found after authentication"));

        if (user.getStatus() != com.cwtms.entity.enums.UserStatus.ACTIVE) {
            throw new org.springframework.security.authentication.DisabledException("User account is inactive.");
        }

        UserDetails userDetails = new org.springframework.security.core.userdetails.User(
                user.getUsername(), user.getPassword(),
                java.util.List.of(new org.springframework.security.core.authority.SimpleGrantedAuthority(
                        "ROLE_" + user.getRole().name()))
        );

        String token = jwtUtil.generateToken(userDetails, user.getId(), user.getRole().name());

        return new LoginResponse(token, user.getId(), user.getFullName(), user.getRole().name());
    }
}
