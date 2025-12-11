package com.example.springapp.repository;

import com.example.springapp.model.Pet;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PetRepository extends JpaRepository<Pet, Long> {

    // Derived Queries
    List<Pet> findByPetType(String petType);
    List<Pet> findByStatus(String status);

    // JPQL Queries
    @Query("SELECT p FROM Pet p WHERE p.breed = :breed")
    List<Pet> findByBreed(String breed);

    @Query("SELECT p FROM Pet p WHERE p.age BETWEEN :minAge AND :maxAge")
    List<Pet> findByAgeRange(int minAge, int maxAge);

    @Query("SELECT p FROM Pet p WHERE LOWER(p.name) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
           "OR LOWER(p.petType) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
           "OR LOWER(p.breed) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    List<Pet> searchPets(String keyword);

    @Query("SELECT p FROM Pet p WHERE p.shelter.id = :shelterId")
    List<Pet> findByShelter(Long shelterId);

    @Query("SELECT COUNT(p) FROM Pet p WHERE p.status = :status")
    Long countByStatus(String status);

    // Eager loading methods to prevent LazyInitializationException
    @Query("SELECT p FROM Pet p LEFT JOIN FETCH p.shelter")
    List<Pet> findAllWithShelter();

    @Query("SELECT p FROM Pet p LEFT JOIN FETCH p.shelter WHERE p.id = :id")
    Pet findByIdWithShelter(Long id);

    @Query("SELECT p FROM Pet p LEFT JOIN FETCH p.shelter WHERE p.status = :status")
    List<Pet> findByStatusWithShelter(String status);

    @Query("SELECT p FROM Pet p LEFT JOIN FETCH p.shelter WHERE p.breed = :breed")
    List<Pet> findByBreedWithShelter(String breed);

    @Query("SELECT p FROM Pet p LEFT JOIN FETCH p.shelter WHERE p.age BETWEEN :minAge AND :maxAge")
    List<Pet> findByAgeRangeWithShelter(int minAge, int maxAge);

    @Query("SELECT p FROM Pet p LEFT JOIN FETCH p.shelter WHERE " +
           "LOWER(p.name) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
           "OR LOWER(p.petType) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
           "OR LOWER(p.breed) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    List<Pet> searchPetsWithShelter(String keyword);

    @Query("SELECT p FROM Pet p LEFT JOIN FETCH p.shelter WHERE p.shelter.id = :shelterId")
    List<Pet> findByShelterWithShelter(Long shelterId);
}
