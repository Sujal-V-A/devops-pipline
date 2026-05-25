import React, { useState } from "react";
import { Cpu, FileCode, Check, Copy, Settings, RefreshCw, Layers, Database, Globe } from "lucide-react";

type Framework = "NodeJS" | "Flask" | "Gin";
type DatabaseType = "PostgreSQL" | "MySQL";

export default function ConfigGenerator() {
  const [projectName, setProjectName] = useState("hybrid-cd-pipeline");
  const [framework, setFramework] = useState<Framework>("NodeJS");
  const [dbType, setDbType] = useState<DatabaseType>("PostgreSQL");
  const [productionIp, setProductionIp] = useState("18.232.40.101");
  const [hostPort, setHostPort] = useState("80");
  const [copiedName, setCopiedName] = useState<string | null>(null);

  const copyCode = (code: string, tabName: string) => {
    navigator.clipboard.writeText(code);
    setCopiedName(tabName);
    setTimeout(() => setCopiedName(null), 2000);
  };

  // Generate Dockerfile dynamically
  const generateDockerfile = () => {
    if (framework === "NodeJS") {
      return `# Generated Dockerfile for Node.js Express Decoupled Service
FROM node:18-alpine
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE ${hostPort}
ENV PORT=${hostPort}
CMD ["node", "server.js"]`;
    } else if (framework === "Flask") {
      return `# Generated Dockerfile for Python Flask Decoupled Service
FROM python:3.10-slim-buster
WORKDIR /srv/flask-app
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
EXPOSE ${hostPort}
ENV PORT=${hostPort}
ENV FLASK_APP=app.py
CMD ["gunicorn", "-b", "0.0.0.0:${hostPort}", "app:app"]`;
    } else {
      return `# Generated Dockerfile for Go Gin Decoupled Service
FROM golang:1.20-alpine AS builder
WORKDIR /app
COPY go.mod go.sum ./
RUN go mod download
COPY . .
RUN CGO_ENABLED=0 GOOS=linux go build -o /server

FROM alpine:latest  
RUN apk --no-cache add ca-certificates
COPY --from=builder /server /server
EXPOSE ${hostPort}
CMD ["/server"]`;
    }
  };

  // Generate Jenkinsfile dynamically
  const generateJenkinsfile = () => {
    const imageName = `docker.io/student/${projectName}:latest`;
    return `// Generated Declarative Jenkinsfile for ${projectName} on AWS Node 1
pipeline {
    agent any
    
    environment {
        DOCKER_HUB_CREDENTIALS_ID = 'docker-hub-token'
        IMAGE_TAG = '${imageName}'
    }
    
    stages {
        stage('Repository Checkout') {
            steps {
                git branch: 'master', url: 'https://github.com/student/${projectName}.git'
            }
        }
        
        stage('Code Safety & Security Validation') {
            steps {
                echo "Validating environment parameters..."
                // Insert linting or basic test suite scripts here
            }
        }
        
        stage('Docker Image Compilation') {
            steps {
                echo "Initializing Docker compilation layer..."
                sh "docker build -t \${IMAGE_TAG} ."
            }
        }
        
        stage('Push to Central Hub Container Registry') {
            steps {
                echo "Pushing immutable image to Docker Hub repository..."
                sh "echo \\$DOCKER_HUB_CREDENTIALS_PSW | docker login -u \\$DOCKER_HUB_CREDENTIALS_USR --password-stdin"
                sh "docker push \${IMAGE_TAG}"
            }
        }
        
        stage('Orchestrate Remote Deployment via Ansible') {
            steps {
                echo "Running Ansible Playbooks agentlessly over Port 22 SSH..."
                sh "ansible-playbook -i ansible/hosts ansible/deploy-playbook.yml"
            }
        }
    }
    
    post {
        success {
            echo "✔ Pipeline Completed Successfully. Production environment loaded!"
        }
        failure {
            echo "❌ Pipeline broken on step validation. Halting Docker packaging."
        }
    }
}`;
  };

  // Generate Ansible deploy playbook dynamically
  const generateAnsiblePlaybook = () => {
    const containerName = `${projectName}-runner`;
    const dockerImage = `student/${projectName}:latest`;
    const dbDefaultPort = dbType === "PostgreSQL" ? "5432" : "3306";

    return `---
# Generated Ansible CD Playbook for ${projectName} Production Server
- name: Agentless CD Deployment to Production Instance
  hosts: production_servers
  become: yes
  
  vars:
    container_name: "${containerName}"
    docker_image: "${dockerImage}"
    host_port: "${hostPort}"
    target_port: "${hostPort}"
    db_endpoint: "managed-${dbType.toLowerCase()}-${projectName}.cgv1kkk9mzo3.us-east-1.rds.amazonaws.com"
    db_port: "${dbDefaultPort}"

  tasks:
    - name: Purge old application docker container instance if present
      docker_container:
        name: "{{ container_name }}"
        state: absent

    - name: Fetch fresh container layer from Docker Hub
      docker_image:
        name: "{{ docker_image }}"
        source: pull
        force_source: yes

    - name: Spin up new stateless container running on Port {{ host_port }}
      docker_container:
        name: "{{ container_name }}"
        image: "{{ docker_image }}"
        state: started
        restart_policy: always
        published_ports:
          - "{{ host_port }}:{{ target_port }}"
        env:
          DB_HOST: "{{ db_endpoint }}"
          DB_PORT: "{{ db_port }}"
          DB_USER: "vault_db_admin"
          DB_PASSWORD: "secureVaultPassword99!"
          DB_NAME: "prod_${projectName}_schema"
          APP_ENV: "production"
`;
  };

  const generateAnsibleHosts = () => {
    return `# Generated Ansible Hosts Inventory File (ansible/hosts)
[production_servers]
aws-node-prod ansible_host=${productionIp} ansible_user=ubuntu ansible_ssh_private_key_file=~/.ssh/aws-keypair.pem

[all:vars]
ansible_python_interpreter=/usr/bin/python3
ansible_ssh_common_args='-o StrictHostKeyChecking=no'`;
  };

  const dynamicFiles = [
    { name: "Dockerfile", description: "Configures microservice parameters", code: generateDockerfile(), lang: "dockerfile" },
    { name: "Jenkinsfile", description: "Automates CI tests & builds", code: generateJenkinsfile(), lang: "groovy" },
    { name: "deploy-playbook.yml", description: "Executes agentless remote deployment states", code: generateAnsiblePlaybook(), lang: "yaml" },
    { name: "ansible/hosts", description: "Orchestration host inventories", code: generateAnsibleHosts(), lang: "ini" }
  ];

  const [activeTab, setActiveTab] = useState("Dockerfile");
  const currentViewFile = dynamicFiles.find(f => f.name === activeTab) || dynamicFiles[0];

  return (
    <div id="config-generator-section" className="space-y-6">
      
      {/* Settings Grid */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-md grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        
        {/* Project details */}
        <div className="space-y-2">
          <label className="block text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
            Project Repo Name
          </label>
          <div className="relative">
            <input
              type="text"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value.replace(/\s+/g, '-').toLowerCase())}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-amber-500 font-mono"
              placeholder="hybrid-decoupled-app"
            />
          </div>
        </div>

        {/* Framework Selector */}
        <div className="space-y-2">
          <label className="block text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
            Web Backend Framework
          </label>
          <div className="grid grid-cols-3 gap-2">
            {(["NodeJS", "Flask", "Gin"] as Framework[]).map((fw) => (
              <button
                key={fw}
                onClick={() => setFramework(fw)}
                className={`py-2 px-3 text-xs font-mono rounded-lg border font-medium ${
                  framework === fw
                    ? "border-amber-500 bg-amber-500/10 text-amber-300"
                    : "border-slate-800 bg-slate-950 text-slate-400 hover:border-slate-700"
                }`}
              >
                {fw === "NodeJS" ? "Node Express" : fw === "Flask" ? "Flask" : "Go Gin"}
              </button>
            ))}
          </div>
        </div>

        {/* DB Selector */}
        <div className="space-y-2">
          <label className="block text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
            Decoupled DB Infrastructure
          </label>
          <div className="grid grid-cols-2 gap-2">
            {(["PostgreSQL", "MySQL"] as DatabaseType[]).map((db) => (
              <button
                key={db}
                onClick={() => setDbType(db)}
                className={`py-2 px-3 text-xs font-mono rounded-lg border font-medium ${
                  dbType === db
                    ? "border-amber-500 bg-amber-500/10 text-amber-300"
                    : "border-slate-800 bg-slate-950 text-slate-400 hover:border-slate-700"
                }`}
              >
                {db} RDS Service
              </button>
            ))}
          </div>
        </div>

        {/* Production Host IP */}
        <div className="space-y-2">
          <label className="block text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
            AWS Host IP Address (EC2 Instance 2)
          </label>
          <div className="relative">
            <input
              type="text"
              value={productionIp}
              onChange={(e) => setProductionIp(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-amber-500 font-mono"
              placeholder="e.g. 18.232.40.101"
            />
          </div>
        </div>

        {/* Target Server Port */}
        <div className="space-y-2">
          <label className="block text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
            Application Service Ingress Port
          </label>
          <input
            type="number"
            value={hostPort}
            onChange={(e) => setHostPort(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-amber-500 font-mono"
            placeholder="80"
          />
        </div>

        {/* Information prompt */}
        <div className="border border-amber-500/20 bg-amber-500/5 rounded-xl px-4 py-3 text-xs text-amber-400 leading-relaxed flex items-center justify-center gap-2.5">
          <RefreshCw className="h-5 w-5 shrink-0 text-amber-500 animate-spin-slow" />
          <span>Blueprints regenerate in real-time as parameters are adjusted, adapting the environmental compilation scripts.</span>
        </div>

      </div>

      {/* Code Viewer Workspace */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden flex flex-col md:flex-row h-[480px]">
        {/* Navigation Tabs */}
        <div className="border-b md:border-b-0 md:border-r border-slate-800 md:w-64 bg-slate-950 flex flex-row md:flex-col shrink-0 overflow-x-auto md:overflow-x-visible">
          {dynamicFiles.map((file) => (
            <button
              key={file.name}
              onClick={() => setActiveTab(file.name)}
              className={`text-left px-5 py-4 text-xs font-mono flex items-center justify-between transition-all border-b md:border-b-0 md:border-l-2 shrink-0 md:shrink border-slate-800/20 ${
                activeTab === file.name
                  ? "bg-slate-900 text-amber-400 border-b-2 md:border-b-0 md:border-l-amber-500 font-bold"
                  : "text-slate-400 hover:bg-slate-900/50 hover:text-slate-200"
              }`}
            >
              <div>
                <p className="font-semibold">{file.name}</p>
                <p className="text-[10px] text-slate-500 mt-0.5 hidden md:block">{file.description}</p>
              </div>
            </button>
          ))}
        </div>

        {/* Code Frame */}
        <div className="flex-1 flex flex-col min-w-0 bg-slate-950">
          <div className="bg-slate-900/60 p-4 border-b border-slate-950 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs">
              <FileCode className="text-amber-500 h-4 w-4" />
              <span className="font-mono text-slate-200 font-medium">{currentViewFile.name}</span>
            </div>
            <button
              id={`btn-copy-${activeTab.replace("/", "-")}`}
              onClick={() => copyCode(currentViewFile.code, currentViewFile.name)}
              className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-xs font-mono text-slate-300 hover:text-slate-100 rounded flex items-center gap-1.5 transition-colors"
            >
              {copiedName === currentViewFile.name ? (
                <>
                  <Check size={13} className="text-emerald-500" />
                  <span className="text-emerald-500 font-semibold">Blank Copied</span>
                </>
              ) : (
                <>
                  <Copy size={13} />
                  <span>Copy Configuration</span>
                </>
              )}
            </button>
          </div>

          <div className="flex-1 p-5 overflow-y-auto bg-[#070b16] font-mono text-xs text-slate-350 leading-relaxed text-left select-text selection:bg-amber-500 selection:text-slate-955 overflow-x-auto">
            <pre className="whitespace-pre">
              <code>{currentViewFile.code}</code>
            </pre>
          </div>
        </div>

      </div>

    </div>
  );
}
