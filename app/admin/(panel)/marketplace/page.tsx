import { AdminHeader } from "@/components/admin/AdminUI";
import { ProductsManager } from "@/components/admin/ProductsManager";
import { getAllProductsAdmin } from "@/lib/marketplace-data";

export const dynamic = "force-dynamic";

export default async function AdminMarketplacePage() {
  const products = await getAllProductsAdmin();
  return (
    <div>
      <AdminHeader
        title="Marketplace products"
        description="Add and edit products for the Ndimih Boclair Marketplace. Set per-country Amazon availability — never fabricate availability, prices or ratings."
      />
      <ProductsManager initial={products} />
    </div>
  );
}
