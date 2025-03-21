package com.shinhan.naengtureat;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.boot.web.servlet.support.SpringBootServletInitializer;

@SpringBootApplication
//		(exclude={DataSourceAutoConfiguration.class})
public class NaengtureatApplication extends SpringBootServletInitializer {

	public static void main(String[] args) {
		SpringApplication.run(NaengtureatApplication.class, args);
	}
	
	@Override
    protected SpringApplicationBuilder configure(SpringApplicationBuilder builder) {
        return builder.sources(NaengtureatApplication.class);
    }
}
