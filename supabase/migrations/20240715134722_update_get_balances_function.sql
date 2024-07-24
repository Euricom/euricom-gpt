set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.get_balances()
 RETURNS TABLE(display_name text, user_id uuid, total_price double precision)
 LANGUAGE sql
AS $function$
    select p.display_name, m.user_id, SUM(m.calc_price) AS total_price
    from messages as m
    join profiles p ON m.user_id = p.user_id
    group by m.user_id, p.display_name
$function$
;


