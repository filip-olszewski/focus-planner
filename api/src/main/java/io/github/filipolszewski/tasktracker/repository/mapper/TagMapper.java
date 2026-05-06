package io.github.filipolszewski.tasktracker.repository.mapper;

import io.github.filipolszewski.tasktracker.controller.dto.TagResponse;
import io.github.filipolszewski.tasktracker.domain.Tag;
import org.mapstruct.Mapper;

@Mapper(config = AppMapperConfig.class)
public interface TagMapper {
    TagResponse toResponse(Tag tag);
}
