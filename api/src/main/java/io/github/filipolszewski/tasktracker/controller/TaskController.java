package io.github.filipolszewski.tasktracker.controller;

import io.github.filipolszewski.tasktracker.controller.dto.CreateTaskRequest;
import io.github.filipolszewski.tasktracker.controller.dto.TaskResponse;
import io.github.filipolszewski.tasktracker.controller.dto.UpdateTaskRequest;
import io.github.filipolszewski.tasktracker.service.TaskService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/tasks")
@RequiredArgsConstructor
public class TaskController {

    private final TaskService taskService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    UUID createTask(@RequestBody @Valid CreateTaskRequest request) {
        return taskService.createTask(request);
    }

    @GetMapping
    public List<TaskResponse> getTasksInRange(
            @RequestParam Instant startDate,
            @RequestParam Instant endDate,
            @RequestParam(required = false) List<UUID> tags
    ) {
        return taskService.getTasksInRange(startDate, endDate, tags);
    }

    @GetMapping("/upcoming")
    List<TaskResponse> getUpcomingTasks(@RequestParam int limit) {
        return taskService.getUpcomingTasks(limit);
    }

    @PutMapping("/{id}")
    TaskResponse updateTask(
        @PathVariable UUID id,
        @RequestBody @Valid UpdateTaskRequest request
    ) {
        return taskService.updateTask(id, request);
    }

    @PostMapping("/{id}/complete")
    TaskResponse completeTask(@PathVariable UUID id) {
        return taskService.completeTask(id);
    }

    @PostMapping("/{id}/uncomplete")
    TaskResponse uncompleteTask(@PathVariable UUID id) {
        return taskService.uncompleteTask(id);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    void deleteTask(@PathVariable UUID id) {
        taskService.deleteTask(id);
    }
}
