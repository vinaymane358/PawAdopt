package com.example.springapp.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Entity
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class AdoptionRequest {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String petName;
    private String petImageUrl;
    private String userName;
    private String userEmail;
    private String userPhone;
    private String message;
    private String adminComments;
    private String status; // Pending, Approved, Rejected
    private LocalDateTime requestedAt = LocalDateTime.now();
    private LocalDateTime reviewedAt;
    private String reviewedBy;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "pet_id", nullable = false)
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private Pet pet;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "shelter_id")
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private Shelter shelter;

    // Helper method to populate pet and user details before saving
    @PrePersist
    @PreUpdate
    public void populateDetails() {
        if (pet != null) {
            this.petName = pet.getName();
            this.petImageUrl = pet.getImageUrl();
        }
        if (user != null) {
            this.userName = user.getFirstName() + " " + user.getLastName();
            this.userEmail = user.getEmail();
            this.userPhone = user.getPhone();
        }
    }
}
