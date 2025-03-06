package com.shinhan.naengtureat.ingredient;

import java.util.Arrays;
import java.util.List;

import com.shinhan.naengtureat.ingredient.model.IngredientService;
import com.shinhan.naengtureat.ingredient.vo.IngredientVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequestMapping("/ingredient")
public class IngredientController {

    @Autowired
    IngredientService ingredientService;

	@GetMapping("/hello")
    public List<String> hello() {
        return Arrays.asList("안녕하세요", "Hello");
    }

    @GetMapping("/{ingredientId}")
    public ResponseEntity<Object> getIngredientById(@PathVariable Long ingredientId) {
        IngredientVO ingredient = ingredientService.getStandardIngredientById(ingredientId);

        if (ingredient != null) {
            return ResponseEntity.ok(ingredient);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Ingredient with ID " + ingredientId + " not found");
        }
    }
}
