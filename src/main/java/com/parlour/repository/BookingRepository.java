package com.parlour.repository;

import com.parlour.model.Booking;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BookingRepository extends MongoRepository<Booking, String> {
    List<Booking> findByUserId(String userId);
    List<Booking> findByDateAndStatus(String date, Booking.Status status);
    List<Booking> findByStatus(Booking.Status status);
    List<Booking> findByDate(String date);
    List<Booking> findByUserIdOrderByCreatedAtDesc(String userId);

    // Find bookings where serviceIds array contains a specific serviceId
    @Query("{ 'serviceIds': ?0, 'date': ?1, 'status': ?2 }")
    List<Booking> findByServiceIdsContainingAndDateAndStatus(String serviceId, String date, Booking.Status status);

    @Query("{ 'serviceIds': ?0 }")
    List<Booking> findByServiceIdsContaining(String serviceId);
}
