drop policy "Allow full access to own assistant_files" on "public"."assistant_files";

drop policy "Allow full access to own assistant_tools" on "public"."assistant_tools";

drop policy "Allow full access to own assistant_workspaces" on "public"."assistant_workspaces";

drop policy "Allow full access to own assistants" on "public"."assistants";

drop policy "Allow view access to non-private assistants" on "public"."assistants";

drop policy "Allow full access to own chat_files" on "public"."chat_files";

drop policy "Allow full access to own chats" on "public"."chats";

drop policy "Allow view access to non-private chats" on "public"."chats";

drop policy "Allow full access to own collection_files" on "public"."collection_files";

drop policy "Allow view access to collection files for non-private collectio" on "public"."collection_files";

drop policy "Allow full access to own collection_workspaces" on "public"."collection_workspaces";

drop policy "Allow full access to own collections" on "public"."collections";

drop policy "Allow view access to non-private collections" on "public"."collections";

drop policy "Allow full access to own file items" on "public"."file_items";

drop policy "Allow view access to non-private file items" on "public"."file_items";

drop policy "Allow full access to own file_workspaces" on "public"."file_workspaces";

drop policy "Allow full access to own files" on "public"."files";

drop policy "Allow view access to files for non-private collections" on "public"."files";

drop policy "Allow view access to non-private files" on "public"."files";

drop policy "Allow full access to own folders" on "public"."folders";

drop policy "Allow full access to own message_file_items" on "public"."message_file_items";

drop policy "Allow full access to own messages" on "public"."messages";

drop policy "Allow view access to messages for non-private chats" on "public"."messages";

drop policy "Allow full access to own model_workspaces" on "public"."model_workspaces";

drop policy "Allow full access to own models" on "public"."models";

drop policy "Allow view access to non-private models" on "public"."models";

drop policy "Allow full access to own preset_workspaces" on "public"."preset_workspaces";

drop policy "Allow full access to own presets" on "public"."presets";

drop policy "Allow view access to non-private presets" on "public"."presets";

drop policy "Allow full access to own profiles" on "public"."profiles";

drop policy "Allow full access to own prompt_workspaces" on "public"."prompt_workspaces";

drop policy "Allow full access to own prompts" on "public"."prompts";

drop policy "Allow view access to non-private prompts" on "public"."prompts";

drop policy "Allow full access to own tool_workspaces" on "public"."tool_workspaces";

drop policy "Allow full access to own tools" on "public"."tools";

drop policy "Allow view access to non-private tools" on "public"."tools";

drop policy "Allow full access to own workspaces" on "public"."workspaces";

drop policy "Allow view access to non-private workspaces" on "public"."workspaces";

create policy "Allow full access to own assistant_files"
on "public"."assistant_files"
as permissive
for all
to public
using (true)
with check (true);


create policy "Allow full access to own assistant_tools"
on "public"."assistant_tools"
as permissive
for all
to public
using (true)
with check (true);


create policy "Allow full access to own assistant_workspaces"
on "public"."assistant_workspaces"
as permissive
for all
to public
using (true)
with check (true);


create policy "Allow full access to own assistants"
on "public"."assistants"
as permissive
for all
to public
using (true)
with check (true);


create policy "Allow view access to non-private assistants"
on "public"."assistants"
as permissive
for select
to public
using (true);


create policy "Allow full access to own chat_files"
on "public"."chat_files"
as permissive
for all
to public
using (true)
with check (true);


create policy "Allow full access to own chats"
on "public"."chats"
as permissive
for all
to public
using (true)
with check (true);


create policy "Allow view access to non-private chats"
on "public"."chats"
as permissive
for select
to public
using (true);


create policy "Allow full access to own collection_files"
on "public"."collection_files"
as permissive
for all
to public
using (true)
with check (true);


create policy "Allow view access to collection files for non-private collectio"
on "public"."collection_files"
as permissive
for select
to public
using (true);


create policy "Allow full access to own collection_workspaces"
on "public"."collection_workspaces"
as permissive
for all
to public
using (true)
with check (true);


create policy "Allow full access to own collections"
on "public"."collections"
as permissive
for all
to public
using (true)
with check (true);


create policy "Allow view access to non-private collections"
on "public"."collections"
as permissive
for select
to public
using (true);


create policy "Allow full access to own file items"
on "public"."file_items"
as permissive
for all
to public
using (true)
with check (true);


create policy "Allow view access to non-private file items"
on "public"."file_items"
as permissive
for select
to public
using (true);


create policy "Allow full access to own file_workspaces"
on "public"."file_workspaces"
as permissive
for all
to public
using (true)
with check (true);


create policy "Allow full access to own files"
on "public"."files"
as permissive
for all
to public
using (true)
with check (true);


create policy "Allow view access to files for non-private collections"
on "public"."files"
as permissive
for select
to public
using (true);


create policy "Allow view access to non-private files"
on "public"."files"
as permissive
for select
to public
using (true);


create policy "Allow full access to own folders"
on "public"."folders"
as permissive
for all
to public
using (true)
with check (true);


create policy "Allow full access to own message_file_items"
on "public"."message_file_items"
as permissive
for all
to public
using (true)
with check (true);


create policy "Allow full access to own messages"
on "public"."messages"
as permissive
for all
to public
using (true)
with check (true);


create policy "Allow view access to messages for non-private chats"
on "public"."messages"
as permissive
for select
to public
using (true);


create policy "Allow full access to own model_workspaces"
on "public"."model_workspaces"
as permissive
for all
to public
using (true)
with check (true);


create policy "Allow full access to own models"
on "public"."models"
as permissive
for all
to public
using (true)
with check (true);


create policy "Allow view access to non-private models"
on "public"."models"
as permissive
for select
to public
using (true);


create policy "Allow full access to own preset_workspaces"
on "public"."preset_workspaces"
as permissive
for all
to public
using (true)
with check (true);


create policy "Allow full access to own presets"
on "public"."presets"
as permissive
for all
to public
using (true)
with check (true);


create policy "Allow view access to non-private presets"
on "public"."presets"
as permissive
for select
to public
using (true);


create policy "Allow full access to own profiles"
on "public"."profiles"
as permissive
for all
to public
using (true)
with check (true);


create policy "Allow full access to own prompt_workspaces"
on "public"."prompt_workspaces"
as permissive
for all
to public
using (true)
with check (true);


create policy "Allow full access to own prompts"
on "public"."prompts"
as permissive
for all
to public
using (true)
with check (true);


create policy "Allow view access to non-private prompts"
on "public"."prompts"
as permissive
for select
to public
using (true);


create policy "Allow full access to own tool_workspaces"
on "public"."tool_workspaces"
as permissive
for all
to public
using (true)
with check (true);


create policy "Allow full access to own tools"
on "public"."tools"
as permissive
for all
to public
using (true)
with check (true);


create policy "Allow view access to non-private tools"
on "public"."tools"
as permissive
for select
to public
using (true);


create policy "Allow full access to own workspaces"
on "public"."workspaces"
as permissive
for all
to public
using (true)
with check (true);


create policy "Allow view access to non-private workspaces"
on "public"."workspaces"
as permissive
for select
to public
using (true);



