alter table "public"."messages" add constraint "messages_user_id_fkey" FOREIGN KEY (user_id) REFERENCES profiles(user_id) not valid;

alter table "public"."messages" validate constraint "messages_user_id_fkey";


