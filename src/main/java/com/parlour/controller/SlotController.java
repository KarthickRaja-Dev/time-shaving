package com.parlour.controller;

import com.parlour.service.SlotService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/slots")
@RequiredArgsConstructor
public class SlotController {

    private final SlotService slotService;

    @GetMapping
    public ResponseEntity<Map<String, Object>> getAvailableSlots(
            @RequestParam List<String> serviceIds,
            @RequestParam String date) {
        return ResponseEntity.ok(slotService.getAvailableSlots(serviceIds, date));
    }
}
