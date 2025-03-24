package com.shinhan.naengtureat.common.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

//Cors문제를 해결하기 위해 추가함 
@Configuration
//@EnableWebMvc
public class CorsConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**") // 모든 경로 허용
                .allowedOriginPatterns("*") // React에서 접근 허용
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS") // HTTP 메서드 허용
                .allowedHeaders("*")  // 모든 헤더 허용
                .allowCredentials(true); // 쿠키, 인증 정보 허용
    }
}


