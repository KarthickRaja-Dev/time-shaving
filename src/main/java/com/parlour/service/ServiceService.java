package com.parlour.service;

import com.parlour.dto.request.ServiceRequest;
import com.parlour.exception.ConflictException;
import com.parlour.exception.ResourceNotFoundException;
import com.parlour.model.Booking;
import com.parlour.model.Service;
import com.parlour.repository.BookingRepository;
import com.parlour.repository.ServiceRepository;
import lombok.RequiredArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@org.springframework.stereotype.Service
@RequiredArgsConstructor
public class ServiceService {

    private final ServiceRepository serviceRepository;
    private final BookingRepository bookingRepository;

    public List<Service> getAllActive() {
        return serviceRepository.findByActiveTrue();
    }

    public List<Service> getAll() {
        return serviceRepository.findAll();
    }

    public Service getById(String id) {
        return serviceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Service not found with id: " + id));
    }

    public Service create(ServiceRequest request) {
        Service service = Service.builder()
                .name(request.getName())
                .description(request.getDescription())
                .category(request.getCategory())
                .price(request.getPrice())
                .duration(request.getDuration())
                .imageUrl(request.getImageUrl())
                .active(true)
                .build();
        return serviceRepository.save(service);
    }

    public Service update(String id, ServiceRequest request) {
        Service service = getById(id);
        service.setName(request.getName());
        service.setDescription(request.getDescription());
        service.setCategory(request.getCategory());
        service.setPrice(request.getPrice());
        service.setDuration(request.getDuration());
        if (request.getImageUrl() != null) {
            service.setImageUrl(request.getImageUrl());
        }
        return serviceRepository.save(service);
    }

    public void delete(String id) {
        Service service = getById(id);
        String today = LocalDate.now().toString();
        // Check bookings that contain this serviceId
        List<Booking> futureBookings = bookingRepository.findByServiceIdsContaining(id).stream()
                .filter(b -> b.getStatus() == Booking.Status.CONFIRMED)
                .filter(b -> b.getDate().compareTo(today) >= 0)
                .toList();
        if (!futureBookings.isEmpty()) {
            throw new ConflictException("Cannot delete service with " + futureBookings.size() + " active future booking(s). Cancel them first.");
        }
        serviceRepository.delete(service);
    }
}
