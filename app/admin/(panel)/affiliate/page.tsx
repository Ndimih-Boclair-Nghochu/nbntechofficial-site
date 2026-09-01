import { AdminHeader } from "@/components/admin/AdminUI";
import { AffiliateNetworks } from "@/components/admin/AffiliateNetworks";
import { PinterestPanel } from "@/components/admin/PinterestPanel";
import { getProviderStatuses } from "@/lib/affiliate/registry";

export const dynamic = "force-dynamic";

export default function AdminAffiliatePage() {
  const statuses = getProviderStatuses();
  return (
    <div className="space-y-8">
      <div>
        <AdminHeader
          title="Affiliate networks"
          description="Amazon, Awin, impact.com and CJ Affiliate — configuration status and capabilities."
        />
        <AffiliateNetworks statuses={statuses} />
      </div>

      <div>
        <AdminHeader
          title="Distribution"
          description="Push your catalogue to external channels."
        />
        <PinterestPanel />
      </div>
    </div>
  );
}
