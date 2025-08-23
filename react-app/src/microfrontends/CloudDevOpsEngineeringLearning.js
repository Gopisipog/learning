import React, { useMemo, useState } from 'react';
import './microfrontend.css';

// Comprehensive learning component for Cloud & DevOps Engineering
// Topics: Azure (App Service, AKS, Functions, APIM, Service Bus, Event Grid), CI/CD (Azure DevOps, GitHub Actions),
// IaC (Bicep, Terraform), Docker, Kubernetes, Observability (App Insights, KQL, Prometheus/Grafana)

const sections = [
  {
    id: 'overview',
    title: 'Overview',
    points: [
      'Azure compute: App Service for PaaS web apps/APIs; AKS for managed Kubernetes; Functions for serverless event-driven compute.',
      'Integration/API layer: API Management (APIM) for gateways, policies, security; Service Bus/Event Grid for messaging/events.',
      'CI/CD: Azure DevOps & GitHub Actions: build, test, security scanning, deploy (blue/green, canary).',
      'IaC: Bicep (native Azure) and Terraform (multi-cloud) for repeatable environments.',
      'Containers: Docker images + Kubernetes objects (Deployment/Service/Ingress/Helm).',
      'Observability: App Insights (traces, metrics, logs, KQL), Prometheus scraping & Grafana dashboards.'
    ]
  },
  {
    id: 'azure-services',
    title: 'Azure Services',
    notes: [
      'App Service: Quick PaaS hosting with slots and autoscale; best for web APIs/sites when you don\'t need container/K8s control.',
      'AKS: Managed K8s; use for microservices, sidecars, service mesh, or when you need custom runtimes.',
      'Functions: Event-driven, consumption plan; ideal for lightweight background tasks, triggers (HTTP/Queue/Timer/EventHub).',
      'APIM: Central gateway for APIs; do auth, rate limiting, rewrite, versioning, insights, and monetization.',
      'Service Bus: Durable queues/topics (AMQP) for reliable messaging; use sessions for ordering and transactions for atomicity.',
      'Event Grid: Lightweight pub/sub for event notifications (push model) with low latency.'
    ],
    code: `// Azure Functions - C# minimal example
[Function("Hello")] public HttpResponseData Run([HttpTrigger(AuthorizationLevel.Function, "get")] HttpRequestData req)
{
    var res = req.CreateResponse(HttpStatusCode.OK);
    res.WriteString("Hello from Azure Functions");
    return res;
}

// Service Bus - C# sender snippet
var client = new ServiceBusClient(conn);
var sender = client.CreateSender("orders");
await sender.SendMessageAsync(new ServiceBusMessage("hello"));

// Event Grid - publish via REST (pseudo)
POST https://<topic-endpoint>/api/events
Header: aeg-sas-token: <token>
Body: [{"id":"1","eventType":"order.created","subject":"/orders/1","data":{...},"dataVersion":"1.0"}]`
  },
  {
    id: 'cicd',
    title: 'CI/CD Pipelines',
    code: `# GitHub Actions (Node/React example)
name: ci
on: { push: { branches: [ main ] } }
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: '20' }
      - run: npm ci
      - run: npm test -- --ci
      - run: npm run build
      - name: Login Azure
        uses: azure/login@v2
        with: { creds: \${{ secrets.AZURE_CREDENTIALS }} }
      - name: Deploy to App Service
        uses: azure/webapps-deploy@v3
        with: { app-name: my-webapp, package: build }

# Azure DevOps (YAML) - .NET API build
trigger:
- main
pool: { vmImage: 'windows-latest' }
steps:
- task: UseDotNet@2
  inputs: { packageType: 'sdk', version: '9.0.x' }
- script: dotnet restore
- script: dotnet build --configuration Release
- script: dotnet test --configuration Release --collect:"XPlat Code Coverage"
- task: PublishBuildArtifacts@1
  inputs: { PathtoPublish: '$(Build.SourcesDirectory)/publish', ArtifactName: 'drop' }`
  },
  {
    id: 'iac',
    title: 'Infrastructure as Code (IaC)',
    code: `// Bicep - App Service + Plan
param location string = resourceGroup().location
param appName string
param skuName string = 'P1v3'

resource plan 'Microsoft.Web/serverfarms@2023-12-01' = {
  name: '\${appName}-plan'
  location: location
  sku: { name: skuName, capacity: 1 }
}

resource app 'Microsoft.Web/sites@2023-12-01' = {
  name: appName
  location: location
  properties: { serverFarmId: plan.id }
}

# Terraform - AKS cluster (simplified)
provider "azurerm" { features {} }
resource "azurerm_resource_group" "rg" { name = var.rg_name location = var.location }
resource "azurerm_kubernetes_cluster" "aks" {
  name = var.aks_name
  location = var.location
  resource_group_name = azurerm_resource_group.rg.name
  dns_prefix = "dev-aks"
  default_node_pool { name = "system" node_count = 2 vm_size = "Standard_DS2_v2" }
  identity { type = "SystemAssigned" }
}`,
    notes: [
      'Bicep: best Azure-native authoring, strong tooling and type safety.',
      'Terraform: multi-cloud portability and mature ecosystem; use remote state + state locking.',
      'Patterns: modularize, parameterize per environment, use pipelines to plan/apply, and approvals for prod.'
    ]
  },
  {
    id: 'containers',
    title: 'Containers & Kubernetes',
    code: `# Dockerfile - .NET Aspire/Minimal API (sample)
FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS base
WORKDIR /app
EXPOSE 8080
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src
COPY . .
RUN dotnet publish -c Release -o /out
FROM base AS final
WORKDIR /app
COPY --from=build /out .
ENTRYPOINT ["dotnet","MyApi.dll"]

# K8s Deployment + Service (YAML)
apiVersion: apps/v1
kind: Deployment
metadata: { name: myapi }
spec:
  replicas: 2
  selector: { matchLabels: { app: myapi } }
  template:
    metadata: { labels: { app: myapi } }
    spec:
      containers:
      - name: myapi
        image: myacr.azurecr.io/myapi:1.0.0
        ports: [{ containerPort: 8080 }]
        readinessProbe: { httpGet: { path: /healthz, port: 8080 } }
        livenessProbe: { httpGet: { path: /healthz, port: 8080 } }
---
apiVersion: v1
kind: Service
metadata: { name: myapi-svc }
spec:
  type: ClusterIP
  selector: { app: myapi }
  ports: [{ port: 80, targetPort: 8080 }]
`,
    notes: [
      'Use multi-stage Docker builds; keep base images updated; scan images for CVEs.',
      'K8s: set resource requests/limits; readiness/liveness probes; use secrets; network policies; autoscaling (HPA).',
      'Ingress or Azure Application Gateway Ingress Controller for external access.'
    ]
  },
  {
    id: 'observability',
    title: 'Observability: App Insights, KQL, Prometheus/Grafana',
    code: `// App Insights SDK - basic telemetry
services.AddApplicationInsightsTelemetry();
_logger.LogInformation("Order {OrderId} processed", orderId);

// KQL examples
requests
| where success == false
| summarize count() by bin(timestamp, 5m), name

traces
| where message contains "timeout"
| project timestamp, message, severityLevel

// Prometheus scrape config (values.yaml snippet)
scrape_configs:
  - job_name: 'kubernetes-pods'
    kubernetes_sd_configs: [ { role: pod } ]
    relabel_configs:
      - action: keep
        regex: true
        source_labels: [ __meta_kubernetes_pod_annotation_prometheus_io_scrape ]

// Grafana: add a dashboard with Prometheus or Azure Monitor datasource and panels for latency, error rate, saturation.`,
    notes: [
      'Define SLI/SLOs and alerting (latency, availability, error rate, saturation).',
      'Trace context propagation (W3C), correlate logs, metrics, and traces.',
      'For AKS: use managed Prometheus + Azure Monitor or self-managed Prometheus/Grafana; secure endpoints.'
    ]
  },
  {
    id: 'hints',
    title: 'Understanding Hints',
    points: [
      'Pick the right compute: App Service (simple web/API), Functions (event-driven), AKS (complex/microservices).',
      'Gateways first: APIM for contracts/policies; decouple clients from services.',
      'Prefer IaC everywhere; don\'t click ops manually. Use PR-based reviews for environments.',
      'Blue/green or canary releases on App Service/AKS; feature flags for progressive delivery.',
      'Instrument first release; add KQL workbooks and alerts alongside deployments.'
    ]
  }
];

const mcqs = [
  {
    q: 'When should you choose Azure App Service over AKS?',
    choices: [
      'When you need fine-grained control over networking and service mesh',
      'When deploying a simple web/API without complex orchestration needs',
      'When you need to run stateful databases in containers'
    ],
    answer: 1,
    explain: 'App Service is great for simple web/API hosting with minimal ops overhead; AKS is for complex/microservices scenarios.'
  },
  {
    q: 'Which statement about APIM is accurate?',
    choices: [
      'It replaces backend services',
      'It acts as a gateway applying policies (auth, rate limit, rewrite) and centralizing API access',
      'It is only for on-prem APIs'
    ],
    answer: 1,
    explain: 'APIM fronts your services to enforce policies, versioning, and security; it does not replace services.'
  },
  {
    q: 'What\'s a safe IaC practice for prod?',
    choices: [
      'Apply changes directly from dev laptops',
      'Plan/apply via CI with approvals and remote state with locking',
      'Keep state locally and push when ready'
    ],
    answer: 1,
    explain: 'Use pipelines to plan/apply with approvals; keep state remote with locking to avoid drift and corruption.'
  },
  {
    q: 'Which is NOT an App Insights capability?',
    choices: [
      'Request/trace collection and KQL querying',
      'Distributed tracing with correlation',
      'Container orchestration and bin packing'
    ],
    answer: 2,
    explain: 'Container orchestration is a Kubernetes/AKS responsibility, not App Insights.'
  }
];

function CodeBlock({ code }) {
  return (
    <pre className="code"><code>{code}</code></pre>
  );
}

function MCQCard({ item, index, onAnswer, userAnswer }) {
  return (
    <div className="card">
      <div className="card-header">MCQ {index + 1}</div>
      <div className="card-body">
        <p className="question">{item.q}</p>
        <div className="choices">
          {item.choices.map((c, i) => (
            <button
              key={i}
              className={`choice ${userAnswer?.choice === i ? 'selected' : ''}`}
              onClick={() => onAnswer(index, i)}
            >{c}</button>
          ))}
        </div>
        {userAnswer && (
          <div className={`explain ${userAnswer.choice === item.answer ? 'correct' : 'incorrect'}`}>
            {userAnswer.choice === item.answer ? '✅ Correct: ' : '❌ Incorrect: '}
            {item.explain}
          </div>
        )}
      </div>
    </div>
  );
}

export default function CloudDevOpsEngineeringLearning() {
  const [active, setActive] = useState('overview');
  const [answers, setAnswers] = useState({});
  const current = useMemo(() => sections.find(s => s.id === active), [active]);

  const onAnswer = (idx, choice) => setAnswers(prev => ({ ...prev, [idx]: { choice } }));

  return (
    <div className="microfrontend-container" data-microfrontend="cloud-devops-eng">
      <header className="mf-header">
        <h1>Cloud & DevOps Engineering</h1>
        <p className="subtitle">Azure • CI/CD • IaC • Containers • Observability</p>
      </header>

      <nav className="tab-nav">
        {sections.map(s => (
          <button
            key={s.id}
            className={`tab ${active === s.id ? 'active' : ''}`}
            onClick={() => setActive(s.id)}
          >{s.title}</button>
        ))}
      </nav>

      <main className="mf-content">
        {current?.points && (
          <ul className="bullets">
            {current.points.map((p, i) => <li key={i}>{p}</li>)}
          </ul>
        )}
        {current?.notes && (
          <ul className="bullets">
            {current.notes.map((p, i) => <li key={i}>{p}</li>)}
          </ul>
        )}
        {current?.code && <CodeBlock code={current.code} />}

        {active === 'overview' && (
          <section className="mcq-grid">
            {mcqs.map((m, idx) => (
              <MCQCard
                key={idx}
                item={m}
                index={idx}
                onAnswer={onAnswer}
                userAnswer={answers[idx]}
              />
            ))}
          </section>
        )}

        <footer className="mf-footer">
          <div className="hint">Tip: Pair these notes with Azure docs and the runnable samples in KnowledgeGraphExtractor/samples for deeper practice.</div>
        </footer>
      </main>
    </div>
  );
}

