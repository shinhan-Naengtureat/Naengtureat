package com.shinhan.naengtureat.member.model;

import java.util.NoSuchElementException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.shinhan.naengtureat.member.entity.Member;

@Service
public class MemberService {

	@Autowired
	MemberRepository memberRepository;

	public Member getMemberById(Long id) {
		return memberRepository.findById(id).orElseThrow(() -> new NoSuchElementException("해당 멤버를 찾을 수 없습니다."));
	}

	// 예산 업데이트
	public int updateMemberBudgetById(Long id, int newBudget) {
		int updatedRows = memberRepository.updateBudgetByMemberId(id, newBudget);
		if (updatedRows == 0) {
			throw new RuntimeException("예산 업데이트 실패. ID: " + id);
		}
		return updatedRows;
	}
}
