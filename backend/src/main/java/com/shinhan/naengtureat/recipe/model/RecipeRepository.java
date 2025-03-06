package com.shinhan.naengtureat.recipe.model;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.shinhan.naengtureat.recipe.entity.Recipe;

public interface RecipeRepository extends JpaRepository<Recipe, Long> {

	@Query("select distinct category from #{#entityName}")
	List<String> findCategoryAll();

}
