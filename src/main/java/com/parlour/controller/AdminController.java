package com.parlour.controller;

import com.parlour.dto.request.SlotConfigRequest;
import com.parlour.model.SlotConfiguration;
import com.parlour.service.DashboardService;
import com.parlour.service.SlotService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
@RequiredArgsConstructor
public class AdminController {

    private final SlotService slotService;
    private final DashboardService dashboardService;

    @GetMapping("/dashboard")
    public ResponseEntity<Map<String, Object>> getDashboard() {
        return ResponseEntity.ok(dashboardService.getDashboardStats());
    }

    @GetMapping("/slot-config")
    public ResponseEntity<SlotConfiguration> getSlotConfig() {
        return ResponseEntity.ok(slotService.getConfig());
    }

    @PutMapping("/slot-config")
    public ResponseEntity<SlotConfiguration> updateSlotConfig(@Valid @RequestBody SlotConfigRequest request) {
        SlotConfiguration config = SlotConfiguration.builder()
                .startTime(request.getStartTime())
                .endTime(request.getEndTime())
                .bufferMinutes(request.getBufferMinutes())
                .workingDays(request.getWorkingDays())
                .build();
        return ResponseEntity.ok(slotService.updateConfig(config));
    }
}
