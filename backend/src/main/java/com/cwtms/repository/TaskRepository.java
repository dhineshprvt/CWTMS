package com.cwtms.repository;

import com.cwtms.entity.Task;
import com.cwtms.entity.enums.TaskCategory;
import com.cwtms.entity.enums.TaskStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface TaskRepository extends JpaRepository<Task, Long> {

    List<Task> findByAssignedTo_IdOrderByCreatedAtDesc(Long workerId);

    List<Task> findByCreatedBy_IdOrderByCreatedAtDesc(Long supervisorId);

    long countByCreatedBy_Id(Long supervisorId);

    long countByCreatedBy_IdAndStatus(Long supervisorId, TaskStatus status);

    long countByAssignedTo_IdAndStatus(Long workerId, TaskStatus status);

    long countByAssignedTo_Id(Long workerId);

    long countByStatus(TaskStatus status);

    long countByCategory(TaskCategory category);

    @Query("""
        SELECT t FROM Task t
        WHERE (:status IS NULL OR t.status = :status)
          AND (:category IS NULL OR t.category = :category)
          AND (:keyword IS NULL OR LOWER(t.title) LIKE LOWER(CONCAT('%', :keyword, '%'))
               OR LOWER(t.description) LIKE LOWER(CONCAT('%', :keyword, '%')))
        ORDER BY t.createdAt DESC
        """)
    List<Task> search(@Param("status") TaskStatus status,
                       @Param("category") TaskCategory category,
                       @Param("keyword") String keyword);

    @Query("""
        SELECT t FROM Task t
        WHERE t.assignedTo.id = :workerId
          AND (:status IS NULL OR t.status = :status)
          AND (:category IS NULL OR t.category = :category)
          AND (:keyword IS NULL OR LOWER(t.title) LIKE LOWER(CONCAT('%', :keyword, '%')))
        ORDER BY t.createdAt DESC
        """)
    List<Task> searchForWorker(@Param("workerId") Long workerId,
                                @Param("status") TaskStatus status,
                                @Param("category") TaskCategory category,
                                @Param("keyword") String keyword);
}
