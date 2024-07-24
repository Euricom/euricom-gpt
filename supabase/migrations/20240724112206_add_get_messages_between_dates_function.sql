set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.get_messages_between_dates(start_date date, end_date date)
 RETURNS TABLE(display_name text, chats integer, messages integer)
 LANGUAGE sql
AS $function$
    SELECT p.display_name, COUNT(DISTINCT c.id) AS chats,  COUNT(m.id) AS messages
    FROM messages AS m
    JOIN profiles p ON m.user_id = p.user_id
    JOIN chats c ON c.id = m.chat_id
    WHERE m.created_at BETWEEN start_date AND end_date
    GROUP BY p.display_name
$function$
;


