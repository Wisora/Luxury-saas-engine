'use client';
import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Compass,
  ShieldCheck,
  BarChart3,
  Zap,
  Coins,
  Sparkles,
  LineChart,
  Volume2,
  VolumeX,
  Terminal,
  UserCheck,
  FileText,
  Lock,
  LayoutDashboard,
} from "lucide-react";

import { LuxuryItem, PipelineLog } from "../types";
import { INITIAL_LUXURY_ITEMS, INITIAL_LOGS } from "../components/MockData";
import OrchestratorView from "../components/OrchestratorView";
import { PhasePanel } from "../components/PhasePanel";
import { ErrorBoundary } from "../components/ErrorBoundary";
import { PrivacyPolicy } from "../components/PrivacyPolicy";
import { TermsOfService } from "../components/TermsOfService";
import { AffiliateBanner } from "../components/AffiliateBanner";

type ActiveView = "dashboard" | "privacy" | "terms";

export default function App() {
  const [activeView, setActiveView] = useState<ActiveView>("dashboard");
  const [currentPhase, setCurrentPhase] = useState<number>(1);
  const [items, setItems] = useState<LuxuryItem[]>(() =>
    Array.isArray(INITIAL_LUXURY_ITEMS) ? INITIAL_LUXURY_ITEMS : []
  );
  const [logs, setLogs] = useState<PipelineLog[]>(() =>
    Array.isArray(INITIAL_LOGS)
      ? INITIAL_LOGS.map((log) => ({
          ...log,
          id: `${Date.now()}-${log.id}`,
        }))
      : []
  );

  const [systemMetrics, setSystemMetrics] = useState({
    uptime: "02h 45m 12s",
    activeCollectors: 3,
    itemsProcessed: 1420,
    cacheHitRate: 94.2,
    queueSize: 8,
    estRevenue: 185200,
    roi: 8.2,
  });

  const [soundEnabled, setSoundEnabled] = useState(false);
  const [wsStatus, setWsStatus] = useState<"connected" | "connecting" | "disconnected">("connecting");

  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const reconnectDelayRef = useRef<number>(1000); // Base retry: 1 sec

  useEffect(() => {
    let isMounted = true;
    const fetchInitialData = async () => {
      try {
        const res = await fetch("/api/items");
        if (res.ok) {
          const data = await res.json();
          if (isMounted && Array.isArray(data?.items) && data.items.length > 0) {
            setItems(data.items);
          }
        }
      } catch {
        // Retain initial mock data fallback
      }
    };
    fetchInitialData();
    return () => {
      isMounted = false;
    };
  }, []);

  const playLuxuryTone = useCallback(
    (type: "nav" | "success" | "warn" | "click") => {
      if (!soundEnabled) return;
      try {
        const AudioContextClass =
          window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        if (!AudioContextClass) return;
        const ctx = new AudioContextClass();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.connect(gain);
        gain.connect(ctx.destination);

        if (type === "nav") {
          osc.frequency.setValueAtTime(587.33, ctx.currentTime);
          osc.type = "triangle";
          gain.gain.setValueAtTime(0.04, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.3);
          osc.start();
          osc.stop(ctx.currentTime + 0.35);
        } else if (type === "success") {
          osc.frequency.setValueAtTime(659.25, ctx.currentTime);
          osc.frequency.setValueAtTime(880.0, ctx.currentTime + 0.08);
          osc.type = "sine";
          gain.gain.setValueAtTime(0.05, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.5);
          osc.start();
          osc.stop(ctx.currentTime + 0.55);
        } else if (type === "click") {
          osc.frequency.setValueAtTime(440.0, ctx.currentTime);
          osc.type = "triangle";
          gain.gain.setValueAtTime(0.03, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.15);
          osc.start();
          osc.stop(ctx.currentTime + 0.18);
        } else if (type === "warn") {
          osc.frequency.setValueAtTime(220.0, ctx.currentTime);
          osc.frequency.setValueAtTime(196.0, ctx.currentTime + 0.1);
          osc.type = "sawtooth";
          gain.gain.setValueAtTime(0.02, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.4);
          osc.start();
          osc.stop(ctx.currentTime + 0.45);
        }
      } catch {
        // Silently skip context creation issues
      }
    },
    [soundEnabled]
  );

  const addLog = useCallback(
    (
      phase: number,
      agent: string,
      message: string,
      status: "info" | "success" | "warning" | "error"
    ) => {
      const safeStatus = ["info", "success", "warning", "error"].includes(status)
        ? status
        : "info";

      const newLog: PipelineLog = {
        id: `${Date.now()}-${Math.random()}`,
        timestamp: new Date().toTimeString().split(" ")[0],
        phase: Number(phase) || 1,
        agent: String(agent || "Telemetry Core"),
        message: String(message || "Event processed"),
        status: safeStatus,
      };

      setLogs((prev) => [newLog, ...(Array.isArray(prev) ? prev : [])].slice(0, 50));

      if (safeStatus === "success") playLuxuryTone("success");
      else if (safeStatus === "warning" || safeStatus === "error") playLuxuryTone("warn");
      else playLuxuryTone("click");
    },
    [playLuxuryTone]
  );

  // Exponential Backoff Auto-Reconnecting WebSocket
  useEffect(() => {
    let ws: WebSocket | null = null;
    let isMounted = true;
    const WS_PORT = "5000";

    const connect = () => {
      if (!isMounted) return;
      setWsStatus("connecting");

      try {
        const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
        const host = window.location.hostname || "localhost";
        ws = new WebSocket(`${protocol}//${host}:${WS_PORT}`);

        ws.onopen = () => {
          if (!isMounted) return;
          setWsStatus("connected");
          reconnectDelayRef.current = 1000;
        };

        ws.onmessage = (event) => {
          if (!isMounted || !event.data) return;
          try {
            const data = JSON.parse(event.data);
            
            if (data && typeof data === "object") {
              if (Array.isArray(data.items)) {
                setItems(data.items);
              }
              const rawLevel = data.level || "info";
              const mappedStatus =
                rawLevel === "warning" ? "warning" : rawLevel === "success" ? "success" : "info";

              addLog(
                currentPhase,
                data.agent || "Backend WS Stream",
                data.message || "Telemetry heartbeat received",
                mappedStatus
              );
            }
          } catch {
            // Silently ignore parse errors
          }
        };

        ws.onclose = () => {
          if (!isMounted) return;
          setWsStatus("disconnected");
          const nextDelay = Math.min(reconnectDelayRef.current * 2, 16000);
          reconnectDelayRef.current = nextDelay;
          reconnectTimeoutRef.current = setTimeout(connect, nextDelay);
        };

        ws.onerror = () => {
          if (ws) ws.close();
        };
      } catch {
        setWsStatus("disconnected");
      }
    };

    connect();

    return () => {
      isMounted = false;
      if (reconnectTimeoutRef.current) clearTimeout(reconnectTimeoutRef.current);
      if (ws) {
        ws.onopen = null;
        ws.onmessage = null;
        ws.onerror = null;
        ws.onclose = null;
        if (ws.readyState === WebSocket.OPEN) {
          ws.close();
        } else if (ws.readyState === WebSocket.CONNECTING) {
          ws.onopen = () => ws?.close();
        }
      }
    };
  }, [currentPhase, addLog]);

  useEffect(() => {
    const timer = setInterval(() => {
      const collectors: Array<{ name: string; phase: number; msg: string; type: "info" | "success" | "warning" | "error" }> = [
        { name: "Farfetch Collector", phase: 1, msg: "Polled exotic accessories index. Cache delta: +0.4%.", type: "info" },
        { name: "Chrono24 Collector", phase: 1, msg: "Audited regional pricing indices. 4 active items verified.", type: "success" },
        { name: "1stDibs Collector", phase: 1, msg: "Sync completed for contemporary art catalog feeds.", type: "info" },
        { name: "Sothebys Realty", phase: 1, msg: "Parsed Duplex listing maps. Structural deeds authenticated.", type: "info" },
        { name: "Data Validation Agent", phase: 2, msg: "Running automatic SHA-256 validation scans...", type: "success" },
        { name: "Caching Agent", phase: 4, msg: "Prerendered 5 fresh catalog sheets to edge servers.", type: "info" },
      ];

      const item = collectors[Math.floor(Math.random() * collectors.length)];

      setSystemMetrics((prev) => ({
        ...prev,
        itemsProcessed: (prev.itemsProcessed || 0) + Math.floor(Math.random() * 2) + 1,
      }));

      addLog(item.phase, item.name, item.msg, item.type);
    }, 15000);

    return () => clearInterval(timer);
  }, [addLog]);

  const handleSelectPhase = (phase: number) => {
    setCurrentPhase(phase);
    setActiveView("dashboard");
    playLuxuryTone("nav");
  };

  const handleViewChange = (view: ActiveView) => {
    setActiveView(view);
    playLuxuryTone("click");
  };

  return (
    <div className="min-h-screen bg-slate-950 text-amber-100 flex flex-col font-sans selection:bg-amber-500/20 selection:text-amber-300 antialiased">
      {/* Network Compliance Disclosure Banner */}
      <AffiliateBanner />

      <header className="border-b border-gray-800/80 bg-[#0f141d]/90 backdrop-blur-md sticky top-0 z-50 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => handleViewChange("dashboard")}
            className="flex items-center gap-3 text-left focus:outline-none group"
          >
            <div className="h-9 w-9 bg-linear-to-tr from-amber-600 to-amber-400 rounded-lg flex items-center justify-center shadow-lg relative overflow-hidden group-hover:scale-105 transition-transform">
              <span className="font-serif font-black text-black text-lg tracking-tighter">
                A
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-sm font-serif font-semibold tracking-wider text-white uppercase group-hover:text-amber-400 transition-colors">
                  AURA ORCHESTRATOR
                </h1>
                <span className="text-[9px] font-mono bg-amber-400/10 text-amber-400 px-1.5 py-0.5 rounded border border-amber-400/20">
                  v1.4 Enterprise
                </span>
              </div>
              <p className="text-[10px] font-mono text-gray-500">
                Luxury Market Pipeline Console
              </p>
            </div>
          </button>
        </div>

        <nav className="hidden md:flex items-center gap-4 text-xs font-mono">
          <button
            onClick={() => handleViewChange("dashboard")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-all ${
              activeView === "dashboard"
                ? "bg-amber-500/10 border-amber-400 text-amber-300"
                : "border-transparent text-gray-400 hover:text-white hover:bg-gray-900"
            }`}
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span>Dashboard</span>
          </button>
          <button
            onClick={() => handleViewChange("privacy")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-all ${
              activeView === "privacy"
                ? "bg-amber-500/10 border-amber-400 text-amber-300"
                : "border-transparent text-gray-400 hover:text-white hover:bg-gray-900"
            }`}
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Privacy</span>
          </button>
          <button
            onClick={() => handleViewChange("terms")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-all ${
              activeView === "terms"
                ? "bg-amber-500/10 border-amber-400 text-amber-300"
                : "border-transparent text-gray-400 hover:text-white hover:bg-gray-900"
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Terms</span>
          </button>
        </nav>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 text-[10px] font-mono px-2.5 py-1 rounded-full bg-gray-900 border border-gray-800">
            <span
              className={`h-2 w-2 rounded-full ${
                wsStatus === "connected"
                  ? "bg-emerald-400 animate-pulse"
                  : wsStatus === "connecting"
                  ? "bg-amber-400 animate-ping"
                  : "bg-red-500"
              }`}
            />
            <span className="text-gray-400 uppercase">{wsStatus}</span>
          </div>

          <button
            onClick={() => {
              setSoundEnabled(!soundEnabled);
              if (!soundEnabled) {
                setTimeout(() => playLuxuryTone("success"), 100);
              }
            }}
            className={`flex items-center gap-1.5 text-xs font-mono px-3 py-1.5 rounded-full border transition-all cursor-pointer ${
              soundEnabled
                ? "bg-amber-400/10 border-amber-400 text-amber-300"
                : "bg-gray-900 border-gray-800 text-gray-500 hover:text-gray-400 hover:border-gray-700"
            }`}
          >
            {soundEnabled ? (
              <>
                <Volume2 className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                <span>CHIMES ON</span>
              </>
            ) : (
              <>
                <VolumeX className="w-3.5 h-3.5 text-gray-500" />
                <span>MUTE</span>
              </>
            )}
          </button>

          <div className="hidden lg:flex items-center gap-2 border-l border-gray-800 pl-4 text-xs font-mono">
            <UserCheck className="w-4 h-4 text-amber-400" />
            <span className="text-gray-400">
              Operator: craig71abels@gmail.com
            </span>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 space-y-6">
        {activeView === "privacy" && <PrivacyPolicy />}
        {activeView === "terms" && <TermsOfService />}

        {activeView === "dashboard" && (
          <>
            <ErrorBoundary fallbackTitle="Orchestrator Overview Fault">
              <OrchestratorView
                currentPhase={currentPhase}
                onSelectPhase={handleSelectPhase}
                systemMetrics={systemMetrics}
              />
            </ErrorBoundary>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              <div className="lg:col-span-1 space-y-4">
                <div className="bg-[#0f141d] border border-gray-800/60 rounded-xl p-4 shadow-md">
                  <h3 className="text-xs font-mono tracking-wider text-amber-500 uppercase mb-3">
                    Pipeline Navigation
                  </h3>

                  <div className="space-y-1.5">
                    {[
                      { id: 1, label: "Market Scanner", icon: Compass, sub: "Phase 1: Collectors" },
                      { id: 2, label: "Governance & Safety", icon: ShieldCheck, sub: "Phase 2: Trust Guard" },
                      { id: 3, label: "Optimization Metrics", icon: BarChart3, sub: "Phase 3: Conversions" },
                      { id: 4, label: "Automation Engine", icon: Zap, sub: "Phase 4: CDN & Caches" },
                      { id: 5, label: "Revenue Drops", icon: Coins, sub: "Phase 5: VIP Drops" },
                      { id: 6, label: "Future Provisions", icon: Sparkles, sub: "Phase 6: Voice & AR" },
                      { id: 7, label: "Investor Portal", icon: LineChart, sub: "Phase 7: Strategy Hub" },
                    ].map((phase) => {
                      const Icon = phase.icon;
                      const isSelected = currentPhase === phase.id;

                      return (
                        <button
                          key={phase.id}
                          onClick={() => handleSelectPhase(phase.id)}
                          className={`w-full flex items-center justify-between p-2.5 rounded-lg border text-left transition-all cursor-pointer ${
                            isSelected
                              ? "bg-amber-500/10 border-amber-400 text-white shadow-sm"
                              : "bg-gray-900/10 border-transparent hover:bg-gray-900/30 hover:border-gray-800 text-gray-400"
                          }`}
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <Icon
                              className={`w-4 h-4 shrink-0 ${isSelected ? "text-amber-400" : "text-gray-500"}`}
                            />
                            <div className="min-w-0">
                              <div className="text-[11.5px] font-medium truncate">
                                {phase.label}
                              </div>
                              <div className="text-[9px] text-gray-500 font-mono">
                                {phase.sub}
                              </div>
                            </div>
                          </div>
                          <span
                            className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                              isSelected
                                ? "bg-amber-400/20 text-amber-300"
                                : "bg-gray-900 text-gray-600"
                            }`}
                          >
                            P{phase.id}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="bg-[#0f141d] border border-gray-800/60 rounded-xl p-4 shadow-md text-xs font-mono text-gray-400 space-y-2">
                  <div className="flex justify-between border-b border-gray-800 pb-1.5">
                    <span>Active Channels:</span>
                    <strong className="text-white">5 / 5 live</strong>
                  </div>
                  <div className="flex justify-between border-b border-gray-800 pb-1.5">
                    <span>Active Server Nodes:</span>
                    <strong className="text-emerald-400">
                      {systemMetrics?.activeCollectors ?? 3} scaled
                    </strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Commissions:</span>
                    <strong className="text-amber-400">
                      ${(systemMetrics?.estRevenue ?? 0).toLocaleString()}
                    </strong>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-3 space-y-6">
                <ErrorBoundary fallbackTitle="Phase Panel Render Error">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentPhase}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                    >
                      <PhasePanel
                        phaseId={currentPhase}
                        items={Array.isArray(items) ? items : []}
                        setItems={setItems}
                        logs={Array.isArray(logs) ? logs : []}
                        addLog={addLog}
                        systemMetrics={systemMetrics}
                        setSystemMetrics={setSystemMetrics}
                      />
                    </motion.div>
                  </AnimatePresence>
                </ErrorBoundary>

                <div className="bg-[#0b0e14] border border-gray-800 rounded-xl overflow-hidden shadow-lg">
                  <div className="bg-gray-900/60 px-4 py-3 border-b border-gray-800 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Terminal className="w-4 h-4 text-amber-400" />
                      <span className="text-xs font-mono text-gray-300 uppercase tracking-wider">
                        Live Pipeline Telemetry Output
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`h-2 w-2 rounded-full ${
                          wsStatus === "connected" ? "bg-emerald-500 animate-pulse" : "bg-amber-500"
                        }`}
                      />
                      <span className="text-[10px] font-mono text-gray-500">
                        Node: aura-pipeline-core-01
                      </span>
                    </div>
                  </div>

                  <div className="p-4 bg-black/60 font-mono text-[11px] h-36 overflow-y-auto space-y-2.5 scrollbar-thin">
                    {!Array.isArray(logs) || logs.length === 0 ? (
                      <div className="text-gray-600 text-center py-4">
                        No telemetry logs recorded. Scan a market.
                      </div>
                    ) : (
                      logs.map((log) => (
                        <div key={log.id} className="flex gap-2.5 items-start">
                          <span className="text-gray-600 shrink-0">
                            [{log.timestamp}]
                          </span>
                          <span
                            className={`text-[10px] px-1.5 py-0.2 rounded shrink-0 ${
                              log.status === "success"
                                ? "bg-emerald-950 text-emerald-400 border border-emerald-800/40"
                                : log.status === "warning"
                                  ? "bg-amber-950 text-amber-400 border border-amber-800/40"
                                  : log.status === "error"
                                    ? "bg-red-950 text-red-400 border border-red-800/40"
                                    : "bg-blue-950 text-blue-400 border border-blue-900/40"
                            }`}
                          >
                            P{log.phase} - {log.agent}
                          </span>
                          <span className="text-gray-300 wrap-break-word flex-1">
                            {log.message}
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </main>

      <footer className="border-t border-gray-900/80 bg-[#0f141d]/20 py-6 mt-12 px-6 text-center text-xs font-mono text-gray-600 space-y-2">
        <div>
          Aura Luxury Pipeline &copy; 2026 Wisora Organization. All rights reserved.
        </div>
        <div className="flex justify-center space-x-6">
          <button 
            onClick={() => handleViewChange("privacy")} 
            className="hover:text-amber-400 transition-colors underline"
          >
            Privacy Policy
          </button>
          <button 
            onClick={() => handleViewChange("terms")} 
            className="hover:text-amber-400 transition-colors underline"
          >
            Terms & Affiliate Disclosure
          </button>
        </div>
      </footer>
    </div>
  );
}