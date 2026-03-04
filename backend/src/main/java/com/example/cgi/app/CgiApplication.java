package com.example.cgi.app;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication(scanBasePackages = "com.example.cgi")
public class CgiApplication {

    public static void main(String[] args) {
        SpringApplication.run(CgiApplication.class, args);
    }

}
