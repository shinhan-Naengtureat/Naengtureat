package com.shinhan.naengtureat.recipe.entity;

import com.shinhan.naengtureat.common.entities.SuperEntity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Entity
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class RecipeHashtag extends SuperEntity{
	 	@Id
	    @Column(name = "recipe_hashtag_id")
	    @GeneratedValue(strategy = GenerationType.IDENTITY)
	    private Long id;//레시피-해시태그ID
	    
	    @ManyToOne(fetch = FetchType.LAZY)
	    @JoinColumn(name = "recipe_id", nullable = false)
	    private Recipe recipe;//레시피ID
	    
	    @ManyToOne(fetch = FetchType.LAZY)
	    @JoinColumn(name = "hashtag_id", nullable = false)
	    private Hashtag hashtag;//해시태그ID
}
