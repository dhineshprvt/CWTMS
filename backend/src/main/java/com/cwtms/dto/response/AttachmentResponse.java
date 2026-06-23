package com.cwtms.dto.response;

import com.cwtms.entity.TaskAttachment;
import com.cwtms.entity.enums.FileType;

import java.time.LocalDateTime;

public record AttachmentResponse(
        Long id,
        String fileName,
        String filePath,
        FileType fileType,
        String uploadedByName,
        LocalDateTime uploadedAt
) {
    public static AttachmentResponse from(TaskAttachment a) {
        return new AttachmentResponse(
                a.getId(), a.getFileName(), a.getFilePath(), a.getFileType(),
                a.getUploadedBy().getFullName(), a.getUploadedAt()
        );
    }
}
