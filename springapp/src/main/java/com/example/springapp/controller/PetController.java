package com.example.springapp.controller;

import com.example.springapp.model.Pet;
import com.example.springapp.services.PetService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/pets")
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
    public Optional<Pet> getPetById(@PathVariable Long id) {
        return petService.getPetById(id);
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
    public List<Pet> getPetsByAgeRange(@RequestParam int min, @RequestParam int max) {
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
    public Pet createPet(@RequestBody Pet pet) {
        return petService.savePet(pet);
    }

    @PutMapping("/{id}")
    public Pet updatePet(@PathVariable Long id, @RequestBody Pet pet) {
        pet.setId(id);
        return petService.savePet(pet);
    }

    @DeleteMapping("/{id}")
    public void deletePet(@PathVariable Long id) {
        petService.deletePet(id);
    }
}
