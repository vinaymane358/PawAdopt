package com.example.springapp.services;

import com.example.springapp.model.AdoptionHistory;
import com.example.springapp.repository.AdoptionHistoryRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class AdoptionHistoryService {
    private final AdoptionHistoryRepository historyRepository;

    public AdoptionHistoryService(AdoptionHistoryRepository historyRepository) {
        this.historyRepository = historyRepository;
    }

    public List<AdoptionHistory> getAllHistories() {
        return historyRepository.findAll();
    }

    public Optional<AdoptionHistory> getHistoryById(Long id) {
        return historyRepository.findById(id);
    }

    public AdoptionHistory saveHistory(AdoptionHistory history) {
        return historyRepository.save(history);
    }

    public void deleteHistory(Long id) {
        historyRepository.deleteById(id);
    }

    // New methods with JPQL
    public List<AdoptionHistory> getHistoriesByAdopter(Long adopterId) {
        return historyRepository.findByAdopterId(adopterId);
    }

    public List<AdoptionHistory> getHistoriesByShelter(Long shelterId) {
        return historyRepository.findByShelterId(shelterId);
    }

    public List<AdoptionHistory> getHistoriesByPet(Long petId) {
        return historyRepository.findByPetId(petId);
    }

    public List<AdoptionHistory> getHistoriesSortedByDate() {
        return historyRepository.findAllSortedByDate();
    }
}
