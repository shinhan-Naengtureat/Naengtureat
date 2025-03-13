// src/api/axios.js
import axios from "axios";
import { API_PATH } from "config/pathConfig"

// axios 인스턴스 생성
const axiosInstance = axios.create({
  baseURL: `${API_PATH}`, // 공통된 기본 URL
  headers: {
    "Content-Type": "application/json", // 기본 헤더 설정
  },
  timeout: 5000, // 타임아웃 시간 설정 (예: 5초)
});

// 필요에 따라 요청/응답 인터셉터 추가
axiosInstance.interceptors.request.use(
  (config) => {
    // 요청 전 처리 (예: 인증 토큰 추가)
    const token = localStorage.getItem("token"); // 예시로 로컬 스토리지에서 토큰 가져오기
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // 응답 오류 처리
    if (error.response && error.response.status === 401) {
      // 예시: 401 에러 처리 (토큰 만료 등)
      console.error("Authentication error", error);
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
