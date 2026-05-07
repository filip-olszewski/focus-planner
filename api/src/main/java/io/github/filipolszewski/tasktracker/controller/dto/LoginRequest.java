package io.github.filipolszewski.tasktracker.controller.dto;

import jakarta.validation.constraints.NotBlank;

public record LoginRequest(
    @NotBlank String email,
    @NotBlank String password
) {
}
