# AWS Lambda Learning Plan

> Goal: Become comfortable designing, building, deploying, and operating AWS Lambda–based serverless systems (suitable for real projects + interviews).

---

## 0. Prerequisites

- [ ] Basic programming in **JavaScript/TypeScript**, **Python**, or **C#**
- [ ] High-level understanding of **HTTP APIs** and JSON
- [ ] Very basic familiarity with AWS Console (can log in, can navigate services)

If any of these are missing, spend 1–2 days closing the gap first.

---

## 1. Lambda Foundations (Day 1–2)

**Concepts to learn**
- [ ] What is *serverless*? How Lambda fits into AWS
- [ ] Key limits: timeout, memory, ephemeral storage, concurrency
- [ ] Cold start vs warm start
- [ ] Lambda pricing model (invocations, duration, memory)

**Hands-on**
- [ ] Create your first Lambda using the **console**
- [ ] Use the built-in test events to trigger it
- [ ] Change memory and timeout; observe effect on execution

**Reflection prompts**
- Why would you use Lambda instead of EC2 or containers?
- Which workloads are a *bad* fit for Lambda?

---

## 2. Lambda Basics with One Runtime (Day 2–4)

Pick one runtime you’re comfortable with (e.g., **Node.js** or **Python**).

**Concepts**
- [ ] Lambda handler signature (event, context)
- [ ] Event structure for simple invocations
- [ ] Returning values vs throwing errors
- [ ] Environment variables and configuration

**Hands-on**
- [ ] Write a Lambda that:
  - [ ] Reads an environment variable
  - [ ] Parses JSON input
  - [ ] Returns a well-structured JSON response
- [ ] Log with `console.log` / `print` and read logs in **CloudWatch Logs**

**Interview angle**
- Practice explaining how the **handler** works and how you **log and debug**.

---

## 3. Triggers & Integrations (Day 4–7)

**What to learn**
- [ ] Common Lambda triggers:
  - [ ] API Gateway (HTTP APIs)
  - [ ] S3 events (object created)
  - [ ] DynamoDB Streams
  - [ ] SQS, SNS
  - [ ] EventBridge (formerly CloudWatch Events)
- [ ] Synchronous vs asynchronous invocation

**Hands-on mini-labs**
- [ ] API Gateway + Lambda: build a simple REST endpoint
- [ ] S3 + Lambda: process an image or text file on upload
- [ ] SQS + Lambda: consume messages from a queue

**Prompts for deeper thinking**
- When would you choose **SQS** vs **SNS** vs **EventBridge** as a trigger?
- How does retry behavior differ across these triggers?

---

## 4. Permissions & IAM (Day 7–9)

**Concepts**
- [ ] Lambda execution role (what your function is allowed to do)
- [ ] Resource-based policies (who can invoke your Lambda)
- [ ] Principle of least privilege for functions

**Hands-on**
- [ ] Create a dedicated IAM role for a Lambda
- [ ] Grant only S3 read permissions and verify access is restricted

**Interview practice**
- Be ready to explain: *“How do you secure a Lambda function?”*

---

## 5. Packaging, Layers, and Dependencies (Day 9–11)

**Concepts**
- [ ] How dependencies are packaged with your Lambda
- [ ] Lambda **Layers** and when to use them
- [ ] Limits around deployment package size

**Hands-on**
- [ ] Create a function with external dependencies (e.g., HTTP client, AWS SDK addon)
- [ ] Move shared code into a **Layer** and reference it from multiple Lambdas

**Prompt**
- How would you share **validation logic** or **domain models** across many Lambdas?

---

## 6. Infrastructure as Code & Deployment (Day 11–15)

Pick **one** primary IaC/deployment tool to focus on (recommended: **AWS SAM** or **CDK**).

**Concepts**
- [ ] Why IaC is critical (repeatability, review, environments)
- [ ] Basic SAM template / CDK stack that defines a Lambda + trigger
- [ ] Build, package, deploy cycle

**Hands-on**
- [ ] Define a Lambda + API Gateway endpoint in SAM or CDK
- [ ] Deploy to a dev environment
- [ ] Change something (e.g., memory, timeout) and redeploy

**Stretch goal**
- [ ] Add a simple CI/CD pipeline (GitHub Actions or CodePipeline) for deployment

---

## 7. Observability & Performance (Day 15–18)

**Concepts**
- [ ] CloudWatch metrics and logs for Lambda
- [ ] Understanding concurrency and throttling
- [ ] Provisioned Concurrency vs on-demand
- [ ] AWS X-Ray basics for tracing

**Hands-on**
- [ ] Enable X-Ray for a Lambda and visualize a request
- [ ] Experiment with memory size to see impact on performance and cost

**Interview prep**
- Prepare examples of troubleshooting slow Lambda functions or timeouts.

---

## 8. Security, Cost Optimization & Best Practices (Day 18–20)

**Concepts**
- [ ] Securing environment variables and secrets (SSM, Secrets Manager)
- [ ] VPC-enabled Lambdas (when and why)
- [ ] Cost drivers (invocations, duration, memory, provisioned concurrency)
- [ ] Common best practices (idempotency, retries, DLQs)

**Hands-on**
- [ ] Configure a DLQ (SQS or SNS) for a failing async Lambda
- [ ] Store a secret in **AWS Systems Manager Parameter Store** or **Secrets Manager** and read it from Lambda

---

## 9. Capstone Project (Day 20–25)

Build a small but real **serverless application**, for example:

> "Image upload & processing API" or "Todo API with DynamoDB".

Checklist:
- [ ] Public HTTP API via API Gateway
- [ ] Multiple Lambda functions with clear responsibilities
- [ ] At least one async integration (S3, SQS, or EventBridge)
- [ ] IaC (SAM/CDK) used end-to-end
- [ ] Basic logging, metrics, and error handling

---

## 10. Interview & System Design Layer

- [ ] Prepare a 3–5 minute explanation of **“What is AWS Lambda and when would you use it?”**
- [ ] Be ready with 1–2 concrete project stories using Lambda
- [ ] Practice drawing a **simple serverless architecture**:
  - API Gateway + Lambda + DynamoDB
  - S3 + EventBridge + Lambda + SNS/SQS

**Self-check questions**
- How do you handle **retries**, **idempotency**, and **exactly-once** semantics in Lambda systems?
- How do you **migrate** from a monolith or EC2-based system to a Lambda-based architecture?

