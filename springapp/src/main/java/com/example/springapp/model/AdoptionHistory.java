package com.example.springapp.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;

@Data
@Entity
public class AdoptionHistory {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDate adoptionDate = LocalDate.now();

    @ManyToOne
    @JoinColumn(name = "adopter_id", nullable = false)
    private User adopter;

    @ManyToOne
    @JoinColumn(name = "pet_id", nullable = false)
    private Pet adoptedPet;

    @ManyToOne
    @JoinColumn(name = "shelter_id", nullable = false)
    private Shelter shelter;
}
