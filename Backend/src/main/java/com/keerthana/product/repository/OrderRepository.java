package com.keerthana.product.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.keerthana.product.Order;

public interface OrderRepository
        extends JpaRepository<Order, Integer> {

    List<Order> findByUserEmailOrderByOrderDateDesc(
            String userEmail);
}