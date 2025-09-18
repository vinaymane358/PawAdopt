package com.example.springapp.controller;

import com.example.springapp.model.Shelter;
import com.example.springapp.services.ShelterService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/shelters")
public class ShelterController {
    private final ShelterService shelterService;

    public ShelterController(ShelterService shelterService) {
        this.shelterService = shelterService;
    }

    @GetMapping
    public List<Shelter> getAllShelters() {
        return shelterService.getAllShelters();
    }

    @GetMapping("/{id}")
    public Optional<Shelter> getShelterById(@PathVariable Long id) {
        return shelterService.getShelterById(id);
    }

    @PostMapping
    public Shelter createShelter(@RequestBody Shelter shelter) {
        return shelterService.saveShelter(shelter);
    }

    @PutMapping("/{id}")
    public Shelter updateShelter(@PathVariable Long id, @RequestBody Shelter shelter) {
        shelter.setId(id);
        return shelterService.saveShelter(shelter);
    }

    @DeleteMapping("/{id}")
    public void deleteShelter(@PathVariable Long id) {
        shelterService.deleteShelter(id);
    }

    // ✅ Extra Endpoints using JPQL Queries
    @GetMapping("/email/{email}")
    public Shelter getShelterByEmail(@PathVariable String email) {
        return shelterService.findByEmail(email);
    }

    @GetMapping("/name/{name}")
    public List<Shelter> getShelterByName(@PathVariable String name) {
        return shelterService.findByShelterName(name);
    }

    @GetMapping("/phone/{phone}")
    public List<Shelter> getShelterByPhone(@PathVariable String phone) {
        return shelterService.findByPhone(phone);
    }

    @GetMapping("/with-pets")
    public List<Shelter> getSheltersWithPets() {
        return shelterService.findSheltersWithPets();
    }
}
