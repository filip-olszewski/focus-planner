package io.github.filipolszewski.tasktracker.config;

import io.github.filipolszewski.tasktracker.domain.User;
import io.github.filipolszewski.tasktracker.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.time.Instant;

@Configuration
@RequiredArgsConstructor
public class MockUserConfig {

    private final UserRepository userRepository;

    @Bean
    public CommandLineRunner seedDatabase() {
        return args -> {
            if (userRepository.count() == 0) {
                User mockUser = new User();
                mockUser.setUsername("dev_user");
                mockUser.setEmail("dev@example.com");
                mockUser.setPassword("password");

                userRepository.save(mockUser);
                System.out.println("Mock user created: " + mockUser.getId());
            }
        };
    }
}