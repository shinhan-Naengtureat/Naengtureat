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
    private Long id;
    private String image;

    @Column(nullable = false, length = 90)
    private String loginId;

    @Column(nullable = false, length = 90)
    private String loginPw;

    @Column(nullable = false, length = 30)
    private String name;

    @Column(nullable = false, length = 60)
    private String phone;

    @Column(nullable = false, length = 100)
    private String roadAddressName;

    @Column(nullable = false, length = 100)
    private String detailAddress;

    @Column(nullable = false)
    private int point;

    private int budget;
}
