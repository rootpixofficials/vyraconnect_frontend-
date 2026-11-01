import ScanClient from "./ScanClient";

// Enforce dynamic server-side rendering so Next.js never statically caches /scan
export const dynamic = "force-dynamic";
export const revalidate = 0;

interface PageProps {
  searchParams: Promise<{ token?: string }>;
}

export default async function ScanPage({ searchParams }: PageProps) {
  const resolvedParams = await searchParams;
  const token = resolvedParams?.token || "9671543dca4c25f71d4a1601c5ce7c947c8a26d0a1a454e7e35ed6a4960018d1";

  // Pre-fetch QR data on the server during SSR for instant rendering and 0 client-side CORS/isolation issues
  let initialQrData: any = null;

  try {
    const backendInternalUrl = process.env.BACKEND_INTERNAL_URL || "http://127.0.0.1:5000";
    const res = await fetch(`${backendInternalUrl}/api/scan/${token}`, {
      cache: "no-store"
    });

    if (res.ok) {
      const data = await res.json();
      initialQrData = data.qr || null;
    } else {
      // Fallback to public domain if loopback is not reachable
      const publicRes = await fetch(`https://api.vyraconnect.in/api/scan/${token}`, {
        cache: "no-store"
      });
      if (publicRes.ok) {
        const data = await publicRes.json();
        initialQrData = data.qr || null;
      }
    }
  } catch (err: any) {
    console.error("Server-side scan fetch error:", err?.message);
    try {
      const publicRes = await fetch(`https://api.vyraconnect.in/api/scan/${token}`, {
        cache: "no-store"
      });
      if (publicRes.ok) {
        const data = await publicRes.json();
        initialQrData = data.qr || null;
      }
    } catch (err2: any) {
      console.error("Public scan fetch error:", err2?.message);
    }
  }

  return (
    <ScanClient 
      initialToken={token} 
      initialQrData={initialQrData}
    />
  );
}
