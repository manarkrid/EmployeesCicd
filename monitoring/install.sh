#!/bin/bash

# Add Helm repo
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm repo update

# Install kube-prometheus-stack
helm install monitoring prometheus-community/kube-prometheus-stack \
  --namespace monitoring \
  --create-namespace

echo "Monitoring stack installed in 'monitoring' namespace."
echo "Access Grafana: kubectl port-forward -n monitoring svc/monitoring-grafana 3000:80"
echo "Default credentials: admin / prom-operator"
