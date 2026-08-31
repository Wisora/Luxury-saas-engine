'use client';
import React, { useState } from "react";
import { LuxuryItem, VIPDrop } from "../types";

interface AuditResult {
  trustScore: number;
  complianceStatus: "Passed" | "Flagged";
  auditReport: string;
}

interface PhasePanelProps {
  activePhase?: number;
  phaseId?: number; // Supports prop passed by App.tsx
  items: LuxuryItem[];
  setItems: React.Dispatch<React.SetStateAction<LuxuryItem[]>>;
  isSystemActive?: boolean;
  setIsSystemActive?: React.Dispatch<React.SetStateAction<boolean>>;
  workerSpeed?: number;
  setWorkerSpeed?: (val: number) => void;
  autoScale?: boolean;
  setAutoScale?: React.Dispatch<React.SetStateAction<boolean>>;
  monetizationEnabled?: boolean;
  setMonetizationEnabled?: React.Dispatch<React.SetStateAction<boolean>>;
  logs?: any[];
  addLog?: (
    phase: number,
    agent: string,
    message: string,
    status: "info" | "success" | "warning" | "error"
  ) => void;
  systemMetrics?: any;
  setSystemMetrics?: any;
}

const PremiumMarkdown: React.FC<{ content: string }> = ({ content }) => {
  const formatted = content
    .replace(
      /^### (.*$)/gim,
      '<h3 class="text-lg font-serif font-bold text-gold-300 mt-4 mb-2">$1</h3>'
    )
    .replace(
      /^## (.*$)/gim,
      '<h2 class="text-xl font-serif font-bold text-gold-400 mt-6 mb-3">$1</h2>'
    )
    .replace(
      /^# (.*$)/gim,
      '<h1 class="text-2xl font-serif font-bold text-gold-400 mt-6 mb-4">$1</h1>'
    )
    .replace(
      /\*\*(.*?)\*\*/g,
      '<strong class="text-gold-200 font-semibold">$1</strong>'
    )
    .replace(
      /^\* (.*$)/gim,
      '<li class="ml-4 list-disc text-slate-300 my-1">$1</li>'
    )
    .replace(
      /^- (.*$)/gim,
      '<li class="ml-4 list-disc text-slate-300 my-1">$1</li>'
    )
    .replace(/\n\n/g, "<br/><br/>");

  return (
    <div
      className="prose prose-invert max-w-none text-slate-300 text-sm leading-relaxed"
      dangerouslySetInnerHTML={{ __html: formatted }}
    />
  );
};

export const PhasePanel: React.FC<PhasePanelProps> = ({
  activePhase: propActivePhase,
  phaseId,
  items,
  setItems,
  isSystemActive = true,
  setIsSystemActive = () => {},
  workerSpeed = 1,
  setWorkerSpeed = () => {},
  autoScale = false,
  setAutoScale = () => {},
  monetizationEnabled = false,
  setMonetizationEnabled = () => {},
}) => {
  // Derive phase index prioritizing activePhase, phaseId, or default 1
  const activePhase = propActivePhase ?? phaseId ?? 1;

  // Phase 1 State
  const [selectedCategory, setSelectedCategory] = useState<string>("Watches");
  const [analyzing, setAnalyzing] = useState<boolean>(false);
  const [marketReport, setMarketReport] = useState<string | null>(null);

  // Phase 2 State
  const [auditingId, setAuditingId] = useState<string | null>(null);
  const [auditResults, setAuditResults] = useState<Record<string, AuditResult>>(
    {}
  );
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Phase 3 State
  const [abVariant, setAbVariant] = useState<"A" | "B">("A");

  // Phase 5 State
  const [vipTheme, setVipTheme] = useState<string>("Vintage Chronographs");
  const [generatingVip, setGeneratingVip] = useState<boolean>(false);
  const [vipDrop, setVipDrop] = useState<VIPDrop | null>(null);

  // Phase 6 State
  const [spatialView, setSpatialView] = useState<boolean>(false);

  // Phase 7 State
  const [investorQ, setInvestorQ] = useState<string>("");
  const [investorA, setInvestorA] = useState<string | null>(null);
  const [askingInvestor, setAskingInvestor] = useState<boolean>(false);
  const [exportingPdf, setExportingPdf] = useState<boolean>(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyzeCategory = async () => {
    setAnalyzing(true);
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ category: selectedCategory }),
      });
      const data = await res.json();
      setMarketReport(data.report);
    } catch (err) {
      console.error(err);
      setMarketReport("Failed to generate market insight.");
    } finally {
      setAnalyzing(false);
    }
  };

  const handleAuditItem = async (item: LuxuryItem) => {
    setAuditingId(item.id);

    let imageBase64: string | undefined = undefined;
    let mimeType: string | undefined = undefined;

    if (imagePreview && imageFile) {
      imageBase64 = imagePreview.split(",")[1];
      mimeType = imageFile.type;
    }

    try {
      const res = await fetch("/api/compliance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: item.name,
          brandOrCreator: item.brandOrCreator,
          category: item.category,
          price: item.price,
          provenanceDescription: item.complianceNotes,
          imageBase64,
          mimeType,
        }),
      });
      const data: AuditResult = await res.json();

      setAuditResults((prev) => ({ ...prev, [item.id]: data }));

      setItems((prev) =>
        prev.map((i) =>
          i.id === item.id
            ? {
                ...i,
                trustScore: data.trustScore,
                complianceStatus: data.complianceStatus,
              }
            : i
        )
      );
    } catch (err) {
      console.error(err);
    } finally {
      setAuditingId(null);
    }
  };

  const handleGenerateVipDrop = async () => {
    setGeneratingVip(true);
    try {
      const res = await fetch("/api/vip-drop", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          theme: vipTheme,
          targetTier: "Ultra-High-Net-Worth (UHNW)",
          monetization: monetizationEnabled
            ? "High-Margin Private Allocation"
            : "Standard Showcase",
        }),
      });
      const data: VIPDrop = await res.json();
      setVipDrop(data);
    } catch (err) {
      console.error(err);
    } finally {
      setGeneratingVip(false);
    }
  };

  const handleAskInvestor = async () => {
    if (!investorQ.trim()) return;
    setAskingInvestor(true);
    try {
      const res = await fetch("/api/investor-qa", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: investorQ }),
      });
      const data = await res.json();
      setInvestorA(data.answer);
    } catch (err) {
      console.error(err);
      setInvestorA("Unable to contact Strategy Agent.");
    } finally {
      setAskingInvestor(false);
    }
  };

  const handleExportPdf = async () => {
    setExportingPdf(true);
    try {
      const res = await fetch("/api/export-pdf");
      if (!res.ok) throw new Error("Report generation failed.");
      
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "aura_executive_report.pdf";
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("PDF Export Error:", err);
      alert("Could not download report. Please check server status.");
    } finally {
      setExportingPdf(false);
    }
  };

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-6 backdrop-blur-md">
      {/* PHASE 1: MARKET SCANNER */}
      {activePhase === 1 && (
        <div className="space-y-6">
          <div className="flex justify-between items-center border-b border-slate-800 pb-4">
            <div>
              <h2 className="text-xl font-serif text-gold-400">
                Phase 1: Market Intelligence & Intake
              </h2>
              <p className="text-xs text-slate-400">
                Scrapes luxury market signals and generates AI insights
              </p>
            </div>
            <button
              onClick={() => setIsSystemActive((prev) => !prev)}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition ${
                isSystemActive
                  ? "bg-red-950/80 text-red-300 border border-red-700/50 hover:bg-red-900"
                  : "bg-emerald-950/80 text-emerald-300 border border-emerald-700/50 hover:bg-emerald-900"
              }`}
            >
              {isSystemActive
                ? "Pause Ingestion Feed"
                : "Resume Ingestion Feed"}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {["Watches", "Fashion", "Art"].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`p-4 rounded-lg border text-left transition ${
                  selectedCategory === cat
                    ? "border-gold-500 bg-gold-950/20 text-gold-300"
                    : "border-slate-800 bg-slate-950/40 text-slate-400 hover:border-slate-700"
                }`}
              >
                <div className="text-sm font-semibold">{cat} Sector</div>
                <div className="text-xs text-slate-500 mt-1">
                  Click to target AI analysis
                </div>
              </button>
            ))}
          </div>

          <div className="flex gap-4">
            <button
              onClick={handleAnalyzeCategory}
              disabled={analyzing}
              className="px-5 py-2.5 bg-gold-600 hover:bg-gold-500 disabled:opacity-50 text-slate-950 font-semibold text-xs rounded-lg transition cursor-pointer"
            >
              {analyzing
                ? "Synthesizing Signals..."
                : `Analyze ${selectedCategory} Trends`}
            </button>
          </div>

          {marketReport && (
            <div className="p-5 bg-slate-950/80 border border-gold-500/30 rounded-lg">
              <PremiumMarkdown content={marketReport} />
            </div>
          )}
        </div>
      )}

      {/* PHASE 2: COMPLIANCE & PROVENANCE */}
      {activePhase === 2 && (
        <div className="space-y-6">
          <div className="border-b border-slate-800 pb-4">
            <h2 className="text-xl font-serif text-gold-400">
              Phase 2: Resilience & Multimodal Audit
            </h2>
            <p className="text-xs text-slate-400">
              FTC regulatory verification and visual authenticity checks
            </p>
          </div>

          <div className="border border-dashed border-gold-500/30 rounded-lg p-4 bg-slate-950/40 text-center">
            {imagePreview ? (
              <div className="relative inline-block">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="h-32 object-cover rounded border border-gold-500/40"
                />
                <button
                  onClick={() => {
                    setImageFile(null);
                    setImagePreview(null);
                  }}
                  className="absolute -top-2 -right-2 bg-red-900 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center hover:bg-red-800 cursor-pointer"
                >
                  ✕
                </button>
              </div>
            ) : (
              <label className="cursor-pointer block space-y-2">
                <span className="text-xs text-gold-300 font-medium block">
                  📷 Optional: Upload Visual Asset for Gemini Multimodal Inspection
                </span>
                <span className="text-[10px] text-slate-500 block">
                  Supports PNG, JPG, WEBP (hallmark verification, condition check)
                </span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            )}
          </div>

          <div className="grid grid-cols-1 gap-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="p-4 bg-slate-950/50 border border-slate-800 rounded-lg flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-slate-200">
                      {item.name}
                    </span>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded ${
                        item.complianceStatus === "Passed"
                          ? "bg-emerald-950 text-emerald-400 border border-emerald-800"
                          : "bg-amber-950 text-amber-400 border border-amber-800"
                      }`}
                    >
                      {item.complianceStatus}
                    </span>
                  </div>
                  <div className="text-xs text-slate-400">
                    {item.brandOrCreator} • {item.price} • Trust Score:{" "}
                    {item.trustScore}%
                  </div>
                </div>

                <button
                  onClick={() => handleAuditItem(item)}
                  disabled={auditingId === item.id}
                  className="px-4 py-2 bg-gold-600/20 text-gold-300 border border-gold-500/40 hover:bg-gold-600/30 disabled:opacity-50 text-xs font-semibold rounded-lg transition cursor-pointer"
                >
                  {auditingId === item.id ? "Auditing Asset..." : "Run Audit"}
                </button>

                {auditResults[item.id] && (
                  <div className="w-full mt-3 p-4 bg-slate-900 border border-gold-500/20 rounded-lg text-xs">
                    <div className="font-semibold text-gold-400 mb-1">
                      Audit Status: {auditResults[item.id].complianceStatus}{" "}
                      (Trust: {auditResults[item.id].trustScore}%)
                    </div>
                    <PremiumMarkdown
                      content={auditResults[item.id].auditReport}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* PHASE 3: ANALYTICS & ROI */}
      {activePhase === 3 && (
        <div className="space-y-6">
          <div className="border-b border-slate-800 pb-4">
            <h2 className="text-xl font-serif text-gold-400">
              Phase 3: Analytics & High-Yield ROI
            </h2>
            <p className="text-xs text-slate-400">
              Conversion models and fraud prevention monitoring
            </p>
          </div>

          <div className="flex gap-4 mb-4">
            <button
              onClick={() => setAbVariant("A")}
              className={`px-4 py-2 text-xs font-semibold rounded-lg border transition ${
                abVariant === "A"
                  ? "bg-gold-500 text-slate-950 border-gold-400"
                  : "bg-slate-950 text-slate-400 border-slate-800"
              }`}
            >
              Variant A (Private Concierge)
            </button>
            <button
              onClick={() => setAbVariant("B")}
              className={`px-4 py-2 text-xs font-semibold rounded-lg border transition ${
                abVariant === "B"
                  ? "bg-gold-500 text-slate-950 border-gold-400"
                  : "bg-slate-950 text-slate-400 border-slate-800"
              }`}
            >
              Variant B (Direct VIP Drop)
            </button>
          </div>

          <div className="p-6 bg-slate-950/60 border border-slate-800 rounded-lg space-y-2">
            <div className="text-sm font-semibold text-gold-300">
              Active Test Optimization: Variant {abVariant}
            </div>
            <p className="text-xs text-slate-400">
              {abVariant === "A"
                ? "High-touch email outreach yielding 14.2% conversion on assets >$100k."
                : "Instant luxury drop notification yielding 22.8% immediate purchase intent on watches."}
            </p>
          </div>
        </div>
      )}

      {/* PHASE 4: AUTOMATION & SCALING */}
      {activePhase === 4 && (
        <div className="space-y-6">
          <div className="border-b border-slate-800 pb-4">
            <h2 className="text-xl font-serif text-gold-400">
              Phase 4: Automation & Execution Scaling
            </h2>
            <p className="text-xs text-slate-400">
              Worker concurrency settings and instance scaling
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-xs text-slate-300 font-semibold block mb-2">
                Worker Speed: {workerSpeed}x
              </label>
              <input
                type="range"
                min="1"
                max="10"
                value={workerSpeed}
                onChange={(e) => setWorkerSpeed(Number(e.target.value))}
                className="w-full accent-gold-500 bg-slate-800 rounded-lg cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between p-4 bg-slate-950/50 border border-slate-800 rounded-lg">
              <span className="text-xs text-slate-300">
                Enable Dynamic Auto-Scaling
              </span>
              <button
                onClick={() => setAutoScale((prev) => !prev)}
                className={`px-4 py-1.5 text-xs rounded font-semibold transition ${
                  autoScale
                    ? "bg-emerald-900 text-emerald-200 border border-emerald-600"
                    : "bg-slate-800 text-slate-400"
                }`}
              >
                {autoScale ? "Enabled" : "Disabled"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PHASE 5: REVENUE EXPANSION */}
      {activePhase === 5 && (
        <div className="space-y-6">
          <div className="border-b border-slate-800 pb-4">
            <h2 className="text-xl font-serif text-gold-400">
              Phase 5: Revenue Expansion Engine
            </h2>
            <p className="text-xs text-slate-400">
              Generates targeted luxury drops and monetization strategies
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-xs text-slate-300 block mb-1">
                Campaign Drop Theme
              </label>
              <input
                type="text"
                value={vipTheme}
                onChange={(e) => setVipTheme(e.target.value)}
                className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded text-xs text-slate-200 focus:border-gold-500 focus:outline-none"
              />
            </div>

            <div className="flex items-center justify-between p-4 bg-slate-950/50 border border-slate-800 rounded-lg">
              <span className="text-xs text-slate-300">
                Monetization Boost Layer
              </span>
              <button
                onClick={() => setMonetizationEnabled((prev) => !prev)}
                className={`px-4 py-1.5 text-xs rounded font-semibold transition ${
                  monetizationEnabled
                    ? "bg-gold-500 text-slate-950"
                    : "bg-slate-800 text-slate-400"
                }`}
              >
                {monetizationEnabled ? "Active (+3.5% Fee)" : "Standard"}
              </button>
            </div>

            <button
              onClick={handleGenerateVipDrop}
              disabled={generatingVip}
              className="px-5 py-2.5 bg-gold-600 hover:bg-gold-500 disabled:opacity-50 text-slate-950 font-semibold text-xs rounded-lg transition cursor-pointer"
            >
              {generatingVip
                ? "Curating VIP Drop..."
                : "Generate AI VIP Drop Campaign"}
            </button>

            {vipDrop && (
              <div className="p-5 bg-slate-950 border border-gold-500/30 rounded-lg space-y-3">
                <h3 className="text-base font-serif font-bold text-gold-300">
                  {vipDrop.title}
                </h3>
                <p className="text-xs text-slate-400 italic">
                  {vipDrop.description}
                </p>
                <div className="border-t border-slate-800 pt-3">
                  <PremiumMarkdown content={vipDrop.newsletterMarkdown} />
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* PHASE 6: FUTURE PROOFING */}
      {activePhase === 6 && (
        <div className="space-y-6">
          <div className="border-b border-slate-800 pb-4">
            <h2 className="text-xl font-serif text-gold-400">
              Phase 6: Future-Proofing & Spatial AI
            </h2>
            <p className="text-xs text-slate-400">
              Apple Vision Pro spatial rendering preview and voice control
            </p>
          </div>

          <div className="flex justify-between items-center p-4 bg-slate-950/60 border border-slate-800 rounded-lg">
            <div>
              <div className="text-xs font-semibold text-slate-200">
                Apple Vision Pro 3D Canvas
              </div>
              <div className="text-[10px] text-slate-500">
                Render 3D assets in Spatial USDZ format
              </div>
            </div>
            <button
              onClick={() => setSpatialView((prev) => !prev)}
              className={`px-4 py-2 text-xs font-semibold rounded-lg border transition ${
                spatialView
                  ? "bg-gold-500 text-slate-950 border-gold-400"
                  : "bg-slate-900 text-slate-300 border-slate-700"
              }`}
            >
              {spatialView ? "Disable Spatial Canvas" : "Enable Spatial View"}
            </button>
          </div>

          {spatialView && (
            <div className="h-48 border border-gold-500/40 rounded-lg bg-linear-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center text-xs text-gold-300">
              [3D Spatial Viewport Active — Spatial Mesh Loaded]
            </div>
          )}
        </div>
      )}

      {/* PHASE 7: INVESTOR READINESS */}
      {activePhase === 7 && (
        <div className="space-y-6">
          <div className="flex justify-between items-center border-b border-slate-800 pb-4">
            <div>
              <h2 className="text-xl font-serif text-gold-400">
                Phase 7: Investor Readiness & Strategy Hub
              </h2>
              <p className="text-xs text-slate-400">
                Real-time pitch deck strategy agent and operational Q&A
              </p>
            </div>

            <button
              onClick={handleExportPdf}
              disabled={exportingPdf}
              className="px-4 py-2 bg-gold-600 hover:bg-gold-500 disabled:opacity-50 text-slate-950 font-bold text-xs rounded-lg transition flex items-center gap-2 cursor-pointer shadow-lg shadow-gold-950/30"
            >
              {exportingPdf ? "Generating PDF..." : "📄 Export PDF Report"}
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-xs text-slate-300 block mb-1">
                Ask Chief Strategy Officer AI
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g., How does zero-inventory risk maintain 85% gross margins?"
                  value={investorQ}
                  onChange={(e) => setInvestorQ(e.target.value)}
                  className="flex-1 p-2.5 bg-slate-950 border border-slate-800 rounded text-xs text-slate-200 focus:border-gold-500 focus:outline-none"
                />
                <button
                  onClick={handleAskInvestor}
                  disabled={askingInvestor}
                  className="px-4 py-2 bg-gold-600 hover:bg-gold-500 disabled:opacity-50 text-slate-950 text-xs font-semibold rounded-lg transition cursor-pointer"
                >
                  {askingInvestor ? "Consulting..." : "Ask Strategy Agent"}
                </button>
              </div>
            </div>

            {investorA && (
              <div className="p-5 bg-slate-950 border border-gold-500/30 rounded-lg">
                <PremiumMarkdown content={investorA} />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};