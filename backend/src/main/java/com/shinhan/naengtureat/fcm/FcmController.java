package com.shinhan.naengtureat.fcm;

import com.shinhan.naengtureat.common.response.BaseResponse;
import com.shinhan.naengtureat.fcm.dto.FcmNotificationRequestDto;
import com.shinhan.naengtureat.fcm.dto.FcmTokenRequestDto;
import com.shinhan.naengtureat.fcm.model.FcmNotificationService;
import com.shinhan.naengtureat.fcm.model.FcmTokenService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/fcm")
public class FcmController {

    @Autowired
    private FcmTokenService fcmTokenService;

    @Autowired
    private FcmNotificationService fcmNotificationService;

    //FCM 토큰 저장 API
    @PostMapping("/token")
    public ResponseEntity<Object> saveToken(@RequestBody FcmTokenRequestDto fcmTokenRequestDto) {
        System.out.println("✅ Redis에 FCM 토큰 저장 시도: userId=" + fcmTokenRequestDto.getUserId()
                + ", token=" + fcmTokenRequestDto.getToken());
        fcmTokenService.saveToken(fcmTokenRequestDto.getUserId(), fcmTokenRequestDto.getToken());
        return ResponseEntity.ok(BaseResponse.builder().message("FCM 토큰 저장 완료!").build());
    }

    //FCM 토큰 조회 API
    @GetMapping("/token/{userId}")
    public ResponseEntity<Object> getToken(@PathVariable("userId") Long userId) {
        String token = fcmTokenService.getToken(userId);
        return token != null
                ? ResponseEntity.ok(token)
                : ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(BaseResponse.builder().message("토큰을 찾을 수 없습니다.").build());
    }

    //FCM 토큰 삭제 API
    @DeleteMapping("/token/{userId}")
    public ResponseEntity<Object> deleteToken(@PathVariable("userId") Long userId) {
        fcmTokenService.deleteToken(userId);
        return ResponseEntity.ok(BaseResponse.builder().message("FCM 토큰 삭제 완료").build());
    }

    @PostMapping("/notification")
    public ResponseEntity<Object> sendNotification(
            @RequestBody FcmNotificationRequestDto requestDto) {
        String token = fcmTokenService.getToken(requestDto.getUserId());

        if (token == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(BaseResponse.builder().message("해당 userId에 대한 FCM 토큰이 없습니다.").build());
        }

        fcmNotificationService.sendNotification(requestDto.getUserId(), requestDto.getTitle(), requestDto.getBody(), token);
        return ResponseEntity.ok(BaseResponse.builder().message("푸시 알림 전송 완료!"));
    }
}
