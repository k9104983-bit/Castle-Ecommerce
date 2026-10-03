package com.keerthana.product.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import com.keerthana.product.Order;
import com.keerthana.product.dto.PlaceOrderRequest;
import com.keerthana.product.service.OrderService;

@RestController
@CrossOrigin(origins = "https://intelligent-love-production-cfdf.up.railway.app")
@RequestMapping("/orders")
public class OrderController {

    private final OrderService orderService;

    public OrderController(
            OrderService orderService) {

        this.orderService = orderService;
    }

    /*
    ============================================================
    PLACE ORDER
    ============================================================
    */

    @PostMapping
    public Order placeOrder(
            @RequestBody PlaceOrderRequest request) {

        Order order =
                orderService.placeOrder(
                        request
                );

        if (order == null) {

            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Unable to place order. Please check stock, address and payment details."
            );
        }

        return order;
    }

    /*
    ============================================================
    GET USER ORDERS
    ============================================================
    */

    @GetMapping("/user/{userEmail}")
    public List<Order> getUserOrders(
            @PathVariable String userEmail) {

        return orderService
                .getUserOrders(userEmail);
    }

    /*
    ============================================================
    GET SINGLE ORDER
    ============================================================
    */

    @GetMapping("/{id}")
    public Order getOrder(
            @PathVariable int id) {

        Order order =
                orderService.getOrderById(id);

        if (order == null) {

            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "Order not found"
            );
        }

        return order;
    }

    /*
    ============================================================
    CANCEL ORDER
    ============================================================
    */

    @PutMapping("/cancel/{id}")
    public Order cancelOrder(
            @PathVariable int id,
            @RequestParam String userEmail) {

        if (userEmail == null
                || userEmail.isBlank()) {

            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "User email is required"
            );
        }

        Order order =
                orderService.cancelOrder(
                        id,
                        userEmail
                );

        if (order == null) {

            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Order cannot be cancelled"
            );
        }

        return order;
    }
}