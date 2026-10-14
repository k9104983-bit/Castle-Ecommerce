package com.keerthana.product.service;

import java.time.LocalDate;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.keerthana.product.CartItem;
import com.keerthana.product.Order;
import com.keerthana.product.OrderItem;
import com.keerthana.product.Product;
import com.keerthana.product.dto.PlaceOrderRequest;
import com.keerthana.product.repository.CartRepository;
import com.keerthana.product.repository.OrderRepository;
import com.keerthana.product.repository.ProductRepository;

@Service
public class OrderService {

    private final OrderRepository orderRepository;
    private final CartRepository cartRepository;
    private final ProductRepository productRepository;
    private final EmailService emailService;

    public OrderService(
            OrderRepository orderRepository,
            CartRepository cartRepository,
            ProductRepository productRepository,
            EmailService emailService) {

        this.orderRepository = orderRepository;
        this.cartRepository = cartRepository;
        this.productRepository = productRepository;
        this.emailService = emailService;
    }

   

    @Transactional
    public Order placeOrder(
            PlaceOrderRequest request) {

        if (request == null
                || request.getUserEmail() == null
                || request.getUserEmail().isBlank()) {

            return null;
        }

        List<CartItem> cartItems =
                cartRepository.findByUserEmail(
                        request.getUserEmail()
                );

        if (cartItems.isEmpty()) {
            return null;
        }

       

        if (request.getFullName() == null
                || request.getFullName().isBlank()
                || request.getPhone() == null
                || request.getPhone().isBlank()
                || request.getHouseStreet() == null
                || request.getHouseStreet().isBlank()
                || request.getCity() == null
                || request.getCity().isBlank()
                || request.getState() == null
                || request.getState().isBlank()
                || request.getPincode() == null
                || request.getPincode().isBlank()) {

            return null;
        }

        
        if (request.getPaymentMethod() == null
                || !request.getPaymentMethod()
                        .equalsIgnoreCase(
                                "CASH_ON_DELIVERY"
                        )) {

            return null;
        }

        

        for (CartItem cartItem :
                cartItems) {

            Product product =
                    productRepository
                            .findById(
                                    cartItem.getProductId()
                            )
                            .orElse(null);

            if (product == null) {
                return null;
            }

            if (cartItem.getQuantity() <= 0) {
                return null;
            }

            if (product.getQuantity() <= 0) {
                return null;
            }

            if (cartItem.getQuantity()
                    > product.getQuantity()) {

                return null;
            }
        }

       

        Order order = new Order();

        order.setUserEmail(
                request.getUserEmail()
        );

        order.setOrderDate(
                LocalDate.now()
        );

        order.setExpectedDeliveryDate(
                LocalDate.now().plusDays(6)
        );

        order.setStatus("PLACED");

        order.setPaymentMethod(
                "CASH_ON_DELIVERY"
        );

        
        order.setFullName(
                request.getFullName()
        );

        order.setPhone(
                request.getPhone()
        );

        order.setHouseStreet(
                request.getHouseStreet()
        );

        order.setCity(
                request.getCity()
        );

        order.setState(
                request.getState()
        );

        order.setPincode(
                request.getPincode()
        );

        double total = 0;

       

        for (CartItem cartItem :
                cartItems) {

            Product product =
                    productRepository
                            .findById(
                                    cartItem.getProductId()
                            )
                            .orElse(null);

            if (product == null) {
                return null;
            }

         

            int newStock =
                    product.getQuantity()
                    - cartItem.getQuantity();

            if (newStock < 0) {
                return null;
            }

            product.setQuantity(
                    newStock
            );

            productRepository.save(
                    product
            );

           
            OrderItem orderItem =
                    new OrderItem();

            orderItem.setProductId(
                    product.getId()
            );

            orderItem.setProductName(
                    product.getName()
            );

            orderItem.setPrice(
                    product.getPrice()
            );

            orderItem.setQuantity(
                    cartItem.getQuantity()
            );

            order.getItems().add(
                    orderItem
            );

            total +=
                    product.getPrice()
                    * cartItem.getQuantity();
        }

       
        order.setTotalAmount(
                total
        );

       
        Order savedOrder =
                orderRepository.save(
                        order
                );

        

        cartRepository.deleteAll(
                cartItems
        );

        

        try {

            emailService
                    .sendOrderConfirmationEmail(
                            savedOrder.getUserEmail(),
                            savedOrder
                    );

        } catch (Exception e) {

            System.out.println(
                    "Order confirmation email failed: "
                    + e.getMessage()
            );
        }

        return savedOrder;
    }

   

    public List<Order> getUserOrders(
            String userEmail) {

        return orderRepository
                .findByUserEmailOrderByOrderDateDesc(
                        userEmail
                );
    }

  

    public Order getOrderById(
            int id) {

        return orderRepository
                .findById(id)
                .orElse(null);
    }

   
    @Transactional
    public Order cancelOrder(
            int id,
            String userEmail) {

        

        Order order =
                orderRepository
                        .findById(id)
                        .orElse(null);

        if (order == null) {
            return null;
        }


        if (userEmail == null
                || userEmail.isBlank()) {

            return null;
        }

        if (!userEmail.equalsIgnoreCase(
                order.getUserEmail())) {

            return null;
        }


        if ("CANCELLED".equalsIgnoreCase(
                order.getStatus())) {

            return order;
        }

        

        if ("DELIVERED".equalsIgnoreCase(
                order.getStatus())) {

            return null;
        }

     

        for (OrderItem item :
                order.getItems()) {

            Product product =
                    productRepository
                            .findById(
                                    item.getProductId()
                            )
                            .orElse(null);

            if (product != null) {

                product.setQuantity(
                        product.getQuantity()
                        + item.getQuantity()
                );

                productRepository.save(
                        product
                );
            }
        }

       

        order.setStatus(
                "CANCELLED"
        );

        Order cancelledOrder =
                orderRepository.save(
                        order
                );

        

        try {

            emailService
                    .sendOrderCancellationEmail(
                            cancelledOrder
                                    .getUserEmail(),
                            cancelledOrder
                    );

        } catch (Exception e) {

          

            System.out.println(
                    "Cancellation email failed: "
                    + e.getMessage()
            );
        }

        return cancelledOrder;
    }
}
