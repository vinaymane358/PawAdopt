package com.example.springapp.model;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
public class Feedback {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String comment;
    private int rating; // 1-5 stars

    @ManyToOne
    private User user;

    @ManyToOne
    private Pet pet;
}
