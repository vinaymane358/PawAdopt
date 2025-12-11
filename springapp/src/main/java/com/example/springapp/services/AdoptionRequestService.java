package com.example.springapp.services;

import com.example.springapp.model.AdoptionRequest;
import com.example.springapp.model.Pet;
import com.example.springapp.repository.AdoptionRequestRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class AdoptionRequestService {
    private final AdoptionRequestRepository requestRepository;
    private final AdoptionHistoryService adoptionHistoryService;
    private final PetService petService;
    private final UserService userService;
    private final ShelterService shelterService;

    public AdoptionRequestService(AdoptionRequestRepository requestRepository, 
                                 AdoptionHistoryService adoptionHistoryService,
                                 PetService petService,
                                 UserService userService,
                                 ShelterService shelterService) {
        this.requestRepository = requestRepository;
        this.adoptionHistoryService = adoptionHistoryService;
        this.petService = petService;
        this.userService = userService;
        this.shelterService = shelterService;
    }

    public List<AdoptionRequest> getAllRequests() {
        return requestRepository.findAll();
    }

    public Optional<AdoptionRequest> getRequestById(Long id) {
        return requestRepository.findById(id);
    }

    public AdoptionRequest saveRequest(AdoptionRequest request) {
        System.out.println("📝 Processing adoption request: " + request);
        
        // If pet and user are provided as references, fetch their details
        if (request.getPet() != null && request.getPet().getId() != null) {
            System.out.println("🔍 Fetching pet details for ID: " + request.getPet().getId());
            // Fetch pet details from database
            var pet = petService.getPetById(request.getPet().getId());
            if (pet.isPresent()) {
                request.setPet(pet.get());
                request.setPetName(pet.get().getName());
                request.setPetImageUrl(pet.get().getImageUrl());
                System.out.println("✅ Pet details populated: " + pet.get().getName());
            } else {
                System.out.println("❌ Pet not found with ID: " + request.getPet().getId());
            }
        }
        
        // If user is provided as reference, fetch user details
        if (request.getUser() != null && request.getUser().getId() != null) {
            System.out.println("🔍 Fetching user details for ID: " + request.getUser().getId());
            var user = userService.getUserById(request.getUser().getId());
            if (user.isPresent()) {
                request.setUser(user.get());
                request.setUserName(user.get().getFirstName() + " " + user.get().getLastName());
                request.setUserEmail(user.get().getEmail());
                request.setUserPhone(user.get().getPhone());
                System.out.println("✅ User details populated: " + user.get().getFirstName() + " " + user.get().getLastName());
            } else {
                System.out.println("❌ User not found with ID: " + request.getUser().getId());
            }
        }
        
        // If shelter is provided as reference, fetch shelter details
        if (request.getShelter() != null && request.getShelter().getId() != null) {
            System.out.println("🔍 Fetching shelter details for ID: " + request.getShelter().getId());
            var shelter = shelterService.getShelterById(request.getShelter().getId());
            if (shelter.isPresent()) {
                request.setShelter(shelter.get());
                System.out.println("✅ Shelter details populated: " + shelter.get().getShelterName());
            } else {
                System.out.println("❌ Shelter not found with ID: " + request.getShelter().getId());
            }
        }
        
        // Ensure pet and user details are populated before saving
        if (request.getPet() != null) {
            request.setPetName(request.getPet().getName());
            request.setPetImageUrl(request.getPet().getImageUrl());
        }
        if (request.getUser() != null) {
            request.setUserName(request.getUser().getFirstName() + " " + request.getUser().getLastName());
            request.setUserEmail(request.getUser().getEmail());
            request.setUserPhone(request.getUser().getPhone());
        }
        
        System.out.println("💾 Saving adoption request: " + request.getPetName() + " by " + request.getUserName());
        System.out.println("💾 User ID: " + (request.getUser() != null ? request.getUser().getId() : "null"));
        System.out.println("💾 Pet ID: " + (request.getPet() != null ? request.getPet().getId() : "null"));
        System.out.println("💾 Shelter ID: " + (request.getShelter() != null ? request.getShelter().getId() : "null"));
        
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

    public List<AdoptionRequest> getRequestsByShelter(Long shelterId) {
        return requestRepository.findByShelterId(shelterId);
    }

    /**
     * Approve an adoption request and create adoption history
     */
    @Transactional
    public AdoptionRequest approveRequest(Long requestId, String adminComments) {
        Optional<AdoptionRequest> requestOpt = requestRepository.findById(requestId);
        if (requestOpt.isEmpty()) {
            throw new RuntimeException("Adoption request not found with ID: " + requestId);
        }
        
        AdoptionRequest request = requestOpt.get();
        request.setStatus("Approved");
        request.setAdminComments(adminComments);
        request.setReviewedAt(java.time.LocalDateTime.now());
        
        // Update pet status to Adopted
        if (request.getPet() != null) {
            Pet pet = request.getPet();
            pet.setStatus("Adopted");
            petService.savePet(pet);
        }
        
        // Create adoption history
        if (request.getUser() != null && request.getPet() != null && request.getShelter() != null) {
            adoptionHistoryService.createAdoptionHistory(
                request.getUser(), 
                request.getPet(), 
                request.getShelter()
            );
            System.out.println("✅ Created adoption history for request ID: " + requestId);
        }
        
        return requestRepository.save(request);
    }

    /**
     * Reject an adoption request
     */
    @Transactional
    public AdoptionRequest rejectRequest(Long requestId, String adminComments) {
        Optional<AdoptionRequest> requestOpt = requestRepository.findById(requestId);
        if (requestOpt.isEmpty()) {
            throw new RuntimeException("Adoption request not found with ID: " + requestId);
        }
        
        AdoptionRequest request = requestOpt.get();
        request.setStatus("Rejected");
        request.setAdminComments(adminComments);
        request.setReviewedAt(java.time.LocalDateTime.now());
        
        return requestRepository.save(request);
    }

    /**
     * Approve an adoption request and create adoption history record
     */
    @Transactional
    public AdoptionRequest approveRequest(Long requestId, String adminComments, String reviewedBy) {
        AdoptionRequest request = requestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Adoption request not found with id: " + requestId));
        
        // Update request status
        request.setStatus("Approved");
        request.setAdminComments(adminComments);
        request.setReviewedAt(java.time.LocalDateTime.now());
        request.setReviewedBy(reviewedBy);
        
        // Update pet status to adopted
        Pet pet = request.getPet();
        if (pet != null) {
            pet.setStatus("Adopted");
            petService.savePet(pet);
        }
        
        // Create adoption history record
        if (request.getUser() != null && pet != null && request.getShelter() != null) {
            adoptionHistoryService.createAdoptionHistory(
                request.getUser(),
                pet,
                request.getShelter()
            );
            System.out.println("✅ Created adoption history for pet: " + pet.getName() + 
                             " adopted by user: " + request.getUser().getEmail());
        }
        
        return requestRepository.save(request);
    }

    /**
     * Reject an adoption request
     */
    @Transactional
    public AdoptionRequest rejectRequest(Long requestId, String adminComments, String reviewedBy) {
        AdoptionRequest request = requestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Adoption request not found with id: " + requestId));
        
        // Update request status
        request.setStatus("Rejected");
        request.setAdminComments(adminComments);
        request.setReviewedAt(java.time.LocalDateTime.now());
        request.setReviewedBy(reviewedBy);
        
        return requestRepository.save(request);
    }
}
