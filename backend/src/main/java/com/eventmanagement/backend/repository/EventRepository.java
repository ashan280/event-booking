package com.eventmanagement.backend.repository;

import com.eventmanagement.backend.model.Event;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EventRepository extends JpaRepository<Event, Long> {
}
