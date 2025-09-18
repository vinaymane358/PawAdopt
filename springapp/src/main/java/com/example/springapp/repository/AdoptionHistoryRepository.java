package com.example.springapp.repository;

import com.example.springapp.model.AdoptionHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AdoptionHistoryRepository extends JpaRepository<AdoptionHistory, Long> {

    // JPQL Query: Get adoption histories by adopter (User ID)
    @Query("SELECT ah FROM AdoptionHistory ah WHERE ah.adopter.id = :adopterId")
    List<AdoptionHistory> findByAdopterId(Long adopterId);

    // JPQL Query: Get adoption histories by shelter ID
    @Query("SELECT ah FROM AdoptionHistory ah WHERE ah.shelter.id = :shelterId")
    List<AdoptionHistory> findByShelterId(Long shelterId);

    // JPQL Query: Get adoption histories by pet ID
    @Query("SELECT ah FROM AdoptionHistory ah WHERE ah.adoptedPet.id = :petId")
    List<AdoptionHistory> findByPetId(Long petId);

    // JPQL Query: Get adoption histories sorted by most recent
    @Query("SELECT ah FROM AdoptionHistory ah ORDER BY ah.adoptionDate DESC")
    List<AdoptionHistory> findAllSortedByDate();
}
