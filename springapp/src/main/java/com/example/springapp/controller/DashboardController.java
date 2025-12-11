package com.example.springapp.controller;

import com.example.springapp.services.AdoptionRequestService;
import com.example.springapp.services.PetService;
import com.example.springapp.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/api/dashboard")
@CrossOrigin(origins = "http://localhost:4200")
public class DashboardController {

    @Autowired
    private PetService petService;

    @Autowired
    private AdoptionRequestService adoptionRequestService;

    @Autowired
    private UserService userService;

    @GetMapping("/stats")
    public ResponseEntity<?> getDashboardStats() {
        try {
            Map<String, Object> stats = new HashMap<>();
            
            // Get pet statistics
            long totalPets = petService.getAllPets().size();
            long availablePets = petService.getPetsByStatus("Available").size();
            long adoptedPets = petService.getPetsByStatus("Adopted").size();
            
            // Get adoption request statistics
            long pendingRequests = adoptionRequestService.getRequestsByStatus("Pending").size();
            long approvedRequests = adoptionRequestService.getRequestsByStatus("Approved").size();
            
            // Get user statistics
            long totalUsers = userService.findUsersWithDetails().size();
            long activeUsers = userService.findUsersWithDetails().stream()
                    .filter(user -> user.getIsActive() != null && user.getIsActive())
                    .count();
            
            stats.put("totalPets", totalPets);
            stats.put("availablePets", availablePets);
            stats.put("adoptedPets", adoptedPets);
            stats.put("pendingRequests", pendingRequests);
            stats.put("approvedRequests", approvedRequests);
            stats.put("totalUsers", totalUsers);
            stats.put("activeUsers", activeUsers);
            
            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error fetching dashboard stats: " + e.getMessage());
        }
    }

    @GetMapping("/adoption-trends")
    public ResponseEntity<?> getAdoptionTrends() {
        try {
            // Mock data for adoption trends (in real app, this would come from database)
            List<Map<String, Object>> trends = Arrays.asList(
                Map.of("month", "Jan", "adoptions", 3),
                Map.of("month", "Feb", "adoptions", 5),
                Map.of("month", "Mar", "adoptions", 4),
                Map.of("month", "Apr", "adoptions", 7),
                Map.of("month", "May", "adoptions", 6),
                Map.of("month", "Jun", "adoptions", 8)
            );
            
            return ResponseEntity.ok(trends);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error fetching adoption trends: " + e.getMessage());
        }
    }

    @GetMapping("/breed-popularity")
    public ResponseEntity<?> getBreedPopularity() {
        try {
            // Mock data for breed popularity (in real app, this would come from database)
            List<Map<String, Object>> popularity = Arrays.asList(
                Map.of("breed", "Golden Retriever", "count", 8, "percentage", 32),
                Map.of("breed", "Labrador Mix", "count", 6, "percentage", 24),
                Map.of("breed", "German Shepherd", "count", 4, "percentage", 16),
                Map.of("breed", "Beagle", "count", 3, "percentage", 12),
                Map.of("breed", "Poodle Mix", "count", 2, "percentage", 8),
                Map.of("breed", "Maltese", "count", 2, "percentage", 8)
            );
            
            return ResponseEntity.ok(popularity);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error fetching breed popularity: " + e.getMessage());
        }
    }

    @GetMapping("/shelter-activity")
    public ResponseEntity<?> getShelterActivity() {
        try {
            // Mock data for shelter activity (in real app, this would come from database)
            List<Map<String, Object>> activity = Arrays.asList(
                Map.of("shelterName", "Happy Paws Shelter", "totalPets", 10, "adoptions", 4, "pendingRequests", 2),
                Map.of("shelterName", "Second Chance Rescue", "totalPets", 8, "adoptions", 2, "pendingRequests", 1),
                Map.of("shelterName", "Paws and Hearts", "totalPets", 7, "adoptions", 1, "pendingRequests", 2)
            );
            
            return ResponseEntity.ok(activity);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error fetching shelter activity: " + e.getMessage());
        }
    }
}
