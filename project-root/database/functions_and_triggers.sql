-- Database Functions and Triggers for Hotel Management System
-- Ejecutar este script en PostgreSQL para crear funciones y triggers

-- ============================================================================
-- 1. TABLA DE HISTORIAL DE CAMBIOS DE CATEGORÍA
-- ============================================================================

CREATE TABLE IF NOT EXISTS HistorialCategoriaHotel (
    id_historial SERIAL PRIMARY KEY,
    id_hotel INTEGER NOT NULL REFERENCES Hotel(id_hotel),
    categoria_anterior INTEGER REFERENCES Categoria(id_categoria),
    categoria_nueva INTEGER REFERENCES Categoria(id_categoria),
    fecha_cambio TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    motivo TEXT,
    usuario_cambio VARCHAR(100)
);

-- ============================================================================
-- 2. FUNCIÓN PARA REGISTRAR CAMBIO DE CATEGORÍA DE HOTEL
-- ============================================================================

CREATE OR REPLACE FUNCTION registrar_cambio_categoria_hotel()
RETURNS TRIGGER
AS $$
    DECLARE
        nombre_hotel_var TEXT;
    BEGIN
        -- Obtener el nombre del hotel
        SELECT nombre INTO nombre_hotel_var
        FROM Hotel
        WHERE id_hotel = OLD.id_hotel;

        -- Insertar en el historial
        INSERT INTO HistorialCategoriaHotel (
            id_hotel,
            categoria_anterior,
            categoria_nueva,
            fecha_cambio,
            motivo
        )
        VALUES (
            OLD.id_hotel,
            OLD.id_categoria,
            NEW.id_categoria,
            CURRENT_TIMESTAMP,
            'Cambio de categoría del hotel: ' || nombre_hotel_var
        );

        RETURN NEW;
    END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- 3. TRIGGER PARA CAMBIO DE CATEGORÍA
-- ============================================================================

DROP TRIGGER IF EXISTS trigger_cambio_categoria_hotel ON Hotel;

CREATE TRIGGER trigger_cambio_categoria_hotel
BEFORE UPDATE OF id_categoria
ON Hotel
FOR EACH ROW
WHEN (OLD.id_categoria IS DISTINCT FROM NEW.id_categoria)
EXECUTE FUNCTION registrar_cambio_categoria_hotel();

-- ============================================================================
-- 4. FUNCIÓN PARA REGISTRAR EVENTOS DE RESERVA
-- ============================================================================

CREATE OR REPLACE FUNCTION registrar_evento_reserva(
    p_id_reserva BIGINT,
    p_evento_tipo VARCHAR(50),
    p_descripcion TEXT DEFAULT NULL
)
RETURNS INTEGER
AS $$
    DECLARE
        nuevo_id INTEGER;
    BEGIN
        INSERT INTO HistorialEventoReserva (
            id_reserva,
            evento_tipo,
            fecha_evento,
            descripcion
        )
        VALUES (
            p_id_reserva,
            p_evento_tipo,
            CURRENT_TIMESTAMP,
            p_descripcion
        )
        RETURNING id_evento INTO nuevo_id;

        RETURN nuevo_id;
    END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- 5. FUNCIÓN PARA VERIFICAR Y CANCELAR RESERVAS VENCIDAS
-- ============================================================================

CREATE OR REPLACE FUNCTION cancelar_reservas_vencidas()
RETURNS TABLE (
    id_reserva_cancelada BIGINT,
    fecha_inicio DATE,
    horas_vencidas NUMERIC
)
AS $$
    BEGIN
        -- Cancelar reservas que no pagaron anticipo 24 horas antes
        UPDATE Reserva r
        SET estado = 'CANCELADA'
        WHERE r.estado = 'PENDIENTE'
          AND r.fecha_inicio - INTERVAL '24 hours' < CURRENT_TIMESTAMP
          AND NOT EXISTS (
              SELECT 1 FROM Pago p 
              WHERE p.id_reserva = r.id_reserva 
              AND p.tipo_pago = 'ANTICIPO'
          );

        -- Cancelar reservas sin check-in después de las 7pm del día de inicio
        UPDATE Reserva r
            r.fecha_inicio,
            EXTRACT(EPOCH FROM (CURRENT_TIMESTAMP - r.fecha_inicio))/3600 as horas_vencidas
        FROM Reserva r
        WHERE r.estado IN ('CANCELADA', 'NO_UTILIZADA')
          AND r.fecha_inicio::date = CURRENT_DATE - INTERVAL '1 day';
    END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- 6. FUNCIÓN PARA CALCULAR OCUPACIÓN DE HOTEL
-- ============================================================================

CREATE OR REPLACE FUNCTION calcular_ocupacion_hotel(
    p_id_hotel INTEGER,
    p_fecha_inicio DATE,
    p_fecha_fin DATE
)
RETURNS TABLE (
    fecha DATE,
    habitaciones_totales INTEGER,
    habitaciones_ocupadas INTEGER,
    porcentaje_ocupacion NUMERIC
)
AS $$
    BEGIN
        RETURN QUERY
        WITH fechas AS (
            SELECT generate_series(p_fecha_inicio, p_fecha_fin, '1 day'::interval)::date as fecha
        ),
        total_habitaciones AS (
            SELECT COUNT(*) as total
            FROM Habitacion
            WHERE id_hotel = p_id_hotel
        )
        SELECT 
            f.fecha,
            th.total::INTEGER,
            COUNT(DISTINCT dr.id_habitacion)::INTEGER as ocupadas,
            ROUND((COUNT(DISTINCT dr.id_habitacion)::NUMERIC / th.total) * 100, 2) as porcentaje
        FROM fechas f
        CROSS JOIN total_habitaciones th
        LEFT JOIN Reserva r ON r.id_hotel = p_id_hotel
            AND f.fecha BETWEEN r.fecha_inicio AND r.fecha_fin
            AND r.estado IN ('CONFIRMADA', 'EN_PROCESO')
        LEFT JOIN DetalleReserva dr ON dr.id_reserva = r.id_reserva
        GROUP BY f.fecha, th.total
        ORDER BY f.fecha;
    END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- 7. VISTA MATERIALIZADA PARA ESTADÍSTICAS DE RESERVAS
-- ============================================================================

CREATE MATERIALIZED VIEW IF NOT EXISTS estadisticas_reservas AS
SELECT 
    DATE_TRUNC('month', fecha_reserva) as mes,
    COUNT(*) as total_reservas,
    COUNT(*) FILTER (WHERE estado = 'CONFIRMADA') as confirmadas,
    COUNT(*) FILTER (WHERE estado = 'CANCELADA') as canceladas,
    COUNT(*) FILTER (WHERE estado = 'NO_UTILIZADA') as no_utilizadas,
    COALESCE(SUM(valor_total), 0) as ingresos_totales,
    COALESCE(AVG(valor_total), 0) as valor_promedio,
    COUNT(DISTINCT id_hotel) as hoteles_activos,
    COUNT(DISTINCT id_huesped) as huespedes_unicos
FROM Reserva
GROUP BY DATE_TRUNC('month', fecha_reserva);

-- Crear índice para mejor rendimiento
CREATE INDEX IF NOT EXISTS idx_estadisticas_mes ON estadisticas_reservas(mes DESC);

-- ============================================================================
-- 8. FUNCIÓN PARA REFRESCAR VISTAS MATERIALIZADAS
-- ============================================================================

CREATE OR REPLACE FUNCTION refrescar_estadisticas()
RETURNS VOID
AS $$
    BEGIN
        REFRESH MATERIALIZED VIEW estadisticas_reservas;
    END;
$$ LANGUAGE plpgsql;


 Reporte 5: Reservas con menores de edad y/o mascotas
CREATE OR REPLACE FUNCTION actualizar_es_menor() 
RETURNS TRIGGER AS $$
BEGIN
    NEW.es_menor := (DATE_PART('year', AGE(CURRENT_DATE, NEW.fecha_nacimiento)) < 18);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_es_menor
BEFORE INSERT OR UPDATE ON Huesped
FOR EACH ROW
EXECUTE FUNCTION actualizar_es_menor();

--Funcion para generar id de reserva
CREATE OR REPLACE FUNCTION generar_codigo_reserva()
RETURNS TRIGGER AS $$
DECLARE
    fecha TEXT;
    cedula5 TEXT;
BEGIN
    -- Obtener la fecha en formato YYYYMMDD
    fecha := to_char(NEW.fecha_reserva, 'YYYYMMDD');

    -- Obtener los primeros 5 dígitos de la cédula del huésped responsable
    SELECT substring(id_huesped::text FROM 1 FOR 5)
    INTO cedula5
    FROM Huesped
    WHERE id_huesped = NEW.id_huesped_responsable;

    -- Concatenar la fecha con los primeros 5 dígitos de la cédula
    NEW.id_reserva := (fecha || cedula5)::BIGINT;

    -- Devolver el nuevo registro con el código de reserva generado
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;


CREATE TRIGGER trg_generar_codigo_reserva
BEFORE INSERT ON Reserva
FOR EACH ROW
EXECUTE FUNCTION generar_codigo_reserva();




-- ============================================================================
-- COMENTARIOS DE DOCUMENTACIÓN
-- ============================================================================

COMMENT ON FUNCTION registrar_cambio_categoria_hotel() IS 
    'Trigger function que registra automáticamente cambios de categoría de hoteles';

COMMENT ON FUNCTION registrar_evento_reserva(INTEGER, VARCHAR, TEXT) IS 
    'Función para registrar eventos en el historial de una reserva (CHECK_IN, CHECK_OUT, CANCELACION, etc)';

COMMENT ON FUNCTION cancelar_reservas_vencidas() IS 
    'Función para cancelar automáticamente reservas que no cumplieron con los requisitos de pago o check-in';

COMMENT ON FUNCTION calcular_ocupacion_hotel(INTEGER, DATE, DATE) IS 
    'Calcula el porcentaje de ocupación de un hotel en un rango de fechas';

COMMENT ON MATERIALIZED VIEW estadisticas_reservas IS 
    'Vista materializada con estadísticas mensuales de reservas para reportes rápidos';
