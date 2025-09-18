package com.example.springapp.repository;

import com.example.springapp.model.AdoptionRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AdoptionRequestRepository extends JpaRepository<AdoptionRequest, Long> {

    // JPQL Query: Find requests by status (Pending, Approved, Rejected)
    @Query("SELECT ar FROM AdoptionRequest ar WHERE ar.status = :status")
    List<AdoptionRequest> findByStatus(String status);

    // JPQL Query: Find requests by User ID
    @Query("SELECT ar FROM AdoptionRequest ar WHERE ar.user.id = :userId")
    List<AdoptionRequest> findByUserId(Long userId);

    // JPQL Query: Find requests by Pet ID
    @Query("SELECT ar FROM AdoptionRequest ar WHERE ar.pet.id = :petId")
    List<AdoptionRequest> findByPetId(Long petId);

    // JPQL Query: Find requests sorted by most recent date
    @Query("SELECT ar FROM AdoptionRequest ar ORDER BY ar.requestDate DESC")
    List<AdoptionRequest> findAllSortedByDate();
}
