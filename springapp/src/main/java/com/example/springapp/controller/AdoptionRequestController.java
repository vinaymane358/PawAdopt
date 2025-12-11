package com.example.springapp.controller;

import com.example.springapp.model.AdoptionRequest;
import com.example.springapp.services.AdoptionRequestService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/adoption-requests")
@CrossOrigin(origins = "http://localhost:4200")
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
    public ResponseEntity<?> createRequest(@RequestBody AdoptionRequest request) {
        try {
            System.out.println("📝 Received adoption request: " + request.getPetName() + " by " + request.getUserName());
            AdoptionRequest savedRequest = requestService.saveRequest(request);
            System.out.println("✅ Successfully saved adoption request with ID: " + savedRequest.getId());
            return ResponseEntity.ok(savedRequest);
        } catch (Exception e) {
            System.err.println("❌ Error creating adoption request: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().body("Error creating adoption request: " + e.getMessage());
        }
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

    @GetMapping("/shelter/{shelterId}")
    public List<AdoptionRequest> getRequestsByShelter(@PathVariable Long shelterId) {
        return requestService.getRequestsByShelter(shelterId);
    }

    @GetMapping("/sorted/date")
    public List<AdoptionRequest> getRequestsSortedByDate() {
        return requestService.getRequestsSortedByDate();
    }

    // Additional endpoints for frontend integration
    @GetMapping("/pending")
    public List<AdoptionRequest> getPendingRequests() {
        return requestService.getRequestsByStatus("Pending");
    }

    @GetMapping("/approved")
    public List<AdoptionRequest> getApprovedRequests() {
        return requestService.getRequestsByStatus("Approved");
    }

    @GetMapping("/rejected")
    public List<AdoptionRequest> getRejectedRequests() {
        return requestService.getRequestsByStatus("Rejected");
    }

    @PutMapping("/{id}/approve")
    public ResponseEntity<?> approveRequest(@PathVariable Long id, @RequestBody Map<String, String> request) {
        try {
            String adminComments = request.getOrDefault("adminComments", "");
            AdoptionRequest approvedRequest = requestService.approveRequest(id, adminComments);
            return ResponseEntity.ok(approvedRequest);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error approving request: " + e.getMessage());
        }
    }

    @PutMapping("/{id}/reject")
    public ResponseEntity<?> rejectRequest(@PathVariable Long id, @RequestBody Map<String, String> request) {
        try {
            String adminComments = request.getOrDefault("adminComments", "");
            AdoptionRequest rejectedRequest = requestService.rejectRequest(id, adminComments);
            return ResponseEntity.ok(rejectedRequest);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error rejecting request: " + e.getMessage());
        }
    }
}
