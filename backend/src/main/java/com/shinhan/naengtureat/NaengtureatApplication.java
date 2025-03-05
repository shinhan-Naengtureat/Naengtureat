package com.shinhan.naengtureat;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration;

@SpringBootApplication
//		(exclude={DataSourceAutoConfiguration.class})
public class NaengtureatApplication {

	public static void main(String[] args) {
		SpringApplication.run(NaengtureatApplication.class, args);
	}

}