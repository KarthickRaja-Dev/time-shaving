package com.parlour.service;

import com.parlour.exception.BadRequestException;
import com.parlour.exception.ResourceNotFoundException;
import com.parlour.model.Booking;
import com.parlour.model.Service;
import com.parlour.model.SlotConfiguration;
import com.parlour.repository.BookingRepository;
import com.parlour.repository.ServiceRepository;
import com.parlour.repository.SlotConfigRepository;
import lombok.RequiredArgsConstructor;

import java.time.LocalDate;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@org.springframework.stereotype.Service
@RequiredArgsConstructor
public class SlotService {

    private final SlotConfigRepository slotConfigRepository;
    private final BookingRepository bookingRepository;
    private final ServiceRepository serviceRepository;

    private static final DateTimeFormatter TIME_FMT = DateTimeFormatter.ofPattern("HH:mm");

    public Map<String, Object> getAvailableSlots(List<String> serviceIds, String date) {
        // Validate services and compute total duration
        List<String> serviceNames = new ArrayList<>();
        int totalDuration = 0;
        for (String sid : serviceIds) {
            Service service = serviceRepository.findById(sid)
                    .orElseThrow(() -> new ResourceNotFoundException("Service not found: " + sid));
            serviceNames.add(service.getName());
            totalDuration += service.getDuration();
        }

        // Validate date
        LocalDate requestedDate;
        try {
            requestedDate = LocalDate.parse(date);
        } catch (Exception e) {
            throw new BadRequestException("Invalid date format. Use YYYY-MM-DD");
        }

        if (requestedDate.isBefore(LocalDate.now())) {
            throw new BadRequestException("Cannot book a slot in the past");
        }

        // Load slot config
        SlotConfiguration config = slotConfigRepository.findFirstByOrderByUpdatedAtDesc()
                .orElseThrow(() -> new ResourceNotFoundException("Slot configuration not found"));

        // Check if it's a working day
        int dayOfWeek = requestedDate.getDayOfWeek().getValue();
        if (!config.getWorkingDays().contains(dayOfWeek)) {
            throw new BadRequestException("The parlour is closed on " + requestedDate.getDayOfWeek().name());
        }

        // Generate all possible slots based on total duration
        List<Map<String, String>> allSlots = generateSlots(config, totalDuration);

        // Get all confirmed bookings for this date
        List<Booking> confirmedBookings = bookingRepository.findByDateAndStatus(date, Booking.Status.CONFIRMED);

        // Filter out slots that overlap with existing bookings
        LocalTime now = LocalTime.now();
        List<Map<String, String>> availableSlots = allSlots.stream()
                .filter(slot -> {
                    LocalTime slotStart = LocalTime.parse(slot.get("startTime"), TIME_FMT);
                    LocalTime slotEnd = LocalTime.parse(slot.get("endTime"), TIME_FMT);
                    // Check overlap with all existing bookings
                    for (Booking booking : confirmedBookings) {
                        LocalTime bStart = LocalTime.parse(booking.getTimeSlot(), TIME_FMT);
                        LocalTime bEnd = LocalTime.parse(booking.getEndTime(), TIME_FMT);
                        if (slotStart.isBefore(bEnd) && slotEnd.isAfter(bStart)) {
                            return false; // overlaps
                        }
                    }
                    return true;
                })
                .filter(slot -> {
                    if (requestedDate.isEqual(LocalDate.now())) {
                        return LocalTime.parse(slot.get("startTime"), TIME_FMT).isAfter(now);
                    }
                    return true;
                })
                .toList();

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("date", date);
        result.put("serviceIds", serviceIds);
        result.put("serviceNames", serviceNames);
        result.put("totalDuration", totalDuration);
        result.put("availableSlots", availableSlots);
        return result;
    }

    private List<Map<String, String>> generateSlots(SlotConfiguration config, int durationMinutes) {
        LocalTime start = LocalTime.parse(config.getStartTime(), TIME_FMT);
        LocalTime end = LocalTime.parse(config.getEndTime(), TIME_FMT);
        int buffer = config.getBufferMinutes();

        List<Map<String, String>> slots = new ArrayList<>();
        LocalTime current = start;

        while (current.plusMinutes(durationMinutes).compareTo(end) <= 0) {
            Map<String, String> slot = new LinkedHashMap<>();
            slot.put("startTime", current.format(TIME_FMT));
            slot.put("endTime", current.plusMinutes(durationMinutes).format(TIME_FMT));
            slots.add(slot);

            current = current.plusMinutes(durationMinutes + buffer);
        }

        return slots;
    }

    public SlotConfiguration getConfig() {
        return slotConfigRepository.findFirstByOrderByUpdatedAtDesc()
                .orElseThrow(() -> new ResourceNotFoundException("Slot configuration not found"));
    }

    public SlotConfiguration updateConfig(SlotConfiguration config) {
        SlotConfiguration existing = slotConfigRepository.findFirstByOrderByUpdatedAtDesc().orElse(null);
        if (existing != null) {
            existing.setStartTime(config.getStartTime());
            existing.setEndTime(config.getEndTime());
            existing.setBufferMinutes(config.getBufferMinutes());
            existing.setWorkingDays(config.getWorkingDays());
            return slotConfigRepository.save(existing);
        }
        return slotConfigRepository.save(config);
    }
}
