package com.cwtms.service;

import com.cwtms.dto.request.CreateUserRequest;
import com.cwtms.dto.request.ResetPasswordRequest;
import com.cwtms.dto.request.UpdateUserRequest;
import com.cwtms.dto.response.UserResponse;
import com.cwtms.entity.User;
import com.cwtms.entity.enums.Role;
import com.cwtms.exception.BadRequestException;
import com.cwtms.exception.ResourceNotFoundException;
import com.cwtms.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @jakarta.persistence.PersistenceContext
    private jakarta.persistence.EntityManager entityManager;

    @Transactional
    public UserResponse createUser(CreateUserRequest req, User admin) {
        if (userRepository.existsByUsername(req.username())) {
            throw new BadRequestException("Username already taken.");
        }
        if (userRepository.existsByEmail(req.email())) {
            throw new BadRequestException("Email already in use.");
        }
        if (req.role() == Role.ADMIN) {
            throw new BadRequestException("Cannot create another Admin account through this endpoint.");
        }

        User user = User.builder()
                .username(req.username())
                .password(passwordEncoder.encode(req.password()))
                .fullName(req.fullName())
                .email(req.email())
                .phone(req.phone())
                .role(req.role())
                .createdBy(admin)
                .build();

        return UserResponse.from(userRepository.save(user));
    }

    @Transactional
    public UserResponse updateUser(Long id, UpdateUserRequest req) {
        User user = getOrThrow(id);
        user.setFullName(req.fullName());
        user.setEmail(req.email());
        user.setPhone(req.phone());
        if (req.role() != null) user.setRole(req.role());
        if (req.status() != null) user.setStatus(req.status());
        if (req.password() != null && !req.password().isBlank()) {
            if (req.password().length() < 6) {
                throw new BadRequestException("Password must be at least 6 characters.");
            }
            user.setPassword(passwordEncoder.encode(req.password()));
        }
        return UserResponse.from(userRepository.save(user));
    }

    @Transactional
    public void deleteUser(Long id, User admin) {
        User user = getOrThrow(id);

        if (user.getId().equals(admin.getId())) {
            throw new BadRequestException("Cannot delete your own admin account.");
        }

        // 1. Reassign users created by this user
        entityManager.createQuery("UPDATE User u SET u.createdBy = :admin WHERE u.createdBy = :user")
                .setParameter("admin", admin)
                .setParameter("user", user)
                .executeUpdate();

        // 2. Delete task attachments uploaded by this user
        entityManager.createQuery("DELETE FROM TaskAttachment ta WHERE ta.uploadedBy = :user")
                .setParameter("user", user)
                .executeUpdate();

        // 3. Delete notifications of this user
        entityManager.createQuery("DELETE FROM Notification n WHERE n.user = :user")
                .setParameter("user", user)
                .executeUpdate();

        // 4. Delete task history changed by this user
        entityManager.createQuery("DELETE FROM TaskHistory th WHERE th.changedBy = :user")
                .setParameter("user", user)
                .executeUpdate();

        // 5. Set assignedTo to NULL for tasks assigned to this user
        entityManager.createQuery("UPDATE Task t SET t.assignedTo = null WHERE t.assignedTo = :user")
                .setParameter("user", user)
                .executeUpdate();

        // 6. Reassign tasks created by this user to the admin
        entityManager.createQuery("UPDATE Task t SET t.createdBy = :admin WHERE t.createdBy = :user")
                .setParameter("admin", admin)
                .setParameter("user", user)
                .executeUpdate();

        // 7. Delete the user
        userRepository.delete(user);
    }

    @Transactional
    public void resetPassword(Long id, ResetPasswordRequest req) {
        User user = getOrThrow(id);
        user.setPassword(passwordEncoder.encode(req.newPassword()));
        userRepository.save(user);
    }

    public UserResponse getById(Long id) {
        return UserResponse.from(getOrThrow(id));
    }

    public List<UserResponse> getAll(Role role) {
        List<User> users = (role != null) ? userRepository.findByRole(role) : userRepository.findAll();
        return users.stream().map(UserResponse::from).toList();
    }

    private User getOrThrow(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
    }
}
