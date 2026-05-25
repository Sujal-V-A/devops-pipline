import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

// Standard express server setup
async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API health check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", geminiConfigured: !!process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== "MY_GEMINI_API_KEY" });
  });

  // AI-Powered Viva defense examiner endpoint
  app.post("/api/viva/evaluate", async (req, res) => {
    const { question, answer, context } = req.body;

    if (!question || !answer) {
      return res.status(400).json({ error: "Question and Answer are required." });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    const isMockMode = !apiKey || apiKey === "MY_GEMINI_API_KEY" || apiKey.includes("PLACEHOLDER");

    if (isMockMode) {
      // Simulate high-quality DevOps critique if Gemini API is not configured
      const lowAnswer = answer.toLowerCase();
      let score = 5;
      let strengths = ["Submitted an answer and referenced the target systems."];
      let improvements = [
        "Needs more specific technical terminology.",
        "Highlight exactly how the tool integrates into the automated pipeline.",
        "Add security considerations, least-privilege principles, or decoupling details."
      ];
      let refined = "";

      if (lowAnswer.includes("stateless") || lowAnswer.includes("decouple") || lowAnswer.includes("managed")) {
        score += 2;
        strengths.push("Correctly identified the decoupling of compute from database layers.");
      }
      if (lowAnswer.includes("docker") || lowAnswer.includes("image") || lowAnswer.includes("container")) {
        score += 1;
        strengths.push("Acknowledged application packaging using Docker is standard practice.");
      }
      if (lowAnswer.includes("ansible") || lowAnswer.includes("playbook") || lowAnswer.includes("ssh")) {
        score += 1;
        strengths.push("Understands that Ansible achieves configuration updates agentlessly over Port 22 SSH.");
      }
      if (lowAnswer.includes("jenkins") || lowAnswer.includes("pipeline") || lowAnswer.includes("webhook")) {
        score += 1;
        strengths.push("Noted Jenkins acts as the pipeline orchestrator handling webhooks automatically.");
      }

      score = Math.min(score, 10);

      if (score < 7) {
        refined = "An excellent response should be: 'By segregating the pipeline, AWS EC2 Instance 1 hosts Jenkins which automatically compiles the Dockerfile and pushes the immutable image to Docker Hub on trigger. Ansible CD then uses standard Port 22 SSH to deploy this lightweight container dynamically on EC2 Instance 2. The compute is entirely stateless because database operations are decoupled to a permanent external Managed Cloud Database service.'";
      } else {
        refined = "This is a great, highly technical answer! To polish it even further, mention the security aspect of keeping EC2 instances bound strictly with security groups allowing only lease-privilege ports (SSH on port 22 for Ansible, and standard HTTP/HTTPS on port 80/443 for public ingress).";
      }

      return res.json({
        score,
        strengths,
        improvements,
        refinedAnswer: refined,
        suggestedFollowUp: "How are the security credentials (SSH keys, AWS access secrets) handled securely during the Jenkins & Ansible execution states?",
        isMock: true
      });
    }

    try {
      const ai = new GoogleGenAI({
        apiKey: apiKey,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          },
        },
      });

      const prompt = `You are a strict, professional academic evaluator/professor conducting a final year project thesis defense (viva-voce) in DevOps Engineering & Systems Automation.
The project title is: "Automated Cloud-Native CI/CD Pipeline and Configuration Management via Hybrid Decoupled Computing Infrastructure".

Evaluate the following student answer to the exam question below.
Question: "${question}"
Student's Answer: "${answer}"
Project Context: "${context || 'Two-tier decoupled architecture: AWS EC2 hosting Jenkins CI and Ansible CD, deploying Dockerized web app contacting a managed database.'}"

Provide your rigorous academic critique in JSON format conforming to this schema:
{
  "score": number (scalar 1 to 10 based on technical accuracy, completeness, and DevOps depth),
  "strengths": string[] (array of what the student captured well),
  "improvements": string[] (array of missing key concepts, security holes, configuration gaps, etc.),
  "refinedAnswer": string (a polished, professional university-defense-grade model answer explaining the principles clearly),
  "suggestedFollowUp": string (a challenging, relevant follow-up question based on this topic)
}
Be critical, academic, and extremely professional. Use standard DevOps jargon where appropriate (immutability, zero-downtime, least-privilege, isolation).`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              score: { type: Type.NUMBER, description: "A score from 1 to 10." },
              strengths: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "Positive aspects of the student's explanation."
              },
              improvements: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "Crucial concepts missing or points that need improvement."
              },
              refinedAnswer: { type: Type.STRING, description: "A flawless, highly academic, detailed model response." },
              suggestedFollowUp: { type: Type.STRING, description: "Relevant follow-up question for deep dive." }
            },
            required: ["score", "strengths", "improvements", "refinedAnswer", "suggestedFollowUp"]
          }
        }
      });

      if (response.text) {
        const result = JSON.parse(response.text.trim());
        return res.json({ ...result, isMock: false });
      } else {
        throw new Error("Empty response received from Gemini.");
      }

    } catch (err: any) {
      console.error("Gemini API Error:", err);
      return res.status(500).json({ error: "Failed to query Gemini API: " + err.message });
    }
  });

  // Serve static assets or mount Vite middleware
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[DevOps Portal Server] Listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
