package io.github.filipolszewski.tasktracker.repository.mapper;

import io.github.filipolszewski.tasktracker.controller.dto.CreateTaskRequest;
import io.github.filipolszewski.tasktracker.controller.dto.TaskResponse;
import io.github.filipolszewski.tasktracker.domain.Task;
import io.github.filipolszewski.tasktracker.domain.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(config = AppMapperConfig.class, uses = {TagMapper.class})
public interface TaskMapper {
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "version", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "user", source = "user")
    @Mapping(target = "isCompleted", ignore = true)
    @Mapping(target = "tags", ignore = true)
    Task toEntity(CreateTaskRequest request, User user);

    @Mapping(target = "userId", source = "user.id")
    TaskResponse toResponse(Task task);
}
