import { AdminHeader } from "@/components/admin/AdminUI";
import { AffiliateNetworks } from "@/components/admin/AffiliateNetworks";
import { getProviderStatuses } from "@/lib/affiliate/registry";

export const dynamic = "force-dynamic";

export default function AdminAffiliatePage() {
  const statuses = getProviderStatuses();
  return (
    <div>
      <AdminHeader
        title="Affiliate networks"
        description="Amazon, Awin, impact.com and CJ Affiliate — configuration status and capabilities."
      />
      <AffiliateNetworks statuses={statuses} />
    </div>
  );
}
