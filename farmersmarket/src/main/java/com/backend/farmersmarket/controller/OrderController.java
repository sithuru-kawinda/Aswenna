package com.backend.farmersmarket.controller;

import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController; // Add this import

import com.backend.farmersmarket.entity.Order;
import com.backend.farmersmarket.entity.Product;
import com.backend.farmersmarket.entity.User;
import com.backend.farmersmarket.repository.OrderRepository;
import com.backend.farmersmarket.repository.ProductRepository;
import com.backend.farmersmarket.repository.UserRepository;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "http://localhost:3000")
public class OrderController {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private UserRepository userRepository;

    // Create new order
    @PostMapping
    public ResponseEntity<?> createOrder(@RequestBody Order order) {
        try {
            // Verify product and buyer exist
            Optional<Product> productOptional = productRepository.findById(order.getProduct().getId());
            Optional<User> buyerOptional = userRepository.findById(order.getBuyer().getId());

            if (productOptional.isEmpty() || buyerOptional.isEmpty()) {
                return ResponseEntity.badRequest().body("Product or buyer not found");
            }

            Order savedOrder = orderRepository.save(order);
            return ResponseEntity.ok(savedOrder);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error creating order");
        }
    }

    // Get orders by buyer
    @GetMapping("/buyer/{buyerId}")
    public List<Order> getBuyerOrders(@PathVariable Long buyerId) {
        return orderRepository.findByBuyerIdOrderByCreatedAtDesc(buyerId);
    }

    // Get orders by farmer
    @GetMapping("/farmer/{farmerId}")
    public List<Order> getFarmerOrders(@PathVariable Long farmerId) {
        return orderRepository.findByProductUserIdOrderByCreatedAtDesc(farmerId);
    }

    // Update order status
    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateOrderStatus(@PathVariable Long id, @RequestBody Map<String, String> status) {
        Optional<Order> orderOptional = orderRepository.findById(id);
        if (orderOptional.isPresent()) {
            Order order = orderOptional.get();
            order.setOrderStatus(status.get("orderStatus"));
            orderRepository.save(order);
            return ResponseEntity.ok(order);
        }
        return ResponseEntity.notFound().build();
    }
}