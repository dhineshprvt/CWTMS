package com.cwtms.dto.response;

import com.cwtms.entity.TaskHistory;
import com.cwtms.entity.enums.TaskStatus;

import java.time.LocalDateTime;

public record TaskHistoryResponse(
        Long id,
        TaskStatus oldStatus,
        TaskStatus newStatus,
        String remarks,
        String changedByName,
        LocalDateTime changedAt
) {
    public static TaskHistoryResponse from(TaskHistory h) {
        return new TaskHistoryResponse(
                h.getId(), h.getOldStatus(), h.getNewStatus(), h.getRemarks(),
                h.getChangedBy().getFullName(), h.getChangedAt()
        );
    }
}
