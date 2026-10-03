package com.keerthana.product.service;

import java.time.LocalDateTime;
import java.util.Random;
import java.util.regex.Pattern;

import org.springframework.stereotype.Service;

import com.keerthana.product.User;
import com.keerthana.product.repository.UserRepository;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final EmailService emailService;

    public UserService(
            UserRepository userRepository,
            EmailService emailService) {

        this.userRepository = userRepository;
        this.emailService = emailService;
    }


    /* =========================================================
       REGISTER USER
    ========================================================= */

    public User registerUser(User user) {

        if (user == null ||
            user.getEmail() == null ||
            user.getEmail().trim().isEmpty()) {

            return null;
        }

        String email =
                user.getEmail().trim();

        if (!EMAIL_PATTERN.matcher(email).matches()) {

            return null;
        }

        User existingUser =
                userRepository.findByEmail(email);

        if (existingUser != null) {

            return null;
        }

        user.setEmail(email);

        /*
         * Every new public registration
         * must be a normal USER.
         */
        user.setRole("USER");

        String otp =
                generateOtp();

        user.setVerificationOtp(otp);

        user.setOtpExpiry(
                LocalDateTime.now().plusMinutes(5)
        );

        user.setEmailVerified(false);

        User savedUser =
                userRepository.save(user);

        emailService.sendOtpEmail(
                savedUser.getEmail(),
                otp
        );

        return savedUser;
    }


    /* =========================================================
       LOGIN
    ========================================================= */

    public User loginUser(
            String email,
            String password) {

        if (email == null ||
            password == null) {

            return null;
        }

        User user =
                userRepository.findByEmail(
                        email.trim()
                );

        if (user == null) {

            return null;
        }

        if (user.getPassword() == null ||
            !user.getPassword().equals(password)) {

            return null;
        }

        /*
         * User must verify email before login.
         */
        if (!user.isEmailVerified()) {

            return null;
        }

        return user;
    }


    /* =========================================================
       VERIFY OTP
    ========================================================= */

    public boolean verifyOtp(
            String email,
            String otp) {

        if (email == null ||
            otp == null) {

            return false;
        }

        User user =
                userRepository.findByEmail(
                        email.trim()
                );

        if (user == null) {

            return false;
        }

        /*
         * Already verified.
         */
        if (user.isEmailVerified()) {

            return true;
        }

        /*
         * OTP does not exist.
         */
        if (user.getVerificationOtp() == null) {

            return false;
        }

        /*
         * OTP does not match.
         */
        if (!user.getVerificationOtp().equals(otp)) {

            return false;
        }

        /*
         * OTP expiry does not exist.
         */
        if (user.getOtpExpiry() == null) {

            return false;
        }

        /*
         * OTP expired.
         */
        if (LocalDateTime.now()
                .isAfter(user.getOtpExpiry())) {

            return false;
        }

        /*
         * SUCCESS
         */
        user.setEmailVerified(true);

        user.setVerificationOtp(null);

        user.setOtpExpiry(null);

        userRepository.save(user);

        return true;
    }


    /* =========================================================
       RESEND OTP
    ========================================================= */

    public boolean resendOtp(String email) {

        if (email == null ||
            email.trim().isEmpty()) {

            return false;
        }

        User user =
                userRepository.findByEmail(
                        email.trim()
                );

        if (user == null) {

            return false;
        }

        /*
         * No need to resend if already verified.
         */
        if (user.isEmailVerified()) {

            return false;
        }

        String newOtp =
                generateOtp();

        user.setVerificationOtp(newOtp);

        user.setOtpExpiry(
                LocalDateTime.now().plusMinutes(5)
        );

        userRepository.save(user);

        emailService.sendOtpEmail(
                user.getEmail(),
                newOtp
        );

        return true;
    }


    /* =========================================================
       GENERATE 6 DIGIT OTP
    ========================================================= */

    private String generateOtp() {

        return String.format(
                "%06d",
                new Random().nextInt(1000000)
        );
    }


    /* =========================================================
       EMAIL VALIDATION
    ========================================================= */

    private static final Pattern EMAIL_PATTERN =
            Pattern.compile(
                    "^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+$"
            );
}