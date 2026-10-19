import { redirect } from "next/navigation";
import { ACTIVE_TEST_TOKEN } from "@/lib/config";

export default async function DynamicScanRoute({
  params
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  redirect(`/scan?token=${encodeURIComponent(token || ACTIVE_TEST_TOKEN)}`);
}
