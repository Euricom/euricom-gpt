CREATE OR REPLACE FUNCTION check_user_exists(email_to_check VARCHAR)
RETURNS BOOLEAN AS $$
DECLARE
    exists BOOLEAN;
BEGIN
    SELECT EXISTS(SELECT 1 FROM auth.users WHERE email = email_to_check) INTO exists;
    RETURN exists;
END;
$$ LANGUAGE plpgsql security definer;