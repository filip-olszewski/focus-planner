package io.github.filipolszewski.tasktracker.repository;

import io.github.filipolszewski.tasktracker.domain.Task;
import io.github.filipolszewski.tasktracker.domain.User;
import org.springframework.data.domain.Limit;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface TaskRepository extends JpaRepository<Task, UUID> {
    @Query("""
    SELECT t FROM Task t
    LEFT JOIN t.tags tag
    WHERE (
        t.user = :user AND
        t.dueDate BETWEEN :startDate AND :endDate AND
        (:filterByTags = false OR tag.id IN :tagIds)
    )
    """)
    List<Task> findAllTasksInRange(
        User user,
        Instant startDate,
        Instant endDate,
        boolean filterByTags,
        List<UUID> tagIds
    );

    @Query("""
    SELECT t FROM Task t
    WHERE (
        t.user = :user AND
        t.isCompleted = false AND
        t.dueDate >= :now
    )
    ORDER BY t.dueDate ASC
    """)
    List<Task> findUpcoming(User user, Instant now, Limit limit);

    Optional<Task> findByIdAndUser(UUID id, User user);
}
