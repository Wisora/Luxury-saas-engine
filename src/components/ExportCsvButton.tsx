'use client';

export default function ExportCsvButton({ subdomain }: { subdomain: string }) {
  const handleExport = () => {
    window.open(`/api/telemetry/export?subdomain=${subdomain}`, '_blank');
  };

  return (
    <button
      onClick={handleExport}
      className="px-4 py-2 rounded-md bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 text-sm font-medium border border-amber-500/30 transition-colors"
    >
      Export Telemetry CSV 📥
    </button>
  );
}