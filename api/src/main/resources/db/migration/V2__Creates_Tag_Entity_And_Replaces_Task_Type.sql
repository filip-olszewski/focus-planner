-- 1. Create the new 'tags' table including BaseEntity fields
CREATE TABLE tags (
    -- BaseEntity fields
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE,
    version BIGINT NOT NULL DEFAULT 0,

    -- Tag fields
    slug VARCHAR(255) NOT NULL UNIQUE,
    value VARCHAR(255) NOT NULL,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE
);

-- 2. Create the Many-to-Many join table 'task_tags'
CREATE TABLE task_tags (
    task_id UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
    tag_id UUID NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
    PRIMARY KEY (task_id, tag_id)
);

-- ==========================================
-- DATA MIGRATION: Preserve existing types
-- ==========================================

-- 3. Extract unique 'types' and auto-generate the slug for them
INSERT INTO tags (value, slug, user_id, created_at, version)
SELECT DISTINCT
    type,
    LOWER(REPLACE(type, ' ', '-')), -- Converts "Side Project" to "side-project"
    user_id,
    NOW(),
    0
FROM tasks
WHERE type IS NOT NULL AND type != '';

-- 4. Link the existing tasks to their newly created tags
INSERT INTO task_tags (task_id, tag_id)
SELECT t.id, tg.id
FROM tasks t
JOIN tags tg ON t.type = tg.value AND t.user_id = tg.user_id;

-- ==========================================
-- CLEANUP: Remove the old string column
-- ==========================================

-- 5. Drop the old 'type' column
ALTER TABLE tasks DROP COLUMN type;