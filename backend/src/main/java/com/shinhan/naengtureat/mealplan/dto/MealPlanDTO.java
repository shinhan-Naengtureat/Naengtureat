package com.shinhan.naengtureat.mealplan.dto;

import com.shinhan.naengtureat.member.entity.Member;
import com.shinhan.naengtureat.recipe.entity.Recipe;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

/**
 * @Data: Getter, Setter, toString, equals, hashCode, RequiredArgsConstructor 자동 생성
 * @NoArgsConstructor: 기본 생성자 생성
 * @AllArgsConstructor: 모든 필드를 포함한 생성자 생성
 * @Builder: 빌더 패턴 지원
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MealPlanDTO {
    private Long id;//식단ID
    private Member member; //멤버번호
    private Recipe recipe; // 레시피ID
    private LocalDate date; // 식단일자
    private String type; //식단분류
    private boolean isCheck; //이행여부

    public boolean getIsCheck() {
        return this.isCheck;
    }
}
