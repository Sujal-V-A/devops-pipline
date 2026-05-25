import React, { useState } from "react";
import { TECHNICAL_TOOLS, VIVA_QUESTIONS } from "../data";
import { TechnicalTool } from "../types";
import { Server, Cpu, Layers, GitBranch, Database, Network, Terminal, Copy, Check, Info, Table } from "lucide-react";

const iconMap: Record<string, React.ComponentType<{ className?: string; size?: number }>> = {
  Server: Server,
  Github: GitBranch,
  Cpu: Cpu,
  Layers: Layers,
  Network: Network,
  Database: Database,
};

export default function TechExplorer() {
  const [selectedToolId, setSelectedToolId] = useState<string>("aws-ec2");
  const [copiedCodeName, setCopiedCodeName] = useState<string | null>(null);

  const selectedTool = TECHNICAL_TOOLS.find(t => t.id === selectedToolId) || TECHNICAL_TOOLS[0];
  const IconComponent = iconMap[selectedTool.iconName] || Server;

  const copyCode = (code: string, name: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCodeName(name);
    setTimeout(() => setCopiedCodeName(null), 2000);
  };

  const getQuestionsForTool = (toolName: string) => {
    const term = toolName.toLowerCase();
    return VIVA_QUESTIONS.filter(q => {
      const qText = q.question.toLowerCase();
      const sText = q.standardExplanation.toLowerCase();
      if (term.includes("ec2") || term.includes("aws")) {
        return qText.includes("ec2") || qText.includes("aws") || qText.includes("security group");
      }
      if (term.includes("jenkins")) {
        return qText.includes("jenkins") || qText.includes("webhook") || qText.includes("ci/cd");
      }
      if (term.includes("docker")) {
        return qText.includes("docker") || qText.includes("container") || qText.includes("hub");
      }
      if (term.includes("ansible")) {
        return qText.includes("ansible") || qText.includes("playbook") || qText.includes("agent");
      }
      if (term.includes("database") || term.includes("db")) {
        return qText.includes("database") || qText.includes("db") || qText.includes("stateless") || qText.includes("cloud db");
      }
      return qText.includes(term) || sText.includes(term);
    });
  };

  const toolQuestions = getQuestionsForTool(selectedTool.name);

  return (
    <div id="tech-explorer-section" className="space-y-6">
      {/* Upper Grid: Left Selector / Right Interactive Tool Sheet */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Tool Selector List */}
        <div className="space-y-2.5">
          <h3 className="text-md font-bold text-slate-400 uppercase tracking-wider font-mono">
            Active Core Components
          </h3>
          <div className="space-y-2">
            {TECHNICAL_TOOLS.map((tool) => {
              const ToolIcon = iconMap[tool.iconName] || Server;
              const isSelected = tool.id === selectedToolId;

              return (
                <button
                  key={tool.id}
                  onClick={() => setSelectedToolId(tool.id)}
                  className={`w-full text-left p-4 rounded-xl border flex items-center gap-3.5 transition-all outline-none ${
                    isSelected
                      ? "border-amber-500 bg-amber-500/10 text-amber-200 ring-1 ring-amber-500/40"
                      : "border-slate-800 bg-slate-900/50 text-slate-400 hover:border-slate-700 hover:bg-slate-900/80"
                  }`}
                >
                  <div className={`p-2 rounded-lg shrink-0 ${
                    isSelected ? "bg-amber-500 text-slate-950 font-bold" : "bg-slate-800 text-slate-350"
                  }`}>
                    <ToolIcon size={20} />
                  </div>
                  <div className="min-w-0">
                    <h4 className={`font-semibold text-sm ${isSelected ? "text-slate-100" : "text-slate-300"}`}>
                      {tool.name}
                    </h4>
                    <p className="text-xs text-slate-400 mt-0.5 truncate max-w-xs">{tool.category}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Tool Details Card */}
        <div className="lg:col-span-2 bg-slate-900/60 border border-slate-800 rounded-xl p-6 flex flex-col space-y-5">
          {/* Header */}
          <div className="flex items-start gap-4 pb-4 border-b border-slate-800/80">
            <div className="p-3 bg-slate-800 rounded-xl text-amber-500 shrink-0">
              <IconComponent size={28} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[10px] font-mono font-bold tracking-wider uppercase">
                  {selectedTool.category}
                </span>
              </div>
              <h3 className="text-xl font-bold text-slate-100 mt-1">{selectedTool.name}</h3>
              <p className="text-xs text-slate-450 mt-0.5">Role: <strong className="text-slate-300 font-medium">{selectedTool.role}</strong></p>
            </div>
          </div>

          {/* Core Target & Justification */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-sm">
            <div className="space-y-2 bg-slate-950/40 border border-slate-800/50 p-4 rounded-xl">
              <h4 className="font-semibold text-amber-400 flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider">
                <Info size={14} />
                Specific Project Target
              </h4>
              <p className="text-slate-300 text-xs leading-relaxed leading-relaxed font-sans">
                {selectedTool.specificTarget}
              </p>
            </div>
            <div className="space-y-2 bg-slate-950/40 border border-slate-800/50 p-4 rounded-xl">
              <h4 className="font-semibold text-amber-400 flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider">
                <Terminal size={14} />
                Evaluator Justification
              </h4>
              <p className="text-slate-350 text-xs leading-relaxed leading-relaxed font-sans">
                {selectedTool.justification}
              </p>
            </div>
          </div>

          {/* Interactive Config Code Preview */}
          <div className="bg-slate-950 border border-slate-850/65 rounded-xl overflow-hidden shadow-md flex flex-col">
            <div className="bg-slate-900 px-4 py-2 flex items-center justify-between border-b border-slate-950">
              <span className="font-mono text-xs text-slate-350 font-bold">
                {selectedTool.configSampleName}
              </span>
              <button
                onClick={() => copyCode(selectedTool.configSampleCode, selectedTool.configSampleName)}
                className="flex items-center gap-1.5 text-[11px] font-mono text-slate-400 hover:text-slate-200"
              >
                {copiedCodeName === selectedTool.configSampleName ? (
                  <>
                    <Check size={12} className="text-emerald-500" />
                    <span className="text-emerald-500">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy size={12} />
                    <span>Copy Snippet</span>
                  </>
                )}
              </button>
            </div>
            <div className="p-4 overflow-x-auto bg-[#0a0f1d] font-mono text-xs text-slate-300 leading-relaxed max-h-[160px] overflow-y-auto">
              <pre className="whitespace-pre">
                <code>{selectedTool.configSampleCode}</code>
              </pre>
            </div>
          </div>

          {/* Associated Viva Defense Questions */}
          {toolQuestions.length > 0 && (
            <div className="border-t border-slate-800/65 pt-4 space-y-3">
              <h4 className="text-xs font-bold text-slate-450 uppercase tracking-wider font-mono">
                Associated Defense Questions
              </h4>
              <div className="space-y-3 max-h-[150px] overflow-y-auto pr-1">
                {toolQuestions.map((q) => (
                  <div key={q.id} className="bg-slate-900 border border-slate-800 rounded-lg p-3 text-xs">
                    <p className="font-semibold text-slate-200">Q: {q.question}</p>
                    <p className="text-slate-400 mt-1.5 border-t border-slate-800/80 pt-1.5 font-sans italic leading-relaxed">
                      💡 Standard Answer: {q.standardExplanation}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Summary Matrix of Technical Tool Roles Table (Exact Copy of User Doc) */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg">
        <h3 className="text-md font-bold text-slate-200 flex items-center gap-2 mb-4">
          <Table size={18} className="text-amber-500" />
          Summary Matrix of Technical Tool Roles
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-350 border-collapse">
            <thead>
              <tr className="bg-slate-950 text-slate-200 font-mono text-[11px] uppercase border-b border-slate-800">
                <th className="p-3 font-semibold">Technology Component</th>
                <th className="p-3 font-semibold">Category / Role</th>
                <th className="p-3 font-semibold">Specific Project Target</th>
                <th className="p-3 font-semibold">Crucial Evaluator Justification</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-850/60 font-sans">
              {TECHNICAL_TOOLS.map((tool) => (
                <tr key={tool.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="p-3 font-medium text-slate-100 whitespace-nowrap">{tool.name}</td>
                  <td className="p-3 font-mono text-[11px] text-amber-400">{tool.category}</td>
                  <td className="p-3 max-w-xs md:max-w-md break-words">{tool.specificTarget}</td>
                  <td className="p-3 max-w-xs md:max-w-md text-slate-400 leading-relaxed font-sans">{tool.justification}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
