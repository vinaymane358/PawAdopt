package com.example.springapp.services;

import com.example.springapp.model.AdoptionHistory;
import com.example.springapp.model.Pet;
import com.example.springapp.model.Shelter;
import com.example.springapp.model.User;
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

    public List<AdoptionHistory> getAllAdoptionHistory() {
        return historyRepository.findAll();
    }

    public Optional<AdoptionHistory> getAdoptionHistoryById(Long id) {
        return historyRepository.findById(id);
    }

    public AdoptionHistory saveAdoptionHistory(AdoptionHistory adoptionHistory) {
        return historyRepository.save(adoptionHistory);
    }

    public void deleteAdoptionHistory(Long id) {
        historyRepository.deleteById(id);
    }

    // Extra methods using JPQL
    public List<AdoptionHistory> getAdoptionHistoryByAdopter(Long userId) {
        return historyRepository.findByAdopterId(userId);
    }

    public List<AdoptionHistory> getAdoptionHistoryByPet(Long petId) {
        return historyRepository.findByPetId(petId);
    }

    public List<AdoptionHistory> getAdoptionHistoryByShelter(Long shelterId) {
        return historyRepository.findByShelterId(shelterId);
    }

    public List<AdoptionHistory> getAdoptionHistorySortedByDate() {
        return historyRepository.findAllSortedByDate();
    }

    /**
     * Create adoption history record when a pet is successfully adopted
     */
    public AdoptionHistory createAdoptionHistory(User adopter, Pet adoptedPet, Shelter shelter) {
        AdoptionHistory adoptionHistory = new AdoptionHistory();
        adoptionHistory.setAdopter(adopter);
        adoptionHistory.setAdoptedPet(adoptedPet);
        adoptionHistory.setShelter(shelter);
        
        return saveAdoptionHistory(adoptionHistory);
    }
}
