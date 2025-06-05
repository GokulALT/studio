import { HarvestForm } from "@/components/harvest/HarvestForm";
import { RainfallForm } from "@/components/harvest/RainfallForm";
import { HarvestLogTable } from "@/components/harvest/HarvestLogTable";

export default function HarvestPage() {
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold font-headline">Harvest Management</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
           <HarvestForm />
        </div>
        <div className="lg:col-span-1 space-y-6">
          <RainfallForm />
        </div>
      </div>
      
      <HarvestLogTable />
    </div>
  );
}
