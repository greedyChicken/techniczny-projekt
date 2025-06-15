package com.jan.financeappbackend.dto;

import lombok.Builder;

@Builder
public record UserDto(Long id, String email) {}
