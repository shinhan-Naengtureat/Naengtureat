package com.shinhan.naengtureat.chat.openai;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Component
@ConfigurationProperties(prefix = "spring.ai.openai")
@Getter
@Setter
@ToString
public class OpenAIProperties {
    private String baseUrl;
    private String apiKey;
    private String model;
}
