# Backend Design — Spring Boot

Layered architecture: **Controller → Service → Repository → Entity**, with DTOs at the
controller boundary so entities never leak into the API response directly.

## 1. Maven Project Setup

```
groupId:    com.cwtms
artifactId: campus-workforce-system
packaging:  jar
Java:       17
Spring Boot: 3.2.x
```

Key dependencies in `pom.xml` (all free/open-source, pulled from Maven Central):

```xml
<dependencies>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-web</artifactId>
    </dependency>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-data-jpa</artifactId>
    </dependency>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-security</artifactId>
    </dependency>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-validation</artifactId>
    </dependency>
    <dependency>
        <groupId>com.mysql</groupId>
        <artifactId>mysql-connector-j</artifactId>
        <scope>runtime</scope>
    </dependency>
    <!-- JWT support -->
    <dependency>
        <groupId>io.jsonwebtoken</groupId>
        <artifactId>jjwt-api</artifactId>
        <version>0.12.5</version>
    </dependency>
    <dependency>
        <groupId>io.jsonwebtoken</groupId>
        <artifactId>jjwt-impl</artifactId>
        <version>0.12.5</version>
        <scope>runtime</scope>
    </dependency>
    <dependency>
        <groupId>io.jsonwebtoken</groupId>
        <artifactId>jjwt-jackson</artifactId>
        <version>0.12.5</version>
        <scope>runtime</scope>
    </dependency>
    <dependency>
        <groupId>org.projectlombok</groupId>
        <artifactId>lombok</artifactId>
        <optional>true</optional>
    </dependency>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-test</artifactId>
        <scope>test</scope>
    </dependency>
</dependencies>
```

`src/main/resources/application.properties`:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/cwtms_db
spring.datasource.username=root
spring.datasource.password=your_mysql_password
spring.jpa.hibernate.ddl-auto=validate
spring.jpa.show-sql=true

server.port=8080

# Local file storage
app.upload.dir=uploads

# JWT
app.jwt.secret=replace_this_with_a_long_random_base64_secret_at_least_256_bits
app.jwt.expiration-ms=86400000

spring.servlet.multipart.max-file-size=25MB
spring.servlet.multipart.max-request-size=100MB
```

> Use `ddl-auto=validate` once you've run `schema.sql` manually — this keeps your hand-written
> schema as the single source of truth, which looks more professional in a viva than
> auto-generated tables.

---

## 2. Package / Folder Structure

```
src/main/java/com/cwtms/
├── CwtmsApplication.java
├── config/
│   ├── SecurityConfig.java
│   ├── WebConfig.java                 # serves /uploads as static resources
│   └── CorsConfig.java
├── security/
│   ├── JwtUtil.java
│   ├── JwtAuthenticationFilter.java
│   ├── CustomUserDetailsService.java
│   └── JwtAuthEntryPoint.java
├── entity/
│   ├── User.java
│   ├── Task.java
│   ├── TaskHistory.java
│   ├── TaskAttachment.java
│   ├── Notification.java
│   └── enums/
│       ├── Role.java
│       ├── UserStatus.java
│       ├── TaskCategory.java
│       ├── TaskStatus.java
│       └── FileType.java
├── repository/
│   ├── UserRepository.java
│   ├── TaskRepository.java
│   ├── TaskHistoryRepository.java
│   ├── TaskAttachmentRepository.java
│   └── NotificationRepository.java
├── service/
│   ├── UserService.java
│   ├── TaskService.java
│   ├── FileStorageService.java
│   ├── NotificationService.java
│   └── ReportService.java
├── controller/
│   ├── AuthController.java
│   ├── UserController.java
│   ├── TaskController.java
│   ├── NotificationController.java
│   └── ReportController.java
├── dto/
│   ├── request/
│   │   ├── LoginRequest.java
│   │   ├── CreateUserRequest.java
│   │   ├── UpdateUserRequest.java
│   │   ├── ResetPasswordRequest.java
│   │   ├── CreateTaskRequest.java
│   │   ├── AssignTaskRequest.java
│   │   ├── UpdateTaskStatusRequest.java
│   │   └── ReviewTaskRequest.java
│   └── response/
│       ├── LoginResponse.java
│       ├── UserResponse.java
│       ├── TaskResponse.java
│       ├── TaskHistoryResponse.java
│       ├── NotificationResponse.java
│       ├── WorkerPerformanceResponse.java
│       └── ApiError.java
└── exception/
    ├── GlobalExceptionHandler.java
    ├── ResourceNotFoundException.java
    └── UnauthorizedActionException.java
```

---

## 3. Enums

```java
public enum Role { ADMIN, SUPERVISOR, WORKER }

public enum UserStatus { ACTIVE, INACTIVE }

public enum TaskCategory {
    CLASSROOM_CLEANING, LABORATORY_CLEANING, RESTROOM_CLEANING, WASTE_COLLECTION,
    GARDEN_MAINTENANCE, ELECTRICAL_MAINTENANCE, PLUMBING_MAINTENANCE, WATER_TANK_INSPECTION
}

public enum TaskStatus {
    ASSIGNED, IN_PROGRESS, SUBMITTED_FOR_REVIEW, APPROVED, REJECTED, REWORK_REQUIRED
}

public enum FileType { IMAGE, VIDEO }
```

---

## 4. Entity Classes

```java
@Entity
@Table(name = "users")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 50)
    private String username;

    @Column(nullable = false)
    private String password;            // BCrypt hash

    @Column(name = "full_name", nullable = false, length = 100)
    private String fullName;

    @Column(nullable = false, unique = true, length = 100)
    private String email;

    private String phone;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private Role role;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private UserStatus status = UserStatus.ACTIVE;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "created_by")
    private User createdBy;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
```

```java
@Entity
@Table(name = "tasks")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Task {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 150)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private TaskCategory category;

    private String location;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 25)
    private TaskStatus status = TaskStatus.ASSIGNED;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "created_by", nullable = false)
    private User createdBy;            // Supervisor

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "assigned_to")
    private User assignedTo;           // Worker

    @Column(name = "due_date")
    private LocalDate dueDate;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
```

```java
@Entity
@Table(name = "task_history")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class TaskHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "task_id", nullable = false)
    private Task task;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "changed_by", nullable = false)
    private User changedBy;

    @Enumerated(EnumType.STRING)
    @Column(name = "old_status", length = 25)
    private TaskStatus oldStatus;

    @Enumerated(EnumType.STRING)
    @Column(name = "new_status", nullable = false, length = 25)
    private TaskStatus newStatus;

    @Column(columnDefinition = "TEXT")
    private String remarks;

    @CreationTimestamp
    @Column(name = "changed_at", updatable = false)
    private LocalDateTime changedAt;
}
```

```java
@Entity
@Table(name = "task_attachments")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class TaskAttachment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "task_id", nullable = false)
    private Task task;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "uploaded_by", nullable = false)
    private User uploadedBy;

    @Column(name = "file_name", nullable = false)
    private String fileName;

    @Column(name = "file_path", nullable = false, length = 500)
    private String filePath;

    @Enumerated(EnumType.STRING)
    @Column(name = "file_type", nullable = false, length = 10)
    private FileType fileType;

    @CreationTimestamp
    @Column(name = "uploaded_at", updatable = false)
    private LocalDateTime uploadedAt;
}
```

```java
@Entity
@Table(name = "notifications")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Notification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private String message;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "related_task_id")
    private Task relatedTask;

    @Column(name = "is_read", nullable = false)
    private boolean isRead = false;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
}
```

---

## 5. Key DTOs (request side — keep the rest similar)

```java
public record LoginRequest(
    @NotBlank String username,
    @NotBlank String password
) {}

public record CreateUserRequest(
    @NotBlank String username,
    @NotBlank String password,
    @NotBlank String fullName,
    @Email @NotBlank String email,
    String phone,
    @NotNull Role role
) {}

public record CreateTaskRequest(
    @NotBlank String title,
    String description,
    @NotNull TaskCategory category,
    String location,
    Long assignedToId,             // optional at creation time
    LocalDate dueDate
) {}

public record AssignTaskRequest(@NotNull Long workerId) {}

public record UpdateTaskStatusRequest(@NotNull TaskStatus status, String remarks) {}

public record ReviewTaskRequest(
    @NotNull TaskStatus decision,   // APPROVED, REJECTED, or REWORK_REQUIRED
    String remarks
) {}
```

Response DTOs are plain records too (`TaskResponse`, `UserResponse`, etc.) — map entities to
them in the service layer (a small private `toResponse(Task t)` method per service is enough
for a project this size; MapStruct is optional polish, not required).

---

## 6. Repository Layer (examples)

```java
public interface TaskRepository extends JpaRepository<Task, Long> {

    List<Task> findByAssignedTo_Id(Long workerId);

    List<Task> findByCreatedBy_Id(Long supervisorId);

    @Query("""
        SELECT t FROM Task t
        WHERE (:status IS NULL OR t.status = :status)
          AND (:category IS NULL OR t.category = :category)
          AND (:keyword IS NULL OR LOWER(t.title) LIKE LOWER(CONCAT('%', :keyword, '%')))
        ORDER BY t.createdAt DESC
        """)
    List<Task> search(TaskStatus status, TaskCategory category, String keyword);

    long countByAssignedTo_IdAndStatus(Long workerId, TaskStatus status);
}
```

```java
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);
    List<User> findByRole(Role role);
    boolean existsByUsername(String username);
    boolean existsByEmail(String email);
}
```

`TaskHistoryRepository`, `TaskAttachmentRepository`, and `NotificationRepository` follow the
same pattern (`findByTask_IdOrderByChangedAtAsc`, `findByUser_IdOrderByCreatedAtDesc`, etc.).

---

## 7. Service Layer — the workflow lives here

```java
@Service
@RequiredArgsConstructor
public class TaskService {

    private final TaskRepository taskRepository;
    private final TaskHistoryRepository historyRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;

    @Transactional
    public Task createTask(CreateTaskRequest req, User supervisor) {
        Task task = Task.builder()
                .title(req.title())
                .description(req.description())
                .category(req.category())
                .location(req.location())
                .dueDate(req.dueDate())
                .status(TaskStatus.ASSIGNED)
                .createdBy(supervisor)
                .build();

        if (req.assignedToId() != null) {
            User worker = userRepository.findById(req.assignedToId())
                    .orElseThrow(() -> new ResourceNotFoundException("Worker not found"));
            task.setAssignedTo(worker);
        }

        Task saved = taskRepository.save(task);
        logHistory(saved, supervisor, null, TaskStatus.ASSIGNED, "Task created.");
        if (saved.getAssignedTo() != null) {
            notificationService.notify(saved.getAssignedTo(),
                    "You have been assigned a new task: \"" + saved.getTitle() + "\"", saved);
        }
        return saved;
    }

    @Transactional
    public Task assignTask(Long taskId, Long workerId, User supervisor) {
        Task task = getOwnedBySupervisorOrThrow(taskId, supervisor);
        User worker = userRepository.findById(workerId)
                .orElseThrow(() -> new ResourceNotFoundException("Worker not found"));
        task.setAssignedTo(worker);
        task.setStatus(TaskStatus.ASSIGNED);
        Task saved = taskRepository.save(task);
        logHistory(saved, supervisor, task.getStatus(), TaskStatus.ASSIGNED, "Re-assigned.");
        notificationService.notify(worker,
                "You have been assigned a task: \"" + saved.getTitle() + "\"", saved);
        return saved;
    }

    @Transactional
    public Task updateStatusByWorker(Long taskId, TaskStatus newStatus, String remarks, User worker) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found"));

        if (!task.getAssignedTo().getId().equals(worker.getId())) {
            throw new UnauthorizedActionException("This task is not assigned to you.");
        }
        // Allowed worker-driven transitions only
        if (!isValidWorkerTransition(task.getStatus(), newStatus)) {
            throw new IllegalStateException("Invalid status transition: "
                    + task.getStatus() + " -> " + newStatus);
        }

        TaskStatus old = task.getStatus();
        task.setStatus(newStatus);
        Task saved = taskRepository.save(task);
        logHistory(saved, worker, old, newStatus, remarks);

        if (newStatus == TaskStatus.SUBMITTED_FOR_REVIEW) {
            notificationService.notify(task.getCreatedBy(),
                    "Worker " + worker.getFullName() + " submitted \"" + task.getTitle()
                            + "\" for review.", saved);
        }
        return saved;
    }

    @Transactional
    public Task reviewTask(Long taskId, TaskStatus decision, String remarks, User supervisor) {
        Task task = getOwnedBySupervisorOrThrow(taskId, supervisor);
        if (task.getStatus() != TaskStatus.SUBMITTED_FOR_REVIEW) {
            throw new IllegalStateException("Task is not awaiting review.");
        }
        if (decision != TaskStatus.APPROVED && decision != TaskStatus.REJECTED
                && decision != TaskStatus.REWORK_REQUIRED) {
            throw new IllegalArgumentException("Review decision must be APPROVED, REJECTED, or REWORK_REQUIRED.");
        }

        TaskStatus old = task.getStatus();
        task.setStatus(decision);
        Task saved = taskRepository.save(task);
        logHistory(saved, supervisor, old, decision, remarks);

        notificationService.notify(task.getAssignedTo(),
                "Your task \"" + task.getTitle() + "\" was " + decision + ". " +
                        (remarks != null ? remarks : ""), saved);
        return saved;
    }

    private boolean isValidWorkerTransition(TaskStatus from, TaskStatus to) {
        return (from == TaskStatus.ASSIGNED && to == TaskStatus.IN_PROGRESS)
            || (from == TaskStatus.IN_PROGRESS && to == TaskStatus.SUBMITTED_FOR_REVIEW)
            || (from == TaskStatus.REWORK_REQUIRED && to == TaskStatus.IN_PROGRESS);
    }

    private Task getOwnedBySupervisorOrThrow(Long taskId, User supervisor) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found"));
        if (!task.getCreatedBy().getId().equals(supervisor.getId())) {
            throw new UnauthorizedActionException("You did not create this task.");
        }
        return task;
    }

    private void logHistory(Task task, User changedBy, TaskStatus oldStatus,
                             TaskStatus newStatus, String remarks) {
        historyRepository.save(TaskHistory.builder()
                .task(task).changedBy(changedBy)
                .oldStatus(oldStatus).newStatus(newStatus)
                .remarks(remarks).build());
    }
}
```

`FileStorageService` (local disk only — no cloud SDK at all):

```java
@Service
public class FileStorageService {

    @Value("${app.upload.dir}")
    private String uploadDir;

    public String store(MultipartFile file, Long taskId) {
        try {
            Path dir = Paths.get(uploadDir, "tasks", String.valueOf(taskId));
            Files.createDirectories(dir);

            String safeName = System.currentTimeMillis() + "_" +
                    StringUtils.cleanPath(file.getOriginalFilename());
            Path target = dir.resolve(safeName);
            file.transferTo(target);

            return "uploads/tasks/" + taskId + "/" + safeName; // path stored in DB
        } catch (IOException e) {
            throw new RuntimeException("Could not store file: " + e.getMessage(), e);
        }
    }
}
```

---

## 8. Controller Layer (examples)

```java
@RestController
@RequestMapping("/api/tasks")
@RequiredArgsConstructor
public class TaskController {

    private final TaskService taskService;

    @PostMapping
    @PreAuthorize("hasRole('SUPERVISOR')")
    public ResponseEntity<TaskResponse> create(@Valid @RequestBody CreateTaskRequest req,
                                                @AuthenticationPrincipal User currentUser) {
        return ResponseEntity.ok(TaskResponse.from(taskService.createTask(req, currentUser)));
    }

    @PutMapping("/{id}/assign")
    @PreAuthorize("hasRole('SUPERVISOR')")
    public ResponseEntity<TaskResponse> assign(@PathVariable Long id,
                                                @Valid @RequestBody AssignTaskRequest req,
                                                @AuthenticationPrincipal User currentUser) {
        return ResponseEntity.ok(TaskResponse.from(
                taskService.assignTask(id, req.workerId(), currentUser)));
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasRole('WORKER')")
    public ResponseEntity<TaskResponse> updateStatus(@PathVariable Long id,
                                                       @Valid @RequestBody UpdateTaskStatusRequest req,
                                                       @AuthenticationPrincipal User currentUser) {
        return ResponseEntity.ok(TaskResponse.from(
                taskService.updateStatusByWorker(id, req.status(), req.remarks(), currentUser)));
    }

    @PutMapping("/{id}/review")
    @PreAuthorize("hasRole('SUPERVISOR')")
    public ResponseEntity<TaskResponse> review(@PathVariable Long id,
                                                 @Valid @RequestBody ReviewTaskRequest req,
                                                 @AuthenticationPrincipal User currentUser) {
        return ResponseEntity.ok(TaskResponse.from(
                taskService.reviewTask(id, req.decision(), req.remarks(), currentUser)));
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('SUPERVISOR','WORKER')")
    public ResponseEntity<List<TaskResponse>> search(
            @RequestParam(required = false) TaskStatus status,
            @RequestParam(required = false) TaskCategory category,
            @RequestParam(required = false) String keyword,
            @AuthenticationPrincipal User currentUser) {
        return ResponseEntity.ok(taskService.search(status, category, keyword, currentUser));
    }
}
```

The full endpoint list (every method + role + path) is in `api_reference.md` — controllers for
`UserController`, `NotificationController`, and `ReportController` follow the exact same shape.

---

## 9. Security Configuration

```java
@Configuration
@EnableMethodSecurity                 // turns on @PreAuthorize
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthFilter;
    private final CustomUserDetailsService userDetailsService;
    private final JwtAuthEntryPoint authEntryPoint;

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider();
        provider.setUserDetailsService(userDetailsService);
        provider.setPasswordEncoder(passwordEncoder());
        return provider;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config)
            throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(AbstractHttpConfigurer::disable)
            .cors(Customizer.withDefaults())
            .exceptionHandling(ex -> ex.authenticationEntryPoint(authEntryPoint))
            .sessionManagement(sm -> sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/auth/**").permitAll()
                .requestMatchers("/uploads/**").authenticated()
                .requestMatchers("/api/admin/**").hasRole("ADMIN")
                .anyRequest().authenticated()
            )
            .authenticationProvider(authenticationProvider())
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}
```

```java
@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;
    private final CustomUserDetailsService userDetailsService;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response,
                                     FilterChain chain) throws ServletException, IOException {
        String header = request.getHeader("Authorization");
        if (header != null && header.startsWith("Bearer ")) {
            String token = header.substring(7);
            String username = jwtUtil.extractUsername(token);

            if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                UserDetails userDetails = userDetailsService.loadUserByUsername(username);
                if (jwtUtil.isTokenValid(token, userDetails)) {
                    UsernamePasswordAuthenticationToken authToken =
                            new UsernamePasswordAuthenticationToken(
                                    userDetails, null, userDetails.getAuthorities());
                    authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    SecurityContextHolder.getContext().setAuthentication(authToken);
                }
            }
        }
        chain.doFilter(request, response);
    }
}
```

```java
@Component
public class JwtUtil {

    @Value("${app.jwt.secret}")
    private String secret;

    @Value("${app.jwt.expiration-ms}")
    private long expirationMs;

    private SecretKey key() {
        return Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
    }

    public String generateToken(UserDetails userDetails, Long userId, String role) {
        return Jwts.builder()
                .subject(userDetails.getUsername())
                .claim("userId", userId)
                .claim("role", role)
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + expirationMs))
                .signWith(key())
                .compact();
    }

    public String extractUsername(String token) {
        return Jwts.parser().verifyWith(key()).build()
                .parseSignedClaims(token).getPayload().getSubject();
    }

    public boolean isTokenValid(String token, UserDetails userDetails) {
        String username = extractUsername(token);
        return username.equals(userDetails.getUsername()) && !isExpired(token);
    }

    private boolean isExpired(String token) {
        Date exp = Jwts.parser().verifyWith(key()).build()
                .parseSignedClaims(token).getPayload().getExpiration();
        return exp.before(new Date());
    }
}
```

`WebConfig` exposes the local `uploads/` folder so the React app can render images/videos:

```java
@Configuration
public class WebConfig implements WebMvcConfigurer {
    @Value("${app.upload.dir}")
    private String uploadDir;

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry.addResourceHandler("/uploads/**")
                .addResourceLocations("file:" + uploadDir + "/");
    }
}
```

---

## 10. Global Exception Handling

```java
@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ApiError> handleNotFound(ResourceNotFoundException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(new ApiError(404, ex.getMessage()));
    }

    @ExceptionHandler(UnauthorizedActionException.class)
    public ResponseEntity<ApiError> handleUnauthorized(UnauthorizedActionException ex) {
        return ResponseEntity.status(HttpStatus.FORBIDDEN)
                .body(new ApiError(403, ex.getMessage()));
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiError> handleValidation(MethodArgumentNotValidException ex) {
        String message = ex.getBindingResult().getFieldErrors().stream()
                .map(f -> f.getField() + ": " + f.getDefaultMessage())
                .collect(Collectors.joining(", "));
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ApiError(400, message));
    }

    @ExceptionHandler(IllegalStateException.class)
    public ResponseEntity<ApiError> handleIllegalState(IllegalStateException ex) {
        return ResponseEntity.status(HttpStatus.CONFLICT).body(new ApiError(409, ex.getMessage()));
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiError> handleGeneric(Exception ex) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ApiError(500, "Something went wrong: " + ex.getMessage()));
    }
}

public record ApiError(int status, String message) {}
```

This single `@RestControllerAdvice` is what you point to in your viva when asked "how do you
handle errors centrally?" — every controller stays clean of try/catch blocks.
