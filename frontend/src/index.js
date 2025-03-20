import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import reportWebVitals from "./reportWebVitals";
import AppRouter from "routes/appRouter";
import {BrowserRouter} from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import { messaging } from "config/firebaseConfig";
import { onMessage } from "firebase/messaging";



const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <AppRouter />
    </BrowserRouter>
  </React.StrictMode>
);

// 서비스 워커 등록 (PWA 적용)
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/service-worker.js")
      .then((registration) => {
      })
      .catch((error) => {
        console.log("Service Worker 등록 실패:", error);
      });
  });
}

// Firebase 푸시 알림 서비스 워커 등록 (추가된 코드)
if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("/firebase-messaging-sw.js")
    .then((registration) => {
    })
    .catch((err) => {
      console.log("Firebase 서비스 워커 등록 실패:", err);
    });
}

// 포그라운드 메시지 처리
onMessage(messaging, (payload) => {
  console.log("포그라운드 메시지 수신:", payload);
  new Notification(payload.notification.title, {
    body: payload.notification.body
  });
});
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();