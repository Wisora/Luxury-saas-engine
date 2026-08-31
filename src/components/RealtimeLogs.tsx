'use client';
import React, { useEffect, useState } from "react";

interface LogMessage {
  timestamp: string;
  message: string;
  level: "info" | "success" | "warning";
}

export const RealtimeLogs: React.FC = () => {
  const [logs, setLogs] = useState<LogMessage[]>([]);

  useEffect(() => {
    // Open connection to Express WebSocket server
    const ws = new WebSocket("ws://localhost:5000");

    ws.onmessage = (event) => {
      try {
        const data: LogMessage = JSON.parse(event.data);
        // Add new log to the top of the feed (capped at 50 logs)
        setLogs((prev) => [data, ...prev].slice(0, 50));
      } catch (err) {
        console.error("Failed to parse log message:", err);
      }
    };

    // Clean up socket when component unmounts
    return () => ws.close();
  }, []);

  return (
    <div className="bg-slate-900 text-slate-200 p-4 rounded-lg font-mono text-xs max-h-60 overflow-y-auto border border-slate-800 shadow-inner">
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-slate-400 font-bold uppercase tracking-wider">
          Live Agent Telemetry
        </h4>
        <span className="flex h-2 w-2 relative">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
        </span>
      </div>

      {logs.length === 0 ? (
        <p className="text-slate-500 italic">Listening for telemetry events...</p>
      ) : (
        logs.map((log, idx) => (
          <div key={idx} className="flex gap-2 py-0.5 border-b border-slate-800/50 last:border-0">
            <span className="text-slate-500">[{log.timestamp}]</span>
            <span
              className={
                log.level === "success"
                  ? "text-emerald-400"
                  : log.level === "warning"
                  ? "text-amber-400"
                  : "text-sky-400"
              }
            >
              {log.message}
            </span>
          </div>
        ))
      )}
    </div>
  );
};