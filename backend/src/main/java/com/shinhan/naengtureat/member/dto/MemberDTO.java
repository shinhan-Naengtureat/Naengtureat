package com.shinhan.naengtureat.member.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

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
public class MemberDTO {
	
	private Long id; // 멤버 번호
	private String image; // 멤버 프로필 사진
	private String loginId; // 로그인 아이디
	private String name; // 멤버 이름
	private String phone; // 멤버 전화번호
	private String roadAddressName; // 도로명 주소
	private String detailAddress; // 상세 주소
	private int point; // 보유 포인트
	private int budget; // 예산

}
