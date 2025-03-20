package com.shinhan.naengtureat.pay;

import java.util.Map;
import java.util.NoSuchElementException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
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
	
	
    // 결제 완료 후 잔액 및 포인트 업데이트
    @PostMapping("/naengpay/charge")
    public ResponseEntity<Object> completePayment(@RequestBody PayDTO PayDto) {
        try {
			// 세션에서 로그인된 사용자 정보 가져오기
			Long memberId = 3L; // security 적용시 코드 수정 필요(WebBoardController SecurityContextHolder, MemberService 참고)
            
			payService.completePayment(memberId, PayDto);
            
			return ResponseEntity.ok(Map.of("status", "PAID"));
        } catch (NoSuchElementException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (Exception e) {
            log.error("결제 완료 처리 중 오류 발생", e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("결제 완료 처리 중 오류가 발생했습니다.");
        }
    }

}