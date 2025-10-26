package com.backend.farmersmarket.controller;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.backend.farmersmarket.entity.User;
import com.backend.farmersmarket.repository.UserRepository;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:3000")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {
        try {
            System.out.println("Registration attempt for: " + user.getEmail());
            
            // Check if email already exists
            if (userRepository.existsByEmail(user.getEmail())) {
                Map<String, String> response = new HashMap<>();
                response.put("error", "Email already exists");
                return ResponseEntity.badRequest().body(response);
            }

            // Set default values if null
            if (user.getUserType() == null) {
                user.setUserType("BUYER");
            }

            User savedUser = userRepository.save(user);
            System.out.println("User registered successfully: " + savedUser.getEmail());
            
            // Remove password from response for security
            savedUser.setPassword(null);
            return ResponseEntity.ok(savedUser);
        } catch (Exception e) {
            System.out.println("Registration error: " + e.getMessage());
            e.printStackTrace();
            
            Map<String, String> response = new HashMap<>();
            response.put("error", "Registration failed: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> credentials) {
        try {
            String email = credentials.get("email");
            String password = credentials.get("password");

            System.out.println("Login attempt for: " + email);

            Optional<User> userOptional = userRepository.findByEmail(email);
            
            if (userOptional.isPresent() && userOptional.get().getPassword().equals(password)) {
                User user = userOptional.get();
                // Remove password from response for security
                user.setPassword(null);
                return ResponseEntity.ok(user);
            } else {
                Map<String, String> response = new HashMap<>();
                response.put("error", "Invalid email or password");
                return ResponseEntity.badRequest().body(response);
            }
        } catch (Exception e) {
            System.out.println("Login error: " + e.getMessage());
            e.printStackTrace();
            
            Map<String, String> response = new HashMap<>();
            response.put("error", "Login failed: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }
}