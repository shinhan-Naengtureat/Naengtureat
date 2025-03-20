import React, {useEffect, useState} from 'react';
import { getToken, onMessage } from "firebase/messaging"
import { messaging } from "config/firebaseConfig";
import axiosInstance from "api/axios";

const UseFirebasePush = (userId) => {
  const [token, setToken] = useState(null);

  useEffect(() => {
    // 현재 알림 권한 확인
    if (Notification.permission === "denied") {
      // 알림 권한이 차단된 경우, 설정 페이지로 이동할지 물어보기
      const userConfirmed = window.confirm(
        "⚠️ 알림이 차단되어 있습니다. 알림을 받으려면 브라우저 설정에서 허용해야 합니다.\n" +
        "지금 설정 페이지로 이동할까요?"
      );

      if (userConfirmed) {
        // 사용자가 확인을 눌렀다면 알림 설정 페이지로 이동
        window.open("chrome://settings/content/notifications", "_blank");
      }
      return;
    }

    Notification.requestPermission().then((permission) => {
      if (permission === "granted") {
        getToken(messaging, { vapidKey: process.env.REACT_APP_FIREBASE_VAPID_KEY })
          .then((currentToken) => {
            if (currentToken) {
              setToken(currentToken);

              // 백엔드로 FCM 토큰 전송
              axiosInstance.post("/fcm/token", {
                userId: userId,
                token: currentToken
              })
                .then(response => console.log("FCM 토큰 저장 완료", response.data))
                .catch(error => console.log("FCM 토큰 저장 실패: ", error));
            } else {
              console.log("FCM 토큰이 반환되지 않음.");
            }
          })
          .catch((err) => console.error("FCM 토큰 가져오기 실패:", err));
      } else {
        console.warn("사용자가 알림 권한을 거부함.");
      }
    });

    //포그라우드 메시지 수신 (앱이 실행 중일 때)
    onMessage(messaging, (payload) => {
      console.log("포그라운드 메세지 수진: ", payload);
      new Notification(payload.notification.title, {
        body: payload.notification.body
      });
    });
  }, [userId]);

  return token;
};

export default UseFirebasePush;