package com.shinhan.naengtureat.inventory.model;

import com.querydsl.core.types.Predicate;
import com.querydsl.core.types.dsl.BooleanExpression;
import com.querydsl.core.types.dsl.Expressions;
import com.shinhan.naengtureat.ingredient.entity.QIngredient;
import com.shinhan.naengtureat.inventory.entity.Inventory;
import com.shinhan.naengtureat.inventory.entity.QInventory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.querydsl.QuerydslPredicateExecutor;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

public interface InventoryRepository extends JpaRepository<Inventory, Long>,
		QuerydslPredicateExecutor<Inventory> {

	default Predicate searchInventoryByKeyword(String keyword) {
		QInventory inventory = QInventory.inventory;
		QIngredient ingredient = QIngredient.ingredient;

		BooleanExpression predicate = Expressions.asBoolean(true).isTrue();

		if (keyword != null && !keyword.isEmpty()) {
			predicate = inventory.nickName.containsIgnoreCase(keyword)
					.or(inventory.memo.containsIgnoreCase(keyword))
					.or(inventory.ingredient.smallCategory.containsIgnoreCase(keyword))
					.or(inventory.ingredient.bigCategory.containsIgnoreCase(keyword));
		}
		return predicate;
	}

	 @Query(value = """
		        SELECT 
		            A.a_ingredient_id, 
		            COALESCE(A.a_quantity, 0) AS a_quantity, 
		            B.b_name,
		            B.b_ingredient_id, 
		            B.b_quantity,
		            B.b_recipe_name
		            
		        FROM (
		            SELECT i.ingredient_id AS a_ingredient_id, i.quantity AS a_quantity
		            FROM inventory i
		            WHERE i.member_id = :memberId
		        ) A
		        RIGHT JOIN (
		            SELECT 
		            	ing.small_category AS b_name,
		                ing.ingredient_id AS b_ingredient_id, 
		                CEIL(SUM(ri.quantity)) AS b_quantity,
		                r.name AS b_recipe_name
		            FROM meal_plan mp
		            LEFT JOIN recipe r ON mp.recipe_id = r.recipe_id
		            LEFT JOIN recipe_ingredient ri ON r.recipe_id = ri.recipe_id
		            LEFT JOIN ingredient ing ON ri.ingredient_id = ing.ingredient_id
		            WHERE mp.date BETWEEN :startDate AND :endDate
		            AND mp.member_id = :memberId
		            GROUP BY ing.ingredient_id
		        ) B
		        ON A.a_ingredient_id = B.b_ingredient_id
		        """, nativeQuery = true)
		    List<Object[]> compareInventoryWithMealPlan(
		        @Param("memberId") Long memberId,
		        @Param("startDate") LocalDate startDate,
		        @Param("endDate") LocalDate endDate
		    );

    List<Inventory> findAllByMemberId(Long memberId);
}