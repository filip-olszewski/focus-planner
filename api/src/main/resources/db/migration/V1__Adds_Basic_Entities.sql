CREATE TABLE users (
    id           UUID PRIMARY KEY,
    created_at   TIMESTAMP WITH TIME ZONE NOT NULL,
    updated_at   TIMESTAMP WITH TIME ZONE,
    version      BIGINT,
    username     VARCHAR(255) NOT NULL,
    email        VARCHAR(255) NOT NULL UNIQUE,
    password     VARCHAR(255) NOT NULL
);

CREATE TABLE tasks (
    id           UUID PRIMARY KEY,
    created_at   TIMESTAMP WITH TIME ZONE NOT NULL,
    updated_at   TIMESTAMP WITH TIME ZONE,
    version      BIGINT,
    name         VARCHAR(255) NOT NULL,
    due_date     TIMESTAMP WITH TIME ZONE NOT NULL,
    type         VARCHAR(255) NOT NULL,
    severity     INT NOT NULL,
    is_completed BOOLEAN NOT NULL,
    user_id      UUID NOT NULL,
    CONSTRAINT fk_tasks_users FOREIGN KEY (user_id) REFERENCES users (id)
);