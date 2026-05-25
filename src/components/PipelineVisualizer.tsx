import React, { useState, useEffect, useRef } from "react";
import { PIPELINE_STAGES } from "../data";
import { PipelineStage } from "../types";
import { Play, RotateCcw, Terminal, Code, Cpu, FileCode, CheckCircle2, ChevronRight, Copy, Check } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export default function PipelineVisualizer() {
  const [stages, setStages] = useState<PipelineStage[]>(PIPELINE_STAGES);
  const [isRunning, setIsRunning] = useState(false);
  const [activeStageId, setActiveStageId] = useState<string>("stage-1");
  const [currentRunningIndex, setCurrentRunningIndex] = useState<number | null>(null);
  const [terminalLogs, setTerminalLogs] = useState<string[]>([
    "[System] DevOps Suite online. Ready to trigger automated hybrid pipeline simulation."
  ]);
  const [copiedFileName, setCopiedFileName] = useState<string | null>(null);
  const logEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (logEndRef.current) {
      logEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [terminalLogs]);

  // Simulate pipeline execution
  const startSimulation = async () => {
    setIsRunning(true);
    // Reset stages to idle
    setStages(prev => prev.map(s => ({ ...s, status: "idle" })));
    setTerminalLogs([
      `[Developer System] Project deployment requested at: ${new Date().toISOString()}`,
      `[Pipeline Controller] Booting orchestration sequences on AWS Control Node 1...`
    ]);

    for (let i = 0; i < PIPELINE_STAGES.length; i++) {
      setCurrentRunningIndex(i);
      setActiveStageId(PIPELINE_STAGES[i].id);
      
      // Update running status
      setStages(prev => prev.map((s, idx) => {
        if (idx === i) return { ...s, status: "running" };
        if (idx < i) return { ...s, status: "success" };
        return s;
      }));

      // Append stage console logs periodically to simulate real process output
      const stage = PIPELINE_STAGES[i];
      setTerminalLogs(prev => [
        ...prev, 
        `>>> Starting Phase: ${stage.name} (${stage.phase})`
      ]);

      for (const log of stage.consoleLogs) {
        // Stagger logs
        await new Promise(resolve => setTimeout(resolve, stage.duration / stage.consoleLogs.length));
        setTerminalLogs(prev => [...prev, `[${stage.name}] ${log}`]);
      }

      // Mark success
      setStages(prev => prev.map((s, idx) => {
        if (idx === i) return { ...s, status: "success" };
        return s;
      }));
      
      setTerminalLogs(prev => [
        ...prev, 
        `✔ Phase Successfully Validated: ${stage.name}`
      ]);
      
      // Stagger slightly before proceeding to the next step
      await new Promise(resolve => setTimeout(resolve, 300));
    }

    setCurrentRunningIndex(null);
    setIsRunning(false);
    setTerminalLogs(prev => [
      ...prev,
      "==================================================================",
      "🚀 DEPLOYMENT COMPLETED SUCCESSFULLY WITH ZERO-DOWNTIME",
      `🌍 Application host URL: http://aws-production-node-2.compute.amazonaws.com:80`,
      `💾 Active data integrity synchronized with external Cloud Database Service`,
      "=================================================================="
    ]);
  };

  const resetPipeline = () => {
    if (isRunning) return;
    setStages(PIPELINE_STAGES.map(s => ({ ...s, status: "idle" })));
    setActiveStageId("stage-1");
    setCurrentRunningIndex(null);
    setTerminalLogs([
      "[System] Pipeline state table records purged. Ready for fresh orchestration trigger."
    ]);
  };

  const currentSelectedStage = stages.find(s => s.id === activeStageId) || stages[0];

  const copyCode = (code: string, fileName: string) => {
    navigator.clipboard.writeText(code);
    setCopiedFileName(fileName);
    setTimeout(() => setCopiedFileName(null), 2000);
  };

  return (
    <div id="pipeline-visualizer-section" className="space-y-6">
      {/* Simulation Trigger Dashboard */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-slate-100 flex items-center gap-2">
            <Cpu className="text-amber-500 h-5 w-5" />
            Hybrid Continuous Delivery & Persistence Pipeline
          </h2>
          <p className="text-sm text-slate-400 mt-1 max-w-2xl">
            Simulate the full operational flow of code being committed to GitHub, compiled by Jenkins on Virtual EC2 Node 1, packaged on port 8080, and deployed agentlessly via Ansible SSH to Production EC2 Node 2 utilizing decoupled DB persistent storage.
          </p>
        </div>
        <div className="flex items-center gap-3 self-start md:self-auto shrink-0">
          <button
            id="btn-trigger-pipeline"
            onClick={startSimulation}
            disabled={isRunning}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium shadow-md transition-all ${
              isRunning
                ? "bg-amber-600/20 text-amber-500/40 border border-amber-600/30 cursor-not-allowed"
                : "bg-amber-500 hover:bg-amber-400 text-slate-955 cursor-pointer font-bold duration-200"
            }`}
          >
            <Play size={18} className={isRunning ? "animate-pulse" : ""} />
            {isRunning ? "Build Pipeline Running..." : "Trigger Pipeline"}
          </button>
          <button
            id="btn-reset-pipeline"
            onClick={resetPipeline}
            disabled={isRunning}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium border transition-all ${
              isRunning
                ? "border-slate-800 text-slate-600 cursor-not-allowed"
                : "border-slate-700 text-slate-300 hover:bg-slate-800 cursor-pointer duration-200"
            }`}
          >
            <RotateCcw size={16} />
            Reset State
          </button>
        </div>
      </div>

      {/* Visual Workflow Steps (Chronological Architecture Layout) */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        {stages.map((stage, idx) => {
          const isSelected = stage.id === activeStageId;
          const statusColors = {
            idle: "border-slate-800 bg-slate-900/50 text-slate-400",
            running: "border-amber-500 bg-amber-950/20 text-amber-300 shadow-lg shadow-amber-500/10 ring-1 ring-amber-500/30",
            success: "border-emerald-500/60 bg-emerald-950/10 text-emerald-300 shadow-md",
            failed: "border-rose-500/60 bg-rose-950/10 text-rose-300"
          };

          return (
            <div
              key={stage.id}
              onClick={() => !isRunning && setActiveStageId(stage.id)}
              className={`flex flex-col justify-between border rounded-xl p-4 cursor-pointer transition-all ${statusColors[stage.status]} ${
                isSelected && !isRunning ? "ring-2 ring-amber-500/60 scale-[1.02] bg-slate-800/40" : "hover:border-slate-600"
              }`}
            >
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs tracking-wider uppercase font-mono text-slate-500 font-bold">
                  <span>{stage.phase.split(":")[0]}</span>
                  {stage.status === "running" && (
                    <span className="flex h-2 w-2 relative">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                    </span>
                  )}
                  {stage.status === "success" && (
                    <CheckCircle2 size={14} className="text-emerald-500" />
                  )}
                </div>
                <h3 className="font-semibold text-sm text-slate-200">{stage.name}</h3>
                <p className="text-xs text-slate-400 line-clamp-2 md:line-clamp-3 leading-relaxed">
                  {stage.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800/70 flex flex-wrap gap-1.5 items-center">
                {stage.tools.map(tool => (
                  <span
                    key={tool}
                    className="px-1.5 py-0.5 rounded text-[10px] bg-slate-800 text-slate-350 font-mono"
                  >
                    {tool}
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Terminal Output & Stage Deep Dive */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Retro Log Console / Terminal */}
        <div className="flex flex-col bg-slate-950 border border-slate-900 rounded-xl overflow-hidden shadow-2xl h-[480px]">
          <div className="bg-slate-900 px-4 py-2 flex items-center justify-between border-b border-slate-950">
            <div className="flex items-center gap-2">
              <span className="flex gap-1.5">
                <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block"></span>
                <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block"></span>
                <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block"></span>
              </span>
              <span className="text-xs font-mono text-slate-450 ml-2 select-none font-bold">
                devops-automation-dashboard-console
              </span>
            </div>
            <div className="flex items-center gap-1.5 bg-slate-955 rounded px-2 py-0.5 border border-slate-800 font-mono text-[10px] text-amber-500">
              <Terminal size={12} />
              <span>LIVE CORE LOGS</span>
            </div>
          </div>
          
          <div className="flex-1 p-4 font-mono text-xs overflow-y-auto space-y-2 select-text selection:bg-amber-500 selection:text-slate-950">
            {terminalLogs.map((log, index) => {
              let logColor = "text-slate-400";
              if (log.startsWith(">>>")) logColor = "text-amber-400 font-semibold pt-1 border-t border-slate-900 mt-2 block";
              else if (log.startsWith("✔")) logColor = "text-emerald-400 font-semibold";
              else if (log.startsWith("🚀") || log.includes("SUCCESSFULLY")) logColor = "text-emerald-400 font-bold";
              else if (log.startsWith("[git]")) logColor = "text-indigo-300";
              else if (log.startsWith("[GitHub")) logColor = "text-blue-300";
              else if (log.startsWith("[Jenkins]")) logColor = "text-amber-300";
              else if (log.startsWith("[Ansible")) logColor = "text-violet-300";
              else if (log.startsWith("[Application")) logColor = "text-sky-300";
              else if (log.startsWith("Connecting to:") || log.includes("established to:")) logColor = "text-slate-500 text-[11px]";

              return (
                <div key={index} className={`${logColor} leading-relaxed break-all`}>
                  {log}
                </div>
              );
            })}
            <div ref={logEndRef} />
          </div>
        </div>

        {/* Selected Phase File & Blueprint Explorer */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 flex flex-col h-[480px]">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
            <div>
              <h3 className="text-md font-semibold text-slate-200">
                Phase Blueprint & Config Files
              </h3>
              <p className="text-xs text-slate-450 mt-0.5">
                Inspect crucial infrastructure templates applied inside <span className="font-sans font-bold text-amber-400">{currentSelectedStage.name}</span>
              </p>
            </div>
            <div className="px-2 py-1 bg-slate-800 rounded text-xs font-mono font-bold text-amber-400">
              {currentSelectedStage.phase.split(":")[1]}
            </div>
          </div>

          <div className="flex-1 flex flex-col min-h-0">
            {currentSelectedStage.files.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-slate-500 p-8 text-center border border-dashed border-slate-800 rounded-lg">
                <Code size={36} className="text-slate-700 mb-2" />
                <p className="text-sm font-medium">No configuration blueprints bound</p>
                <p className="text-xs text-slate-600 mt-1">This step acts strictly as a network web-trigger notification link</p>
              </div>
            ) : (
              <div className="flex-1 flex flex-col min-h-0 space-y-3">
                {currentSelectedStage.files.map((file) => (
                  <div key={file.name} className="flex-1 flex flex-col min-h-0 bg-slate-950 border border-slate-900 rounded-lg overflow-hidden">
                    {/* File Header Tab */}
                    <div className="bg-slate-900 px-3 py-2 flex items-center justify-between border-b border-slate-950 font-mono text-xs">
                      <div className="flex items-center gap-1.5 text-slate-300 font-medium">
                        <FileCode size={14} className="text-amber-500" />
                        <span>{file.name}</span>
                        <span className="text-[10px] text-slate-500 font-normal opacity-90">({file.description})</span>
                      </div>
                      <button
                        onClick={() => copyCode(file.code, file.name)}
                        className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-slate-250 transition-colors flex items-center gap-1 text-[10px]"
                        title="Copy to Clipboard"
                      >
                        {copiedFileName === file.name ? (
                          <>
                            <Check size={12} className="text-emerald-500" />
                            <span className="text-emerald-505">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy size={12} />
                            <span>Copy</span>
                          </>
                        )}
                      </button>
                    </div>
                    {/* Embedded Code View */}
                    <div className="flex-1 p-3 overflow-y-auto font-mono text-xs text-slate-300 text-left bg-[#080d1a] leading-relaxed selection:bg-amber-500 select-text">
                      <pre className="whitespace-pre-wrap word-break">
                        <code>{file.code}</code>
                      </pre>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
