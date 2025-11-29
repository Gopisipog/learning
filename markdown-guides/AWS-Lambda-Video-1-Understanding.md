# AWS Lambda  Understanding Notes (Video 1)

> Based on: `aws lambda.md` – *"UPDATED - Create Your First AWS Lambda Function | AWS Tutorial for Beginners"*

This document is meant to deepen your **conceptual understanding** of what you saw in the video, beyond just following steps.

---

## 1. Big Picture Mental Model

- **Lambda is "functions as a service"**: you deploy small pieces of code that run **on demand**.
- You **do not manage servers** (OS, patching, capacity) – AWS does it for you.
- Code runs **in response to events**: S3 uploads, DynamoDB changes, API Gateway requests, schedules, etc.
- You **pay for usage** (invocations + execution time + memory), not for idle capacity.

A good alternative name (from the video): **"AWS functions" or "AWS scripts"**.

---

## 2. The Tiny Flicks Scenario

The video uses a fictional app **Tiny Flicks**:

- Users upload short videos (< 5 minutes).
- The system must:
  - Create a **small thumbnail**.
  - Create a **large thumbnail**.
  - Create an **HD version** of the video.

Where Lambda fits:

- Upload to **S3 bucket** > **triggers** Lambda functions.
- Each Lambda can do one focused task (e.g., generate one thumbnail).
- This leads to **modular, parallel, and scalable** processing.

---

## 3. What "Serverless" Really Means Here

When the video says *serverless*:

- There **are** servers, but you **dont provision or manage** them.
- AWS automatically:
  - Allocates compute when your function is invoked.
  - Scales up to many concurrent executions.
  - Scales down to zero when idle.

Key benefits highlighted:

1. **Modularity**: code is forced into small, single-purpose functions.
2. **Cost & performance tuning**: configure memory per function.
3. **Massive parallelism**: can scale from 100 to 1,000,000 concurrent executions without manual work.

---

## 4. Core Lambda Concepts in the Video

### 4.1 Function code and handler

- The **handler** is the entry point called by Lambda.
- It receives two arguments:
  - `event`: data about what triggered the function (e.g., S3 object info).
  - `context`: metadata about the runtime, function, and invocation.
- The sample code:
  - Uses **Boto3** (Python AWS SDK) to talk to S3.
  - Reads bucket and object key from the **event** JSON.
  - Fetches the object and logs its **content type**.

### 4.2 Execution role (IAM)

- The **Lambda execution role** defines what your function is allowed to do.
- In this demo, it needs permission to **read from S3**.
- A role is created from a **policy template** (S3 read-only).

If permissions are wrong:

- Lambda may be invoked, but calls to S3 **fail with AccessDenied**.

### 4.3 Triggers and resource policies

- You add an **S3 trigger** to the Lambda:
  - Event type: **ObjectCreated** (any new upload).
  - Bucket: the Tiny Flicks S3 bucket.
- Behind the scenes this creates:
  - An **event notification** in the S3 bucket.
  - A **resource-based policy** on the Lambda allowing S3 to invoke it.

---

## 5. End-to-End Flow (Tiny Flicks Demo)

1. **User uploads** an image to S3.
2. S3 fires an **ObjectCreated** event.
3. S3 invokes the **Lambda function** according to the bucket's event notification.
4. Lambda runtime passes **event + context** to your handler.
5. Your code:
   - Reads bucket + key from the event JSON.
   - Calls S3 (via Boto3) to get the object.
   - Logs the object **content type**.
6. **CloudWatch Logs** stores the logs.
7. **CloudWatch Metrics** (duration, invocations, errors, etc.) are updated.

---

## 6. Monitoring and Debugging

From the video:

- The **Monitor** tab in the Lambda console shows:
  - Invocations
  - Duration
  - Success / error counts
- For deeper insight:
  - Open **CloudWatch Logs** from the Lambda console.
  - Find the latest **log stream**.
  - Look for your custom log lines (e.g., `loading function`, `ContentType: image/png`).

Mental model:

> Lambda does the work, but **CloudWatch** tells you what happened.

---

## 7. Clean-Up and Cost Awareness

Why clean up?

- Even though the demo stays in the **free tier**, good practice is to delete resources you dont need.

Steps from the video:

- Delete the **Lambda function** from the Lambda console.
- For the **S3 bucket**:
  - Must be **emptied first** (delete all objects).
  - Then you can delete the bucket itself.

This habit avoids **long-lived test buckets/functions** that might incur costs later.

---

## 8. How to Explain This in an Interview

A concise answer based on the video:

> *"AWS Lambda is a serverless compute service where you deploy small functions that run in response to events, without managing servers yourself. In a typical pattern, an S3 upload or an API Gateway request triggers a Lambda function. The function receives an event object, does some focused work (like processing a file or updating a record), and logs results to CloudWatch. You pay only for the time your code actually runs, and AWS automatically scales the number of concurrent executions for you."*

---

## 9. Key Takeaways

- Lambda = **event-driven, managed, pay-per-use compute**.
- S3 + Lambda is a **classic pattern** for file processing.
- IAM **execution roles** and **resource policies** are central to making things work.
- CloudWatch is your **window into behavior** (logs + metrics).
- Clean-up is part of being a **responsible AWS practitioner**.

