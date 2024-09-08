import dynamic from "next/dynamic";
import ReviewsList from "@/components/ReviewsList";

const LazyMap = dynamic(() => import("@/components/map"), {
  loading: () => <p>Loading...</p>,
  ssr: false,
});

export default function Home() {
  return (
    <main style={{ display: 'flex', height: '100vh', width: '100vw' }}>
      <div style={{ flex: '3 1 0%' }}>
        <LazyMap />
      </div>
      <div style={{ flex: '2 1 0%', overflowY: 'auto' }}>
        <ReviewsList />
      </div>
    </main>
  );
}