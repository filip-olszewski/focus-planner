package io.github.filipolszewski.tasktracker.security;

import io.github.filipolszewski.tasktracker.domain.User;
import io.github.filipolszewski.tasktracker.domain.exception.UserNotFoundException;
import io.github.filipolszewski.tasktracker.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UserNotFoundException(email));

        return new CustomUserDetails(
            user.getEmail(),
            user.getPassword(),
            List.of(new SimpleGrantedAuthority(user.getRole().toString()))
        );
    }
}
