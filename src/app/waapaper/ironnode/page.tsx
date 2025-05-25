import PageContainer from "@/components/PageContainer";

export default function IronNodePage() {
  return (
    <PageContainer
      title="IRONNODE"
      content="IronNode is the security backbone of AFEL, a Web3 development and
    auditing firm owned by Foreseon. It provides essential services to
    external projects while feeding revenue into the $WAA, ensuring
    ongoing growth and utility."
      media={{
        type: "image",
        src: "/images/ironnodelogo.png",
        alt: "ironnodelogo",
      }}
    />
  );
}
