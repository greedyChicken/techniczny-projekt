package com.jan.financeappbackend.security;

import com.jan.financeappbackend.model.User;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

@Service
public class JwtService {
  private static final String SECRET_KEY =
      "21332f71525150484659392b5242677d58597e2734475c2054592c6754";
  private static final long JWT_EXPIRATION = 86400000;

  public String extractSubject(String token) {
    return extractClaim(token, Claims::getSubject);
  }

  public Long extractUserId(String token) {
    return extractClaim(token, claims -> claims.get("userId", Long.class));
  }

  public String extractRole(String token) {
    return extractClaim(token, claims -> claims.get("role", String.class));
  }

  public String extractEmailClaim(String token) {
    return extractClaim(token, claims -> claims.get("email", String.class));
  }

  private Claims extractAllClaims(String token) {
    return Jwts.parserBuilder()
        .setSigningKey(getSignInKey())
        .build()
        .parseClaimsJws(token)
        .getBody();
  }

  public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
    final Claims claims = extractAllClaims(token);
    return claimsResolver.apply(claims);
  }

  public String generateToken(UserDetails userDetails) {
    Map<String, Object> extraClaims = new HashMap<>();

    if (userDetails instanceof User user) {
      extraClaims.put("userId", user.getId());
      extraClaims.put("role", user.getRole().name());
      extraClaims.put("email", user.getEmail());
      extraClaims.put("registeredViaGoogle", user.isRegisteredViaGoogle());
    }

    return generateToken(extraClaims, userDetails);
  }

  public String generateToken(Map<String, Object> extraClaims, UserDetails userDetails) {
    String subject;
    if (userDetails instanceof User user) {
      subject = String.valueOf(user.getId());
    } else {
      subject = userDetails.getUsername();
    }

    return Jwts.builder()
        .setClaims(extraClaims)
        .setSubject(subject)
        .setIssuedAt(new Date(System.currentTimeMillis()))
        .setExpiration(new Date(System.currentTimeMillis() + JWT_EXPIRATION))
        .signWith(getSignInKey(), SignatureAlgorithm.HS256)
        .compact();
  }

  public boolean isTokenValid(String token, UserDetails userDetails) {
    if (!(userDetails instanceof User user)) {
      return false;
    }
    String subject = extractSubject(token);
    try {
      long idFromToken = Long.parseLong(subject);
      if (idFromToken != user.getId()) {
        return false;
      }
    } catch (NumberFormatException e) {
      if (!subject.equals(user.getEmail())) {
        return false;
      }
    }
    return !isTokenExpired(token);
  }

  private boolean isTokenExpired(String token) {
    try {
      Date expiration = extractExpiration(token);
      return expiration != null && expiration.before(new Date());
    } catch (Exception e) {
      return true;
    }
  }

  private Date extractExpiration(String token) {
    return extractClaim(token, Claims::getExpiration);
  }

  private Key getSignInKey() {
    byte[] keyBytes = Decoders.BASE64.decode(SECRET_KEY);
    return Keys.hmacShaKeyFor(keyBytes);
  }
}
