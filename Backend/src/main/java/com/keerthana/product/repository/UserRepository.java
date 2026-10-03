package com.keerthana.product.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.keerthana.product.User;

public interface UserRepository extends JpaRepository<User, Integer> {

	User findByEmail(String email);
}