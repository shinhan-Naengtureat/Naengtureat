package com.shinhan.naengtureat.fcm.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FcmNotificationRequestDto {
    private Long userId;
    private String title;
    private String body;
}
