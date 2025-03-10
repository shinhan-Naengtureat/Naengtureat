package com.shinhan.naengtureat.member.model;

import com.shinhan.naengtureat.member.entity.Member;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

public interface MemberRepository extends JpaRepository<Member, Long> {
	// Budget 업데이트
	@Modifying
	@Transactional
	@Query("UPDATE Member m SET m.budget = :newBudget WHERE m.id = :memberId")
	int updateBudgetByMemberId(@Param("memberId") Long memberId, @Param("newBudget") int newBudget);

}
