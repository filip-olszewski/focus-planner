package io.github.filipolszewski.tasktracker.controller.dto;

import java.util.UUID;

public record TagResponse(
    UUID id,
    String slug,
    String value
) {
}
