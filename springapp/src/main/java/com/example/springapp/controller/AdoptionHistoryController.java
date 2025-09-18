package com.example.springapp.controller;

import com.example.springapp.model.AdoptionHistory;
import com.example.springapp.services.AdoptionHistoryService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/adoption-history")
public class AdoptionHistoryController {
    private final AdoptionHistoryService historyService;

    public AdoptionHistoryController(AdoptionHistoryService historyService) {
        this.historyService = historyService;
    }

    @GetMapping
    public List<AdoptionHistory> getAllHistories() {
        return historyService.getAllHistories();
    }

    @GetMapping("/{id}")
    public Optional<AdoptionHistory> getHistoryById(@PathVariable Long id) {
        return historyService.getHistoryById(id);
    }

    @PostMapping
    public AdoptionHistory createHistory(@RequestBody AdoptionHistory history) {
        return historyService.saveHistory(history);
    }

    @PutMapping("/{id}")
    public AdoptionHistory updateHistory(@PathVariable Long id, @RequestBody AdoptionHistory history) {
        history.setId(id);
        return historyService.saveHistory(history);
    }

    @DeleteMapping("/{id}")
    public void deleteHistory(@PathVariable Long id) {
        historyService.deleteHistory(id);
    }

    // Extra endpoints using JPQL
    @GetMapping("/adopter/{adopterId}")
    public List<AdoptionHistory> getHistoriesByAdopter(@PathVariable Long adopterId) {
        return historyService.getHistoriesByAdopter(adopterId);
    }

    @GetMapping("/shelter/{shelterId}")
    public List<AdoptionHistory> getHistoriesByShelter(@PathVariable Long shelterId) {
        return historyService.getHistoriesByShelter(shelterId);
    }

    @GetMapping("/pet/{petId}")
    public List<AdoptionHistory> getHistoriesByPet(@PathVariable Long petId) {
        return historyService.getHistoriesByPet(petId);
    }

    @GetMapping("/sorted/date")
    public List<AdoptionHistory> getHistoriesSortedByDate() {
        return historyService.getHistoriesSortedByDate();
    }
}
