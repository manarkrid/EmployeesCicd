pipeline {
    agent any

    environment {
    DOCKER_HUB_USER = 'manar2'
    DOCKER_HUB_CREDENTIALS_ID = 'docker-hub-credentials'
    BACKEND_IMAGE = "${DOCKER_HUB_USER}/employeemanagment_back"
    FRONTEND_IMAGE = "${DOCKER_HUB_USER}/employeemanagment_front"
    KUBECTL_IMAGE = "rancher/kubectl:v1.29.0" 
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
                    // Mise à jour des images dans les manifests Kubernetes
                    sh "sed -i 's|IMAGE_BACKEND|${BACKEND_IMAGE}:${BUILD_NUMBER}|g' k8s/backend-manifests.yaml"
                    sh "sed -i 's|IMAGE_FRONTEND|${FRONTEND_IMAGE}:${BUILD_NUMBER}|g' k8s/frontend-manifests.yaml"

                    // Déploiement via kubectl en passant les manifests par un "pipe"
                    // Cela évite les erreurs de montage de fichiers (mount)
                    sh """
                        cat k8s/*.yaml | docker run -i --rm --network host \\
                        -v /home/vboxuser/.kube:/root/.kube \\
                        -v /home/vboxuser/.minikube:/home/vboxuser/.minikube \\
                        ${KUBECTL_IMAGE} apply -f -
                    """
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
