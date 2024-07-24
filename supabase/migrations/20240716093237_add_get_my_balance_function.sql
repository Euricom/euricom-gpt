set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.get_my_balance(user_id uuid, start_date date, end_date date)
 RETURNS double precision
 LANGUAGE sql
AS $function$
    SELECT 
        COALESCE(SUM(m.calc_price), 0)::float AS total_price
    FROM 
        messages AS m
    JOIN 
        profiles p ON m.user_id = p.user_id
    WHERE 
        m.created_at BETWEEN start_date AND end_date 
        AND m.user_id = $1
$function$
;


