package com.example.springapp.services;

import com.example.springapp.model.AdoptionRequest;
import com.example.springapp.repository.AdoptionRequestRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class AdoptionRequestService {
    private final AdoptionRequestRepository requestRepository;

    public AdoptionRequestService(AdoptionRequestRepository requestRepository) {
        this.requestRepository = requestRepository;
    }

    public List<AdoptionRequest> getAllRequests() {
        return requestRepository.findAll();
    }

    public Optional<AdoptionRequest> getRequestById(Long id) {
        return requestRepository.findById(id);
    }

    public AdoptionRequest saveRequest(AdoptionRequest request) {
        return requestRepository.save(request);
    }

    public void deleteRequest(Long id) {
        requestRepository.deleteById(id);
    }

    // Extra methods using JPQL
    public List<AdoptionRequest> getRequestsByStatus(String status) {
        return requestRepository.findByStatus(status);
    }

    public List<AdoptionRequest> getRequestsByUser(Long userId) {
        return requestRepository.findByUserId(userId);
    }

    public List<AdoptionRequest> getRequestsByPet(Long petId) {
        return requestRepository.findByPetId(petId);
    }

    public List<AdoptionRequest> getRequestsSortedByDate() {
        return requestRepository.findAllSortedByDate();
    }
}
