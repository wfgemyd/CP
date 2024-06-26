-- Create schema if it does not exist
CREATE SCHEMA IF NOT EXISTS Fproject;

-- Creating 'employment_status' table
CREATE TABLE Fproject.employment_status (
    id SERIAL PRIMARY KEY,
    employment_name VARCHAR
);

-- Creating 'role' table
CREATE TABLE Fproject.role (
    id SERIAL PRIMARY KEY,
    role_name VARCHAR UNIQUE,
    role_description TEXT
);

-- Creating 'user' table
CREATE TABLE Fproject."user" (
    id SERIAL PRIMARY KEY,
    WBI VARCHAR,
    f_name VARCHAR,
    l_name VARCHAR,
    email VARCHAR,
    role_id INT REFERENCES Fproject.role(id), -- Foreign key to the 'role' table
    employment_status_id INT REFERENCES Fproject.employment_status(id) -- Foreign key
);


-- Creating 'department' table
CREATE TABLE Fproject.department (
    id SERIAL PRIMARY KEY,
    dep_name VARCHAR
);

-- Creating 'position' table
CREATE TABLE Fproject.position (
    id SERIAL PRIMARY KEY,
    pos_name VARCHAR
);

-- Creating 'certificates' table
CREATE TABLE Fproject.certificates (
    id SERIAL PRIMARY KEY,
    certificate_name VARCHAR,
    is_permanent BOOLEAN,
    certificate_valid_from DATE,
    certificate_valid_till DATE
);

-- Creating 'department_user' table
CREATE TABLE Fproject.department_user ( -- Many to many relationship
    department_id INT REFERENCES Fproject.department(id),
    user_id INT REFERENCES Fproject."user"(id),
    PRIMARY KEY (department_id, user_id)
);

-- Creating 'position_user' table
CREATE TABLE Fproject.position_user ( -- Many to many relationship
    position_id INT REFERENCES Fproject.position(id),
    user_id INT REFERENCES Fproject."user"(id),
    PRIMARY KEY (position_id, user_id)
);

-- Creating 'certificates_user' table
CREATE TABLE Fproject.certificates_user ( -- Many to many relationship
    certificate_id INT REFERENCES Fproject.certificates(id),
    user_id INT REFERENCES Fproject."user"(id),
    PRIMARY KEY (certificate_id, user_id)
);

-- Creating 'ticket_status' table
CREATE TABLE Fproject.ticket_status ( -- One to many relationship
    id SERIAL PRIMARY KEY,
    status_name VARCHAR,
    color BIGINT
);

-- Creating 'ticket_priorities' table
CREATE TABLE Fproject.ticket_priorities ( -- One to many relationship
    id SERIAL PRIMARY KEY,
    priority_name VARCHAR,
    color INT
);


-- Creating 'ticket' table
CREATE TABLE Fproject.ticket (
    id SERIAL PRIMARY KEY,
    subject VARCHAR,
    content TEXT,
    file_data BYTEA, -- Optional: If you want to store file data in the database
    status_id INT REFERENCES Fproject.ticket_status(id),
    priority_id INT REFERENCES Fproject.ticket_priorities(id),
    user_id INT REFERENCES Fproject."user"(id), -- Assuming there's a 'user' table to reference
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    completed_at TIMESTAMP NULL
);

-- Creating 'ticket_category' table
CREATE TABLE Fproject.ticket_category (
    id SERIAL PRIMARY KEY,
    category_name VARCHAR
);

-- Creating 'ticket_category_ticket' table
CREATE TABLE Fproject.ticket_category_ticket ( -- Many to many relationship
    category_id INT REFERENCES Fproject.ticket_category(id),
    ticket_id INT REFERENCES Fproject.ticket(id),
    PRIMARY KEY (category_id, ticket_id)
);

-- Creating 'ticket_comment' table
CREATE TABLE Fproject.ticket_comment (
    id SERIAL PRIMARY KEY,
    ticket_id INT REFERENCES Fproject.ticket(id),
    user_id INT REFERENCES Fproject."user"(id), -- The user who made the comment
    comment TEXT, -- The content of the comment
    file_data BYTEA, -- adding files to the comment
    status_change INT REFERENCES Fproject.ticket_status(id), -- Optional reference to a new status
    priority_change INT REFERENCES Fproject.ticket_priorities(id), -- Optional reference to a new priority
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP -- The date and time when the comment was made
);

-- Creating 'notifications' table
CREATE TABLE Fproject.notifications (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES Fproject."user"(id),
    ticket_id INT REFERENCES Fproject.ticket(id),
    comment_id INT REFERENCES Fproject.ticket_comment(id) NULL,
    notification_type VARCHAR, -- e.g., 'status_change', 'new_comment', 'ticket_assigned'
    message TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    read BOOLEAN DEFAULT FALSE -- To track whether the notification has been read
);

CREATE TABLE Fproject.ticket_action (
    id SERIAL PRIMARY KEY,
    ticket_id INT REFERENCES Fproject.ticket(id),
    user_id INT REFERENCES Fproject."user"(id), -- The user (manager, admin, etc.) who performed the action
    action_type VARCHAR, -- Could be 'comment', 'status_change', 'priority_change', etc.
    action_description TEXT, -- Details of the action, could be a comment text or a description of what was changed
    previous_value TEXT, -- Optional: The previous value before the action, for status/priority changes
    new_value TEXT, -- Optional: The new value after the action, for status/priority changes
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP -- The date and time when the action was performed
);



-- Index for searching tickets by user details
CREATE INDEX idx_user_details ON Fproject."user"(f_name, l_name);

-- Full-text search index on the ticket's content
CREATE INDEX idx_ticket_content ON Fproject.ticket USING GIN (to_tsvector('english', content));

-- Full-text search index on ticket comments
CREATE INDEX idx_ticket_comment ON Fproject.ticket_comment USING GIN (to_tsvector('english', comment));

CREATE INDEX idx_ticket_action_description ON Fproject.ticket_action USING GIN (to_tsvector('english', action_description));

CREATE INDEX idx_ticket_action_type ON Fproject.ticket_action(action_type);



