-- =====================================================================
-- Campus Workforce Task Management System (CWTMS)
-- MySQL Community Edition - Database Schema
-- Run this once to create the database and all tables.
-- =====================================================================

CREATE DATABASE IF NOT EXISTS cwtms_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE cwtms_db;

-- ---------------------------------------------------------------------
-- Table: users
-- Holds Admin, Supervisor, and Worker accounts. Role-based access is
-- driven entirely by the `role` column.
-- ---------------------------------------------------------------------
CREATE TABLE users (
    id              BIGINT AUTO_INCREMENT PRIMARY KEY,
    username        VARCHAR(50)  NOT NULL UNIQUE,
    password        VARCHAR(255) NOT NULL,             -- BCrypt hash, never plain text
    full_name       VARCHAR(100) NOT NULL,
    email           VARCHAR(100) NOT NULL UNIQUE,
    phone           VARCHAR(20),
    role            ENUM('ADMIN', 'SUPERVISOR', 'WORKER') NOT NULL,
    status          ENUM('ACTIVE', 'INACTIVE') NOT NULL DEFAULT 'ACTIVE',
    created_by      BIGINT NULL,                       -- admin who created this account
    created_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
                        ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_users_created_by FOREIGN KEY (created_by)
        REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE INDEX idx_users_role ON users(role);

-- ---------------------------------------------------------------------
-- Table: tasks
-- A maintenance task created by a Supervisor and (optionally at
-- creation time) assigned to a Worker.
-- ---------------------------------------------------------------------
CREATE TABLE tasks (
    id              BIGINT AUTO_INCREMENT PRIMARY KEY,
    title           VARCHAR(150) NOT NULL,
    description     TEXT,
    category        ENUM(
                        'CLASSROOM_CLEANING',
                        'LABORATORY_CLEANING',
                        'RESTROOM_CLEANING',
                        'WASTE_COLLECTION',
                        'GARDEN_MAINTENANCE',
                        'ELECTRICAL_MAINTENANCE',
                        'PLUMBING_MAINTENANCE',
                        'WATER_TANK_INSPECTION',
                        'OTHER'
                     ) NOT NULL,
    custom_category VARCHAR(100) NULL,
    priority        ENUM('LOW', 'MEDIUM', 'HIGH') NOT NULL DEFAULT 'MEDIUM',
    location        VARCHAR(150),                      -- e.g. "Block A - Room 204"
    status          ENUM(
                        'ASSIGNED',
                        'IN_PROGRESS',
                        'SUBMITTED_FOR_REVIEW',
                        'APPROVED',
                        'REJECTED',
                        'REWORK_REQUIRED'
                     ) NOT NULL DEFAULT 'ASSIGNED',
    created_by      BIGINT NOT NULL,                   -- Supervisor (FK -> users.id)
    assigned_to     BIGINT NULL,                        -- Worker (FK -> users.id)
    due_date        DATE,
    created_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
                        ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_tasks_created_by FOREIGN KEY (created_by)
        REFERENCES users(id) ON DELETE RESTRICT,
    CONSTRAINT fk_tasks_assigned_to FOREIGN KEY (assigned_to)
        REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_tasks_category ON tasks(category);
CREATE INDEX idx_tasks_assigned_to ON tasks(assigned_to);
CREATE INDEX idx_tasks_created_by ON tasks(created_by);

-- ---------------------------------------------------------------------
-- Table: task_history
-- Every status transition is logged here — this is the audit trail /
-- "task history tracking" feature, and also stores remarks attached
-- to each transition (worker remarks on submit, supervisor remarks
-- on approve/reject).
-- ---------------------------------------------------------------------
CREATE TABLE task_history (
    id              BIGINT AUTO_INCREMENT PRIMARY KEY,
    task_id         BIGINT NOT NULL,
    changed_by      BIGINT NOT NULL,
    old_status      ENUM(
                        'ASSIGNED','IN_PROGRESS','SUBMITTED_FOR_REVIEW',
                        'APPROVED','REJECTED','REWORK_REQUIRED'
                     ) NULL,
    new_status      ENUM(
                        'ASSIGNED','IN_PROGRESS','SUBMITTED_FOR_REVIEW',
                        'APPROVED','REJECTED','REWORK_REQUIRED'
                     ) NOT NULL,
    remarks         TEXT,
    changed_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_history_task FOREIGN KEY (task_id)
        REFERENCES tasks(id) ON DELETE CASCADE,
    CONSTRAINT fk_history_changed_by FOREIGN KEY (changed_by)
        REFERENCES users(id) ON DELETE RESTRICT
) ENGINE=InnoDB;

CREATE INDEX idx_history_task_id ON task_history(task_id);

-- ---------------------------------------------------------------------
-- Table: task_attachments
-- Proof images/videos uploaded by a Worker. Files live on the local
-- filesystem (e.g. backend/uploads/tasks/{taskId}/...); this table
-- only stores the path/metadata.
-- ---------------------------------------------------------------------
CREATE TABLE task_attachments (
    id              BIGINT AUTO_INCREMENT PRIMARY KEY,
    task_id         BIGINT NOT NULL,
    uploaded_by     BIGINT NOT NULL,
    file_name       VARCHAR(255) NOT NULL,
    file_path       VARCHAR(500) NOT NULL,             -- relative path on local disk
    file_type       ENUM('IMAGE', 'VIDEO') NOT NULL,
    uploaded_at     TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_attachment_task FOREIGN KEY (task_id)
        REFERENCES tasks(id) ON DELETE CASCADE,
    CONSTRAINT fk_attachment_uploaded_by FOREIGN KEY (uploaded_by)
        REFERENCES users(id) ON DELETE RESTRICT
) ENGINE=InnoDB;

CREATE INDEX idx_attachments_task_id ON task_attachments(task_id);

-- ---------------------------------------------------------------------
-- Table: notifications
-- Simple in-database notifications (no email/SMS provider needed).
-- ---------------------------------------------------------------------
CREATE TABLE notifications (
    id              BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id         BIGINT NOT NULL,                   -- recipient
    message         VARCHAR(255) NOT NULL,
    related_task_id BIGINT NULL,
    is_read         BOOLEAN NOT NULL DEFAULT FALSE,
    created_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_notifications_user FOREIGN KEY (user_id)
        REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_notifications_task FOREIGN KEY (related_task_id)
        REFERENCES tasks(id) ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_is_read ON notifications(is_read);

-- =====================================================================
-- End of schema. Next: run sample_data.sql to seed demo accounts.
-- =====================================================================
