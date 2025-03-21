import { useEffect } from "react";
import { getToken, onMessage } from "firebase/messaging";
import { messaging } from "config/firebaseConfig";
import axiosInstance from "api/axios";

const useFirebasePush = (userId, onReceive) => {
  useEffect(() => {
    if (!("Notification" in window)) return;

    Notification.requestPermission().then((permission) => {
      if (permission === "granted") {
        getToken(messaging, {vapidKey: process.env.REACT_APP_FIREBASE_VAPID_KEY})
          .then((currentToken) => {
            if (currentToken) {
              axiosInstance.post("/fcm/token", {
                userId: userId,
                token: currentToken
              })
                .then((res) => console.log("FCM 토큰 저장 완료", res.data))
                .catch((err) => console.error("FCM 토큰 저장 실패", err));
            }
          })
          .catch((err) => console.error("FCM 토큰 가져오기 실패:", err));
      }
    });
  });


  useEffect(() => {
    const unsubscribe = onMessage(messaging, (payload) => {
      console.log("🔥 메시지 수신:", payload);

      if (typeof onReceive === "function") {
        onReceive(payload.notification); // ✅ 안전하게 호출
      } else {
        console.warn("⚠️ onReceive 콜백이 정의되지 않았습니다.");
      }
    });

    return () => unsubscribe();
  }, [userId, onReceive]);
}

export default useFirebasePush;