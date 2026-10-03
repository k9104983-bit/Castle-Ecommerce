package com.keerthana.product.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.keerthana.product.Product;

public interface ProductRepository
        extends JpaRepository<Product, Integer> {

}