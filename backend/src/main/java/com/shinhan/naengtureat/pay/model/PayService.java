package com.shinhan.naengtureat.pay.model;

import java.util.NoSuchElementException;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.shinhan.naengtureat.member.entity.Member;
import com.shinhan.naengtureat.member.model.MemberRepository;
import com.shinhan.naengtureat.pay.dto.PayDTO;
import com.shinhan.naengtureat.pay.entity.Pay;

import jakarta.transaction.Transactional;

@Service
public class PayService {
	
	@Autowired
	PayRepository payRepository;
	
	@Autowired
    MemberRepository memberRepository;

	
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

	// 결제 완료 후 잔액과 멤버 포인트 업데이트 (충전 금액의 1% 보너스 추가)
    @Transactional
    public void completePayment(PayDTO PayDto) {
        // 1. 해당 회원의 Pay 정보 조회
        Member memberKey = Member.builder().id(PayDto.getMemberId()).build();
        Pay pay = payRepository.findByMember(memberKey);
        if (pay == null) {
            throw new NoSuchElementException("해당 회원의 Pay 정보를 찾을 수 없습니다.");
        }
        
        // 2. 충전 금액만큼 잔액 업데이트
        int chargeAmount = PayDto.getBalance();
        pay.setBalance(pay.getBalance() + chargeAmount);
        payRepository.save(pay);
        
        // 3. 멤버 테이블의 포인트 업데이트 (충전 금액의 1% 보너스 추가)
        Member member = memberRepository.findById(PayDto.getMemberId())
                .orElseThrow(() -> new NoSuchElementException("해당 회원 정보를 찾을 수 없습니다."));
        int bonusPoint = (int) (chargeAmount * 0.01);
        member.setPoint(member.getPoint() + bonusPoint);
        memberRepository.save(member);
    }
}
