package io.github.filipolszewski.tasktracker.domain;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(
    name = "tags",
    uniqueConstraints = @UniqueConstraint(columnNames = {"slug", "user_id"})
)
@Setter
@Getter
@NoArgsConstructor
public class Tag extends BaseEntity {
    @NotBlank
    @Column(nullable = false)
    private String slug;

    @NotBlank
    @Column(nullable = false)
    private String value;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(nullable = false, name = "user_id")
    private User user;
}
