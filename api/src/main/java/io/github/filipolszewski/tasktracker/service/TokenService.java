package io.github.filipolszewski.tasktracker.service;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.jwt.JwtClaimsSet;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.JwtEncoderParameters;
import org.springframework.stereotype.Service;

import java.time.Instant;

@Service
@RequiredArgsConstructor
public class TokenService {

    private final JwtEncoder jwtEncoder;

    @Value("${security.jwt-expiration-time}")
    private Integer expirationTime;

    @Value("${spring.application.name}")
    private String issuerName;

    public String generateToken(Authentication auth) {
        Instant now = Instant.now();

        JwtClaimsSet claims = JwtClaimsSet.builder()
                .issuer(issuerName)
                .issuedAt(now)
                .expiresAt(now.plusSeconds(expirationTime))
                .subject(auth.getName())
                .build();

        return jwtEncoder.encode(JwtEncoderParameters.from(claims)).getTokenValue();
    }

}
