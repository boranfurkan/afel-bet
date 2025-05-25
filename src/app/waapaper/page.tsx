import PageContainer from "@/components/PageContainer";

export default function AfelPage() {
  return (
    <PageContainer
      title="AFEL"
      content="AFEL is an ecosystem driven by top-tier developers and a community-first approach, powered by FEL NFTs and the $WAA token. Holding a FEL NFT means joining a space where degens and builders unite, with constant utility and reward growth. We share revenue with our NFT holders, conduct token buybacks, and airdrop them back to the community."
      media={{
        type: "video",
        src: "/videos/ecosystem.webm",
        alt: "ecosystem",
      }}
    />
  );
}
