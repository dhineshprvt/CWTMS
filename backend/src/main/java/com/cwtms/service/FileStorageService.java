package com.cwtms.service;

import com.cwtms.exception.BadRequestException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@Service
public class FileStorageService {

    @Value("${app.upload.dir}")
    private String uploadDir;

    /**
     * Stores a single file under uploads/tasks/{taskId}/ and returns the
     * relative path that gets persisted in task_attachments.file_path.
     */
    public String store(MultipartFile file, Long taskId) {
        if (file == null || file.isEmpty()) {
            throw new BadRequestException("Cannot upload an empty file.");
        }
        try {
            Path dir = Paths.get(uploadDir, "tasks", String.valueOf(taskId));
            Files.createDirectories(dir);

            String original = StringUtils.cleanPath(
                    file.getOriginalFilename() != null ? file.getOriginalFilename() : "file");
            String safeName = System.currentTimeMillis() + "_" + original.replaceAll("[^a-zA-Z0-9._-]", "_");

            Path target = dir.resolve(safeName);
            file.transferTo(target);

            return "uploads/tasks/" + taskId + "/" + safeName;
        } catch (IOException e) {
            throw new RuntimeException("Could not store file: " + e.getMessage(), e);
        }
    }
}
