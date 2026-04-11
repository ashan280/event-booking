package com.eventmanagement.backend.repository;

import com.eventmanagement.backend.model.Booking;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BookingRepository extends JpaRepository<Booking, Long> {

    List<Booking> findByEventIdOrderByCreatedAtAsc(Long eventId);

    List<Booking> findByUserIdOrderByCreatedAtDesc(Long userId);

    List<Booking> findTop5ByOrderByCreatedAtDesc();
}
