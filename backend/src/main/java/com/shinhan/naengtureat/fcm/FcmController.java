package com.shinhan.naengtureat.fcm;

import com.shinhan.naengtureat.fcm.model.FcmTokenService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/fcm")
public class FcmController {

    @Autowired
    private FcmTokenService fcmTokenService;

    //FCM 토큰 저장 API
    @PostMapping("/token")
    public ResponseEntity<Object> saveToken(@RequestParam Long userId, @RequestParam String token) {
        fcmTokenService.saveToken(userId, token);
        return ResponseEntity.ok("FCM 토큰 저장 완료!");
    }

    //FCM 토큰 조회 API
    @GetMapping("/token/{userId}")
    public ResponseEntity<Object> getToken(@PathVariable("userId") Long userId) {
        String token = fcmTokenService.getToken(userId);
        return token != null ? ResponseEntity.ok(token) : ResponseEntity.notFound().build();
    }

    //FCM 토큰 삭제 API
    @DeleteMapping("/token/{userId}")
    public ResponseEntity<Object> deleteToken(@PathVariable("userId") Long userId) {
        fcmTokenService.deleteToken(userId);
        return ResponseEntity.ok("FCM 토큰 삭제 완료");
    }
}
