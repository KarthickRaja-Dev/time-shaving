package com.parlour.service;

import com.parlour.model.Booking;
import com.parlour.repository.BookingRepository;
import com.parlour.repository.ServiceRepository;
import com.parlour.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final BookingRepository bookingRepository;
    private final ServiceRepository serviceRepository;
    private final UserRepository userRepository;

    public Map<String, Object> getDashboardStats() {
        String today = LocalDate.now().toString();
        List<Booking> allBookings = bookingRepository.findAll();
        List<Booking> todayBookings = bookingRepository.findByDate(today);

        long confirmed = allBookings.stream().filter(b -> b.getStatus() == Booking.Status.CONFIRMED).count();
        long completed = allBookings.stream().filter(b -> b.getStatus() == Booking.Status.COMPLETED).count();
        long cancelled = allBookings.stream().filter(b -> b.getStatus() == Booking.Status.CANCELLED).count();

        // Calculate revenue by summing prices of all services in each booking
        double totalRevenue = allBookings.stream()
                .filter(b -> b.getStatus() == Booking.Status.COMPLETED)
                .mapToDouble(b -> b.getServiceIds() != null
                        ? b.getServiceIds().stream()
                            .mapToDouble(sid -> serviceRepository.findById(sid)
                                .map(com.parlour.model.Service::getPrice).orElse(0.0))
                            .sum()
                        : 0.0)
                .sum();

        double todayRevenue = todayBookings.stream()
                .filter(b -> b.getStatus() != Booking.Status.CANCELLED)
                .mapToDouble(b -> b.getServiceIds() != null
                        ? b.getServiceIds().stream()
                            .mapToDouble(sid -> serviceRepository.findById(sid)
                                .map(com.parlour.model.Service::getPrice).orElse(0.0))
                            .sum()
                        : 0.0)
                .sum();

        Map<String, Object> stats = new LinkedHashMap<>();
        stats.put("todayBookings", todayBookings.size());
        stats.put("totalBookings", allBookings.size());
        stats.put("totalCustomers", userRepository.count() - 1); // exclude admin
        stats.put("totalServices", serviceRepository.count());
        stats.put("todayRevenue", todayRevenue);
        stats.put("totalRevenue", totalRevenue);

        Map<String, Long> byStatus = new LinkedHashMap<>();
        byStatus.put("CONFIRMED", confirmed);
        byStatus.put("COMPLETED", completed);
        byStatus.put("CANCELLED", cancelled);
        stats.put("bookingsByStatus", byStatus);

        return stats;
    }
}
