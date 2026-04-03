package com.jan.financeappbackend.security;

import com.jan.financeappbackend.model.User;
import com.jan.financeappbackend.service.AuthenticationService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class OAuth2AuthenticationSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

  private final JwtService jwtService;
  private final AuthenticationService authenticationService;

  @Value("${app.oauth2.frontend-callback-url}")
  private String frontendCallbackUrl;

  @Value("${app.oauth2.frontend-login-url}")
  private String frontendLoginUrl;

  @Override
  public void onAuthenticationSuccess(
      HttpServletRequest request, HttpServletResponse response, Authentication authentication)
      throws IOException {
    if (!(authentication instanceof OAuth2AuthenticationToken)) {
      response.sendRedirect(frontendLoginUrl + "?error=oauth_invalid");
      return;
    }

    OAuth2User oauthUser = ((OAuth2AuthenticationToken) authentication).getPrincipal();
    String email = oauthUser.getAttribute("email");
    Boolean emailVerified = oauthUser.getAttribute("email_verified");
    if (email == null || email.isBlank()) {
      response.sendRedirect(frontendLoginUrl + "?error=oauth_missing_email");
      return;
    }
    if (Boolean.FALSE.equals(emailVerified)) {
      response.sendRedirect(frontendLoginUrl + "?error=oauth_unverified_email");
      return;
    }

    User user = authenticationService.findOrCreateUserFromGoogle(email.trim());

    String token = jwtService.generateToken(user);
    String redirectUrl =
        frontendCallbackUrl
            + "?token="
            + URLEncoder.encode(token, StandardCharsets.UTF_8);
    response.sendRedirect(redirectUrl);
  }
}
