package io.github.filipolszewski.tasktracker.controller;

import io.github.filipolszewski.tasktracker.controller.dto.LoginRequest;
import io.github.filipolszewski.tasktracker.controller.dto.LoginResponse;
import io.github.filipolszewski.tasktracker.controller.dto.RegisterRequest;
import io.github.filipolszewski.tasktracker.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/auth")
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    public LoginResponse register(@RequestBody @Valid RegisterRequest request) {
        return authService.register(request);
    }

    @PostMapping("/login")
    @ResponseStatus(HttpStatus.OK)
    public LoginResponse login(@RequestBody @Valid LoginRequest request) {
        return authService.login(request);
    }

}
