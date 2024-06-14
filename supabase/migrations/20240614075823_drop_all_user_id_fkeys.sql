alter table "public"."assistant_files" drop constraint "assistant_files_user_id_fkey";

alter table "public"."assistant_tools" drop constraint "assistant_tools_user_id_fkey";

alter table "public"."assistant_workspaces" drop constraint "assistant_workspaces_user_id_fkey";

alter table "public"."assistants" drop constraint "assistants_user_id_fkey";

alter table "public"."chat_files" drop constraint "chat_files_user_id_fkey";

alter table "public"."chats" drop constraint "chats_user_id_fkey";

alter table "public"."collection_files" drop constraint "collection_files_user_id_fkey";

alter table "public"."collection_workspaces" drop constraint "collection_workspaces_user_id_fkey";

alter table "public"."collections" drop constraint "collections_user_id_fkey";

alter table "public"."file_items" drop constraint "file_items_user_id_fkey";

alter table "public"."file_workspaces" drop constraint "file_workspaces_user_id_fkey";

alter table "public"."files" drop constraint "files_user_id_fkey";

alter table "public"."folders" drop constraint "folders_user_id_fkey";

alter table "public"."message_file_items" drop constraint "message_file_items_user_id_fkey";

alter table "public"."messages" drop constraint "messages_user_id_fkey";

alter table "public"."model_workspaces" drop constraint "model_workspaces_user_id_fkey";

alter table "public"."models" drop constraint "models_user_id_fkey";

alter table "public"."preset_workspaces" drop constraint "preset_workspaces_user_id_fkey";

alter table "public"."presets" drop constraint "presets_user_id_fkey";

alter table "public"."profiles" drop constraint "profiles_user_id_fkey";

alter table "public"."prompt_workspaces" drop constraint "prompt_workspaces_user_id_fkey";

alter table "public"."prompts" drop constraint "prompts_user_id_fkey";

alter table "public"."tool_workspaces" drop constraint "tool_workspaces_user_id_fkey";

alter table "public"."tools" drop constraint "tools_user_id_fkey";

alter table "public"."workspaces" drop constraint "workspaces_user_id_fkey";


