drop function if exists "public"."get_balances"();

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.get_balances(start_date text, end_date text)
 RETURNS TABLE(display_name text, created_at text, total_price double precision)
 LANGUAGE sql
AS $function$
    select p.display_name, m.created_at, SUM(m.calc_price) AS total_price
    from messages as m
    join profiles p ON m.user_id = p.user_id
    group by m.created_at, p.display_name
$function$
;

CREATE OR REPLACE FUNCTION public.get_balances_between_dates(start_date date, end_date date)
 RETURNS TABLE(display_name text, total_price double precision)
 LANGUAGE sql
AS $function$
    SELECT p.display_name, SUM(m.calc_price) AS total_price
    FROM messages AS m
    JOIN profiles p ON m.user_id = p.user_id
    WHERE m.created_at BETWEEN start_date AND end_date
    GROUP BY p.display_name
$function$
;

CREATE OR REPLACE FUNCTION public.get_balances()
 RETURNS TABLE(display_name text, total_price double precision)
 LANGUAGE sql
AS $function$
    select p.display_name, SUM(m.calc_price) AS total_price
    from messages as m
    join profiles p ON m.user_id = p.user_id
    group by p.display_name
$function$
;


