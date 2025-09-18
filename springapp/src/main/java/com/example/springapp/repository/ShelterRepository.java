package com.example.springapp.repository;

import com.example.springapp.model.Shelter;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ShelterRepository extends JpaRepository<Shelter, Long> {

    // ✅ Derived Query
    Shelter findByEmail(String email);

    // ✅ JPQL Queries
    @Query("SELECT s FROM Shelter s WHERE s.shelterName = :name")
    List<Shelter> findByShelterName(String name);

    @Query("SELECT s FROM Shelter s WHERE s.phone = :phone")
    List<Shelter> findByPhone(String phone);

    @Query("SELECT s FROM Shelter s JOIN FETCH s.pets")
    List<Shelter> findSheltersWithPets();
}
