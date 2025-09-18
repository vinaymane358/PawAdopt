package com.example.springapp.repository;

import com.example.springapp.model.Feedback;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FeedbackRepository extends JpaRepository<Feedback, Long> {

    // Find feedback by userId
    @Query("SELECT f FROM Feedback f WHERE f.user.id = :userId")
    List<Feedback> findByUserId(Long userId);

    // Find feedback by petId
    @Query("SELECT f FROM Feedback f WHERE f.pet.id = :petId")
    List<Feedback> findByPetId(Long petId);

    // Find feedbacks by rating (e.g., 5-star feedback)
    @Query("SELECT f FROM Feedback f WHERE f.rating = :rating")
    List<Feedback> findByRating(int rating);

    // Get average rating for a specific pet
    @Query("SELECT AVG(f.rating) FROM Feedback f WHERE f.pet.id = :petId")
    Double findAverageRatingByPetId(Long petId);
}
