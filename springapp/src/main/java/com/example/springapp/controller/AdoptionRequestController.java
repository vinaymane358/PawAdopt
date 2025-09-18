package com.example.springapp.controller;

import com.example.springapp.model.AdoptionRequest;
import com.example.springapp.services.AdoptionRequestService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/adoption-requests")
public class AdoptionRequestController {
    private final AdoptionRequestService requestService;

    public AdoptionRequestController(AdoptionRequestService requestService) {
        this.requestService = requestService;
    }

    @GetMapping
    public List<AdoptionRequest> getAllRequests() {
        return requestService.getAllRequests();
    }

    @GetMapping("/{id}")
    public Optional<AdoptionRequest> getRequestById(@PathVariable Long id) {
        return requestService.getRequestById(id);
    }

    @PostMapping
    public AdoptionRequest createRequest(@RequestBody AdoptionRequest request) {
        return requestService.saveRequest(request);
    }

    @PutMapping("/{id}")
    public AdoptionRequest updateRequest(@PathVariable Long id, @RequestBody AdoptionRequest request) {
        request.setId(id);
        return requestService.saveRequest(request);
    }

    @DeleteMapping("/{id}")
    public void deleteRequest(@PathVariable Long id) {
        requestService.deleteRequest(id);
    }

    // Extra endpoints using JPQL
    @GetMapping("/status/{status}")
    public List<AdoptionRequest> getRequestsByStatus(@PathVariable String status) {
        return requestService.getRequestsByStatus(status);
    }

    @GetMapping("/user/{userId}")
    public List<AdoptionRequest> getRequestsByUser(@PathVariable Long userId) {
        return requestService.getRequestsByUser(userId);
    }

    @GetMapping("/pet/{petId}")
    public List<AdoptionRequest> getRequestsByPet(@PathVariable Long petId) {
        return requestService.getRequestsByPet(petId);
    }

    @GetMapping("/sorted/date")
    public List<AdoptionRequest> getRequestsSortedByDate() {
        return requestService.getRequestsSortedByDate();
    }
}
