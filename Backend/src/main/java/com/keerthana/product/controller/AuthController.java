package com.keerthana.product.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.keerthana.product.User;
import com.keerthana.product.dto.VerifyOtpRequest;
import com.keerthana.product.service.UserService;

@RestController
@CrossOrigin(origins = "https://intelligent-love-production-cfdf.up.railway.app")
@RequestMapping("/auth")
public class AuthController {

    private final UserService userService;

    public AuthController(UserService userService) {

        this.userService = userService;
    }


    /* =========================================================
       REGISTER
    ========================================================= */

    @PostMapping("/register")
    public Map<String, Object> register(
            @RequestBody User user) {

        Map<String, Object> response =
                new HashMap<>();

        User registeredUser =
                userService.registerUser(user);

        if (registeredUser == null) {

            response.put(
                    "success",
                    false
            );

            response.put(
                    "message",
                    "Email already exists or registration data is invalid."
            );

            return response;
        }

        response.put(
                "success",
                true
        );

        response.put(
                "message",
                "Registration successful. OTP sent to your email."
        );

        response.put(
                "email",
                registeredUser.getEmail()
        );

        return response;
    }


    /* =========================================================
       LOGIN
    ========================================================= */

    @PostMapping("/login")
    public Map<String, Object> login(
            @RequestBody User user) {

        User loggedInUser =
                userService.loginUser(
                        user.getEmail(),
                        user.getPassword()
                );

        Map<String, Object> response =
                new HashMap<>();

        if (loggedInUser == null) {

            response.put(
                    "success",
                    false
            );

            response.put(
                    "message",
                    "Invalid email, password, or email not verified."
            );

            return response;
        }

        response.put(
                "success",
                true
        );

        response.put(
                "message",
                "Login successful"
        );

        response.put(
                "user",
                Map.of(
                        "id",
                        loggedInUser.getId(),

                        "name",
                        loggedInUser.getName(),

                        "email",
                        loggedInUser.getEmail(),

                        "role",
                        loggedInUser.getRole(),

                        "emailVerified",
                        loggedInUser.isEmailVerified()
                )
        );

        return response;
    }


    /* =========================================================
       VERIFY OTP
    ========================================================= */

    @PostMapping("/verify-otp")
    public boolean verifyOtp(
            @RequestBody VerifyOtpRequest request) {

        return userService.verifyOtp(
                request.getEmail(),
                request.getOtp()
        );
    }


    /* =========================================================
       RESEND OTP
    ========================================================= */

    @PostMapping("/resend-otp")
    public Map<String, Object> resendOtp(
            @RequestBody Map<String, String> request) {

        String email =
                request.get("email");

        boolean success =
                userService.resendOtp(email);

        Map<String, Object> response =
                new HashMap<>();

        if (!success) {

            response.put(
                    "success",
                    false
            );

            response.put(
                    "message",
                    "Unable to resend OTP. User may not exist or may already be verified."
            );

            return response;
        }

        response.put(
                "success",
                true
        );

        response.put(
                "message",
                "New OTP sent to your email."
        );

        return response;
    }
}