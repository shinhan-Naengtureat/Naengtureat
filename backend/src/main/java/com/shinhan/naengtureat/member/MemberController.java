package com.shinhan.naengtureat.member;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.shinhan.naengtureat.common.response.BaseResponse;
import com.shinhan.naengtureat.member.dto.MemberDTO;
import com.shinhan.naengtureat.member.model.MemberService;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequestMapping("/member")
public class MemberController {
	
	@Autowired
	MemberService memberService;
	
	// 사용자 정보 조회
	@GetMapping("/detail")
	public ResponseEntity<Object> getMemberDetail() {
		
		try {
			// 세션에서 로그인된 사용자 정보 가져오기
			Long memberId = 3L; // security 적용시 코드 수정 필요(WebBoardController SecurityContextHolder, MemberService 참고)
			
			MemberDTO memberDTO = memberService.getMemberById(memberId);
			
			return ResponseEntity.ok(memberDTO);
		} catch (Exception e) {
			e.printStackTrace();

			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
					.body(BaseResponse.builder().message("사용자 정보 조회 중 오류 발생: " + e.getMessage()));
		}
		
	}

}
