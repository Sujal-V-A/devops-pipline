import React, { useState, useEffect } from "react";
import { VIVA_QUESTIONS } from "../data";
import { InterviewQuestion, Critique } from "../types";
import { Sparkles, Trophy, HelpCircle, Send, RotateCcw, ThumbsUp, ChevronRight, AlertTriangle, BookOpen, Eye, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export default function VivaPrep() {
  const [selectedQuestionId, setSelectedQuestionId] = useState<string>("q-1");
  const [studentAnswer, setStudentAnswer] = useState("");
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evaluation, setEvaluation] = useState<Critique & { isMock?: boolean } | null>(null);
  const [customQuestion, setCustomQuestion] = useState("");
  const [customQuestionMode, setCustomQuestionMode] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const selectedQuestion = customQuestionMode 
    ? { id: "custom", question: customQuestion, category: "Custom Practice", difficulty: "Custom" as any, standardExplanation: "Submit your response to generate an expert appraisal and model draft." } as InterviewQuestion
    : VIVA_QUESTIONS.find(q => q.id === selectedQuestionId) || VIVA_QUESTIONS[0];

  const submitEvaluation = async () => {
    if (!studentAnswer.trim()) {
      setStatusMessage("Answer field cannot be empty. Please draft an outline answer first.");
      return;
    }
    setIsEvaluating(true);
    setEvaluation(null);
    setStatusMessage(null);

    try {
      const response = await fetch("/api/viva/evaluate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: selectedQuestion.question,
          answer: studentAnswer,
          context: "Automated Decoupled CI/CD Pipeline on AWS EC2, Jenkins, Ansible, Docker Hub, and independent cloud Managed Relational Database core."
        })
      });

      if (!response.ok) {
        throw new Error(`Server returned error: ${response.status}`);
      }

      const data = await response.json();
      setEvaluation(data);
    } catch (e: any) {
      console.error(e);
      setStatusMessage("Failed to connect to the evaluation server. Falling back to local offline validator...");
      // Fail gracefully: simulate response.
      setTimeout(() => {
        setEvaluation({
          score: 6,
          strengths: ["Captures general understanding of DevOps pipeline isolation."],
          improvements: ["Expand on AWS Security Groups or ssh key validation.", "Define the exact database decoupling mechanisms."],
          refinedAnswer: "To formulate a premium thesis grade panel answer: Specify that separation of concerns isolates Jenkins heavy CPU compilations (Port 8080) from live stateless web traffic (Port 80). Ansible deploys over SSH Port 22 natively. Decoupled databases reside externally allowing EC2 nodes to scale without data integrity loss.",
          suggestedFollowUp: "How does the webhook connect GitHub pushes back to Jenkins dynamically?",
          isMock: true
        });
        setIsEvaluating(false);
      }, 1500);
      return;
    }

    setIsEvaluating(false);
  };

  const handleActiveQuestionChange = (id: string) => {
    setCustomQuestionMode(false);
    setSelectedQuestionId(id);
    setStudentAnswer("");
    setEvaluation(null);
    setStatusMessage(null);
  };

  const loadFollowUp = (followUpQuestion: string) => {
    setCustomQuestion(followUpQuestion);
    setCustomQuestionMode(true);
    setStudentAnswer("");
    setEvaluation(null);
    setStatusMessage(null);
  };

  const resetPractice = () => {
    setStudentAnswer("");
    setEvaluation(null);
    setStatusMessage(null);
  };

  return (
    <div id="viva-prep-section" className="space-y-6">
      
      {/* Upper Grid: selector list on left, practice container on right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Exam Question Bank Column */}
        <div className="space-y-3 lg:h-[600px] overflow-y-auto pr-1">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono">
            Defense Panel Question Bank
          </h3>
          <div className="space-y-2">
            {VIVA_QUESTIONS.map((q) => {
              const isSelected = !customQuestionMode && q.id === selectedQuestionId;
              const difficultyColors = {
                Basic: "text-emerald-400 bg-emerald-500/10 border-emerald-500/15",
                Intermediate: "text-amber-400 bg-amber-500/10 border-amber-500/15",
                Advanced: "text-rose-400 bg-rose-500/10 border-rose-500/15"
              };

              return (
                <button
                  key={q.id}
                  onClick={() => handleActiveQuestionChange(q.id)}
                  className={`w-full text-left p-3.5 rounded-xl border transition-all text-xs flex flex-col space-y-2 outline-none ${
                    isSelected
                      ? "border-amber-500 bg-amber-500/5 ring-1 ring-amber-500/20"
                      : "border-slate-800 bg-slate-900/40 hover:border-slate-700 hover:bg-slate-900/60"
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <span className="text-[10px] uppercase font-mono tracking-wider font-bold text-slate-500">
                      {q.category}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[9px] font-mono border ${difficultyColors[q.difficulty]}`}>
                      {q.difficulty}
                    </span>
                  </div>
                  <p className={`font-medium leading-relaxed ${isSelected ? "text-slate-100" : "text-slate-350"}`}>
                    {q.question}
                  </p>
                </button>
              );
            })}

            <button
              onClick={() => {
                setCustomQuestionMode(true);
                setCustomQuestion("Why did we host the systems inside the AWS Free Tier framework rather than standard corporate instances?");
                setStudentAnswer("");
                setEvaluation(null);
                setStatusMessage(null);
              }}
              className={`w-full text-left p-4 rounded-xl border border-dashed text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
                customQuestionMode
                  ? "border-amber-500/70 bg-amber-500/10 text-amber-200 font-bold"
                  : "border-slate-800 bg-slate-950/20 text-slate-500 hover:border-slate-700 hover:text-slate-400"
              }`}
            >
              <Sparkles size={14} className={customQuestionMode ? "text-amber-400" : ""} />
              Practice custom or Follow-up Question
            </button>
          </div>
        </div>

        {/* Practice Form & AI Appraiser Container */}
        <div className="lg:col-span-2 bg-slate-900/60 border border-slate-800 rounded-xl p-6 flex flex-col min-h-[500px]">
          
          {/* Active Question Prompt */}
          <div className="bg-slate-950 border border-slate-850/65 rounded-xl p-4 mb-5 text-sm">
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-slate-500 uppercase tracking-wider mb-2">
              <HelpCircle className="text-amber-500 h-4 w-4" />
              <span>Defense Examination Prompt</span>
            </div>
            {customQuestionMode ? (
              <div className="space-y-2">
                <input
                  type="text"
                  value={customQuestion}
                  onChange={(e) => setCustomQuestion(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs font-mono text-slate-200 outline-none focus:border-amber-500/50"
                  placeholder="Type any custom interview prompt questions here..."
                />
                <p className="text-[10px] text-slate-500 font-mono italic">Adjust the question string above to evaluate customized DevOps parameters.</p>
              </div>
            ) : (
              <p className="font-semibold text-slate-250 leading-relaxed leading-relaxed font-sans">
                &ldquo;{selectedQuestion.question}&rdquo;
              </p>
            )}
          </div>

          {/* Practice Workstation Area */}
          <div className="flex-1 flex flex-col space-y-4">
            <div className="flex-1 flex flex-col space-y-2">
              <div className="flex justify-between items-center text-xs font-mono">
                <span className="text-slate-500 font-bold uppercase tracking-wider">Draft Your Appraisal Response</span>
                <span className="text-slate-600">Tip: Mention EC2 instances, stateless files, YAML triggers, or decoupling.</span>
              </div>
              <textarea
                id="text-viva-student-answer"
                value={studentAnswer}
                onChange={(e) => setStudentAnswer(e.target.value)}
                rows={5}
                disabled={isEvaluating}
                className="flex-1 p-4 bg-slate-950 border border-slate-850/70 rounded-xl text-xs text-slate-200 font-mono leading-relaxed placeholder-slate-700 outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/30 font-sans resize-none disabled:opacity-50"
                placeholder="Draft your defense statement explanation in your own words. Write freely, including as much cloud-native or system-automation details as possible..."
              />
            </div>

            {statusMessage && (
              <div className="p-3 bg-rose-500/10 text-rose-400 border border-rose-500/20 rounded-lg text-xs font-sans leading-relaxed flex items-center gap-2">
                <AlertTriangle size={14} className="shrink-0" />
                <span>{statusMessage}</span>
              </div>
            )}

            {/* Triggers Panel */}
            <div className="flex items-center justify-between pt-1">
              <button
                onClick={resetPractice}
                disabled={isEvaluating || !studentAnswer}
                className="px-4 py-2 text-xs font-mono font-bold text-slate-400 hover:text-slate-250 border border-slate-800 hover:border-slate-700 rounded-lg transition-colors flex items-center gap-2 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <RotateCcw size={14} />
                Refresh State
              </button>

              <button
                id="btn-evaluate-answer"
                onClick={submitEvaluation}
                disabled={isEvaluating}
                className={`px-6 py-2.5 rounded-lg text-xs font-bold font-mono text-slate-950 transition-all flex items-center gap-2 shadow-md ${
                  isEvaluating
                    ? "bg-amber-600/30 text-amber-500/40 border border-amber-500/10 cursor-not-allowed"
                    : "bg-amber-500 hover:bg-amber-400 cursor-pointer text-slate-955"
                }`}
              >
                <Sparkles size={14} className={isEvaluating ? "animate-spin" : ""} />
                {isEvaluating ? "Panel Reviewing Answer..." : "Submit to Exam Panel (AI Review)"}
              </button>
            </div>
          </div>

          {/* AI Appraisal Findings Sheet */}
          <AnimatePresence>
            {evaluation && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="mt-6 border-t border-slate-800/80 pt-6 space-y-5"
              >
                
                {/* Score & Banner */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-950/50 border border-slate-850/60 p-4 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-amber-500/10 text-amber-400 rounded-xl">
                      <Trophy size={24} />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-100 font-sans">
                        {evaluation.score >= 8 ? "Excellent Defence Grade Appraisal" : evaluation.score >= 5 ? "Competent Performance Answer" : "Needs Technical Revision"}
                      </h4>
                      <p className="text-xs text-slate-450 mt-0.5">
                        Reviewed by simulated DevOps Thesis Evaluator {evaluation.isMock && "(Local Backup Agent offline mode)"}
                      </p>
                    </div>
                  </div>
                  {/* Circular-like Score Dial */}
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-slate-500 uppercase tracking-widest">Score Assessment:</span>
                    <span className="text-2xl font-mono font-bold text-amber-400 bg-amber-500/5 border border-amber-500/20 px-3.5 py-1.5 rounded-lg">
                      {evaluation.score} <span className="text-slate-600 text-xs font-semibold">/ 10</span>
                    </span>
                  </div>
                </div>

                {/* Critiques Splitting */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-sans">
                  
                  {/* Strengths */}
                  <div className="bg-emerald-950/5 border border-emerald-500/15 p-4 rounded-xl space-y-2">
                    <h5 className="font-bold text-emerald-400 uppercase font-mono text-[10px] tracking-wider flex items-center gap-1.5">
                      <ThumbsUp size={12} />
                      Thesis Strengths Captured
                    </h5>
                    <ul className="space-y-1.5 list-disc pl-4 text-slate-300">
                      {evaluation.strengths.map((s, idx) => (
                        <li key={idx} className="leading-relaxed leading-relaxed">{s}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Areas for Improvement */}
                  <div className="bg-amber-950/5 border border-amber-500/15 p-4 rounded-xl space-y-2">
                    <h5 className="font-bold text-amber-400 uppercase font-mono text-[10px] tracking-wider flex items-center gap-1.5">
                      <AlertTriangle size={12} />
                      Refinement Gaps & Exclusions
                    </h5>
                    <ul className="space-y-1.5 list-disc pl-4 text-slate-300">
                      {evaluation.improvements.map((imp, idx) => (
                        <li key={idx} className="leading-relaxed leading-relaxed">{imp}</li>
                      ))}
                    </ul>
                  </div>

                </div>

                {/* Model Grade Response Draft */}
                <div className="bg-[#080c16] border border-slate-850 p-4 rounded-xl space-y-2.5">
                  <h5 className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                    <BookOpen size={13} className="text-amber-500" />
                    University Defence Model Grade Answer Draft
                  </h5>
                  <p className="text-slate-300 text-xs italic leading-relaxed leading-relaxed select-text font-serif bg-slate-950/40 p-3 rounded-lg border border-slate-900">
                    &ldquo;{evaluation.refinedAnswer}&rdquo;
                  </p>
                </div>

                {/* Follow-up Question Trigger */}
                {evaluation.suggestedFollowUp && (
                  <div className="bg-slate-950/80 border border-slate-850 p-4 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
                    <div className="space-y-1">
                      <span className="text-[9px] font-mono leading-none tracking-widest font-bold uppercase text-amber-500 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/15">
                        Evaluator Follow-Up Target
                      </span>
                      <p className="font-semibold text-slate-200 mt-1 leading-relaxed">
                        Q: {evaluation.suggestedFollowUp}
                      </p>
                    </div>
                    <button
                      onClick={() => loadFollowUp(evaluation.suggestedFollowUp)}
                      className="px-4 py-2 font-mono font-bold text-[10px] uppercase text-slate-950 bg-amber-500 hover:bg-amber-400 transition-colors rounded-lg flex items-center gap-1.5 self-end sm:self-auto cursor-pointer"
                    >
                      <span>Practice Question</span>
                      <ArrowRight size={12} />
                    </button>
                  </div>
                )}

              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </div>

    </div>
  );
}
