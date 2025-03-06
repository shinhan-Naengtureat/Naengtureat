package com.shinhan.naengtureat.ingredient.model;

import com.shinhan.naengtureat.ingredient.dto.IngredientDTO;
import com.shinhan.naengtureat.ingredient.entity.Ingredient;
import com.shinhan.naengtureat.ingredient.vo.IngredientVO;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class IngredientService {
    @Autowired
    IngredientRepository ingredientRepository;

    public IngredientVO getStandardIngredientById(Long ingredientId) {
        return ingredientRepository.findById(ingredientId)
                .map(this::convertDto)
                .map(IngredientVO::new)
                .orElse(null);
    }

    public IngredientDTO convertDto(Ingredient ingredientEntity) {
        ModelMapper mapper = new ModelMapper();
        return mapper.map(ingredientEntity, IngredientDTO.class);
    }
}