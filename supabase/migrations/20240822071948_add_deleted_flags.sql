alter table "public"."chats" add column "deleted" boolean default false;

alter table "public"."messages" add column "deleted" boolean default false;


