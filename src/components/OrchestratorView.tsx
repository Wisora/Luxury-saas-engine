'use client';
import React from 'react';
import { 
  Compass, ShieldCheck, BarChart3, Zap, 
  Coins, Sparkles, LineChart, Cpu, 
  CheckCircle2 
} from 'lucide-react';

interface OrchestratorViewProps {
  currentPhase: number;
  onSelectPhase: (phase: number) => void;
  systemMetrics: {
    uptime: string;
    activeCollectors: number;
    itemsProcessed: number;
    cacheHitRate: number;
    queueSize: number;
    estRevenue: number;
    roi: number;
  };
}

export default function OrchestratorView({ 
  currentPhase, 
  onSelectPhase, 
  systemMetrics 
}: OrchestratorViewProps) {
  
  const phases = [
    {
      id: 1,
      title: "Market Scanner",
      short: "P1",
      icon: Compass,
      desc: "Collectors fetching fashion, watches, art, real estate & travel.",
      status: "Active Scanning"
    },
    {
      id: 2,
      title: "Resilience & Trust",
      short: "P2",
      icon: ShieldCheck,
      desc: "Failover protection, exotic material audit & FTC disclosure stamp.",
      status: "Gov Compliance Guard"
    },
    {
      id: 3,
      title: "Analytics & ROI",
      short: "P3",
      icon: BarChart3,
      desc: "High-net-worth demand analysis & interactive fraud checks.",
      status: "Continuous Optimization"
    },
    {
      id: 4,
      title: "Automation & Scale",
      short: "P4",
      icon: Zap,
      desc: "Pre-rendered cache, task schedules, CRM integrations & worker-queues.",
      status: "Zero-Latency Caching"
    },
    {
      id: 5,
      title: "Revenue Expansion",
      short: "P5",
      icon: Coins,
      desc: "Bespoke VIP Drops, subscription lists, and direct brokerages.",
      status: "Multi-Axis Monetization"
    },
    {
      id: 6,
      title: "Future-Proofing",
      short: "P6",
      icon: Sparkles,
      desc: "Alexa Voice simulation, 3D AR catalogs & philanthropic tracking.",
      status: "Legacy Infrastructure"
    },
    {
      id: 7,
      title: "Investor Hub",
      short: "P7",
      icon: LineChart,
      desc: "Fundraising Q&A agent, live metrics, and real-time cap table audit.",
      status: "Series-A Audited"
    }
  ];

  return (
    <div className="w-full bg-[#0f141d] border border-gray-800/60 rounded-xl p-6 shadow-2xl relative overflow-hidden">
      {/* Absolute Ambient Glow */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-gold-500/5 blur-[100px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-cyan-500/5 blur-[100px] rounded-full pointer-events-none" />

      {/* Header and Live Status */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 mb-6 border-b border-gray-800/60 gap-4">
        <div>
          <span className="text-xs font-mono tracking-[0.2em] text-gold-400 uppercase font-medium">Pipeline Topology</span>
          <h2 className="text-2xl font-serif text-white mt-1">Aura Luxury Pipeline Orchestrator</h2>
        </div>
        <div className="flex items-center gap-4 text-xs font-mono">
          <div className="flex items-center gap-2 bg-emerald-950/40 border border-emerald-800/40 text-emerald-400 px-3 py-1.5 rounded-full">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            SYSTEM OPERATIONAL
          </div>
          <div className="text-gray-400 bg-gray-900/60 border border-gray-800 px-3 py-1.5 rounded-full flex items-center gap-1.5">
            <Cpu className="w-3.5 h-3.5 text-gold-400" />
            <span className="text-gray-300">Uptime:</span> {systemMetrics.uptime}
          </div>
        </div>
      </div>

      {/* Metric Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        {[
          { label: "Active Collectors", value: systemMetrics.activeCollectors, unit: "/5 node clusters" },
          { label: "Products Processed", value: systemMetrics.itemsProcessed.toLocaleString(), unit: "total items" },
          { label: "Cache Hit Rate", value: `${systemMetrics.cacheHitRate}%`, unit: "optimized" },
          { label: "Worker Queue", value: `${systemMetrics.queueSize} units`, unit: "zero lag" },
          { label: "Monetized Commission", value: `$${systemMetrics.estRevenue.toLocaleString()}`, unit: "est revenue" },
          { label: "Current Pipeline ROI", value: `${systemMetrics.roi}x`, unit: "over CAC" }
        ].map((met, idx) => (
          <div key={idx} className="bg-gray-900/30 border border-gray-800/40 rounded-lg p-3 text-center">
            <div className="text-[10px] font-mono tracking-wider text-gray-400 uppercase">{met.label}</div>
            <div className="text-lg font-serif text-white font-semibold mt-1">{met.value}</div>
            <div className="text-[9px] font-mono text-gold-500/70 mt-0.5">{met.unit}</div>
          </div>
        ))}
      </div>

      {/* Nodes Map */}
      <div className="relative">
        <h3 className="text-xs font-mono tracking-wider text-gray-400 uppercase mb-4">Pipeline Execution Stages</h3>
        
        {/* Connection Line Behind Nodes */}
        <div className="absolute top-1/2 left-4 right-4 h-0.5 bg-gray-800 -translate-y-1/2 hidden lg:block z-0" />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-4 relative z-10">
          {phases.map((phase) => {
            const Icon = phase.icon;
            const isSelected = currentPhase === phase.id;
            const isPassed = currentPhase > phase.id;

            return (
              <div 
                key={phase.id}
                id={`pipeline-node-${phase.id}`}
                onClick={() => onSelectPhase(phase.id)}
                className={`group cursor-pointer rounded-xl p-4 transition-all duration-300 flex flex-col justify-between h-40 border relative ${
                  isSelected 
                    ? 'bg-linear-to-b from-[#1b1915] to-[#12110d] border-gold-400 shadow-[0_0_15px_rgba(181,131,45,0.15)]' 
                    : isPassed
                      ? 'bg-gray-900/40 border-emerald-800/40 hover:border-emerald-700/60'
                      : 'bg-gray-900/20 border-gray-800/60 hover:bg-gray-900/35 hover:border-gray-700'
                }`}
              >
                {/* Visual state icon badges */}
                <div className="flex items-center justify-between">
                  <div className={`p-2 rounded-lg transition-colors ${
                    isSelected 
                      ? 'bg-gold-500/10 text-gold-400' 
                      : isPassed
                        ? 'bg-emerald-500/10 text-emerald-400'
                        : 'bg-gray-800/60 text-gray-400'
                  }`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                    isSelected 
                      ? 'bg-gold-400/10 text-gold-400 border border-gold-400/20' 
                      : isPassed
                        ? 'bg-emerald-400/10 text-emerald-400 border border-emerald-400/20'
                        : 'bg-gray-800/60 text-gray-500'
                  }`}>
                    {phase.short}
                  </span>
                </div>

                {/* Info Text */}
                <div className="mt-3">
                  <div className="text-[10px] font-mono text-gold-500 uppercase tracking-wider">Phase {phase.id}</div>
                  <h4 className="text-sm font-serif font-medium text-white group-hover:text-gold-300 transition-colors mt-0.5">{phase.title}</h4>
                  <p className="text-[10.5px] text-gray-400 line-clamp-2 mt-1 leading-relaxed">{phase.desc}</p>
                </div>

                {/* Pulse Glow for Selected Node */}
                {isSelected && (
                  <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gold-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-gold-500"></span>
                  </span>
                )}
                
                {isPassed && (
                  <CheckCircle2 className="absolute top-2 right-2 w-4 h-4 text-emerald-400" />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}