package com.example.springapp.services;

import com.example.springapp.model.Shelter;
import com.example.springapp.repository.ShelterRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ShelterService {
    private final ShelterRepository shelterRepository;

    public ShelterService(ShelterRepository shelterRepository) {
        this.shelterRepository = shelterRepository;
    }

    public List<Shelter> getAllShelters() {
        return shelterRepository.findAllWithPets();
    }

    public Optional<Shelter> getShelterById(Long id) {
        Shelter shelter = shelterRepository.findByIdWithPets(id);
        return shelter != null ? Optional.of(shelter) : Optional.empty();
    }

    public Shelter saveShelter(Shelter shelter) {
        return shelterRepository.save(shelter);
    }

    public void deleteShelter(Long id) {
        shelterRepository.deleteById(id);
    }

    // ✅ JPQL Service Methods
    public Shelter findByEmail(String email) {
        return shelterRepository.findByEmailWithPets(email);
    }

    public List<Shelter> findByShelterName(String name) {
        return shelterRepository.findByShelterNameWithPets(name);
    }

    public List<Shelter> findByPhone(String phone) {
        // Try exact match first
        List<Shelter> results = shelterRepository.findByPhoneWithPets(phone);
        
        // If no results and phone doesn't start with +, try with + prefix
        if (results.isEmpty() && !phone.startsWith("+")) {
            results = shelterRepository.findByPhoneWithPets("+" + phone);
        }
        
        // If still no results and phone starts with +, try without + prefix
        if (results.isEmpty() && phone.startsWith("+")) {
            results = shelterRepository.findByPhoneWithPets(phone.substring(1));
        }
        
        return results;
    }

    public List<Shelter> findSheltersWithPets() {
        return shelterRepository.findSheltersWithPets();
    }
}
