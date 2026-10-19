import { redirect } from "next/navigation";

export default async function DynamicScanRoute({
  params
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  redirect(`/scan?token=${encodeURIComponent(token || "demo")}`);
}
