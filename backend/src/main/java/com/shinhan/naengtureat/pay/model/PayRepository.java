package com.shinhan.naengtureat.pay.model;

import org.springframework.data.jpa.repository.JpaRepository;

import com.shinhan.naengtureat.member.entity.Member;
import com.shinhan.naengtureat.pay.entity.Pay;

public interface PayRepository extends JpaRepository<Pay, Long> {
	
	// 로그인한 유저의 pay정보 받아오기
	public Pay findByMember(Member member);
}
