package com.bus.app.tools;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class PasswordGenerator implements CommandLineRunner {

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        String password = "admin";
        String encodedPassword = passwordEncoder.encode(password);
//        System.out.println("Encoded password for 'admin': " + encodedPassword);
    }
}
