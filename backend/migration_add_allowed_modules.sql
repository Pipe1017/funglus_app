-- Agregar columna allowed_modules a la tabla users
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS allowed_modules JSONB DEFAULT '["laboratorio"]'::jsonb;

-- Dar acceso completo a usuarios admin existentes
UPDATE users 
SET allowed_modules = '["laboratorio", "siembra", "incubacion", "admin"]'::jsonb
WHERE role = 'admin';

-- Dar acceso a laboratorio a usuarios operator/viewer existentes
UPDATE users 
SET allowed_modules = '["laboratorio"]'::jsonb
WHERE role IN ('operator', 'viewer') AND allowed_modules IS NULL;
