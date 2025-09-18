package com.example.springapp.repository;

import com.example.springapp.model.Pet;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PetRepository extends JpaRepository<Pet, Long> {

    // Derived Queries
    List<Pet> findByType(String type);
    List<Pet> findByStatus(String status);

    // JPQL Queries
    @Query("SELECT p FROM Pet p WHERE p.breed = :breed")
    List<Pet> findByBreed(String breed);

    @Query("SELECT p FROM Pet p WHERE p.age BETWEEN :minAge AND :maxAge")
    List<Pet> findByAgeRange(int minAge, int maxAge);

    @Query("SELECT p FROM Pet p WHERE LOWER(p.name) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
           "OR LOWER(p.type) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
           "OR LOWER(p.breed) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    List<Pet> searchPets(String keyword);

    @Query("SELECT p FROM Pet p WHERE p.shelter.id = :shelterId")
    List<Pet> findByShelter(Long shelterId);

    @Query("SELECT COUNT(p) FROM Pet p WHERE p.status = :status")
    Long countByStatus(String status);
}
