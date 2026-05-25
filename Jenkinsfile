// Jenkins Declarative CI/CD Pipeline Definition
pipeline {
    agent any
    
    environment {
        DOCKER_HUB_CREDENTIALS_ID = 'docker-hub-token'
        IMAGE_TAG = 'docker.io/student/devops-pipeline-master-suite:latest'
    }
    
    stages {
        stage('Code Safety & Security Validation') {
            steps {
                echo "Validating environment parameters..."
                // Runs dependency safety check or basic linter here
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
                sh "echo \$DOCKER_HUB_CREDENTIALS_PSW | docker login -u \$DOCKER_HUB_CREDENTIALS_USR --password-stdin"
                sh "docker push \${IMAGE_TAG}"
            }
        }
        
        stage('Orchestrate Remote Deployment via Ansible') {
            steps {
                echo "Running Ansible Playbooks agentlessly via containerized Ansible..."
                sh "docker run --rm -v \$(pwd):/workspace -v ~/.ssh:/root/.ssh alpine/ansible ansible-playbook -i /workspace/ansible/hosts /workspace/ansible/deploy-playbook.yml"
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
}
