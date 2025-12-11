package com.example.springapp.services;

import com.example.springapp.model.Feedback;
import com.example.springapp.model.User;
import com.example.springapp.model.Pet;
import com.example.springapp.repository.FeedbackRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class FeedbackService {
    private final FeedbackRepository feedbackRepository;

    public FeedbackService(FeedbackRepository feedbackRepository) {
        this.feedbackRepository = feedbackRepository;
    }

    public List<Feedback> getAllFeedbacks() {
        return feedbackRepository.findAll();
    }

    public Optional<Feedback> getFeedbackById(Long id) {
        return feedbackRepository.findById(id);
    }

    public Feedback saveFeedback(Feedback feedback) {
        // Create User and Pet objects with the provided IDs
        if (feedback.getUserId() != null) {
            User user = new User();
            user.setId(feedback.getUserId());
            feedback.setUser(user);
        }
        
        if (feedback.getPetId() != null) {
            Pet pet = new Pet();
            pet.setId(feedback.getPetId());
            feedback.setPet(pet);
        }
        
        return feedbackRepository.save(feedback);
    }

    public void deleteFeedback(Long id) {
        feedbackRepository.deleteById(id);
    }

    // JPQL Methods
    public List<Feedback> getFeedbacksByUser(Long userId) {
        return feedbackRepository.findByUserId(userId);
    }

    public List<Feedback> getFeedbacksByPet(Long petId) {
        return feedbackRepository.findByPetId(petId);
    }

    public List<Feedback> getFeedbacksByRating(int rating) {
        return feedbackRepository.findByRating(rating);
    }

    public Double getAverageRatingForPet(Long petId) {
        return feedbackRepository.findAverageRatingByPetId(petId);
    }
}
