import PageShell from "../components/layout/PageShell";
import VideoGrid from "../components/sections/VideoGrid";
import { useVideos } from "../hooks/useVideos";
import { useTranslation } from "react-i18next";

export default function Videos() {
  const { data: videos, isLoading, error } = useVideos();
  const { t } = useTranslation();

  return (
    <PageShell
      title={t("pages.videos.title")}
      subtitle={t("pages.videos.subtitle")}
    >
      {isLoading && <p className="text-muted">Loading…</p>}
      {error && <p className="text-burgundy">Could not load videos.</p>}
      {videos && videos.length === 0 && (
        <p className="text-muted">No videos yet.</p>
      )}
      {videos && videos.length > 0 && <VideoGrid videos={videos} />}
    </PageShell>
  );
}
