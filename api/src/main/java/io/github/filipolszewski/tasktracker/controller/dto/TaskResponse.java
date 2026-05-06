package io.github.filipolszewski.tasktracker.controller.dto;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

public record TaskResponse(
    UUID id,
    String name,
    Instant dueDate,
    List<TagResponse> tags,
    Integer severity,
    Boolean isCompleted,
    UUID userId
) {
}
