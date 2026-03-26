package com.parlour.service;

import com.parlour.dto.request.BookingRequest;
import com.parlour.dto.response.BookingResponse;
import com.parlour.exception.BadRequestException;
import com.parlour.exception.ConflictException;
import com.parlour.exception.ResourceNotFoundException;
import com.parlour.model.Booking;
import com.parlour.model.Service;
import com.parlour.repository.BookingRepository;
import com.parlour.repository.ServiceRepository;
import com.parlour.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.DuplicateKeyException;

import java.time.LocalDate;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;
import java.util.stream.Collectors;

@org.springframework.stereotype.Service
@RequiredArgsConstructor
public class BookingService {

    private final BookingRepository bookingRepository;
    private final ServiceRepository serviceRepository;
    private final UserRepository userRepository;

    private static final DateTimeFormatter TIME_FMT = DateTimeFormatter.ofPattern("HH:mm");
    private static final Random RANDOM = new Random();

    public BookingResponse createBooking(String userId, BookingRequest request) {
        // Validate all services
        List<Service> services = new ArrayList<>();
        int totalDuration = 0;
        for (String sid : request.getServiceIds()) {
            Service service = serviceRepository.findById(sid)
                    .orElseThrow(() -> new ResourceNotFoundException("Service not found: " + sid));
            services.add(service);
            totalDuration += service.getDuration();
        }

        // Validate date is not in past
        LocalDate date = LocalDate.parse(request.getDate());
        if (date.isBefore(LocalDate.now())) {
            throw new BadRequestException("Cannot book a slot in the past");
        }

        // Validate time is not in past for today
        if (date.isEqual(LocalDate.now())) {
            LocalTime slotTime = LocalTime.parse(request.getTimeSlot(), TIME_FMT);
            if (slotTime.isBefore(LocalTime.now())) {
                throw new BadRequestException("Cannot book a slot that has already passed");
            }
        }

        // Compute end time based on total duration
        LocalTime startTime = LocalTime.parse(request.getTimeSlot(), TIME_FMT);
        String endTime = startTime.plusMinutes(totalDuration).format(TIME_FMT);

        // Check for overlapping bookings at this time slot
        List<Booking> existingBookings = bookingRepository.findByDateAndStatus(request.getDate(), Booking.Status.CONFIRMED);
        LocalTime newStart = startTime;
        LocalTime newEnd = startTime.plusMinutes(totalDuration);
        for (Booking existing : existingBookings) {
            LocalTime exStart = LocalTime.parse(existing.getTimeSlot(), TIME_FMT);
            LocalTime exEnd = LocalTime.parse(existing.getEndTime(), TIME_FMT);
            // Check time overlap
            if (newStart.isBefore(exEnd) && newEnd.isAfter(exStart)) {
                throw new ConflictException("This time slot overlaps with an existing booking. Please choose another.");
            }
        }

        // Generate 6-digit OTP for verification
        String otp = String.format("%06d", RANDOM.nextInt(999999));

        // Build booking
        Booking booking = Booking.builder()
                .userId(userId)
                .serviceIds(request.getServiceIds())
                .date(request.getDate())
                .timeSlot(request.getTimeSlot())
                .endTime(endTime)
                .status(Booking.Status.CONFIRMED)
                .otp(otp)
                .build();

        try {
            booking = bookingRepository.save(booking);
        } catch (DuplicateKeyException e) {
            throw new ConflictException("This time slot is no longer available. Please choose another.");
        }

        return toResponse(booking);
    }

    public List<BookingResponse> getUserBookings(String userId) {
        return bookingRepository.findByUserIdOrderByCreatedAtDesc(userId).stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public List<BookingResponse> getAllBookings(String date, String serviceId, String status) {
        List<Booking> bookings;
        if (date != null && !date.isBlank()) {
            bookings = bookingRepository.findByDate(date);
        } else if (status != null && !status.isBlank()) {
            bookings = bookingRepository.findByStatus(Booking.Status.valueOf(status.toUpperCase()));
        } else if (serviceId != null && !serviceId.isBlank()) {
            bookings = bookingRepository.findByServiceIdsContaining(serviceId);
        } else {
            bookings = bookingRepository.findAll();
        }
        return bookings.stream().map(this::toResponse).collect(Collectors.toList());
    }

    public BookingResponse cancelBooking(String bookingId, String userId, boolean isAdmin) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));

        // Authorization check
        if (!isAdmin && !booking.getUserId().equals(userId)) {
            throw new BadRequestException("You are not authorized to cancel this booking");
        }

        if (booking.getStatus() != Booking.Status.CONFIRMED) {
            throw new BadRequestException("Only confirmed bookings can be cancelled");
        }

        // Check 2-hour cancellation window
        if (!isAdmin) {
            LocalDate bookingDate = LocalDate.parse(booking.getDate());
            LocalTime bookingTime = LocalTime.parse(booking.getTimeSlot(), TIME_FMT);
            if (bookingDate.isEqual(LocalDate.now()) && bookingTime.minusHours(2).isBefore(LocalTime.now())) {
                throw new ConflictException("Cancellation is not allowed within 2 hours of the appointment time");
            }
        }

        booking.setStatus(Booking.Status.CANCELLED);
        booking = bookingRepository.save(booking);
        return toResponse(booking);
    }

    public BookingResponse completeBooking(String bookingId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));

        if (booking.getStatus() != Booking.Status.CONFIRMED) {
            throw new BadRequestException("Only confirmed bookings can be marked as completed");
        }

        booking.setStatus(Booking.Status.COMPLETED);
        booking = bookingRepository.save(booking);
        return toResponse(booking);
    }

    private BookingResponse toResponse(Booking booking) {
        List<String> names = new ArrayList<>();
        List<String> categories = new ArrayList<>();
        double totalPrice = 0;
        int totalDuration = 0;

        if (booking.getServiceIds() != null) {
            for (String sid : booking.getServiceIds()) {
                serviceRepository.findById(sid).ifPresent(s -> {
                    names.add(s.getName());
                    categories.add(s.getCategory());
                });
            }
            // Calculate price and duration
            for (String sid : booking.getServiceIds()) {
                serviceRepository.findById(sid).ifPresent(s -> {
                });
            }
            for (String sid : booking.getServiceIds()) {
                var svc = serviceRepository.findById(sid);
                if (svc.isPresent()) {
                    totalPrice += svc.get().getPrice();
                    totalDuration += svc.get().getDuration();
                }
            }
        }

        BookingResponse.BookingResponseBuilder builder = BookingResponse.builder()
                .id(booking.getId())
                .userId(booking.getUserId())
                .serviceIds(booking.getServiceIds())
                .serviceNames(names)
                .serviceCategories(categories)
                .totalPrice(totalPrice)
                .totalDuration(totalDuration)
                .date(booking.getDate())
                .timeSlot(booking.getTimeSlot())
                .endTime(booking.getEndTime())
                .status(booking.getStatus().name())
                .otp(booking.getOtp())
                .createdAt(booking.getCreatedAt());

        // Enrich with user info
        userRepository.findById(booking.getUserId()).ifPresent(u -> {
            builder.userName(u.getName());
            builder.userEmail(u.getEmail());
        });

        return builder.build();
    }
}
