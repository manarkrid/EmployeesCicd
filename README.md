# Projet Employees Management - Documentation CI/CD Complète

Ce document fournit les instructions précises pour reproduire l'environnement de développement et la chaîne de déploiement automatisée (CI/CD).

---

## 🏗️ 1. Architecture du Système

L'application suit une architecture microservices simplifiée :
- **Frontend** : Framework Angular, servi via un serveur de développement ou Docker.
- **Backend** : API REST Node.js/Express connectée à MySQL.
- **Base de données** : Instance MySQL avec persistance des données via Kubernetes Volumes.
- **CI/CD** : Pipeline orchestré par Jenkins, utilisant Docker Hub comme registre d'images.

---

## 🛠️ 2. Reproduction de l'Environnement de Développement

### A. Prérequis
- **Docker Engine** (version 20.10+)
- **Docker Compose**
- **Node.js** (v18+) & **Angular CLI** (optionnel, pour dev sans Docker)

### B. Lancement via Docker Compose
Cette méthode reproduit l'environnement complet (App + DB) localement :
```bash
# À la racine du projet
docker-compose up --build -d
```
- **Frontend** : [http://localhost:4200](http://localhost:4200)
- **Backend API** : [http://localhost:8080](http://localhost:8080)
- **Logs** : `docker-compose logs -f`

---

## ⚙️ 3. Mise en Place de la Chaîne CI/CD (Jenkins)

Pour reproduire la chaîne automatisée, suivez ces étapes détaillées :

### A. Configuration de Jenkins
1. **Plugins requis** :
   - `Pipeline`
   - `Git`
   - `Credentials Binding Plugin` (pour Docker Hub)
   - `Docker Pipeline`

2. **Identifiants (Credentials)** :
   - Allez dans **Manage Jenkins** > **Credentials**.
   - Ajoutez un identifiant de type **Username with password**.
   - **Username** : Votre compte Docker Hub (`manar2`).
   - **Password** : Votre Token ou Mot de passe Docker Hub.
   - **ID** : `docker-hub-credentials` (doit correspondre au Jenkinsfile).

### B. Configuration de l'accès Kubernetes
Le pipeline utilise `kubectl` via Docker pour déployer sur le cluster.
- Assurez-vous que le service Jenkins a les permissions de lecture sur `/home/vboxuser/.kube/config`.
- Le Jenkinsfile monte ces volumes pour l'accès local :
  - `-v /home/vboxuser/.kube:/root/.kube:ro`
  - `-v /home/vboxuser/.minikube:/home/vboxuser/.minikube:ro`

### C. Création du Job
1. Nouveau item > **Pipeline**.
2. Dans la section **Pipeline**, choisissez **Pipeline script from SCM**.
3. **SCM** : Git.
4. **Repository URL** : L'URL de votre projet.
5. **Script Path** : `Jenkinsfile`.

---

## 🚢 4. Déploiement et Vérification (Kubernetes)

Après l'exécution du pipeline, vérifiez le bon fonctionnement sur le cluster :

### Vérification des ressources
```bash
# Vérifier que tous les pods sont "Running"
kubectl get pods

# Vérifier que les services sont exposés
kubectl get svc
```

### Accès à l'application (Minikube)
```bash
# Récupérer l'URL du frontend
minikube service frontend --url
```

---

## 📝 5. Résumé des Fichiers Clés
- **`Jenkinsfile`** : Définit les stages (Checkout, Build, Push, Deploy).
- **`k8s/`** : Contient les manifests YAML (backend, frontend, mysql).
- **`docker-compose.yml`** : Orchestration simple pour le développement local.
- **`frontend/.editorconfig`** : Règles de formatage de code pour l'équipe.


