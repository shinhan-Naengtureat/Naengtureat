package com.shinhan.naengtureat.chat.openai;


import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;

import java.io.IOException;

import org.springframework.beans.factory.annotation.Autowired;
@RestController
@RequestMapping("/api/meal-plan")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class MealPlanController {
	  private final OpenAiService openAiService;

	    @PostMapping
	    public String getMealPlan(@RequestBody String prompt) {
	        try {
	            return openAiService.generateMealPlan(prompt);
	        } catch (IOException e) {
	            return "Error: " + e.getMessage();
	        }
	    }
	
}
