package com.shinhan.naengtureat.ingredient.model;

import com.shinhan.naengtureat.ingredient.dto.IngredientDTO;
import com.shinhan.naengtureat.ingredient.entity.Ingredient;
import com.shinhan.naengtureat.ingredient.vo.IngredientVO;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.NoSuchElementException;

@Service
@Slf4j
public class IngredientService {
    @Autowired
    IngredientRepository ingredientRepository;

    public Ingredient getStandardIngredientById(Long ingredientId) {
        return ingredientRepository.findById(ingredientId)
                .orElseThrow(() -> new NoSuchElementException("해당 재료를 찾을 수 없습니다."));
    }

    public IngredientDTO convertDto(Ingredient ingredientEntity) {
        ModelMapper mapper = new ModelMapper();
        return mapper.map(ingredientEntity, IngredientDTO.class);
    }
}
