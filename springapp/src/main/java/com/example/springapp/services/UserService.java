package com.example.springapp.services;

import com.example.springapp.model.User;
import com.example.springapp.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {
    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Transactional(readOnly = true)
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @Transactional(readOnly = true)
    public Optional<User> getUserById(Long id) {
        return userRepository.findById(id);
    }

    @Transactional
    public User saveUser(User user) {
        return userRepository.save(user);
    }

    @Transactional
    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }

    // ✅ JPQL Service methods
    @Transactional(readOnly = true)
    public User findByEmail(String email) {
        List<User> users = userRepository.findByEmail(email);
        return users.isEmpty() ? null : users.get(0); // Return first user if duplicates exist
    }

    @Transactional(readOnly = true)
    public List<User> findByRole(String role) {
        return userRepository.findByRole(role);
    }

    @Transactional(readOnly = true)
    public List<User> searchByName(String keyword) {
        return userRepository.searchByName(keyword);
    }

    @Transactional(readOnly = true)
    public List<User> findUsersWithDetails() {
        return userRepository.findUsersWithDetails();
    }

    @Transactional(readOnly = true)
    public User findUserWithDetailsById(Long id) {
        return userRepository.findUserWithDetailsById(id);
    }
}
