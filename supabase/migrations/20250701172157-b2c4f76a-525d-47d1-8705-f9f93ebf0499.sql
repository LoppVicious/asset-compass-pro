
-- Recrear la función para que no reciba parámetros y use COALESCE para determinar el portfolio_id
CREATE OR REPLACE FUNCTION public.recalc_positions_for_portfolio()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  target_portfolio uuid := COALESCE(NEW.portfolio_id, OLD.portfolio_id);
BEGIN
  -- Borra todas las posiciones de ese portfolio
  DELETE FROM public.positions
  WHERE portfolio_id = target_portfolio;

  -- Inserta posiciones agregadas (compras - ventas) por símbolo y tipo_activo
  INSERT INTO public.positions (id, portfolio_id, simbolo, tipo_activo, cantidad, precio_compra, fecha_compra)
  SELECT
    gen_random_uuid(),                       -- nuevo id
    target_portfolio,                        -- portfolio adecuado
    simbolo,
    'accion'::text,                         -- tipo_activo por defecto
    SUM(CASE WHEN tipo = 'venta' THEN -cantidad ELSE cantidad END) AS cantidad,
    AVG(precio) AS precio_compra,           -- precio promedio de compra
    NOW()::date                             -- fecha_compra como date
  FROM public.operations
  WHERE portfolio_id = target_portfolio
  GROUP BY simbolo, 'accion'::text
  HAVING SUM(CASE WHEN tipo = 'venta' THEN -cantidad ELSE cantidad END) > 0;

  RETURN COALESCE(NEW, OLD);
END;
$$;

-- Eliminar el trigger antiguo y crear uno nuevo
DROP TRIGGER IF EXISTS handle_operations_change ON public.operations;

CREATE TRIGGER handle_operations_change
  AFTER INSERT OR UPDATE OR DELETE
  ON public.operations
  FOR EACH ROW
  EXECUTE FUNCTION public.recalc_positions_for_portfolio();
