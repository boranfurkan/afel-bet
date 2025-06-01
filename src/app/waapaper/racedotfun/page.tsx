import PageContainer from "@/components/PageContainer";

export default function SolrushPage() {
  return (
    <PageContainer
      title="RACEDOTFUN"
      content="racedotfun is a 3D racing game where players can connect their wallets
    via a web browser and race against each other. A prize pot is set
    before the race, and the winner takes it all. It's a skill-based
    gambling experience."
      media={{
        type: "video",
        src: "/videos/solrush.mp4",
        alt: "solrush demo",
      }}
    />
  );
}
