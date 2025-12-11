package com.example.springapp.controller;

import com.example.springapp.model.AdoptionHistory;
import com.example.springapp.services.AdoptionHistoryService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/adoption-history")
@CrossOrigin(origins = "http://localhost:4200")
public class AdoptionHistoryController {
    private final AdoptionHistoryService historyService;

    public AdoptionHistoryController(AdoptionHistoryService historyService) {
        this.historyService = historyService;
    }

    @GetMapping
    public List<AdoptionHistory> getAllAdoptionHistory() {
        return historyService.getAllAdoptionHistory();
    }

    @GetMapping("/{id}")
    public Optional<AdoptionHistory> getAdoptionHistoryById(@PathVariable Long id) {
        return historyService.getAdoptionHistoryById(id);
    }

    @PostMapping
    public AdoptionHistory createAdoptionHistory(@RequestBody AdoptionHistory adoptionHistory) {
        return historyService.saveAdoptionHistory(adoptionHistory);
    }

    @PutMapping("/{id}")
    public AdoptionHistory updateAdoptionHistory(@PathVariable Long id, @RequestBody AdoptionHistory adoptionHistory) {
        adoptionHistory.setId(id);
        return historyService.saveAdoptionHistory(adoptionHistory);
    }

    @DeleteMapping("/{id}")
    public void deleteAdoptionHistory(@PathVariable Long id) {
        historyService.deleteAdoptionHistory(id);
    }

    // Extra endpoints using JPQL
    @GetMapping("/adopter/{userId}")
    public List<AdoptionHistory> getAdoptionHistoryByAdopter(@PathVariable Long userId) {
        return historyService.getAdoptionHistoryByAdopter(userId);
    }

    @GetMapping("/pet/{petId}")
    public List<AdoptionHistory> getAdoptionHistoryByPet(@PathVariable Long petId) {
        return historyService.getAdoptionHistoryByPet(petId);
    }

    @GetMapping("/shelter/{shelterId}")
    public List<AdoptionHistory> getAdoptionHistoryByShelter(@PathVariable Long shelterId) {
        return historyService.getAdoptionHistoryByShelter(shelterId);
    }

    @GetMapping("/sorted/date")
    public List<AdoptionHistory> getAdoptionHistorySortedByDate() {
        return historyService.getAdoptionHistorySortedByDate();
    }
}
