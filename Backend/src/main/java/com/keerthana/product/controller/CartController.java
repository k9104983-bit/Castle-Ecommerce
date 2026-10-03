package com.keerthana.product.controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import com.keerthana.product.CartItem;
import com.keerthana.product.service.CartService;

@RestController
@CrossOrigin(origins = "https://intelligent-love-production-cfdf.up.railway.app")
@RequestMapping("/cart")
public class CartController {

    private final CartService cartService;

    public CartController(
            CartService cartService) {

        this.cartService = cartService;
    }

    /*
    ============================================================
    GET CART
    ============================================================
    */

    @GetMapping("/{userEmail}")
    public List<CartItem> getCart(
            @PathVariable String userEmail) {

        return cartService.getCart(
                userEmail
        );
    }

    /*
    ============================================================
    ADD TO CART
    ============================================================
    */

    @PostMapping
    public CartItem addToCart(
            @RequestBody CartItem cartItem) {

        try {

            return cartService.addToCart(
                    cartItem
            );

        } catch (IllegalArgumentException e) {

            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    e.getMessage()
            );
        }
    }

    /*
    ============================================================
    UPDATE CART
    ============================================================
    */

    @PutMapping("/{id}")
    public CartItem updateCartItem(
            @PathVariable int id,
            @RequestBody Map<String, Integer> request) {

        Integer quantity =
                request.get("quantity");

        if (quantity == null
                || quantity < 1) {

            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Quantity must be at least 1"
            );
        }

        try {

            CartItem updatedItem =
                    cartService.updateCartItem(
                            id,
                            quantity
                    );

            if (updatedItem == null) {

                throw new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Cart item not found"
                );
            }

            return updatedItem;

        } catch (
                IllegalArgumentException e) {

            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    e.getMessage()
            );
        }
    }

    /*
    ============================================================
    REMOVE
    ============================================================
    */

    @DeleteMapping("/{id}")
    public void removeFromCart(
            @PathVariable int id) {

        cartService.removeFromCart(id);
    }

    /*
    ============================================================
    CLEAR CART
    ============================================================
    */

    @DeleteMapping("/user/{userEmail}")
    public void clearCart(
            @PathVariable String userEmail) {

        cartService.clearCart(
                userEmail
        );
    }
}