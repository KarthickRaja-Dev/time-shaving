package com.parlour.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

import java.util.List;

@Data
public class BookingRequest {

    @NotEmpty(message = "At least one service must be selected")
    private List<String> serviceIds;

    @NotBlank(message = "Date is required")
    @Pattern(regexp = "\\d{4}-\\d{2}-\\d{2}", message = "Date must be in YYYY-MM-DD format")
    private String date;

    @NotBlank(message = "Time slot is required")
    @Pattern(regexp = "\\d{2}:\\d{2}", message = "Time slot must be in HH:mm format")
    private String timeSlot;
}
