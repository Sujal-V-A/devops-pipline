import React, { useState } from "react";
import PipelineVisualizer from "./components/PipelineVisualizer";
import TechExplorer from "./components/TechExplorer";
import ConfigGenerator from "./components/ConfigGenerator";
import VivaPrep from "./components/VivaPrep";
import { Cpu, Terminal, Layers, HelpCircle, Code, ShieldAlert, BookOpen, Layers2, FileText } from "lucide-react";

export default function App() {
  const [activeTab, setActiveTab] = useState<"visualizer" | "technologies" | "generator" | "viva">("visualizer");

  return (
    <div className="min-h-screen bg-[#060b13] text-slate-100 font-sans selection:bg-amber-500 selection:text-slate-950">
      
      {/* Decorative Top Accent */}
      <div className="h-1.5 w-full bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600"></div>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Academic Header Deck / Presentation Meta */}
        <header className="border-b border-slate-800/80 pb-6">
          <div className="space-y-2">

            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-slate-50 via-slate-100 to-amber-400 leading-tight">
              Automated Cloud-Native CI/CD Pipeline & Configuration Management via Hybrid Decoupled Computing Infrastructure
            </h1>
            <p className="text-sm text-slate-400 max-w-4xl font-sans leading-relaxed">
              A production-ready DevOps implementation designed to eliminate manual system updates, validate runtime libraries, and secure persistent relational database transactions decoupled from stateless transient application host VM instances.
            </p>
          </div>
        </header>

        {/* Executive Overview Bento Grid */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Executive Summary */}
          <div className="bg-slate-900/40 border border-slate-850 rounded-xl p-5 md:col-span-2 space-y-2.5">
            <h3 className="text-xs font-bold font-mono text-amber-500 uppercase tracking-wider flex items-center gap-1.5">
              <FileText size={14} />
              Executive Project Overview
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed font-sans">
              In traditional software development, compiling and deploying web applications requires manually logging into cloud servers, pulling changes, compiling binaries, manually setting environmental variables, and restarting services over SSH. This manual flow introduces environment drift, configuration delays, and high downtime risk.
            </p>
            <p className="text-xs text-slate-355 leading-relaxed font-sans">
              This master deployment project solves this friction by constructing a completely automated, zero-touch continuous delivery pipeline. By dividing resources on AWS Free Tier virtual instances, Jenkins automates Git triggers and compiling Docker architectures, pushing immutable images directly to registries, while Ansible CD orchestrates live container configurations dynamically over standard Keypair Ports, decoupled entirely from relational state storage engines.
            </p>
          </div>

          {/* Quick Metrics Dashboard */}
          <div className="bg-slate-900/40 border border-slate-850 rounded-xl p-5 flex flex-col justify-between space-y-4">
            <h3 className="text-xs font-bold font-mono text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
              <Layers2 size={14} />
              Architecture Metrics
            </h3>
            <div className="grid grid-cols-2 gap-3 flex-1">
              <div className="bg-slate-950/50 border border-slate-850 p-3 rounded-lg text-center flex flex-col justify-center">
                <span className="text-2xl font-mono font-bold text-amber-400">AWS EC2</span>
                <span className="text-[10px] text-slate-500 uppercase font-mono mt-1 font-bold">2 Virtual Nodes</span>
              </div>
              <div className="bg-slate-950/50 border border-slate-850 p-3 rounded-lg text-center flex flex-col justify-center">
                <span className="text-2xl font-mono font-bold text-emerald-400">Stateless</span>
                <span className="text-[10px] text-slate-500 uppercase font-mono mt-1 font-bold">Web Containers</span>
              </div>
              <div className="bg-slate-950/50 border border-slate-850 p-3 rounded-lg text-center flex flex-col justify-center">
                <span className="text-2xl font-mono font-bold text-sky-400">DBaaS</span>
                <span className="text-[10px] text-slate-500 uppercase font-mono mt-1 font-bold">Decoupled Relational</span>
              </div>
              <div className="bg-slate-950/50 border border-slate-850 p-3 rounded-lg text-center flex flex-col justify-center">
                <span className="text-2xl font-mono font-bold text-violet-400">&lt; 2 Mins</span>
                <span className="text-[10px] text-slate-500 uppercase font-mono mt-1 font-bold">Trigger to Run</span>
              </div>
            </div>
          </div>
        </section>

        {/* Tab Switcher Hub */}
        <section className="space-y-4">
          <div className="flex border-b border-slate-800 bg-slate-950/50 p-1.5 rounded-xl gap-2 overflow-x-auto shrink-0">
            <button
              onClick={() => setActiveTab("visualizer")}
              className={`px-5 py-3 rounded-lg text-xs font-mono font-bold uppercase transition-all flex items-center gap-2 shrink-0 ${
                activeTab === "visualizer"
                  ? "bg-amber-500 text-slate-950 font-extrabold shadow-md"
                  : "text-slate-400 hover:text-slate-205 hover:bg-slate-900"
              }`}
            >
              <Cpu size={14} />
              <span>Pipeline Workflow Simulator</span>
            </button>
            <button
              onClick={() => setActiveTab("technologies")}
              className={`px-5 py-3 rounded-lg text-xs font-mono font-bold uppercase transition-all flex items-center gap-2 shrink-0 ${
                activeTab === "technologies"
                  ? "bg-amber-500 text-slate-950 font-extrabold shadow-md"
                  : "text-slate-400 hover:text-slate-205 hover:bg-slate-900"
              }`}
            >
              <Terminal size={14} />
              <span>Core Technology Breakdown</span>
            </button>
            <button
              onClick={() => setActiveTab("generator")}
              className={`px-5 py-3 rounded-lg text-xs font-mono font-bold uppercase transition-all flex items-center gap-2 shrink-0 ${
                activeTab === "generator"
                  ? "bg-amber-500 text-slate-950 font-extrabold shadow-md"
                  : "text-slate-400 hover:text-slate-205 hover:bg-slate-900"
              }`}
            >
              <Code size={14} />
              <span>Config Blueprint Generator</span>
            </button>
            <button
              onClick={() => setActiveTab("viva")}
              className={`px-5 py-3 rounded-lg text-xs font-mono font-bold uppercase transition-all flex items-center gap-2 shrink-0 ${
                activeTab === "viva"
                  ? "bg-amber-500 text-slate-950 font-extrabold shadow-md"
                  : "text-slate-400 hover:text-slate-205 hover:bg-slate-900"
              }`}
            >
              <BookOpen size={14} />
              <span>Thesis Defense AI Viva Prep</span>
            </button>
          </div>

          {/* Active Work Panel */}
          <main className="bg-slate-950/30 border border-slate-850/80 p-6 rounded-2xl shadow-xl">
            {activeTab === "visualizer" && <PipelineVisualizer />}
            {activeTab === "technologies" && <TechExplorer />}
            {activeTab === "generator" && <ConfigGenerator />}
            {activeTab === "viva" && <VivaPrep />}
          </main>
        </section>

        {/* Footer info limits layout */}
        <footer className="pt-6 border-t border-slate-850/80 text-center text-[11px] text-slate-550 space-y-1">
          <p>© 2026 Academic DevOps Systems Engineering Workspace. Evaluated under AWS Free-Tier compliance criteria.</p>
          <p>Presented in partial fulfillment of systems automation deployment architecture qualifications.</p>
        </footer>

      </div>
    </div>
  );
}
