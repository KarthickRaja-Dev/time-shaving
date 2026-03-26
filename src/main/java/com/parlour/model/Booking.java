package com.parlour.model;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Document(collection = "bookings")
public class Booking {

    @Id
    private String id;

    private String userId;

    private List<String> serviceIds;

    private String date;      // YYYY-MM-DD

    private String timeSlot;  // HH:mm (start time)

    private String endTime;   // HH:mm (computed: start + total duration)

    private Status status;

    private String otp;       // 6-digit verification code

    @CreatedDate
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;

    public enum Status {
        CONFIRMED, CANCELLED, COMPLETED
    }
}
