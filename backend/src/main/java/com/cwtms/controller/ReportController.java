package com.cwtms.controller;

import com.cwtms.dto.response.TaskSummaryResponse;
import com.cwtms.dto.response.WorkerPerformanceResponse;
import com.cwtms.service.ReportService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/reports")
@RequiredArgsConstructor
@PreAuthorize("hasRole('SUPERVISOR')")
public class ReportController {

    private final ReportService reportService;

    @GetMapping("/worker-performance")
    public ResponseEntity<List<WorkerPerformanceResponse>> workerPerformance() {
        return ResponseEntity.ok(reportService.workerPerformance());
    }

    @GetMapping("/task-summary")
    public ResponseEntity<TaskSummaryResponse> taskSummary() {
        return ResponseEntity.ok(reportService.taskSummary());
    }
}
