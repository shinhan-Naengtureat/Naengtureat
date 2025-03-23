package com.shinhan.naengtureat.chatgpt;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ChatGPTRequest {

	
	private String model;
    private List<Message> messages;
    private Map<String,String> response_format;

    public ChatGPTRequest(String model, String prompt) {
        this.model = model;
        this.messages = new ArrayList<>();
        this.messages.add(new Message("user",prompt,0.7));
        this.response_format = Map.of("type","json_object");
    }
}
