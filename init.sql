CREATE TABLE IF NOT EXISTS network (
    Id BINARY(16) PRIMARY KEY DEFAULT (UUID_TO_BIN(UUID())),
    Name VARCHAR(255) NOT NULL,
    Url VARCHAR(255) NOT NULL,
    Scriptfile TEXT,
    Timestamps TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    );

CREATE TABLE IF NOT EXISTS user (
    Id BINARY(16) PRIMARY KEY DEFAULT (UUID_TO_BIN(UUID())),
    Username VARCHAR(255) NOT NULL,
    Email VARCHAR(255) NOT NULL,
    Network_id BINARY(16),
    Timestamps TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (Network_id) REFERENCES network(Id)
    );

CREATE TABLE IF NOT EXISTS logs (
    Id BINARY(16) PRIMARY KEY DEFAULT (UUID_TO_BIN(UUID())),
    Network_id BINARY(16),
    User_id BINARY(16),
    Old_password VARCHAR(255),
    New_password VARCHAR(255),
    Timestamps TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (Network_id) REFERENCES network(Id),
    FOREIGN KEY (User_id) REFERENCES user(Id)
    );