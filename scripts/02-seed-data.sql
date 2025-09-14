-- Insert sample data for testing
USE event_management;

-- Insert sample users (passwords are hashed versions of 'password123')
INSERT INTO Users (name, email, password_hash, role) VALUES
('Admin User', 'admin@example.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/VjPyV8Eim', 'admin'),
('John Doe', 'john@example.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/VjPyV8Eim', 'participant'),
('Jane Smith', 'jane@example.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/VjPyV8Eim', 'participant');

-- Insert sample events
INSERT INTO Events (title, description, location, event_date, created_by) VALUES
('Tech Conference 2024', 'Annual technology conference featuring latest trends', 'Convention Center', '2024-03-15 09:00:00', 1),
('Workshop: React Basics', 'Learn the fundamentals of React development', 'Room 101', '2024-03-20 14:00:00', 1),
('Networking Event', 'Connect with professionals in your field', 'Hotel Ballroom', '2024-03-25 18:00:00', 2);

-- Insert sample registrations
INSERT INTO Registrations (user_id, event_id) VALUES
(2, 1),
(3, 1),
(3, 2);
