package com.jan.financeappbackend.security;

import com.jan.financeappbackend.repository.UserRepository;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Objects;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

  private final JwtService jwtService;
  private final UserRepository userRepository;

  @Override
  protected void doFilterInternal(
      @NonNull HttpServletRequest request,
      @NonNull HttpServletResponse response,
      @NonNull FilterChain filterChain)
      throws ServletException, IOException {
    final String authHeader = request.getHeader("Authorization");
    final String jwt;

    if (Objects.isNull(authHeader) || !authHeader.startsWith("Bearer")) {
      filterChain.doFilter(request, response);
      return;
    }
    jwt = authHeader.substring(7);
    String subject = jwtService.extractSubject(jwt);
    if (subject != null
        && !subject.isBlank()
        && SecurityContextHolder.getContext().getAuthentication() == null) {
      try {
        UserDetails userDetails = loadUserForJwtSubject(subject);
        if (jwtService.isTokenValid(jwt, userDetails)) {
          UsernamePasswordAuthenticationToken authToken =
              new UsernamePasswordAuthenticationToken(
                  userDetails, null, userDetails.getAuthorities());
          authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
          SecurityContextHolder.getContext().setAuthentication(authToken);
        }
      } catch (UsernameNotFoundException ignored) {
      }
    }
    filterChain.doFilter(request, response);
  }

  private UserDetails loadUserForJwtSubject(String subject) {
    try {
      long id = Long.parseLong(subject);
      return userRepository
          .findById(id)
          .orElseThrow(() -> new UsernameNotFoundException("User not found"));
    } catch (NumberFormatException e) {
      return userRepository
          .findByEmail(subject)
          .orElseThrow(() -> new UsernameNotFoundException("User not found"));
    }
  }
}
