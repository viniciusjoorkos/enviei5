import { LoadingSpinner } from "@/components/ui/loading-spinner";

export default function AuthLoading() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <div className="text-center">
        <LoadingSpinner size="medium" />
        <p className="mt-4 text-sm text-gray-500">Carregando autenticação...</p>
      </div>
    </div>
  );
} 