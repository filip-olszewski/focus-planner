package io.github.filipolszewski.tasktracker.controller.dto;

import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.time.Instant;
import java.util.Set;
import java.util.UUID;

public record CreateTaskRequest(
    @NotBlank String name,
    @NotNull Instant dueDate,
    @NotNull Set<UUID> tagIds,
    @NotNull @Positive Integer severity
) {
}
