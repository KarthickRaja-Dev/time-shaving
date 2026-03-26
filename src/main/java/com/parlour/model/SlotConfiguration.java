package com.parlour.model;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.annotation.LastModifiedDate;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Document(collection = "slot_configurations")
public class SlotConfiguration {

    @Id
    private String id;

    private String startTime;    // HH:mm e.g. "09:00"

    private String endTime;      // HH:mm e.g. "19:00"

    @Builder.Default
    private Integer bufferMinutes = 10;

    private List<Integer> workingDays; // 1=Mon, 7=Sun

    @LastModifiedDate
    private LocalDateTime updatedAt;
}
