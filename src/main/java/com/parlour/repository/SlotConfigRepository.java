package com.parlour.repository;

import com.parlour.model.SlotConfiguration;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface SlotConfigRepository extends MongoRepository<SlotConfiguration, String> {
    Optional<SlotConfiguration> findFirstByOrderByUpdatedAtDesc();
}
