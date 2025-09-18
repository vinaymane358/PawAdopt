package com.example.springapp.controller;

import com.example.springapp.model.Feedback;
import com.example.springapp.services.FeedbackService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/feedbacks")
public class FeedbackController {
    private final FeedbackService feedbackService;

    public FeedbackController(FeedbackService feedbackService) {
        this.feedbackService = feedbackService;
    }

    @GetMapping
    public List<Feedback> getAllFeedbacks() {
        return feedbackService.getAllFeedbacks();
    }

    @GetMapping("/{id}")
    public Optional<Feedback> getFeedbackById(@PathVariable Long id) {
        return feedbackService.getFeedbackById(id);
    }

    @PostMapping
    public Feedback createFeedback(@RequestBody Feedback feedback) {
        return feedbackService.saveFeedback(feedback);
    }

    @PutMapping("/{id}")
    public Feedback updateFeedback(@PathVariable Long id, @RequestBody Feedback feedback) {
        feedback.setId(id);
        return feedbackService.saveFeedback(feedback);
    }

    @DeleteMapping("/{id}")
    public void deleteFeedback(@PathVariable Long id) {
        feedbackService.deleteFeedback(id);
    }

    // ✅ JPQL Endpoints
    @GetMapping("/user/{userId}")
    public List<Feedback> getFeedbacksByUser(@PathVariable Long userId) {
        return feedbackService.getFeedbacksByUser(userId);
    }

    @GetMapping("/pet/{petId}")
    public List<Feedback> getFeedbacksByPet(@PathVariable Long petId) {
        return feedbackService.getFeedbacksByPet(petId);
    }

    @GetMapping("/rating/{rating}")
    public List<Feedback> getFeedbacksByRating(@PathVariable int rating) {
        return feedbackService.getFeedbacksByRating(rating);
    }

    @GetMapping("/pet/{petId}/average-rating")
    public Double getAverageRatingForPet(@PathVariable Long petId) {
        return feedbackService.getAverageRatingForPet(petId);
    }
}