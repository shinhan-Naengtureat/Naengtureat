package com.shinhan.naengtureat.common.swagger;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.info.Info;
import io.swagger.v3.oas.models.OpenAPI;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@OpenAPIDefinition(
        info = @Info(title = "냉털잇 API 명세서",
                description = "도메인별 API 명세서",
                version = "v1"))
@Configuration
public class SwaggerConfig {

    @Bean
    public OpenAPI api() {
        return new OpenAPI();
    }
}
    //Security 적용 시 코드
//        SecurityScheme apiKey = new SecurityScheme()
//                .type(SecurityScheme.Type.HTTP)
//                .in(SecurityScheme.In.HEADER)
//                .name("Authorization")
//                .scheme("bearer")
//                .bearerFormat("JWT");
//
//        SecurityRequirement securityRequirement = new SecurityRequirement()
//                .addList("Bearer Token");
//
//        return new OpenAPI()
//                .components(new Components().addSecuritySchemes("Bearer Token", apiKey))
//                .addSecurityItem(securityRequirement);
//    }
