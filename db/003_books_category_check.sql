alter table public.books
  add constraint books_category_check
  check (category in ('authored', 'translated', 'edited'));