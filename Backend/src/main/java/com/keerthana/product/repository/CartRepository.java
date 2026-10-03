package com.keerthana.product.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.keerthana.product.CartItem;

public interface CartRepository extends JpaRepository<CartItem, Integer> {

    List<CartItem> findByUserEmail(String userEmail);

}