package com.example.springapp.repository;

import com.example.springapp.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    // ✅ Derived query - return list to handle duplicates
    List<User> findByEmail(String email);

    // ✅ JPQL queries
    @Query("SELECT u FROM User u WHERE u.role = :role")
    List<User> findByRole(String role);

    @Query("SELECT u FROM User u WHERE LOWER(CONCAT(u.firstName, ' ', u.lastName)) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    List<User> searchByName(String keyword);

    @Query("SELECT DISTINCT u FROM User u LEFT JOIN FETCH u.feedbacks LEFT JOIN FETCH u.adoptionRequests")
    List<User> findUsersWithDetails();

    @Query("SELECT u FROM User u LEFT JOIN FETCH u.feedbacks LEFT JOIN FETCH u.adoptionRequests WHERE u.id = :id")
    User findUserWithDetailsById(Long id);
}
