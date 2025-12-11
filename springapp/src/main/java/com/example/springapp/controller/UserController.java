package com.example.springapp.controller;

import com.example.springapp.model.User;
import com.example.springapp.services.UserService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Set;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:4200")
public class UserController {
    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping
    public List<User> getAllUsers() {
        return userService.findUsersWithDetails();
    }

    @GetMapping("/{id}")
    public User getUserById(@PathVariable Long id) {
        return userService.findUserWithDetailsById(id);
    }

    @PostMapping
    public User createUser(@RequestBody User user) {
        return userService.saveUser(user);
    }

    @PutMapping("/{id}")
    public User updateUser(@PathVariable Long id, @RequestBody User user) {
        user.setId(id);
        return userService.saveUser(user);
    }

    @DeleteMapping("/{id}")
    public void deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
    }

    // ✅ Extra Endpoints using JPQL queries
    @GetMapping("/email/{email}")
    public User getUserByEmail(@PathVariable String email) {
        User user = userService.findByEmail(email);
        if (user != null) {
            // Load the user with details to avoid lazy loading issues
            return userService.findUserWithDetailsById(user.getId());
        }
        return user;
    }

    @GetMapping("/role/{role}")
    public List<User> getUsersByRole(@PathVariable String role) {
        return userService.findUsersWithDetails().stream()
                .filter(user -> user.getRole().equals(role))
                .toList();
    }

    @GetMapping("/search/{keyword}")
    public List<User> searchUsersByName(@PathVariable String keyword) {
        return userService.findUsersWithDetails().stream()
                .filter(user -> (user.getFirstName() + " " + user.getLastName()).toLowerCase().contains(keyword.toLowerCase()))
                .toList();
    }

    @GetMapping("/with-details")
    public List<User> getUsersWithDetails() {
        return userService.findUsersWithDetails();
    }
}
