package com.jan.financeappbackend.jwt;

import com.jan.financeappbackend.model.Role;
import com.jan.financeappbackend.model.User;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.test.context.support.WithSecurityContextFactory;
import org.springframework.stereotype.Component;

import java.util.Collection;
import java.util.List;

@Component
public class WithMockJwtUserSecurityContextFactory implements WithSecurityContextFactory<WithMockJwtUser> {

    @Override
    public SecurityContext createSecurityContext(WithMockJwtUser annotation) {
        SecurityContext context = SecurityContextHolder.createEmptyContext();

        User mockUser = createMockUser(annotation);

        Collection<SimpleGrantedAuthority> authorities = List.of(
                new SimpleGrantedAuthority("ROLE_" + annotation.role())
        );

        UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                mockUser, null, authorities);

        context.setAuthentication(authToken);
        return context;
    }

    private User createMockUser(WithMockJwtUser annotation) {
        User user = new User();
        user.setId(annotation.userId());
        user.setEmail(annotation.username());
        user.setRole(Role.valueOf(annotation.role()));

        // Set other required fields for UserDetails implementation
        // Adjust these based on your User entity
        return user;
    }
}