import { PipelineStage, TechnicalTool, InterviewQuestion } from "./types";

export const PIPELINE_STAGES: PipelineStage[] = [
  {
    id: "stage-1",
    name: "Code Commit",
    phase: "Phase 1: Commit",
    description: "The developer implements code updates, Ansible Playbooks, or Docker configs locally and pushes them to the remote GitHub repository.",
    status: "idle",
    duration: 1500,
    tools: ["Git", "GitHub"],
    files: [
      {
        name: "index.js",
        description: "Node.js/Express Server Entry Point inside the repository",
        language: "javascript",
        code: `const express = require('express');
const { Pool } = require('pg');
const app = express();

const dbPool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: 5432,
  ssl: { rejectUnauthorized: false }
});

app.get('/', async (req, res) => {
  try {
    const { rows } = await dbPool.query('SELECT NOW()');
    res.send({ status: 'live', timestamp: rows[0].now, compute: 'AWS EC2 Instance 2' });
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

app.listen(80, () => console.log('Stateless web services serving traffic on port 80'));`
      }
    ],
    consoleLogs: [
      "git add .",
      "git commit -m 'feat: integrated managed database cluster & decoupled endpoints'",
      "git push origin master",
      "Counting objects: 100% (7/7), done.",
      "Delta compression using up to 8 threads",
      "To github.com/student/devops-final-year-project.git",
      "   a9f3b2d..d4c1b92  master -> master"
    ]
  },
  {
    id: "stage-2",
    name: "Automated Orchestration Trigger",
    phase: "Phase 2: Trigger",
    description: "GitHub handles the master push and triggers the pre-configured Webhook on port 8080. Jenkins is awakened instantly via this webhook listener payload.",
    status: "idle",
    duration: 1200,
    tools: ["GitHub Webhooks", "Jenkins Multi-branch Webhook Header"],
    files: [
      {
        name: "webhook-payload.json",
        description: "Partial GitHub Webhook JSON representation sent to Jenkins",
        language: "json",
        code: `{
  "ref": "refs/heads/master",
  "before": "a9f3b2d6a12",
  "after": "d4c1b9231f8",
  "repository": {
    "name": "devops-final-year-project",
    "html_url": "https://github.com/student/devops-final-year-project"
  },
  "pusher": {
    "name": "developer-student",
    "email": "student@university.edu"
  }
}`
      }
    ],
    consoleLogs: [
      "[GitHub Webhook] Event 'push' captured for branch master",
      "[GitHub Webhook] Outbound HTTP POST payload initiated to AWS security-group endpoint...",
      "Connecting to: http://ec2-18-204-12-88.compute-1.amazonaws.com:8888/github-webhook/ ...",
      "HTTP/1.1 200 OK received from Jenkins server controller",
      "[Jenkins Queue] Build job #14 successfully registered on AWS Control Node 1"
    ]
  },
  {
    id: "stage-3",
    name: "Continuous Integration & Packaging",
    phase: "Phase 3: Build & Package",
    description: "Jenkins clones the repository on AWS EC2 Instance 1 (CI Control Node), reads the Declarative Jenkinsfile, compiles the Dockerfile into an immutable container image, and pushes it to Docker Hub.",
    status: "idle",
    duration: 3000,
    tools: ["Jenkins Pipelines", "Docker Core Engine", "Docker Hub"],
    files: [
      {
        name: "Jenkinsfile",
        description: "Jenkins Declarative CI Pipeline Definition",
        language: "groovy",
        code: `pipeline {
    agent any
    environment {
        DOCKER_HUB_CREDS = credentials('docker-hub-token')
        IMAGE_NAME = 'hub.docker.com/student/devops-final-web:v1.0'
    }
    stages {
        stage('Checkout Code') {
            steps {
                git branch: 'master', url: 'https://github.com/student/devops-final-year-project.git'
            }
        }
        stage('Docker App Build') {
            steps {
                sh 'docker build -t $IMAGE_NAME .'
            }
        }
        stage('Push to Registry') {
            steps {
                sh 'echo $DOCKER_HUB_CREDS_PSW | docker login -u $DOCKER_HUB_CREDS_USR --password-stdin'
                sh 'docker push $IMAGE_NAME'
            }
        }
    }
}`
      },
      {
        name: "Dockerfile",
        description: "Application container specifications creating repeatable execution layers",
        language: "dockerfile",
        code: `FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --only=production
COPY . .
EXPOSE 80
ENV PORT=80
CMD ["node", "index.js"]`
      }
    ],
    consoleLogs: [
      "[Jenkins Build #14] Started by GitHub Trigger",
      "Cloning repository into local workspace: /var/jenkins_home/workspace/pipeline_master",
      "Switched to a new branch 'master'",
      "Executing step: Docker App Build",
      "Sending build context to Docker daemon  42.5kB",
      "Step 1/6 : FROM node:18-alpine ---> 83ab9c2401bc",
      "Step 2/6 : WORKDIR /app ---> Running in bfcf89cb52b",
      "Step 5/6 : EXPOSE 80 ---> Running in 118a8ba991c",
      "Successfully built f28ac00d11be",
      "Executing step: Push to registry",
      "Logging in to Docker Hub via credentials token...",
      "Login Succeeded",
      "Pushed image layer: index 83ab9c2401bc - cached",
      "Pushed image layer: application code d4c1b9231f8 - uploaded",
      "[Jenkins] CI phase complete. Stored on docker.io/student/devops-final-web:v1.0"
    ]
  },
  {
    id: "stage-4",
    name: "Remote Configuration & Deployment",
    phase: "Phase 4: Configure",
    description: "Jenkins passes the baton to Ansible Core. Operating agentlessly via SSH key validation on Port 22, Ansible logs into EC2 Instance 2 (Production Host), wipes stale containers, and provisions the fresh runtime container.",
    status: "idle",
    duration: 2500,
    tools: ["Ansible Orchestration", "Port 22 SSH", "Ubuntu Target Instance 2"],
    files: [
      {
        name: "deploy-playbook.yml",
        description: "Ansible Playbook carrying atomic deployment steps",
        language: "yaml",
        code: `---
- name: Deploy Stateless Application Container to Production Host
  hosts: production_servers
  become: yes
  tasks:
    - name: Ensure old application container is stopped and removed
      docker_container:
        name: final-web-app
        state: absent

    - name: Pull newly minted version from Docker Hub
      docker_image:
        name: "student/devops-final-web:v1.0"
        source: pull

    - name: Launch container dynamic cluster on Port 80
      docker_container:
        name: final-web-app
        image: "student/devops-final-web:v1.0"
        state: started
        restart_policy: always
        published_ports:
          - "80:80"
        env:
          DB_HOST: "managed-rds-postgres.cgv1kkk9mzo3.us-east-1.rds.amazonaws.com"
          DB_USER: "master_admin"
          DB_PASSWORD: "vaultSecurePassword123"
          DB_NAME: "production_master_db"
`
      }
    ],
    consoleLogs: [
      "[Ansible Executor] Initiating Playbook: deploy-playbook.yml",
      "Target list resolved: [18.232.40.101 (AWS EC2 Instance 2)]",
      "TASK [Gathering Facts] *********************************************************",
      "ok: [18.232.40.101]",
      "TASK [Ensure old application container is stopped and removed] ******************",
      "changed: [18.232.40.101] - container 'final-web-app' was running, now removed",
      "TASK [Pull newly minted version from Docker Hub] ********************************",
      "changed: [18.232.40.101] - pulled 'student/devops-final-web:v1.0' layer successfully",
      "TASK [Launch container dynamic cluster on Port 80] ******************************",
      "changed: [18.232.40.101] - running target mapped container over bridge interface",
      "PLAY RECAP *********************************************************************",
      "18.232.40.101              : ok=4    changed=3    unreachable=0    failed=0"
    ]
  },
  {
    id: "stage-5",
    name: "Stateless Run & Decoupled Database Sync",
    phase: "Phase 5: Run",
    description: "The live web workload is up-and-running on EC2 Instance 2, answering web traffic on Port 80. DB read/write actions are instantly marshaled across cloud database parameters, keeping application local storage static.",
    status: "idle",
    duration: 1000,
    tools: ["Managed DB Engine (PostgreSQL/MySQL)", "AWS Security Firewalls"],
    files: [
      {
        name: "db-schema.sql",
        description: "Relational cloud schema populated inside independent Managed DB engine",
        language: "sql",
        code: `-- Decoupled database schema
CREATE TABLE IF NOT EXISTS user_interactions (
  id SERIAL PRIMARY KEY,
  client_ip VARCHAR(45) NOT NULL,
  submission_content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO user_interactions (client_ip, submission_content)
VALUES ('192.168.1.1', 'Final year DevOps presentation successfully validated!');`
      }
    ],
    consoleLogs: [
      "[Application server runtime initialized]",
      "Listening on standard interface http://0.0.0.0:80",
      "[database-agent] Establishing client-pool connections...",
      "[database-agent] OK! Dynamic connection pool is established to: managed-rds-postgres.cgv1kkk9mzo3.us-east-1.rds.amazonaws.com:5432",
      "[HTTP Ingress User Log] GET / (Response Status Code: 200) - 1.2ms latency",
      "[HTTP Ingress User Log] POST /submit_form (Database state INSERT committed to Managed DB instance.)"
    ]
  }
];

export const TECHNICAL_TOOLS: TechnicalTool[] = [
  {
    id: "aws-ec2",
    name: "AWS (Amazon Web Services) EC2",
    category: "Infrastructure as a Service (IaaS)",
    role: "Compute Platform Hosts",
    specificTarget: "Provides full physical/virtual server systems. Two distinct Ubuntu Server Linux Nodes are provisioned under Free Tier limit boundaries: Node 1 strictly confines Jenkins Automation/Ansible controls, Node 2 hosts the containerized server payload.",
    justification: "Industrial validation: emulates actual workspace environments with secure cluster segmentation. We isolate Automation/CI tasks from live internet traffic, improving system reliability and resilience.",
    iconName: "Server",
    configSampleName: "SecurityGroupRules",
    configSampleCode: `# AWS Security Group Rules setup configuration
SecurityGroup-Jenkins:
  Ingress:
    - Port: 22    # Restricted to Admin CLI Access
    - Port: 8080  # Web Dashboard endpoint (Jenkins Portal)
SecurityGroup-ProductionApp:
  Ingress:
    - Port: 22    # Strict limited binding (Allows Ansible over SSH)
    - Port: 80    # Public Web Service HTTP Access port`,
    language: "yaml"
  },
  {
    id: "github",
    name: "Git & GitHub Repo",
    category: "Version Control Systems (VCS)",
    role: "Code Storage & Automation Driver",
    specificTarget: "Index and catalog standard source changes. Houses application business logic, Dockerfiles, and provisioning guides. Connects back to Jenkins systems dynamically through Webhook event listeners.",
    justification: "Serves as the definitive 'Source of Truth'. Trigger automation sequences on-push, bypassing manual steps and enforcing git-backed operational accountability.",
    iconName: "Github",
    configSampleName: "WebhookConfiguration",
    configSampleCode: `# Git Integration Hook Settings
Payload URL: http://your-jenkins-aws-instance-ip:8080/github-webhook/
Content Type: application/json
Trigger Events: [ ✔ ] Just the push event.
Active: True`,
    language: "yaml"
  },
  {
    id: "jenkins",
    name: "Jenkins declarative engine",
    category: "Continuous Integration (CI)",
    role: "Workflow Pipeline Orchestrator",
    specificTarget: "Handles integration code checks, automated builds, and deployment task handoffs automatically using declarative step chains.",
    justification: "Removes repetitive build actions, compiling application environments natively, ensuring no incomplete code or broken dependencies enter production registries.",
    iconName: "Cpu",
    configSampleName: "JenkinsDeclarativeSnippet",
    configSampleCode: `// Jenkins dynamic deployment trigger and docker packaging logic 
stage('Docker Build Process') {
    steps {
        echo 'Compiling dependencies into stateless storage containers'
        sh 'docker build -t production-registry/app-payload:latest .'
    }
}`,
    language: "groovy"
  },
  {
    id: "docker",
    name: "Docker Containers & Hub",
    category: "Containerization & Asset Registry",
    role: "Application Packaging & Storage",
    specificTarget: "Bundles software binaries, operating system libraries, and application dependencies into immutable images, hosted on Docker Hub.",
    justification: "Resolves the absolute classic 'But it works on my local computer!' issue. Running identical container parameters maintains stability across multi-node environments.",
    iconName: "Layers",
    configSampleName: "DockerfileSpecs",
    configSampleCode: `# Production dockerfile construction outline
FROM python:3.10-slim-buster
WORKDIR /srv/web
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
EXPOSE 80
ENTRYPOINT ["gunicorn", "-b", "0.0.0.0:80", "wsgi:app"]`,
    language: "dockerfile"
  },
  {
    id: "ansible",
    name: "Ansible Core Orchestration",
    category: "Continuous Deployment (CD) & Configuration",
    role: "Remote Agentless System Provisioner",
    specificTarget: "Handles zero-touch server updates on EC2 Instance 2 by verifying OS libraries and deploying container revisions dynamically over standard Port 22 SSH keys.",
    justification: "No client agents needed on the production instance. Avoids background system overhead, using direct, readable YAML lists to describe machine states cleanly.",
    iconName: "Network",
    configSampleName: "AnsibleHostsInventory",
    configSampleCode: `# Ansible Hosts Inventory File configuration
[production_servers]
aws-app-host ansible_host=18.232.xx.yy ansible_user=ubuntu ansible_ssh_private_key_file=./aws-keypair.pem

[all:vars]
ansible_python_interpreter=/usr/bin/python3`,
    language: "ini"
  },
  {
    id: "managed-db",
    name: "Managed Cloud Database Core",
    category: "Database-as-a-Service (DBaaS)",
    role: "Distributed Persistent Storage",
    specificTarget: "Maintains relational schema engines (such as PostgreSQL/MySQL) in an isolated cloud network away from transient virtual application nodes.",
    justification: "Keeps AWS EC2 systems entirely stateless. Even if production nodes crash, the database remains completely isolated, preventing data loss during auto-scaling or server failures.",
    iconName: "Database",
    configSampleName: "DatabaseConnectionVerification",
    configSampleCode: `-- Sample PostgreSQL Database Connection Check
SELECT 
    datname, 
    numbackends, 
    xact_commit, 
    xact_rollback 
FROM 
    pg_stat_database 
WHERE 
    datname = 'production_master_db';`,
    language: "sql"
  }
];

export const VIVA_QUESTIONS: InterviewQuestion[] = [
  {
    id: "q-1",
    question: "Why did you separate the pipeline by hosting Jenkins on EC2 Instance 1 and the web application on EC2 Instance 2 instead of running both on a single AWS VM?",
    category: "Architecture & Isolation",
    difficulty: "Intermediate",
    standardExplanation: "Resource scheduling and security. Jenkins handles resource-heavy Docker compiles and is exposed on port 8080 to GitHub webhooks. The Web Application must be kept secure on port 80 on Instance 2. Separating them prevents a heavy build load from lagging or crashing the live website, and respects least-privilege network rules."
  },
  {
    id: "q-2",
    question: "What does it mean that your application compute layer is entirely 'stateless', and how does your Managed Cloud Database core support this state?",
    category: "Cloud Native Principles",
    difficulty: "Advanced",
    standardExplanation: "Statelessness means that the application code running inside the Docker container does not read or write its permanent data inside the container container's file system. If the EC2 virtual host is terminated or restarted, no customer data is lost. It works because databases are completely decoupled to an external Managed Database, which handles replication, encryption, and scaling on its own."
  },
  {
    id: "q-3",
    question: "How does Ansible configure EC2 Instance 2, and what key configurations made it possible to deploy without installing a client-side agent?",
    category: "Infrastructure as Code",
    difficulty: "Advanced",
    standardExplanation: "Ansible operates 'agentlessly'. It establishes a secure channel dynamically over standard Port 22 SSH using SSH private keypairs provided during AWS VM provisioning. This completely avoids executing daemon engines on the client, minimizing memory consumption and security vulnerability points."
  },
  {
    id: "q-4",
    question: "Which port configurations did you specify in your AWS Security Groups for both machines? Justify these settings under the 'Principle of Least Privilege'.",
    category: "SecDevOps Security",
    difficulty: "Intermediate",
    standardExplanation: "For EC2 Node 1 (Jenkins): Ingress is enabled on Port 22 (restricted to the administrator's IP address) and Port 8080 (publicly open for webhook payloads from GitHub). For EC2 Node 2 (Production Host): Ingress permits Port 22 (SSH strictly limited to Node 1's private IP for Ansible security) and Port 80 (open to 0.0.0.0/0 for public internet users)."
  },
  {
    id: "q-5",
    question: "If a developer pushes a broken code update containing a syntax error to GitHub, does this automatically crash your live website? Clarify how your CI/CD setup protects production.",
    category: "DevOps & SRE Goals",
    difficulty: "Intermediate",
    standardExplanation: "The live website is protected. The Jenkinsfile is set up to test build compilation in the isolated build workspace on Node 1 beforehand. If the Docker build commands fail or tests error, Jenkins aborts the pipeline, logs a failure, and never triggers Ansible. The production runner cluster on EC2 Instance 2 continues running the healthy previous container image untouched."
  },
  {
    id: "q-6",
    question: "What is the role of Docker Hub in this architecture? Explain how it acts as the bridge intermediate state between CI and CD.",
    category: "Continuous Delivery",
    difficulty: "Basic",
    standardExplanation: "Docker Hub acts as an abstract, independent Container Registry. Jenkins compiles and tags the code as an immutable Docker image and pushes it to Docker Hub (CI completion). Ansible then orchestrates the Production EC2 to pull this exact image tag directly from Docker Hub (CD startup). This decouples build logic from deployment environments completely."
  }
];
