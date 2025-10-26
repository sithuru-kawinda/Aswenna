package com.backend.farmersmarket.controller;

import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.backend.farmersmarket.entity.Product;
import com.backend.farmersmarket.entity.User;
import com.backend.farmersmarket.repository.ProductRepository;
import com.backend.farmersmarket.repository.UserRepository;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "http://localhost:3000")
public class ProductController {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private UserRepository userRepository;

    // Get all available products
    @GetMapping
    public List<Product> getAllProducts() {
        List<Product> products = productRepository.findByIsAvailableTrueOrderByCreatedAtDesc();
        // Eagerly load user data to avoid LazyInitializationException
        for (Product product : products) {
            if (product.getUser() != null) {
                product.getUser().getId(); // Trigger loading
            }
        }
        return products;
    }

    // Get products by user
    @GetMapping("/user/{userId}")
    public List<Product> getUserProducts(@PathVariable Long userId) {
        return productRepository.findByUserId(userId);
    }

    

    // Add new product - FIXED VERSION
    @PostMapping
    public ResponseEntity<?> addProduct(@RequestBody Product productRequest) {
        try {
            System.out.println("Adding product for user ID: " + productRequest.getUser().getId());
            System.out.println("Product data: " + productRequest.getProductName() + ", " + productRequest.getPrice());

            // Verify user exists
            Optional<User> userOptional = userRepository.findById(productRequest.getUser().getId());
            if (userOptional.isEmpty()) {
                System.out.println("User not found with ID: " + productRequest.getUser().getId());
                return ResponseEntity.badRequest().body("User not found");
            }

            User user = userOptional.get();
            System.out.println("Found user: " + user.getFullName());

            // Create new product with user
            Product product = new Product();
            product.setProductName(productRequest.getProductName());
            product.setPrice(productRequest.getPrice());
            product.setQuantity(productRequest.getQuantity());
            product.setDescription(productRequest.getDescription());
            product.setUser(user);
            product.setIsAvailable(true);

            Product savedProduct = productRepository.save(product);
            System.out.println("Product saved successfully with ID: " + savedProduct.getId());

            // Load user data in response
            savedProduct.getUser().getId(); // Trigger loading

            return ResponseEntity.ok(savedProduct);
        } catch (Exception e) {
            System.out.println("Error adding product: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().body("Error adding product: " + e.getMessage());
        }
    }

    // Delete product
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteProduct(@PathVariable Long id) {
        try {
            productRepository.deleteById(id);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error deleting product");
        }
    }

    // Update product availability
    @PutMapping("/{id}/availability")
    public ResponseEntity<?> updateAvailability(@PathVariable Long id, @RequestBody Map<String, Boolean> availability) {
        Optional<Product> productOptional = productRepository.findById(id);
        if (productOptional.isPresent()) {
            Product product = productOptional.get();
            product.setIsAvailable(availability.get("isAvailable"));
            productRepository.save(product);
            return ResponseEntity.ok(product);
        }
        return ResponseEntity.notFound().build();
    }
    
}