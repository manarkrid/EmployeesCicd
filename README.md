# Projet Employees Management - Documentation CI/CD de bout en bout

Ce dépôt contient une solution de gestion des employés avec une automatisation CI/CD, un déploiement Kubernetes et un monitoring avancé.

---

## 🏗️ 1. Architecture du Projet

L'architecture est basée sur une pile fullstack moderne et suit un modèle **3-Tier** conteneurisé :
- **Frontend** : Angular (v18+) & Nginx
- **Backend** : Node.js (Express) & Sequelize
- **Base de données** : MySQL
- **Orchestration** : Kubernetes (Minikube)
- **CI/CD** : Jenkins & GitHub Actions

### Schéma Conceptuel (Mermaid)

L'application suit une architecture **3-Tier** conteneurisée et orchestrée.

### Schéma Conceptuel (Mermaid)
```mermaid
graph TD
    classDef infra fill:#f9f,stroke:#333,stroke-width:2px;
    classDef app fill:#bbf,stroke:#333,stroke-width:2px;
    classDef db fill:#bfb,stroke:#333,stroke-width:2px;

    subgraph "Utilisateur"
        User((Navigateur Web))
    end

    subgraph "CI/CD Pipeline"
        Code[Code Source] --> Build{Build & Push}
        Build --> DHub((Docker Hub))
    end

    subgraph "Cluster Kubernetes (Minikube)"
        subgraph "Frontend Layer"
            FE_Svc[Service Frontend]:::infra
            FE_Svc --> FE_Pod[Pod: Angular + Nginx]:::app
        end

        subgraph "Backend Layer"
            BE_Svc[Service Backend]:::infra
            BE_Svc --> BE_Pod[Pod: Node.js / Express]:::app
        end

        subgraph "Data Layer"
            DB_Svc[Service MySQL]:::infra
            DB_Svc --> DB_Pod[Pod: MySQL]:::db
            DB_Pod --- PV[(Persistent Volume)]
        end
    end

    User <--> FE_Svc
    FE_Pod -- API REST --> BE_Svc
    BE_Svc <--> BE_Pod
    BE_Pod -- Sequelize --> DB_Svc
    DHub -. Pull Images .-> FE_Pod
    DHub -. Pull Images .-> BE_Pod
```

### Visualisation Graphique
![Architecture du Projet](./assets/architecture.png)

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

## 🚀 4. GitHub Actions (Alternative CD)
Un workflow GitHub Actions est disponible dans `.github/workflows/cd.yml`.

### Configuration requise :
1. **Secrets GitHub** : Ajoutez `DOCKER_HUB_TOKEN` dans votre dépôt.
2. **Self-hosted Runner** : Indispensable pour l'accès local à Minikube.

---

## ☸️ 5. Kubernetes (K8s)
Le déploiement est géré via les manifests dans `/k8s` :

- **Deployments** : Gèrent les répliques pour `frontend`, `backend` et `mysql`.
- **Services** : 
  - `frontend` : Exposé via un **LoadBalancer** (ou NodePort sur Minikube).
  - `backend` : Service interne accessible uniquement par le frontend.
  - `db` : Service interne pour MySQL.
- **Outil utilisé** : `kubectl apply -f k8s/`.

---

## 📊 6. Monitoring (Prometheus + Grafana)
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




