package com.example.springapp.services;

import com.example.springapp.model.Pet;
import com.example.springapp.repository.PetRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class PetService {
    private final PetRepository petRepository;

    public PetService(PetRepository petRepository) {
        this.petRepository = petRepository;
    }

    public List<Pet> getAllPets() {
        return petRepository.findAll();
    }

    public Optional<Pet> getPetById(Long id) {
        return petRepository.findById(id);
    }

    public List<Pet> getPetsByStatus(String status) {
        return petRepository.findByStatus(status);
    }

    public List<Pet> getPetsByBreed(String breed) {
        return petRepository.findByBreed(breed);
    }

    public List<Pet> getPetsByAgeRange(int minAge, int maxAge) {
        return petRepository.findByAgeRange(minAge, maxAge);
    }

    public List<Pet> searchPets(String keyword) {
        return petRepository.searchPets(keyword);
    }

    public List<Pet> getPetsByShelter(Long shelterId) {
        return petRepository.findByShelter(shelterId);
    }

    public Long countPetsByStatus(String status) {
        return petRepository.countByStatus(status);
    }

    public Pet savePet(Pet pet) {
        return petRepository.save(pet);
    }

    public void deletePet(Long id) {
        petRepository.deleteById(id);
    }
}
