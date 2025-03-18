package com.shinhan.naengtureat.pay;

import java.util.NoSuchElementException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.shinhan.naengtureat.pay.dto.PayDTO;
import com.shinhan.naengtureat.pay.model.PayService;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequestMapping("/pay")
public class PayController {
	
	@Autowired
	PayService payService;
	
	// 로그인한 유저의 pay정보 받아오기
	@GetMapping
	public ResponseEntity<Object> getPay() {
		Long memberId = 3L; // security 적용시 코드 수정 필요(WebBoardController SecurityContextHolder, MemberService 참고)
		
		PayDTO pay = payService.getPayByMember(memberId);
		
		if (pay == null) {
			throw new NoSuchElementException("로그인한 유저 정보를 확인할 수 없습니다.");
		}
		return ResponseEntity.ok(pay);
	}

}