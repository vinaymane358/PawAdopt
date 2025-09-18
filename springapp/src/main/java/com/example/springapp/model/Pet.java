package com.example.springapp.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;
import java.util.List;

@Data
@Entity
public class Pet {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String type;   // Dog, Cat, etc.
    private String breed;
    private int age;
    private String gender;
    private String size;
    private String status; // Available, Adopted, Pending
    private LocalDate addedDate = LocalDate.now();

    @ManyToOne
    private Shelter shelter;

    @OneToMany(mappedBy = "pet")
    private List<AdoptionRequest> adoptionRequests;

    @OneToMany(mappedBy = "pet")
    private List<Feedback> feedbacks;
}
