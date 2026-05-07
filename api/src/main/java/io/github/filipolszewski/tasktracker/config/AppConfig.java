package io.github.filipolszewski.tasktracker.config;

import com.github.slugify.Slugify;
import io.github.filipolszewski.tasktracker.config.properties.RSAKeyPair;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@Configuration
@EnableJpaAuditing
@EnableConfigurationProperties(RSAKeyPair.class)
public class AppConfig {

    @Bean
    public Slugify slugify() {
        return Slugify.builder().build();
    }
}
