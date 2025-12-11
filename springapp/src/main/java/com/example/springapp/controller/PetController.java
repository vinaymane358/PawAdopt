package com.example.springapp.controller;

import com.example.springapp.model.Pet;
import com.example.springapp.services.PetService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/pets")
@CrossOrigin(origins = "http://localhost:4200")
public class PetController {
    private final PetService petService;

    public PetController(PetService petService) {
        this.petService = petService;
    }

    @GetMapping
    public List<Pet> getAllPets() {
        return petService.getAllPets();
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getPetById(@PathVariable Long id) {
        Optional<Pet> pet = petService.getPetById(id);
        if (pet.isPresent()) {
            return ResponseEntity.ok(pet.get());
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/status/{status}")
    public List<Pet> getPetsByStatus(@PathVariable String status) {
        return petService.getPetsByStatus(status);
    }

    @GetMapping("/breed/{breed}")
    public List<Pet> getPetsByBreed(@PathVariable String breed) {
        return petService.getPetsByBreed(breed);
    }

    @GetMapping("/age-range")
    public List<Pet> getPetsByAgeRange(@RequestParam double min, @RequestParam double max) {
        return petService.getPetsByAgeRange(min, max);
    }

    @GetMapping("/search")
    public List<Pet> searchPets(@RequestParam String keyword) {
        return petService.searchPets(keyword);
    }

    @GetMapping("/shelter/{shelterId}")
    public List<Pet> getPetsByShelter(@PathVariable Long shelterId) {
        return petService.getPetsByShelter(shelterId);
    }

    @GetMapping("/count/{status}")
    public Long countPetsByStatus(@PathVariable String status) {
        return petService.countPetsByStatus(status);
    }

    @PostMapping
    public ResponseEntity<?> createPet(@RequestBody Pet pet) {
        try {
            Pet savedPet = petService.savePet(pet);
            return ResponseEntity.ok(savedPet);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error creating pet: " + e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updatePet(@PathVariable Long id, @RequestBody Pet pet) {
        try {
            pet.setId(id);
            Pet updatedPet = petService.savePet(pet);
            return ResponseEntity.ok(updatedPet);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error updating pet: " + e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletePet(@PathVariable Long id) {
        try {
            petService.deletePet(id);
            return ResponseEntity.ok("Pet deleted successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error deleting pet: " + e.getMessage());
        }
    }

    // Additional endpoints for frontend integration
    @GetMapping("/featured")
    public List<Pet> getFeaturedPets() {
        List<Pet> availablePets = petService.getPetsByStatus("Available");
        return availablePets.stream()
                .limit(8)
                .toList();
    }

    @GetMapping("/breeds")
    public List<String> getBreeds() {
        return petService.getAllPets().stream()
                .map(Pet::getBreed)
                .distinct()
                .sorted()
                .toList();
    }

    @GetMapping("/locations")
    public List<String> getLocations() {
        return petService.getAllPets().stream()
                .map(Pet::getLocation)
                .filter(location -> location != null && !location.isEmpty())
                .distinct()
                .sorted()
                .toList();
    }

    @GetMapping("/filter")
    public ResponseEntity<?> filterPets(
            @RequestParam(required = false) String breed,
            @RequestParam(required = false) String petType,
            @RequestParam(required = false) String location,
            @RequestParam(required = false) String gender,
            @RequestParam(required = false) Boolean vaccinated,
            @RequestParam(required = false) String search) {
        try {
            List<Pet> filteredPets = petService.getAllPets().stream()
                    .filter(pet -> breed == null || (pet.getBreed() != null && pet.getBreed().toLowerCase().contains(breed.toLowerCase())))
                    .filter(pet -> petType == null || pet.getPetType().equals(petType))
                    .filter(pet -> location == null || (pet.getLocation() != null && pet.getLocation().toLowerCase().contains(location.toLowerCase())))
                    .filter(pet -> gender == null || pet.getGender().equals(gender))
                    .filter(pet -> vaccinated == null || pet.getVaccinated().equals(vaccinated))
                    .filter(pet -> search == null || 
                        (pet.getName() != null && pet.getName().toLowerCase().contains(search.toLowerCase())) ||
                        (pet.getBreed() != null && pet.getBreed().toLowerCase().contains(search.toLowerCase())) ||
                        (pet.getDescription() != null && pet.getDescription().toLowerCase().contains(search.toLowerCase())))
                    .toList();
            return ResponseEntity.ok(filteredPets);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error filtering pets: " + e.getMessage());
        }
    }
}
