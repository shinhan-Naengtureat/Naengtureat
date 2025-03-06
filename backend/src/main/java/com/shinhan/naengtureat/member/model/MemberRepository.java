package com.shinhan.naengtureat.member.model;


import com.shinhan.naengtureat.member.entity.Member;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MemberRepository extends JpaRepository<Member, Long> {

}
