package com.eventmanagement.backend.model;

import lombok.Data;

@Data
public class User {

    private Long id;
    private String fullName;
    private String email;
    private String role;
}
