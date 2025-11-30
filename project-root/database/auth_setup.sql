-- database/auth_setup.sql
CREATE TABLE IF NOT EXISTS Usuario (
    id_usuario SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    rol VARCHAR(20) NOT NULL CHECK (rol IN ('ADMIN', 'EMPLEADO'))
);

INSERT INTO Usuario (username, password, rol) VALUES 
('admin', 'admin123', 'ADMIN'),
('empleado', 'empleado123', 'EMPLEADO')
ON CONFLICT (username) DO NOTHING;
