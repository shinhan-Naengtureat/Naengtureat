package com.shinhan.naengtureat.member.model;

import java.util.NoSuchElementException;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.shinhan.naengtureat.member.dto.MemberDTO;
import com.shinhan.naengtureat.member.entity.Member;

import jakarta.transaction.Transactional;

@Service
public class MemberService {

	@Autowired
	MemberRepository memberRepository;

	// 사용자 정보 조회
	public MemberDTO getMemberById(Long memberId) {
		Member memberEntity = memberRepository.findById(memberId)
				.orElseThrow(() -> new NoSuchElementException("해당 멤버를 찾을 수 없습니다."));
		
		return entityToDTO(memberEntity);
	}
	
	// 사용한 포인트 업데이트
	@Transactional
    public void updateMemberPoint(Long memberId, int newPoint) {
        Member member = memberRepository.findById(memberId)
            .orElseThrow(() -> new IllegalArgumentException("회원 정보를 찾을 수 없습니다."));
        member.setPoint(newPoint);
        memberRepository.save(member);
    }

	// 예산 업데이트
	public int updateMemberBudgetById(Long id, int newBudget) {
		int updatedRows = memberRepository.updateBudgetByMemberId(id, newBudget);
		if (updatedRows == 0) {
			throw new RuntimeException("예산 업데이트 실패. ID: " + id);
		}
		return updatedRows;
	}
	
	// Entity를 DTO로 변환
	public MemberDTO entityToDTO(Member entity) {
		ModelMapper mapper = new ModelMapper();
		MemberDTO dto = mapper.map(entity, MemberDTO.class); // 이름이 같은 필드들은 자동으로 매핑

		return dto;
	}
	
}
