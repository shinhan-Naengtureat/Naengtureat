package com.shinhan.naengtureat.pay.model;

import java.util.List;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.shinhan.naengtureat.inventory.dto.InventoryResponseDTO;
import com.shinhan.naengtureat.inventory.entity.Inventory;
import com.shinhan.naengtureat.mealplan.dto.MealPlanDTO;
import com.shinhan.naengtureat.mealplan.entity.MealPlan;
import com.shinhan.naengtureat.member.entity.Member;
import com.shinhan.naengtureat.pay.dto.PayDTO;
import com.shinhan.naengtureat.pay.entity.Pay;

@Service
public class PayService {
	
	@Autowired
	PayRepository payRepository;
	
	// 로그인한 유저의 pay정보 받아오기
	public PayDTO getPayByMember(Long memberId) {
		Member newMember = Member.builder().id(memberId).build();
		
		Pay pay = payRepository.findByMember(newMember);
		PayDTO payDTO = convertDto(pay);
		
		return payDTO;
	}
	
	public PayDTO convertDto(Pay pay) {
		ModelMapper mapper = new ModelMapper();

        return mapper.map(pay, PayDTO.class);
    }
}
