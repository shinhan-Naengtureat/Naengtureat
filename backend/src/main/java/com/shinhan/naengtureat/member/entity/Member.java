package com.shinhan.naengtureat.member.entity;

import com.shinhan.naengtureat.common.entities.SuperEntity;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class Member extends SuperEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "member_id")
    Long id;
    String image;

    @Column(nullable = false)
    String loginId;

    @Column(nullable = false)
    String loginPw;

    @Column(nullable = false)
    String name;

    @Column(nullable = false)
    String phone;

    @Column(nullable = false)
    String roadAddressName;

    @Column(nullable = false)
    String detailAddress;

    @Column(nullable = false)
    int point;

    int budget;
}
