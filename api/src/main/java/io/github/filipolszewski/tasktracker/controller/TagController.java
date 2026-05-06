package io.github.filipolszewski.tasktracker.controller;

import io.github.filipolszewski.tasktracker.controller.dto.CreateTagRequest;
import io.github.filipolszewski.tasktracker.controller.dto.TagResponse;
import io.github.filipolszewski.tasktracker.service.TagService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/tags")
@RequiredArgsConstructor
public class TagController {

    private final TagService tagService;

    @GetMapping
    public List<TagResponse> getAllTags() {
        return tagService.getAllTags();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public TagResponse createTag(@Valid @RequestBody CreateTagRequest request) {
        return tagService.createTag(request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteTag(@PathVariable UUID id) {
        tagService.deleteTag(id);
    }
}