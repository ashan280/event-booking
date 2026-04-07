package com.eventmanagement.backend.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@Entity
@Table(name = "events")
public class Event {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 150)
    private String title;

    @Column(nullable = false, length = 80)
    private String category;

    @Column(nullable = false, length = 150)
    private String venue;

    @Column(nullable = false, length = 120)
    private String city;

    @Column(nullable = false, length = 20)
    private String date;

    @Column(nullable = false, length = 40)
    private String time;

    @Column(nullable = false, length = 40)
    private String price;

    @Column(name = "short_description", nullable = false, length = 120)
    private String shortDescription;

    @Column(nullable = false, length = 500)
    private String description;

    @Column(name = "available_seats", nullable = false)
    private Integer availableSeats;

    @Column(name = "image_url", length = 255)
    private String imageUrl;
}
