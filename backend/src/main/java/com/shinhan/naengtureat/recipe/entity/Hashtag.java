package com.shinhan.naengtureat.recipe.entity;

import com.shinhan.naengtureat.common.entities.SuperEntity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
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
public class Hashtag extends SuperEntity {
	 @Id
	 @Column(name= "hashtag_id")
	 @GeneratedValue(strategy = GenerationType.IDENTITY)
	 Long id;
	 
	 @Column(nullable = false)
	 private String keyword;//해시태그ID
	    
	    
	 
}
