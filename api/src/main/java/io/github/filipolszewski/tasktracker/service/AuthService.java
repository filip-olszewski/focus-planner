package io.github.filipolszewski.tasktracker.service;

import io.github.filipolszewski.tasktracker.controller.dto.LoginRequest;
import io.github.filipolszewski.tasktracker.controller.dto.LoginResponse;
import io.github.filipolszewski.tasktracker.controller.dto.RegisterRequest;
import io.github.filipolszewski.tasktracker.domain.User;
import io.github.filipolszewski.tasktracker.domain.UserRole;
import io.github.filipolszewski.tasktracker.domain.exception.UserAlreadyExistsException;
import io.github.filipolszewski.tasktracker.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AuthService {

    private final AuthenticationManager authManager;
    private final TokenService tokenService;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Transactional
    public LoginResponse login(LoginRequest request) {
        Authentication authentication = authenticate(request.email(), request.password());

        String token = tokenService.generateToken(authentication);
        return new LoginResponse(token);
    }

    @Transactional
    public LoginResponse register(RegisterRequest request) {
        if(userRepository.existsByEmail(request.email())) {
            throw new UserAlreadyExistsException(request.email());
        }

        User user = createUser(request);
        userRepository.save(user);

        Authentication authentication = authenticate(request.email(), request.password());
        String token = tokenService.generateToken(authentication);

        return new LoginResponse(token);
    }

    Authentication authenticate(String email, String password) {
        return authManager.authenticate(new UsernamePasswordAuthenticationToken(email, password));
    }

    User createUser(RegisterRequest request) {
        User user = new User();
        user.setEmail(request.email());
        user.setUsername(request.username());
        user.setRole(UserRole.USER);
        user.setPassword(passwordEncoder.encode(request.password()));
        return user;
    }

}
