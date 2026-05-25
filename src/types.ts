export interface PipelineStage {
  id: string;
  name: string;
  phase: string;
  description: string;
  status: "idle" | "running" | "success" | "failed";
  duration: number; // in ms
  tools: string[];
  files: {
    name: string;
    description: string;
    code: string;
    language: string;
  }[];
  consoleLogs: string[];
}

export interface TechnicalTool {
  id: string;
  name: string;
  category: string;
  role: string;
  specificTarget: string;
  justification: string;
  iconName: string;
  configSampleName: string;
  configSampleCode: string;
  language: string;
}

export interface InterviewQuestion {
  id: string;
  question: string;
  category: string;
  difficulty: "Basic" | "Intermediate" | "Advanced";
  standardExplanation: string;
}

export interface Critique {
  score: number;
  strengths: string[];
  improvements: string[];
  refinedAnswer: string;
  suggestedFollowUp: string;
}

export interface ChatMessage {
  sender: "student" | "evaluator";
  text: string;
  critique?: Critique;
  timestamp: string;
}
