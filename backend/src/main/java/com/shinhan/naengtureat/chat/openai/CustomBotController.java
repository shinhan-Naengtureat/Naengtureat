package com.shinhan.naengtureat.chat.openai;

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

@RestController
@RequestMapping("/bot")
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

	@GetMapping("/getchat")
	public String chat(@RequestParam("prompt") String prompt) {
		ChatGPTRequest request = new ChatGPTRequest(model, prompt);
		ChatGptResponse chatGptResponse = template.postForObject(apiURL, request, ChatGptResponse.class);
		return chatGptResponse.getChoices().get(0).getMessage().getContent();
	}

	@PostMapping(value = "/chat", consumes = "application/json", produces = "application/json")
	public ResponseEntity<String> chat(@RequestBody ChatGPTRequest request) {
		try {
			// 1. HTTP 헤더 설정 (API 키 추가)
			System.out.println(request);
			HttpHeaders headers = new HttpHeaders();
			headers.set("Authorization", "Bearer " + apiKey);
			headers.setContentType(MediaType.APPLICATION_JSON);
			// headers.set("Content-Type", "application/json");

			// 2. 요청 객체 생성 (모델 값 추가)
			request.setModel(model);
			//request.setResponse_format("json");

			// 3. HTTP 요청 생성
			HttpEntity<ChatGPTRequest> entity = new HttpEntity<>(request);
			// 4. API 호출
			ResponseEntity<ChatGptResponse> response = template.postForEntity(apiURL, entity, ChatGptResponse.class);
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
			return ResponseEntity.internalServerError().contentType(MediaType.APPLICATION_JSON)
					.body("{\"error\": \"" + e.getMessage() + "\"}");
		}
	}
}
