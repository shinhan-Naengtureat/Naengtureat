package com.shinhan.naengtureat.chat.openai;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

import com.fasterxml.jackson.databind.ObjectMapper;

@RestController
@RequestMapping("/mealplan")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class CustomBotController {
	@Value("${spring.ai.openai.chat.options.model}")
	private String model;

	@Value(("${spring.ai.openai.base-url}"))
	private String apiURL;

	@Value("${spring.ai.openai.api-key}")
	String apiKey;

	@Autowired
	private RestTemplate template;
//
//	@GetMapping("/getchat")
//	public String chat(@RequestParam("prompt") String prompt) {
//		ChatGPTRequest request = new ChatGPTRequest(model, prompt);
//		ChatGptResponse chatGptResponse = template.postForObject(apiURL, request, ChatGptResponse.class);
//		return chatGptResponse.getChoices().get(0).getMessage().getContent();
//	}

	@PostMapping( consumes = "application/json", produces = "application/json")
	public ResponseEntity<Object> chat(@RequestBody ChatGPTRequest request) {
		try {
			// 1️⃣ 요청 객체 검증
	        if (request == null || request.getMessages() == null || request.getMessages().isEmpty()) {
	            return ResponseEntity.badRequest().body("{\"error\": \"잘못된 요청 데이터입니다.\"}");
	        }
			// 1. HTTP 헤더 설정 (API 키 추가)
			HttpHeaders headers = new HttpHeaders();
			headers.set("Authorization", "Bearer " + apiKey);
			headers.setContentType(MediaType.APPLICATION_JSON);
			
			// 2. 요청 객체 생성 (모델 값 추가)
			request.setModel(model);
			request.setResponse_format(Map.of("type", "json_object"));
			
			ObjectMapper objectMapper = new ObjectMapper();
	        System.out.println("🔍 OpenAI 요청 JSON: " + objectMapper.writeValueAsString(request));
			
	        // 3. HTTP 요청 생성
			HttpEntity<ChatGPTRequest> entity = new HttpEntity<>(request);
			 System.out.println("🛠️ entity 생성 완료: " + entity);
			// 4. API 호출
			ResponseEntity<ChatGptResponse> response = template.postForEntity(apiURL, entity, ChatGptResponse.class);
			 System.out.println("✅ OpenAI API 응답 성공: " + response);
			
			// 5. 응답 처리
			ChatGptResponse responseBody = response.getBody();
			
			
			if (responseBody != null && responseBody.getChoices() != null && !responseBody.getChoices().isEmpty()) {
				ChatGptResponse chatResponse = response.getBody();
				System.out.println("🚀 사용된 토큰:");
	            System.out.println("  - 프롬프트 토큰: " + chatResponse.getUsage().getPrompt_tokens());
	            System.out.println("  - 응답 토큰: " + chatResponse.getUsage().getCompletion_tokens());
	            System.out.println("  - 총 사용 토큰: " + chatResponse.getUsage().getTotal_tokens());
	          

				return ResponseEntity.ok().contentType(MediaType.APPLICATION_JSON)
						.body(responseBody.getChoices().get(0).getMessage().getContent());
			} else {
				return ResponseEntity.badRequest().contentType(MediaType.APPLICATION_JSON)
						.body("{\"error\": \"No response from OpenAI API\"}");
			}
		} catch (Exception e) {
			 System.out.println("❌ OpenAI API 호출 실패: " + e.getMessage());
			return ResponseEntity.internalServerError().contentType(MediaType.APPLICATION_JSON)
					.body("{\"error\": \"" + e.getMessage() + "\"}");
		}
	}
}
