package com.bus.app.tools;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

public class PasswordTest {
    public static void main(String[] args) {
        BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

        // Encode a password
        String rawPassword = "usu_1";
        String encodedPassword = passwordEncoder.encode(rawPassword);
        System.out.println("Encoded password: " + encodedPassword);

        // Check if raw password matches encoded password
        boolean matches = passwordEncoder.matches(rawPassword, "$2a$10$xLJ9TU1sfY0KFJmsHqeIteEuMjKNonNf2a6gNBznHgua590FcbuNS");
        System.out.println("Passwords match: " + matches);
    }
}

