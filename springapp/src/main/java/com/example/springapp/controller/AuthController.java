package com.example.springapp.controller;

import com.example.springapp.model.User;
import com.example.springapp.model.Shelter;
import com.example.springapp.services.ShelterService;
import com.example.springapp.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:4200")
public class AuthController {

    @Autowired
    private UserService userService;

    @Autowired
    private ShelterService shelterService;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        try {
            User user = userService.findByEmail(loginRequest.getEmail());
            
            if (user != null && 
                user.getPassword().equals(loginRequest.getPassword()) && 
                user.getRole().equals(loginRequest.getRole()) &&
                user.getIsActive()) {
                
                // Create response similar to frontend AuthResponse
                Map<String, Object> response = new HashMap<>();
                Map<String, Object> userResponse = new HashMap<>();
                
                userResponse.put("id", user.getId().toString());
                userResponse.put("email", user.getEmail());
                userResponse.put("firstName", user.getFirstName());
                userResponse.put("lastName", user.getLastName());
                userResponse.put("phone", user.getPhone());
                userResponse.put("address", user.getAddress());
                userResponse.put("city", user.getCity());
                userResponse.put("state", user.getState());
                userResponse.put("zipCode", user.getZipCode());
                userResponse.put("role", user.getRole());
                if ("Shelter".equalsIgnoreCase(user.getRole())) {
                    try {
                        Shelter shelter = shelterService.findByEmail(user.getEmail());
                        if (shelter != null && shelter.getShelterName() != null) {
                            userResponse.put("shelterName", shelter.getShelterName());
                        }
                    } catch (Exception ignored) {}
                }
                userResponse.put("isActive", user.getIsActive());
                userResponse.put("createdAt", user.getCreatedAt());
                userResponse.put("updatedAt", user.getUpdatedAt());
                
                response.put("user", userResponse);
                response.put("token", "jwt-token-" + user.getId());
                
                return ResponseEntity.ok(response);
            } else {
                return ResponseEntity.badRequest().body("Invalid credentials");
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Login failed: " + e.getMessage());
        }
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest registerRequest) {
        try {
            // Check if user already exists
            User existingUser = userService.findByEmail(registerRequest.getEmail());
            if (existingUser != null) {
                return ResponseEntity.badRequest().body("User already exists with this email");
            }

            // Create new user
            User newUser = new User();
            newUser.setEmail(registerRequest.getEmail());
            newUser.setPassword(registerRequest.getPassword());
            newUser.setFirstName(registerRequest.getFirstName());
            newUser.setLastName(registerRequest.getLastName());
            newUser.setPhone(registerRequest.getPhone());
            newUser.setAddress(registerRequest.getAddress());
            newUser.setCity(registerRequest.getCity());
            newUser.setState(registerRequest.getState());
            newUser.setZipCode(registerRequest.getZipCode());
            newUser.setRole(registerRequest.getRole());
            newUser.setIsActive(true);
            newUser.setCreatedAt(LocalDateTime.now());
            newUser.setUpdatedAt(LocalDateTime.now());

            User savedUser = userService.saveUser(newUser);

            // If the user is a Shelter, also create a Shelter record
            if ("Shelter".equalsIgnoreCase(savedUser.getRole())) {
                Shelter shelter = new Shelter();
                String resolvedShelterName = (registerRequest.getShelterName() != null && !registerRequest.getShelterName().trim().isEmpty())
                        ? registerRequest.getShelterName().trim()
                        : String.format("%s %s",
                            registerRequest.getFirstName() != null ? registerRequest.getFirstName().trim() : "",
                            registerRequest.getLastName() != null ? registerRequest.getLastName().trim() : "").trim();
                shelter.setShelterName(resolvedShelterName.isEmpty() ? "Unknown Shelter" : resolvedShelterName);
                shelter.setEmail(savedUser.getEmail());
                shelter.setPhone(savedUser.getPhone());
                shelter.setAddress(savedUser.getAddress());
                shelterService.saveShelter(shelter);
            }

            // Create response similar to frontend AuthResponse
            Map<String, Object> response = new HashMap<>();
            Map<String, Object> userResponse = new HashMap<>();
            
            userResponse.put("id", savedUser.getId().toString());
            userResponse.put("email", savedUser.getEmail());
            userResponse.put("firstName", savedUser.getFirstName());
            userResponse.put("lastName", savedUser.getLastName());
            userResponse.put("phone", savedUser.getPhone());
            userResponse.put("address", savedUser.getAddress());
            userResponse.put("city", savedUser.getCity());
            userResponse.put("state", savedUser.getState());
            userResponse.put("zipCode", savedUser.getZipCode());
            userResponse.put("role", savedUser.getRole());
            if ("Shelter".equalsIgnoreCase(savedUser.getRole())) {
                try {
                    Shelter createdShelter = shelterService.findByEmail(savedUser.getEmail());
                    if (createdShelter != null && createdShelter.getShelterName() != null) {
                        userResponse.put("shelterName", createdShelter.getShelterName());
                    }
                } catch (Exception ignored) {}
            }
            userResponse.put("isActive", savedUser.getIsActive());
            userResponse.put("createdAt", savedUser.getCreatedAt());
            userResponse.put("updatedAt", savedUser.getUpdatedAt());
            
            response.put("user", userResponse);
            response.put("token", "jwt-token-" + savedUser.getId());
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Registration failed: " + e.getMessage());
        }
    }

    // Inner classes for request/response
    public static class LoginRequest {
        private String email;
        private String password;
        private String role;

        // Getters and setters
        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }
        public String getRole() { return role; }
        public void setRole(String role) { this.role = role; }
    }

    public static class RegisterRequest {
        private String email;
        private String password;
        private String confirmPassword;
        private String firstName;
        private String lastName;
        private String shelterName;
        private String phone;
        private String address;
        private String city;
        private String state;
        private String zipCode;
        private String role;

        // Getters and setters
        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }
        public String getConfirmPassword() { return confirmPassword; }
        public void setConfirmPassword(String confirmPassword) { this.confirmPassword = confirmPassword; }
        public String getFirstName() { return firstName; }
        public void setFirstName(String firstName) { this.firstName = firstName; }
        public String getLastName() { return lastName; }
        public void setLastName(String lastName) { this.lastName = lastName; }
        public String getShelterName() { return shelterName; }
        public void setShelterName(String shelterName) { this.shelterName = shelterName; }
        public String getPhone() { return phone; }
        public void setPhone(String phone) { this.phone = phone; }
        public String getAddress() { return address; }
        public void setAddress(String address) { this.address = address; }
        public String getCity() { return city; }
        public void setCity(String city) { this.city = city; }
        public String getState() { return state; }
        public void setState(String state) { this.state = state; }
        public String getZipCode() { return zipCode; }
        public void setZipCode(String zipCode) { this.zipCode = zipCode; }
        public String getRole() { return role; }
        public void setRole(String role) { this.role = role; }
    }
}
