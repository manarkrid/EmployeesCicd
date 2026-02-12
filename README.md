# Projet Employees Management - Documentation CI/CD de bout en bout

Ce dépôt contient une solution complète de gestion des employés avec une automatisation CI/CD, un déploiement Kubernetes et un monitoring avancé.

---

## 🏗️ 1. Architecture du Projet
L'architecture est basée sur une pile fullstack moderne :
- **Frontend** : Angular (v18+)
- **Backend** : Node.js (Express) & Sequelize
- **Base de données** : MySQL
- **Orchestration** : Kubernetes (Minikube)

---

## � 2. Dockerisation de l'Application
Chaque composant possède son propre `Dockerfile` optimisé :

- **Backend** : Construit une image Node.js légère, installe les dépendances et expose le port `8080`.
- **Frontend** : Utilise une construction multi-étapes (Multistage build) :
  1. Build de l'application Angular via Node.js.
  2. Service des fichiers statiques via Nginx sur le port `80`.

**Vérification locale** :
`docker-compose up --build` permet de valider que les conteneurs sont pleinement fonctionnels.

---

## ⚙️ 3. Pipeline Jenkins (CI/CD)
Le fichier `Jenkinsfile` à la racine orchestre la chaîne de livraison :

1.  **Checkout** : Récupère le code source depuis GitHub.
2.  **Build Docker Images** : Construit les images avec un tag basé sur le numéro de build `${BUILD_NUMBER}`.
3.  **Push to Docker Hub** : Publie les images sur le dépôt `manar2/employeemanagment_*`.
4.  **Déploiement GitOps** : 
    - Met à jour les manifests Kubernetes avec les nouveaux tags d'images (`sed`).
    - Applique les changements sur le cluster via un conteneur `kubectl`.

---

## ☸️ 4. Kubernetes (K8s)
Le déploiement est géré via les manifests dans `/k8s` :

- **Deployments** : Gèrent les répliques pour `frontend`, `backend` et `mysql`.
- **Services** : 
  - `frontend` : Exposé via un **LoadBalancer** (ou NodePort sur Minikube).
  - `backend` : Service interne accessible uniquement par le frontend.
  - `db` : Service interne pour MySQL.
- **Outil utilisé** : `kubectl apply -f k8s/`.

---

## 📊 5. Monitoring (Prometheus + Grafana)
Le monitoring est mis en place via la stack **kube-prometheus-stack** (Helm).

### A. Installation par ligne de commande (CMD)
```bash
# Ajouter le repo Helm
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm repo update

# Installer la stack
helm install monitoring prometheus-community/kube-prometheus-stack \
  --namespace monitoring --create-namespace
```

### B. Accès via Navigateur (GUI)
1. **Port-forward** : `kubectl port-forward -n monitoring svc/monitoring-grafana 3000:80`
2. **Ouverture** : Accédez à [http://localhost:3000](http://localhost:3000).
3. **Login** : `admin` / `prom-operator`.

### C. Exigences réalisées
- **Collecte** : Prometheus collecte automatiquement les métriques des nodes et pods du cluster.
- **Dashboards** : Importez des dashboards standards (ex: ID `1860` pour Node Exporter) pour visualiser l'état du cluster.
- **Métriques applicatives** : Surveillance de la latence HTTP et du taux d'erreur via les métriques exposées.
- **Alerting** (Bonus) : Alertmanager est configuré pour notifier en cas de pod en échec.

---

## 📝 Résumé des commandes utiles
- `minikube service frontend` : Accéder à l'application.
- `kubectl get all -n monitoring` : Vérifier l'état du monitoring.
- `git commit -m "docs: finalized readme covering all 5 steps"` : Enregistrer les changements.


