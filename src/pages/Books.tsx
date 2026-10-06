import { useTranslation } from "react-i18next";
import PageShell from "../components/layout/PageShell";
import BookShelf from "../components/sections/BookShelf";
import { useBooks } from "../hooks/useBooks";
import Loading from "../components/ui/Loading";

// import { useUIStore } from "../stores/uiStore";

export default function Books() {
  const { t } = useTranslation();
  const { data: books, isLoading, error } = useBooks();
  // const lang = useUIStore((s) => s.lang);

  return (
    <PageShell
      title={t("pages.books.title")}
      subtitle={t("pages.books.subtitle")}
    >
      {isLoading && <Loading />}

      {error && <p className="text-burgundy">Could not load books.</p>}

      {books && books.length === 0 && (
        <p className="text-muted">No books yet.</p>
      )}

      {books && books.length > 0 && <BookShelf books={books} />}
    </PageShell>
  );
}
