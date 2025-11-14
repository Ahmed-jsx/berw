import { ChartAreaInteractive } from "@/components/chart-area-interactive";
import { DataTable } from "@/components/data-table";
import { SectionCards } from "@/components/section-cards";
import { ProductDashboard } from "@/components/dashboard/product-dashboard";
import OrdersPage from "./orders/page";
import { ProductsTable } from "@/components/tables/ProductsTable";

export default function Page() {
  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          {/* <SectionCards /> */}
          <div className="px-4 lg:px-6">
            {/* <ChartAreaInteractive /> */}
            <OrdersPage />
          </div>
          <div className="px-4 lg:px-6">
            <DataTable />
          </div>
          <div className="px-4 lg:px-6">
          <ProductsTable />

            
          </div>
          {/* <ProductTable data={mockProductData} /> */}
        </div>
      </div>
    </div>
  );
}
