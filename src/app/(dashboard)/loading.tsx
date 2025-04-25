import { LoadingSpinner } from "@/components/ui/loading-spinner";

export default function DashboardLoading() {
  return (
    <div className="min-h-[90vh] flex items-center justify-center">
      <div className="text-center">
        <LoadingSpinner size="medium" />
        <p className="mt-4 text-sm text-gray-500">Carregando dashboard...</p>
      </div>
    </div>
  );
} 