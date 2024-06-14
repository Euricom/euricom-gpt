drop policy "Allow full access to own assistant_collections" on "public"."assistant_collections";

create policy "Allow full access to own assistant_collections"
on "public"."assistant_collections"
as permissive
for all
to public
using (true)
with check (true);



