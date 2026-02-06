package com.jan.financeappbackend.jwt;

import org.springframework.security.test.context.support.WithSecurityContext;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Target({ElementType.METHOD, ElementType.TYPE})
@Retention(RetentionPolicy.RUNTIME)
@WithSecurityContext(factory = WithMockJwtUserSecurityContextFactory.class)
public @interface WithMockJwtUser {
    String username() default "john.doe@email.com";
    String role() default "USER";
    long userId() default 1L;
}