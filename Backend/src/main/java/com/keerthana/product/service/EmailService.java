package com.keerthana.product.service;

import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import com.keerthana.product.Order;
import com.keerthana.product.OrderItem;

@Service
public class EmailService {

    private final JavaMailSender mailSender;

    public EmailService(
            JavaMailSender mailSender) {

        this.mailSender = mailSender;
    }

    /*
    ============================================================
    OTP EMAIL
    ============================================================
    */

    public void sendOtpEmail(
            String toEmail,
            String otp) {

        SimpleMailMessage message =
                new SimpleMailMessage();

        message.setTo(toEmail);

        message.setSubject(
                "Castle - Email Verification OTP"
        );

        message.setText(
                "Welcome to Castle!\n\n"
                + "Your email verification OTP is: "
                + otp
                + "\n\n"
                + "This OTP is valid for 5 minutes.\n\n"
                + "Please do not share this OTP with anyone.\n\n"
                + "Thank you,\n"
                + "Castle Team"
        );

        mailSender.send(message);
    }

    /*
    ============================================================
    ORDER CONFIRMATION EMAIL
    ============================================================
    */

    public void sendOrderConfirmationEmail(
            String toEmail,
            Order order) {

        SimpleMailMessage message =
                new SimpleMailMessage();

        message.setTo(toEmail);

        message.setSubject(
                "Castle - Order Confirmed #"
                + order.getId()
        );

        StringBuilder items =
                new StringBuilder();

        for (OrderItem item :
                order.getItems()) {

            items.append(
                    item.getProductName()
            );

            items.append(" × ");

            items.append(
                    item.getQuantity()
            );

            items.append(" - ₹");

            items.append(
                    String.format(
                            "%.2f",
                            item.getPrice()
                    )
            );

            items.append("\n");
        }

        String emailBody =
                "Hello "
                + order.getFullName()
                + ",\n\n"

                + "Thank you for shopping with Castle!\n\n"

                + "Your order has been successfully placed.\n\n"

                + "----------------------------------------\n"
                + "ORDER DETAILS\n"
                + "----------------------------------------\n\n"

                + "Order ID: "
                + order.getId()
                + "\n"

                + "Order Date: "
                + order.getOrderDate()
                + "\n"

                + "Status: "
                + order.getStatus()
                + "\n"

                + "Payment Method: Cash on Delivery\n\n"

                + "Items:\n"
                + items
                + "\n"

                + "Total Amount: ₹"
                + String.format(
                        "%.2f",
                        order.getTotalAmount()
                )
                + "\n\n"

                + "----------------------------------------\n"
                + "DELIVERY ADDRESS\n"
                + "----------------------------------------\n\n"

                + order.getFullName()
                + "\n"

                + order.getPhone()
                + "\n"

                + order.getHouseStreet()
                + "\n"

                + order.getCity()
                + ", "
                + order.getState()
                + " - "
                + order.getPincode()
                + "\n\n"

                + "----------------------------------------\n"
                + "DELIVERY INFORMATION\n"
                + "----------------------------------------\n\n"

                + "Your order will be delivered within 5-6 days.\n"

                + "Expected Delivery Date: "
                + order.getExpectedDeliveryDate()
                + "\n\n"

                + "Please keep the Cash on Delivery amount ready "
                + "when your order arrives.\n\n"

                + "Thank you for choosing Castle.\n\n"

                + "Regards,\n"
                + "Castle Team";

        message.setText(emailBody);

        mailSender.send(message);
    }

    /*
    ============================================================
    ORDER CANCELLATION EMAIL
    ============================================================
    */

    public void sendOrderCancellationEmail(
            String toEmail,
            Order order) {

        SimpleMailMessage message =
                new SimpleMailMessage();

        message.setTo(toEmail);

        message.setSubject(
                "Castle - Order Cancelled #"
                + order.getId()
        );

        StringBuilder items =
                new StringBuilder();

        for (OrderItem item :
                order.getItems()) {

            items.append(
                    item.getProductName()
            );

            items.append(" × ");

            items.append(
                    item.getQuantity()
            );

            items.append(" - ₹");

            items.append(
                    String.format(
                            "%.2f",
                            item.getPrice()
                    )
            );

            items.append("\n");
        }

        String emailBody =
                "Hello "
                + order.getFullName()
                + ",\n\n"

                + "Your Castle order has been cancelled successfully.\n\n"

                + "----------------------------------------\n"
                + "CANCELLATION DETAILS\n"
                + "----------------------------------------\n\n"

                + "Order ID: "
                + order.getId()
                + "\n"

                + "Order Date: "
                + order.getOrderDate()
                + "\n"

                + "Status: "
                + order.getStatus()
                + "\n\n"

                + "Cancelled Order Items:\n"
                + items
                + "\n"

                + "Order Amount: ₹"
                + String.format(
                        "%.2f",
                        order.getTotalAmount()
                )
                + "\n\n"

                + "The products from this order "
                + "have been returned to available stock.\n\n"

                + "If you did not request this cancellation, "
                + "please contact Castle support.\n\n"

                + "Thank you,\n"
                + "Castle Team";

        message.setText(emailBody);

        mailSender.send(message);
    }
}