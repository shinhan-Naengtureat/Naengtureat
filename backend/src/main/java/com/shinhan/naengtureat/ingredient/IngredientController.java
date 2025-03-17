package com.shinhan.naengtureat.ingredient;

import com.shinhan.naengtureat.common.response.BaseResponse;
import com.shinhan.naengtureat.ingredient.dto.IngredientDTO;
import com.shinhan.naengtureat.ingredient.model.IngredientService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RestController
@RequestMapping("/ingredient")
public class IngredientController {

    @Autowired
    IngredientService ingredientService;

    @GetMapping("/{ingredientId}")
    public ResponseEntity<Object> getIngredientById(@PathVariable("ingredientId") Long ingredientId) {
        IngredientDTO ingredientDTO = ingredientService.getStandardIngredientById(ingredientId);

        if (ingredientDTO != null) {
            return ResponseEntity.ok(ingredientDTO);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(BaseResponse.builder().message("재료 ID: " + ingredientId + "를 찾을 수 없습니다.").build());
        }
    }

    @GetMapping("/categories")
    public ResponseEntity<Object> getCategories() {
        return ResponseEntity.ok(ingredientService.getAllCategory());
    }
}
