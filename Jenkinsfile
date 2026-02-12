pipeline {
    agent any

    environment {
    DOCKER_HUB_USER = 'manar2'
    DOCKER_HUB_CREDENTIALS_ID = 'docker-hub-credentials'
    BACKEND_IMAGE = "${DOCKER_HUB_USER}/employeemanagment_back"
    FRONTEND_IMAGE = "${DOCKER_HUB_USER}/employeemanagment_front"
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
                    // 1. Mise à jour des images dans les manifests
                    sh "sed -i 's|IMAGE_BACKEND|${BACKEND_IMAGE}:${BUILD_NUMBER}|g' k8s/backend-manifests.yaml"
                    sh "sed -i 's|IMAGE_FRONTEND|${FRONTEND_IMAGE}:${BUILD_NUMBER}|g' k8s/frontend-manifests.yaml"

                    // 2. Fusionner les fichiers proprement et déployer via container en mode root
                    sh """
                        # Création d'un fichier unique avec séparateurs
                        echo "" > k8s_all.yaml
                        for f in k8s/backend-manifests.yaml k8s/frontend-manifests.yaml k8s/mysql-manifests.yaml; do
                            cat \$f >> k8s_all.yaml
                            echo "" >> k8s_all.yaml
                            echo "---" >> k8s_all.yaml
                        done

                        # Déploiement (--user 0:0 est essentiel pour lire les certificats du host)
                        cat k8s_all.yaml | docker run -i --rm --network host \\
                            --user 0:0 \\
                            -v /home/vboxuser/.kube:/root/.kube:ro \\
                            -v /home/vboxuser/.minikube:/home/vboxuser/.minikube:ro \\
                            -e KUBECONFIG=/root/.kube/config \\
                            bitnami/kubectl:latest apply -f - --validate=false
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
