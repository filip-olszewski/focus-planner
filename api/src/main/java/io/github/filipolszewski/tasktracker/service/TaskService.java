package io.github.filipolszewski.tasktracker.service;

import io.github.filipolszewski.tasktracker.controller.dto.CreateTaskRequest;
import io.github.filipolszewski.tasktracker.controller.dto.TaskResponse;
import io.github.filipolszewski.tasktracker.controller.dto.UpdateTaskRequest;
import io.github.filipolszewski.tasktracker.domain.Tag;
import io.github.filipolszewski.tasktracker.domain.Task;
import io.github.filipolszewski.tasktracker.domain.User;
import io.github.filipolszewski.tasktracker.domain.exception.UserNotFoundException;
import io.github.filipolszewski.tasktracker.repository.TagRepository;
import io.github.filipolszewski.tasktracker.repository.TaskRepository;
import io.github.filipolszewski.tasktracker.repository.UserRepository;
import io.github.filipolszewski.tasktracker.repository.mapper.TaskMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Limit;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class TaskService {

    private final TaskRepository taskRepository;
    private final UserRepository userRepository;
    private final TagRepository tagRepository; // <-- Inject TagRepository
    private final TaskMapper taskMapper;

    // Helper method to keep code DRY
    private User getCurrentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new UserNotFoundException(email));
    }

    @Transactional
    public UUID createTask(CreateTaskRequest request) {
        User user = getCurrentUser();

        Task task = taskMapper.toEntity(request, user);
        task.setIsCompleted(false);

        // Fetch the tags from the DB and attach them
        if (request.tagIds() != null && !request.tagIds().isEmpty()) {
            Set<Tag> tags = tagRepository.findByIdInAndUser(request.tagIds(), user);
            task.setTags(new HashSet<>(tags));
        }

        return taskRepository.save(task).getId();
    }

    public List<TaskResponse> getTasksInRange(Instant startDate, Instant endDate, List<UUID> tags) {
        User user = getCurrentUser();

        boolean filterByTags = tags != null && !tags.isEmpty();
        List<UUID> safeTags = filterByTags ? tags : List.of(UUID.randomUUID());

        return taskRepository.findAllTasksInRange(user, startDate, endDate, filterByTags, safeTags).stream()
                .map(taskMapper::toResponse)
                .toList();
    }

    public List<TaskResponse> getUpcomingTasks(int limit) {
        User user = getCurrentUser();
        return taskRepository.findUpcoming(user, Instant.now(), Limit.of(Math.min(limit, 32)))
                .stream()
                .map(taskMapper::toResponse)
                .toList();
    }

    @Transactional
    public TaskResponse updateTask(UUID id, UpdateTaskRequest request) {
        User user = getCurrentUser();

        Task task = taskRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new RuntimeException("Task not found"));

        if (request.name() != null) {
            task.setName(request.name());
        }
        if (request.dueDate() != null) {
            task.setDueDate(request.dueDate());
        }
        if (request.severity() != null) {
            task.setSeverity(request.severity());
        }

        // Handle updating tags
        if (request.tagIds() != null) {
            Set<Tag> tags = tagRepository.findByIdInAndUser(request.tagIds(), user);
            task.setTags(new HashSet<>(tags));
        }

        Task saved = taskRepository.save(task);
        return taskMapper.toResponse(saved);
    }

    @Transactional
    public TaskResponse completeTask(UUID id) {
        User user = getCurrentUser();
        Task task = taskRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new RuntimeException("Task not found"));

        task.setIsCompleted(true);
        return taskMapper.toResponse(taskRepository.save(task));
    }

    @Transactional
    public TaskResponse uncompleteTask(UUID id) {
        User user = getCurrentUser();
        Task task = taskRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new RuntimeException("Task not found"));

        task.setIsCompleted(false);
        return taskMapper.toResponse(taskRepository.save(task));
    }

    @Transactional
    public void deleteTask(UUID id) {
        User user = getCurrentUser();
        Task task = taskRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new RuntimeException("Task not found"));

        taskRepository.delete(task);
    }
}
