package com.shinhan.naengtureat.ingredient;

import java.util.Arrays;
import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequestMapping("/ingredient")
public class IngredientController {

	@GetMapping("/hello")
    public List<String> hello() {
        return Arrays.asList("안녕하세요", "Hello");
    }
}
