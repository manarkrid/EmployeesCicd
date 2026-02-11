pipeline {
    agent any

    environment {
        DOCKER_HUB_USER = 'your-docker-hub-username'
        DOCKER_HUB_CREDENTIALS_ID = 'docker-hub-credentials'
        BACKEND_IMAGE = "${DOCKER_HUB_USER}/employees-backend"
        FRONTEND_IMAGE = "${DOCKER_HUB_USER}/employees-frontend"
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build Docker Images') {
            steps {
                script {
                    sh "docker build -t ${BACKEND_IMAGE}:${BUILD_NUMBER} ./backend"
                    sh "docker build -t ${FRONTEND_IMAGE}:${BUILD_NUMBER} ./frontend"
                    sh "docker tag ${BACKEND_IMAGE}:${BUILD_NUMBER} ${BACKEND_IMAGE}:latest"
                    sh "docker tag ${FRONTEND_IMAGE}:${BUILD_NUMBER} ${FRONTEND_IMAGE}:latest"
                }
            }
        }

        stage('Push to Docker Hub') {
            steps {
                script {
                    withCredentials([usernamePassword(credentialsId: "${DOCKER_HUB_CREDENTIALS_ID}", usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                        sh "echo \$DOCKER_PASS | docker login -u \$DOCKER_USER --password-stdin"
                        sh "docker push ${BACKEND_IMAGE}:${BUILD_NUMBER}"
                        sh "docker push ${BACKEND_IMAGE}:latest"
                        sh "docker push ${FRONTEND_IMAGE}:${BUILD_NUMBER}"
                        sh "docker push ${FRONTEND_IMAGE}:latest"
                    }
                }
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                script {
                    // Assuming kubectl is configured on the Jenkins agent
                    // Update the image in the deployment manifests or use helm
                    sh "sed -i 's|IMAGE_BACKEND|${BACKEND_IMAGE}:${BUILD_NUMBER}|g' k8s/backend-deployment.yaml"
                    sh "sed -i 's|IMAGE_FRONTEND|${FRONTEND_IMAGE}:${BUILD_NUMBER}|g' k8s/frontend-deployment.yaml"
                    sh "kubectl apply -f k8s/"
                }
            }
        }
    }

    post {
        always {
            sh "docker logout"
        }
    }
}
