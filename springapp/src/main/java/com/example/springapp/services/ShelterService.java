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
        return shelterRepository.findAll();
    }

    public Optional<Shelter> getShelterById(Long id) {
        return shelterRepository.findById(id);
    }

    public Shelter saveShelter(Shelter shelter) {
        return shelterRepository.save(shelter);
    }

    public void deleteShelter(Long id) {
        shelterRepository.deleteById(id);
    }

    // ✅ JPQL Service Methods
    public Shelter findByEmail(String email) {
        return shelterRepository.findByEmail(email);
    }

    public List<Shelter> findByShelterName(String name) {
        return shelterRepository.findByShelterName(name);
    }

    public List<Shelter> findByPhone(String phone) {
        return shelterRepository.findByPhone(phone);
    }

    public List<Shelter> findSheltersWithPets() {
        return shelterRepository.findSheltersWithPets();
    }
}
