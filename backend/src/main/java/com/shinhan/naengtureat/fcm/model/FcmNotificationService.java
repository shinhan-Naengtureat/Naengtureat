package com.shinhan.naengtureat.fcm.model;

import com.google.firebase.messaging.*;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.concurrent.ExecutionException;

@Service
@Slf4j
public class FcmNotificationService {
    @Autowired
    private StringRedisTemplate redisTemplate;

    @Autowired
    private RestTemplate restTemplate = new RestTemplate();

    private static final String FCM_API_URL = "https://fcm.googleapis.com/fcm/send";

    public FcmNotificationService(StringRedisTemplate redisTemplate) {
        this.redisTemplate = redisTemplate;
    }

    //FCM 푸시 알림 전송 메서드
    public void sendNotification(Long userId, String title, String body, String token) {
        Message message = Message.builder()
                .setToken(token)
                .setNotification(Notification.builder()
                        .setTitle(title)
                        .setBody(body)
                        .build())
                .build();

        try {
            String response = FirebaseMessaging.getInstance().sendAsync(message).get();
            log.info("푸시 알림 전송 성공: " + response);
        } catch (InterruptedException | ExecutionException e) {
            log.info("푸시 알림 전송 실패: " + e);
        }
    }
}
