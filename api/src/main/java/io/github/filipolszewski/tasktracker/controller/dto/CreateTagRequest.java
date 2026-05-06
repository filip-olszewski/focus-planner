package io.github.filipolszewski.tasktracker.controller.dto;

import jakarta.validation.constraints.NotBlank;

public record CreateTagRequest(
    @NotBlank String value
) {
}
