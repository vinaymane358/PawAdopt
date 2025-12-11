package com.example.springapp.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Entity
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Pet {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String breed;
    private String age;
    private String petType;  // dog, cat, other
    private String gender;  // Male, Female
    private String color;
    private String description;
    private String imageUrl;
    private String status; // Available, Adopted, Pending
    private String location;
    private Boolean vaccinated = false;
    private LocalDateTime createdAt = LocalDateTime.now();
    private LocalDateTime updatedAt = LocalDateTime.now();

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "shelter_id")
    private Shelter shelter;

    @OneToMany(mappedBy = "pet", fetch = FetchType.LAZY)
    @JsonIgnore
    private List<AdoptionRequest> adoptionRequests;

    @OneToMany(mappedBy = "pet", fetch = FetchType.LAZY)
    @JsonIgnore
    private List<Feedback> feedbacks;

    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}
