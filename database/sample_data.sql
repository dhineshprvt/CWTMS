-- =====================================================================
-- Campus Workforce Task Management System (CWTMS)
-- Sample / Demo Data
-- Run AFTER schema.sql. Gives you working logins for your demo + viva.
--
-- All demo accounts use the password:   Password@123
-- (the hash below is a real BCrypt hash of that string, cost factor 10,
--  generated independently — it is NOT a placeholder, it will work
--  with Spring Security's BCryptPasswordEncoder out of the box)
-- =====================================================================

USE cwtms_db;

-- ---------------------------------------------------------------------
-- Users: 1 Admin, 2 Supervisors, 4 Workers
-- ---------------------------------------------------------------------
INSERT INTO users (id, username, password, full_name, email, phone, role, status, created_by) VALUES
(1, 'admin',        '$2a$10$hQy.Leq0P4RZi52RhBoOZOZCBDgzobgppCksjH7ASw8Wriy3JlKXW', 'System Administrator', 'admin@karpagamtech.ac.in',      '9000000001', 'ADMIN',      'ACTIVE', NULL),
(2, 'supervisor1',  '$2a$10$hQy.Leq0P4RZi52RhBoOZOZCBDgzobgppCksjH7ASw8Wriy3JlKXW', 'Dhineshkumar',         '23eca27@karpagamtech.ac.in',    '9000000002', 'SUPERVISOR', 'ACTIVE', 1),
(3, 'supervisor2',  '$2a$10$hQy.Leq0P4RZi52RhBoOZOZCBDgzobgppCksjH7ASw8Wriy3JlKXW', 'Gowtham',              '23eca42@karpagamtech.ac.in',    '9000000003', 'SUPERVISOR', 'ACTIVE', 1),
(4, 'supervisor3',  '$2a$10$vsIvMXbfpCAW5l/MGzcboOEJP76aLuay5Zz3WYKN5rpI.uBru3Roa', 'Nigesh',               '23csb15@karpagamtech.ac.in',    '9080773347', 'SUPERVISOR', 'ACTIVE', 1),
(5, 'worker1',      '$2a$10$hQy.Leq0P4RZi52RhBoOZOZCBDgzobgppCksjH7ASw8Wriy3JlKXW', 'Deepadharshan',        '23eca18@karpagamtech.ac.in',    '9000000005', 'WORKER',     'ACTIVE', 1),
(6, 'worker2',      '$2a$10$hQy.Leq0P4RZi52RhBoOZOZCBDgzobgppCksjH7ASw8Wriy3JlKXW', 'Gopi',                 '23eca38@karpagamtech.ac.in',    '9000000006', 'WORKER',     'ACTIVE', 1),
(9, 'worker3',      '$2a$10$EoS8osD.o7ZySl9lDR79iOyHu7tEcLlMj7qnAIcCCMr38izBlZbYG', 'Jayaprasanth',         '23eca56@karpagamtech.ac.in',    '9000000007', 'WORKER',     'ACTIVE', 1),
(10, 'worker4',     '$2a$10$Lm/qKI4w7EGpN.2ODvJXte.YCBtPPCopt1XlD70j8hESgS6BEZ4Dm', 'Preethi',              'dhinesh1434k@gmail.com',        '9000000008', 'WORKER',     'ACTIVE', 1);

-- ---------------------------------------------------------------------
-- Tasks: a mix across every status so the dashboards/reports look real
-- ---------------------------------------------------------------------
INSERT INTO tasks (id, title, description, category, location, status, created_by, assigned_to, due_date) VALUES
(1, 'Clean Room 204 after lab session',   'Wipe benches, mop floor, dispose of waste from chemistry lab.', 'LABORATORY_CLEANING',     'Block A - Room 204', 'APPROVED',             2, 5, '2026-06-10'),
(2, 'Restroom deep clean - Block B',       'Daily deep clean of ground floor restrooms.',                    'RESTROOM_CLEANING',       'Block B - Ground Floor', 'SUBMITTED_FOR_REVIEW', 2, 6, '2026-06-18'),
(3, 'Fix flickering tube light',           'Tube light in Room 105 flickers intermittently, replace ballast.', 'ELECTRICAL_MAINTENANCE', 'Block A - Room 105',  'IN_PROGRESS',          3, 9, '2026-06-19'),
(4, 'Water tank inspection - Hostel block', 'Monthly inspection for leaks/sediment in the overhead tank.',   'WATER_TANK_INSPECTION',  'Hostel Block C',       'ASSIGNED',             3, 10, '2026-06-22'),
(5, 'Garden hedge trimming',                'Trim hedges along the main entrance walkway.',                  'GARDEN_MAINTENANCE',     'Main Entrance',        'REWORK_REQUIRED',      2, 5, '2026-06-15'),
(6, 'Leaking tap repair - Staff washroom',  'Tap in the staff washroom on 2nd floor is leaking continuously.', 'PLUMBING_MAINTENANCE', 'Block A - 2nd Floor',  'REJECTED',             3, 9, '2026-06-12'),
(7, 'Waste collection - Canteen area',      'Collect and segregate waste bins outside the canteen.',         'WASTE_COLLECTION',       'Canteen Block',        'APPROVED',             2, 6, '2026-06-14'),
(8, 'Classroom cleaning - Room 301',        'Routine end-of-day cleaning.',                                  'CLASSROOM_CLEANING',     'Block A - Room 301',  'ASSIGNED',             2, 5, '2026-06-20');

-- ---------------------------------------------------------------------
-- Task history: status trail for a couple of tasks to show the workflow
-- ---------------------------------------------------------------------
INSERT INTO task_history (task_id, changed_by, old_status, new_status, remarks) VALUES
(1, 2, NULL, 'ASSIGNED', 'Task created and assigned to Arjun Singh.'),
(1, 5, 'ASSIGNED', 'IN_PROGRESS', 'Started cleaning.'),
(1, 5, 'IN_PROGRESS', 'SUBMITTED_FOR_REVIEW', 'Cleaning completed, photos attached.'),
(1, 2, 'SUBMITTED_FOR_REVIEW', 'APPROVED', 'Looks good, well done.'),

(5, 2, NULL, 'ASSIGNED', 'Task created and assigned to Arjun Singh.'),
(5, 5, 'ASSIGNED', 'IN_PROGRESS', 'Started trimming.'),
(5, 5, 'IN_PROGRESS', 'SUBMITTED_FOR_REVIEW', 'Hedges trimmed.'),
(5, 2, 'SUBMITTED_FOR_REVIEW', 'REWORK_REQUIRED', 'Back hedge near the gate was missed, please redo.'),

(6, 3, NULL, 'ASSIGNED', 'Task created and assigned to Suresh Babu.'),
(6, 9, 'ASSIGNED', 'IN_PROGRESS', 'Inspecting the tap.'),
(6, 9, 'IN_PROGRESS', 'SUBMITTED_FOR_REVIEW', 'Replaced the washer.'),
(6, 3, 'SUBMITTED_FOR_REVIEW', 'REJECTED', 'Tap is still leaking, video proof shows no improvement.');

-- ---------------------------------------------------------------------
-- Task attachments: file rows pointing at local disk paths
-- (these example files don't need to physically exist for you to read
--  the schema, but in the real app the upload endpoint creates them
--  under backend/uploads/tasks/{taskId}/)
-- ---------------------------------------------------------------------
INSERT INTO task_attachments (task_id, uploaded_by, file_name, file_path, file_type) VALUES
(1, 5, 'room204_after_1.jpg', 'uploads/tasks/1/room204_after_1.jpg', 'IMAGE'),
(1, 5, 'room204_after_2.jpg', 'uploads/tasks/1/room204_after_2.jpg', 'IMAGE'),
(2, 6, 'restroom_b_clean.jpg', 'uploads/tasks/2/restroom_b_clean.jpg', 'IMAGE'),
(5, 5, 'hedge_before_rework.jpg', 'uploads/tasks/5/hedge_before_rework.jpg', 'IMAGE'),
(6, 9, 'tap_repair_proof.mp4', 'uploads/tasks/6/tap_repair_proof.mp4', 'VIDEO');

-- ---------------------------------------------------------------------
-- Notifications
-- ---------------------------------------------------------------------
INSERT INTO notifications (user_id, message, related_task_id, is_read) VALUES
(5, 'You have been assigned a new task: "Clean Room 204 after lab session"', 1, TRUE),
(2, 'Worker Lakshmi Devi submitted "Restroom deep clean - Block B" for review.', 2, FALSE),
(5, 'Your submission for "Garden hedge trimming" needs rework: back hedge near the gate was missed.', 5, FALSE),
(9, 'Your submission for "Leaking tap repair - Staff washroom" was rejected.', 6, FALSE),
(10, 'You have been assigned a new task: "Water tank inspection - Hostel block"', 4, FALSE);

-- =====================================================================
-- Done. Demo logins (password for all: Password@123):
--   admin / supervisor1 / supervisor2 / worker1 / worker2 / worker3 / worker4
-- =====================================================================
