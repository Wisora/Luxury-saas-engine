'use client';
import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

interface Props {
  children: ReactNode;
  fallbackTitle?: string;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error caught by boundary:", error, errorInfo);
  }

  public handleReset = () => {
    this.setState({ hasError: false, error: undefined });
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="bg-[#0f141d] border border-red-500/30 rounded-xl p-6 text-center space-y-4 my-4 shadow-lg">
          <div className="flex justify-center">
            <div className="h-12 w-12 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-red-400" />
            </div>
          </div>
          <div>
            <h4 className="text-sm font-serif font-semibold text-white uppercase tracking-wider">
              {this.props.fallbackTitle || "Component Telemetry Failure"}
            </h4>
            <p className="text-xs font-mono text-gray-400 mt-1 max-w-md mx-auto">
              A runtime anomaly was isolated. The rest of the Orchestrator remains active.
            </p>
          </div>
          <button
            onClick={this.handleReset}
            className="inline-flex items-center gap-2 text-xs font-mono px-4 py-2 bg-red-500/10 border border-red-500/30 text-red-300 rounded-lg hover:bg-red-500/20 transition-all cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Re-initialize Component</span>
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}