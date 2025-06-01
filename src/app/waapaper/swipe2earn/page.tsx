import PageContainer from "@/components/PageContainer";
export default function Swipe2EarnPage() {
  return (
    <PageContainer
      title="SWIPE2EARN"
      content="Swipe2Earn is the most rewarding way for communities to connect. Like Tinder, but for Twitter posts, it gathers community tweets in one place for easy engagement. Swipers earn regular rewards while both swipers and posters grow their networks. Every interaction syncs directly with Twitter/X via API, boosting visibility for all."
      media={{
        type: "video",
        src: "/videos/swipe2earn.mp4",
        alt: "Swipe2Earn Demo",
      }}
    />
  );
}
