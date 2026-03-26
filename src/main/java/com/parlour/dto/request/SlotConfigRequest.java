package com.parlour.dto.request;

import jakarta.validation.constraints.*;
import lombok.Data;

import java.util.List;

@Data
public class SlotConfigRequest {

    @NotBlank(message = "Start time is required")
    @Pattern(regexp = "\\d{2}:\\d{2}", message = "Start time must be in HH:mm format")
    private String startTime;

    @NotBlank(message = "End time is required")
    @Pattern(regexp = "\\d{2}:\\d{2}", message = "End time must be in HH:mm format")
    private String endTime;

    @NotNull(message = "Buffer minutes is required")
    @Min(value = 0, message = "Buffer cannot be negative")
    private Integer bufferMinutes;

    @NotEmpty(message = "Working days are required")
    private List<Integer> workingDays;
}
