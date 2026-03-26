package com.parlour.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BookingResponse {
    private String id;
    private String userId;
    private List<String> serviceIds;
    private List<String> serviceNames;
    private List<String> serviceCategories;
    private double totalPrice;
    private int totalDuration;
    private String date;
    private String timeSlot;
    private String endTime;
    private String status;
    private String otp;
    private String userName;
    private String userEmail;
    private LocalDateTime createdAt;
}
