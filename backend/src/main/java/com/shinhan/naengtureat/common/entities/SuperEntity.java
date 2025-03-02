package com.shinhan.naengtureat.common.entities;

import jakarta.persistence.Column;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.MappedSuperclass;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.CreatedBy;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedBy;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@MappedSuperclass
@EntityListeners(AuditingEntityListener.class)
@Getter
@Setter
public class SuperEntity {

    @CreatedDate
    @Column(updatable = false)
    private LocalDateTime regDate;

    @LastModifiedDate
    private LocalDateTime updateDate;

    /**
     * {@code @CreatedBy},  {@code @LastModifiedBy}:
     * springSecurity를 통해 현재 로그인한 사용자 정보 기록
     */
    @CreatedBy
    @Column(updatable = false)
    private String regWriter;

    @LastModifiedBy
    private String updateWriter;
}
