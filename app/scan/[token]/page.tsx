import ScanClient from "../ScanClient";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function DynamicScanRoute({
  params
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  return <ScanClient initialToken={token} />;
}
