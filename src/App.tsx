import { Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import Home from "./pages/Home";
import Books from "./pages/Books";
import BookDetail from "./pages/BookDetail";
import Articles from "./pages/Articles";
import ArticleDetail from "./pages/ArticleDetail";
import Videos from "./pages/Videos";
import Translations from "./pages/Translations";
import About from "./pages/About";
import Contact from "./pages/Contact";
import RequireAuth from "./components/admin/RequireAuth";
import AdminLayout from "./components/admin/AdminLayout";
import Login from "./pages/admin/Login";
import Dashboard from "./pages/admin/Dashboard";
import AdminBooks from "./pages/admin/AdminBooks";
import AdminArticles from "./pages/admin/AdminArticles";
import AdminTranslations from "./pages/admin/AdminTranslations";
import AdminVideos from "./pages/admin/AdminVideos";
import AdminTimeline from "./pages/admin/AdminTimeline";
import AdminComments from "./pages/admin/AdminComments";
import AdminPages from "./pages/admin/AdminPages";
import AdminSettings from "./pages/admin/AdminSettings";
import { useAuthBootstrap } from "./hooks/useAuthBootstrap";
import AdminBookForm from "./pages/admin/AdminBookForm";
import AdminArticleForm from "./pages/admin/AdminArticleForm";
import ScrollToTop from "./components/ScrollToTop";
import AdminTimelineForm from "./pages/admin/AdminTimelineForm";
import { useScrollRestoration } from "./hooks/useScrollRestoration";
import AdminSubscribers from "./pages/admin/AdminSubscribers";

export default function App() {
  useAuthBootstrap();
  useScrollRestoration();
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");

  if (isAdminRoute) {
    return (
      <Routes>
        <Route path="/admin/login" element={<Login />} />
        <Route
          path="/admin"
          element={
            <RequireAuth>
              <ScrollToTop />
              <AdminLayout />
            </RequireAuth>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="books" element={<AdminBooks />} />
          <Route path="books/new" element={<AdminBookForm />} />
          <Route path="books/:id" element={<AdminBookForm />} />
          <Route path="articles" element={<AdminArticles />} />
          <Route path="articles/new" element={<AdminArticleForm />} />
          <Route path="articles/:id" element={<AdminArticleForm />} />
          <Route path="translations" element={<AdminTranslations />} />
          <Route path="videos" element={<AdminVideos />} />
          <Route path="timeline" element={<AdminTimeline />} />
          <Route path="timeline/new" element={<AdminTimelineForm />} />
          <Route path="timeline/:id" element={<AdminTimelineForm />} />
          <Route path="comments" element={<AdminComments />} />
          <Route path="pages" element={<AdminPages />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>
      </Routes>
    );
  }
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <ScrollToTop />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/books" element={<Books />} />
          <Route path="/books/:slug" element={<BookDetail />} />
          <Route path="/articles" element={<Articles />} />
          <Route path="/articles/:slug" element={<ArticleDetail />} />
          <Route path="/videos" element={<Videos />} />
          <Route path="/translations" element={<Translations />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="subscribers" element={<AdminSubscribers />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
