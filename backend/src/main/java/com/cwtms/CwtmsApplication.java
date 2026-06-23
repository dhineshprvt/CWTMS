package com.cwtms;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
@EnableAsync
public class CwtmsApplication {
    public static void main(String[] args) {
        SpringApplication.run(CwtmsApplication.class, args);
    }
}
