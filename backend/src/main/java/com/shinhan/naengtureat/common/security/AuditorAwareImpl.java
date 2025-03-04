package com.shinhan.naengtureat.common.security;

import org.springframework.data.domain.AuditorAware;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.Optional;

public class AuditorAwareImpl implements AuditorAware<String> {
    @Override
    public Optional<String> getCurrentAuditor() {
        return Optional.of("system");

        /* springSecurity 도입 후 설정
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            if (authentication == null || !authentication.isAuthenticated()) {
                return Optional.of("system");  // 기본값 "system"을 반환하여 오류 방지
            }
            return Optional.of(authentication.getName());
        } catch (Exception e) {
            return Optional.of("system");  // 예외 발생 시 기본값 반환
        }
        */
    }
}
