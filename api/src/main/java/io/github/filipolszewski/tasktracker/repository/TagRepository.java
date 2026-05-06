package io.github.filipolszewski.tasktracker.repository;

import io.github.filipolszewski.tasktracker.domain.Tag;
import io.github.filipolszewski.tasktracker.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Set;
import java.util.UUID;

@Repository
public interface TagRepository extends JpaRepository<Tag, UUID> {
    List<Tag> findAllByUser(User user);
    boolean existsBySlugAndUser(String slug, User user);
    Set<Tag> findByIdInAndUser(Set<UUID> ids, User user);
}
