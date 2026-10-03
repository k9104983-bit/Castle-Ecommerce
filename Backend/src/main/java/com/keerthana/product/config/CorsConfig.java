package com.keerthana.product.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {

        registry.addMapping("/**")
                .allowedOrigins(
                    "https://intelligent-love-production-cfdf.up.railway.app"
                )
                .allowedMethods(
                    "GET",
                    "POST",
                    "PUT",
                    "DELETE",
                    "OPTIONS"
                )
                .allowedHeaders("*")
                .allowCredentials(true);
    }
}