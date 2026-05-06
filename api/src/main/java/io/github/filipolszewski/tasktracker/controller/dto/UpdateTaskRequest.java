package io.github.filipolszewski.tasktracker.controller.dto;

import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.Positive;

import java.time.Instant;
import java.util.Set;
import java.util.UUID;

public record UpdateTaskRequest(
    String name,
    Instant dueDate,
    Set<UUID> tagIds,
    @Positive Integer severity
) {
}
