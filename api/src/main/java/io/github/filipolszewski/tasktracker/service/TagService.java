package io.github.filipolszewski.tasktracker.service;

import com.github.slugify.Slugify;
import io.github.filipolszewski.tasktracker.controller.dto.CreateTagRequest;
import io.github.filipolszewski.tasktracker.controller.dto.TagResponse;
import io.github.filipolszewski.tasktracker.domain.Tag;
import io.github.filipolszewski.tasktracker.domain.User;
import io.github.filipolszewski.tasktracker.domain.exception.UserNotFoundException;
import io.github.filipolszewski.tasktracker.repository.mapper.TagMapper;
import io.github.filipolszewski.tasktracker.repository.TagRepository;
import io.github.filipolszewski.tasktracker.repository.UserRepository;
import io.github.filipolszewski.tasktracker.repository.mapper.TagMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class TagService {

    private final TagRepository tagRepository;
    private final UserRepository userRepository;

    // Injecting our new tools!
    private final TagMapper tagMapper;
    private final Slugify slugify;

    private User getCurrentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new UserNotFoundException(email));
    }

    public List<TagResponse> getAllTags() {
        User user = getCurrentUser();

        return tagRepository.findAllByUser(user)
                .stream()
                .map(tagMapper::toResponse) // Using MapStruct
                .toList();
    }

    @Transactional
    public TagResponse createTag(CreateTagRequest request) {
        User user = getCurrentUser();

        // Using Slugify instead of manual regex
        String slug = slugify.slugify(request.value());

        if (tagRepository.existsBySlugAndUser(slug, user)) {
            throw new IllegalArgumentException("A tag with this name already exists.");
        }

        Tag tag = new Tag();
        tag.setValue(request.value().trim());
        tag.setSlug(slug);
        tag.setUser(user);

        Tag savedTag = tagRepository.save(tag);
        return tagMapper.toResponse(savedTag); // Using MapStruct
    }

    @Transactional
    public void deleteTag(UUID tagId) {
        User user = getCurrentUser();

        Tag tag = tagRepository.findById(tagId)
                .orElseThrow(() -> new RuntimeException("Tag not found"));

        if (!tag.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized to delete this tag");
        }

        tagRepository.delete(tag);
    }
}