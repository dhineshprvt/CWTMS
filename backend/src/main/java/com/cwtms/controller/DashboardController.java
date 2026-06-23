package com.cwtms.controller;

import com.cwtms.dto.response.AdminStatsResponse;
import com.cwtms.dto.response.SupervisorStatsResponse;
import com.cwtms.dto.response.WorkerStatsResponse;
import com.cwtms.security.CustomUserDetailsService;
import com.cwtms.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService dashboardService;
    private final CustomUserDetailsService userDetailsService;

    @GetMapping("/admin-stats")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<AdminStatsResponse> adminStats() {
        return ResponseEntity.ok(dashboardService.adminStats());
    }

    @GetMapping("/supervisor-stats")
    @PreAuthorize("hasRole('SUPERVISOR')")
    public ResponseEntity<SupervisorStatsResponse> supervisorStats(Authentication auth) {
        var supervisor = userDetailsService.loadDomainUser(auth.getName());
        return ResponseEntity.ok(dashboardService.supervisorStats(supervisor));
    }

    @GetMapping("/worker-stats")
    @PreAuthorize("hasRole('WORKER')")
    public ResponseEntity<WorkerStatsResponse> workerStats(Authentication auth) {
        var worker = userDetailsService.loadDomainUser(auth.getName());
        return ResponseEntity.ok(dashboardService.workerStats(worker));
    }
}
