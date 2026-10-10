package com.keerthana.product.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.keerthana.product.CartItem;
import com.keerthana.product.Product;
import com.keerthana.product.repository.CartRepository;
import com.keerthana.product.repository.ProductRepository;

@Service
public class CartService {

    private final CartRepository cartRepository;
    private final ProductRepository productRepository;

    public CartService(
            CartRepository cartRepository,
            ProductRepository productRepository) {

        this.cartRepository = cartRepository;
        this.productRepository = productRepository;
    }


    public List<CartItem> getCart(String userEmail) {

        return cartRepository
                .findByUserEmail(userEmail);
    }

   

    public CartItem addToCart(CartItem cartItem) {

        if (cartItem == null) {
            throw new IllegalArgumentException(
                    "Cart item cannot be null"
            );
        }

        if (cartItem.getUserEmail() == null
                || cartItem.getUserEmail().isBlank()) {

            throw new IllegalArgumentException(
                    "User email is required"
            );
        }

        if (cartItem.getProductId() <= 0) {

            throw new IllegalArgumentException(
                    "Invalid product ID"
            );
        }

       

        Product product =
                productRepository
                        .findById(
                                cartItem.getProductId()
                        )
                        .orElse(null);

        if (product == null) {

            throw new IllegalArgumentException(
                    "Product not found"
            );
        }


        int availableStock =
                product.getQuantity();

        if (availableStock <= 0) {

            throw new IllegalArgumentException(
                    "Product is out of stock"
            );
        }

        

        cartItem.setProductName(
                product.getName()
        );

        cartItem.setPrice(
                product.getPrice()
        );

        
        int requestedQuantity =
                cartItem.getQuantity();

        if (requestedQuantity < 1) {
            requestedQuantity = 1;
        }

       

        List<CartItem> existingItems =
                cartRepository
                        .findByUserEmail(
                                cartItem.getUserEmail()
                        );

        for (CartItem existingItem :
                existingItems) {

            if (existingItem.getProductId()
                    == cartItem.getProductId()) {

                int newQuantity =
                        existingItem.getQuantity()
                        + requestedQuantity;

                if (newQuantity >
                        availableStock) {

                    throw new IllegalArgumentException(
                            "Only "
                            + availableStock
                            + " item(s) available."
                    );
                }

                existingItem.setQuantity(
                        newQuantity
                );

                existingItem.setProductName(
                        product.getName()
                );

                existingItem.setPrice(
                        product.getPrice()
                );

                return cartRepository.save(
                        existingItem
                );
            }
        }

      

        if (requestedQuantity >
                availableStock) {

            throw new IllegalArgumentException(
                    "Only "
                    + availableStock
                    + " item(s) available."
            );
        }

        cartItem.setQuantity(
                requestedQuantity
        );

        return cartRepository.save(
                cartItem
        );
    }

    

    public CartItem updateCartItem(
            int id,
            int quantity) {

        CartItem existingItem =
                cartRepository
                        .findById(id)
                        .orElse(null);

        if (existingItem == null) {
            return null;
        }

        if (quantity < 1) {

            throw new IllegalArgumentException(
                    "Quantity must be at least 1"
            );
        }

       

        Product product =
                productRepository
                        .findById(
                                existingItem
                                        .getProductId()
                        )
                        .orElse(null);

        if (product == null) {

            throw new IllegalArgumentException(
                    "Product no longer exists"
            );
        }

        int availableStock =
                product.getQuantity();

        
        if (availableStock <= 0) {

            throw new IllegalArgumentException(
                    "Product is out of stock"
            );
        }

        if (quantity >
                availableStock) {

            throw new IllegalArgumentException(
                    "Only "
                    + availableStock
                    + " item(s) available."
            );
        }

        

        existingItem.setProductName(
                product.getName()
        );

        existingItem.setPrice(
                product.getPrice()
        );

        existingItem.setQuantity(
                quantity
        );

        return cartRepository.save(
                existingItem
        );
    }

    

    public void removeFromCart(int id) {

        cartRepository.deleteById(id);
    }

  

    public void clearCart(
            String userEmail) {

        List<CartItem> cartItems =
                cartRepository
                        .findByUserEmail(
                                userEmail
                        );

        cartRepository.deleteAll(
                cartItems
        );
    }
}
