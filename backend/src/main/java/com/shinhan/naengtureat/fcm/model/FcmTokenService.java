package com.shinhan.naengtureat.fcm.model;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

@Service
public class FcmTokenService {

    @Autowired
    private StringRedisTemplate redisTemplate;

    //FCM토큰 저장(유효기간 없음)
    public void saveToken(Long userId, String token) {
        redisTemplate.opsForValue().set("fcm_token: " + userId, token);
    }

    //사용자 FCM 토큰 조회
    public String getToken(Long userId) {
        return redisTemplate.opsForValue().get("fcm_token: " + userId);
    }

    //사용자 FCM 토큰 삭제
    public void deleteToken(Long userId) {
        redisTemplate.delete("fcm_token: " + userId);
    }
}
