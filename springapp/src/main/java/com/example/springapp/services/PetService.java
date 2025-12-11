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
        return petRepository.findAllWithShelter();
    }

    public Optional<Pet> getPetById(Long id) {
        Pet pet = petRepository.findByIdWithShelter(id);
        return pet != null ? Optional.of(pet) : Optional.empty();
    }

    public List<Pet> getPetsByStatus(String status) {
        return petRepository.findByStatusWithShelter(status);
    }

    public List<Pet> getPetsByBreed(String breed) {
        return petRepository.findByBreedWithShelter(breed);
    }

    public List<Pet> getPetsByAgeRange(double minAge, double maxAge) {
        // Since we now use string ages, we need to filter in memory
        return getAllPets().stream()
                .filter(pet -> {
                    double petAge = parseAgeToNumber(pet.getAge());
                    return petAge >= minAge && petAge <= maxAge;
                })
                .toList();
    }

    private double parseAgeToNumber(String ageString) {
        if (ageString == null || ageString.trim().isEmpty()) {
            return 0.0;
        }
        
        String age = ageString.toLowerCase().trim();
        
        // Handle months
        if (age.contains("month")) {
            String monthMatch = age.replaceAll(".*?(\\d+)\\s*month.*", "$1");
            try {
                int months = Integer.parseInt(monthMatch);
                return months / 12.0; // Convert months to years (e.g., 6 months = 0.5 years)
            } catch (NumberFormatException e) {
                return 0.0;
            }
        }
        
        // Handle years
        if (age.contains("year")) {
            String yearMatch = age.replaceAll(".*?(\\d+)\\s*year.*", "$1");
            try {
                return Double.parseDouble(yearMatch);
            } catch (NumberFormatException e) {
                return 0.0;
            }
        }
        
        // Handle mixed formats like "1 year 8 months"
        if (age.contains("year") && age.contains("month")) {
            String yearMatch = age.replaceAll(".*?(\\d+)\\s*year.*", "$1");
            String monthMatch = age.replaceAll(".*?(\\d+)\\s*month.*", "$1");
            try {
                double years = Double.parseDouble(yearMatch);
                double months = Double.parseDouble(monthMatch);
                return years + (months / 12.0);
            } catch (NumberFormatException e) {
                return 0.0;
            }
        }
        
        // Fallback: try to extract any number
        String numberMatch = age.replaceAll(".*?(\\d+).*", "$1");
        try {
            return Double.parseDouble(numberMatch);
        } catch (NumberFormatException e) {
            return 0.0;
        }
    }

    public List<Pet> searchPets(String keyword) {
        return petRepository.searchPetsWithShelter(keyword);
    }

    public List<Pet> getPetsByShelter(Long shelterId) {
        return petRepository.findByShelterWithShelter(shelterId);
    }

    public Long countPetsByStatus(String status) {
        return petRepository.countByStatus(status);
    }

    public Pet savePet(Pet pet) {
        System.out.println("💾 Saving pet: " + pet.getName());
        System.out.println("💾 Pet shelter: " + (pet.getShelter() != null ? pet.getShelter().getId() : "null"));
        
        Pet savedPet = petRepository.save(pet);
        System.out.println("✅ Pet saved with ID: " + savedPet.getId());
        return savedPet;
    }

    public void deletePet(Long id) {
        petRepository.deleteById(id);
    }
}
