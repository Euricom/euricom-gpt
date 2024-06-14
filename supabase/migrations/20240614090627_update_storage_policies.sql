drop policy "Allow authenticated delete access to own file" on "storage"."objects";

drop policy "Allow authenticated delete access to own profile images" on "storage"."objects";

drop policy "Allow authenticated insert access to own file" on "storage"."objects";

drop policy "Allow authenticated insert access to own profile images" on "storage"."objects";

drop policy "Allow authenticated update access to own file" on "storage"."objects";

drop policy "Allow authenticated update access to own profile images" on "storage"."objects";

drop policy "Allow delete access to own assistant images" on "storage"."objects";

drop policy "Allow delete access to own message images" on "storage"."objects";

drop policy "Allow delete access to own workspace images" on "storage"."objects";

drop policy "Allow insert access to own assistant images" on "storage"."objects";

drop policy "Allow insert access to own message images" on "storage"."objects";

drop policy "Allow insert access to own workspace images" on "storage"."objects";

drop policy "Allow public read access on non-private assistant images" on "storage"."objects";

drop policy "Allow public read access on non-private files" on "storage"."objects";

drop policy "Allow public read access on non-private workspace images" on "storage"."objects";

drop policy "Allow public read access on profile images" on "storage"."objects";

drop policy "Allow read access to own message images" on "storage"."objects";

drop policy "Allow update access to own assistant images" on "storage"."objects";

drop policy "Allow update access to own message images" on "storage"."objects";

drop policy "Allow update access to own workspace images" on "storage"."objects";

drop policy "Allow users to read their own files" on "storage"."objects";

create policy "Allow authenticated delete access to own file"
on "storage"."objects"
as permissive
for delete
to authenticated
using (true);


create policy "Allow authenticated delete access to own profile images"
on "storage"."objects"
as permissive
for delete
to authenticated
using (true);


create policy "Allow authenticated insert access to own file"
on "storage"."objects"
as permissive
for insert
to authenticated
with check (true);


create policy "Allow authenticated insert access to own profile images"
on "storage"."objects"
as permissive
for insert
to authenticated
with check (true);


create policy "Allow authenticated update access to own file"
on "storage"."objects"
as permissive
for update
to authenticated
using (true);


create policy "Allow authenticated update access to own profile images"
on "storage"."objects"
as permissive
for update
to authenticated
using (true);


create policy "Allow delete access to own assistant images"
on "storage"."objects"
as permissive
for delete
to authenticated
using (true);


create policy "Allow delete access to own message images"
on "storage"."objects"
as permissive
for delete
to public
using (true);


create policy "Allow delete access to own workspace images"
on "storage"."objects"
as permissive
for delete
to authenticated
using (true);


create policy "Allow insert access to own assistant images"
on "storage"."objects"
as permissive
for insert
to authenticated
with check (true);


create policy "Allow insert access to own message images"
on "storage"."objects"
as permissive
for insert
to public
with check (true);


create policy "Allow insert access to own workspace images"
on "storage"."objects"
as permissive
for insert
to authenticated
with check (true);


create policy "Allow public read access on non-private assistant images"
on "storage"."objects"
as permissive
for select
to public
using (true);


create policy "Allow public read access on non-private files"
on "storage"."objects"
as permissive
for select
to public
using (true);


create policy "Allow public read access on non-private workspace images"
on "storage"."objects"
as permissive
for select
to public
using (true);


create policy "Allow public read access on profile images"
on "storage"."objects"
as permissive
for select
to public
using (true);


create policy "Allow read access to own message images"
on "storage"."objects"
as permissive
for select
to public
using (true);


create policy "Allow update access to own assistant images"
on "storage"."objects"
as permissive
for update
to authenticated
using (true);


create policy "Allow update access to own message images"
on "storage"."objects"
as permissive
for update
to public
using (true);


create policy "Allow update access to own workspace images"
on "storage"."objects"
as permissive
for update
to authenticated
using (true);


create policy "Allow users to read their own files"
on "storage"."objects"
as permissive
for select
to authenticated
using (true);



