import ScanClient from "./ScanClient";

// Enforce dynamic server-side rendering so Next.js never prerenders or statically caches /scan
export const dynamic = "force-dynamic";
export const revalidate = 0;

interface PageProps {
  searchParams: Promise<{ token?: string }>;
}

export default async function ScanPage({ searchParams }: PageProps) {
  const resolvedParams = await searchParams;
  const token = resolvedParams?.token;

  return <ScanClient initialToken={token} />;
}
