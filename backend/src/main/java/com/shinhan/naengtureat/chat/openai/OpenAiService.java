package com.shinhan.naengtureat.chat.openai;

import java.io.IOException;

import org.springframework.beans.factory.annotation.Value;

import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import okhttp3.MediaType;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.RequestBody;
import okhttp3.Response;

@Service
public class OpenAiService  {
	private static final String API_URL = "https://api.openai.com/v1/chat/completions";

    @Value("${spring.ai.openai.api-key}")
    private String apiKey;

    public String generateMealPlan(String prompt) throws IOException {
        OkHttpClient client = new OkHttpClient();

        MediaType mediaType = MediaType.parse("application/json");
        String requestBody = "{"
                + "\"model\": \"gpt-4\","
                + "\"messages\": [{\"role\": \"system\", \"content\": \"You are a meal planner.\"},"
                + "{\"role\": \"user\", \"content\": \"" + prompt + "\"}],"
                + "\"max_tokens\": 500"
                + "}";

        Request request = new Request.Builder()
                .url(API_URL)
                .post(RequestBody.create(mediaType, requestBody))
                .addHeader("Authorization", "Bearer " + apiKey)
                .addHeader("Content-Type", "application/json")
                .build();

        Response response = client.newCall(request).execute();
        String responseBody = response.body().string();

        ObjectMapper objectMapper = new ObjectMapper();
        JsonNode jsonNode = objectMapper.readTree(responseBody);
        return jsonNode.get("choices").get(0).get("message").get("content").asText();
    }
	    
}
