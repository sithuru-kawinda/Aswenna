package com.backend.farmersmarket.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.backend.farmersmarket.entity.Product;

public interface ProductRepository extends JpaRepository<Product, Long> {
    List<Product> findAllByOrderByCreatedAtDesc();
    List<Product> findByUserId(Long userId);
    List<Product> findByIsAvailableTrueOrderByCreatedAtDesc();
}