package com.jan.financeappbackend.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class RegisterRequest {
  @NotBlank @Email private String email;

  @NotBlank
  @Size(min = 8, message = "Password must be at least 6 characters")
  private String password;

  @NotBlank private String role;
}
