package com.cwtms.repository;

import com.cwtms.entity.TaskHistory;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TaskHistoryRepository extends JpaRepository<TaskHistory, Long> {
    List<TaskHistory> findByTask_IdOrderByChangedAtAsc(Long taskId);
}
