# Learning Session: Create Your First AWS Lambda Function

> Source: `aws lambda.md` (video: *UPDATED - Create Your First AWS Lambda Function | AWS Tutorial for Beginners*)
> Duration: ~60–90 minutes including hands-on.

---

## 1. Learning Goals

By the end of this session you should be able to:

- [ ] Explain what AWS Lambda is and what “serverless” really means
- [ ] Describe a simple event-driven architecture using S3 + Lambda
- [ ] Create a basic Lambda function from scratch
- [ ] Configure an S3 trigger for a Lambda function
- [ ] Inspect logs and metrics in CloudWatch
- [ ] Safely delete demo resources to avoid surprise costs

---

## 2. Warm-Up (5–10 minutes)

Before watching the video, answer (just for yourself):

1. What do you think **serverless** means?
2. When would you **not** use a Lambda function?
3. How would you describe the difference between **Lambda** and running code on an **EC2 instance**?

After the session, come back and refine your answers.

---

## 3. Watch & Pause Checkpoints

Use these timestamps from the video and pause at each checkpoint to reflect.

- [ ] **00:00 – Lambda scenario (Tiny Flicks)**  
  Ask: *Where are events coming from? What does Lambda actually do in this flow?*

- [ ] **00:40 – What is serverless computing?**  
  Write a one-sentence definition of **serverless** in your own words.

- [ ] **02:15 – Benefits of Lambda**  
  Make a 3-point list: *modularity*, *cost/performance tuning*, *scaling behavior*.

- [ ] **03:18 – Pricing & Free Tier**  
  Note: *What drives Lambda cost?* (hint: invocations, duration, memory).

- [ ] **03:57–05:25 – Creating S3 bucket & Lambda function**  
  Sketch: S3 bucket ↔ Lambda ↔ CloudWatch on paper.

- [ ] **05:25–08:54 – Execution role & code**  
  Identify: What permissions does the Lambda need? Where do *event* and *context* come from?

- [ ] **08:54–12:12 – Creating the trigger & testing with S3**  
  Note: What changed in **S3 event notifications** and in the **Lambda resource policy** when you added the trigger?

- [ ] **12:12–14:27 – Monitoring with CloudWatch**  
  Observe: How do you find the **content type** in the logs? What else do you see?

- [ ] **14:27–end – Cleaning up**  
  List the exact steps to delete:  
  - [ ] The Lambda function  
  - [ ] The S3 bucket (including emptying it first)

---

## 4. Hands-On Lab: Rebuild the Demo Yourself

Do this in your own AWS account while or after watching.

1. **Create S3 bucket**  
   - [ ] Name it something like `tiny-flicks-yourname-date`  
   - [ ] Ensure region matches what you’ll use for Lambda.

2. **Create Lambda function**  
   - [ ] Runtime: Python (or your preferred runtime)  
   - [ ] Author from scratch  
   - [ ] Create a **new execution role** with S3 read permissions.

3. **Paste and deploy code**  
   - [ ] Implement logic to read the S3 object and log its content type.  
   - [ ] Click **Deploy** and confirm there are no errors.

4. **Add S3 trigger**  
   - [ ] Configure event for `ObjectCreated` on your bucket.  
   - [ ] Acknowledge warning about using the same bucket for input/output.

5. **Test by uploading a file**  
   - [ ] Upload an image file to S3.  
   - [ ] Wait ~1–2 minutes and inspect **CloudWatch Logs** for:  
     - The `loading function` message  
     - The detected `ContentType`.

6. **Clean up**  
   - [ ] Delete the Lambda function.  
   - [ ] Empty and delete the S3 bucket.

---

## 5. Reflection & Interview Practice

After completing the lab, answer these:

- [ ] How would you explain **Lambda** and **serverless** to a junior developer?
- [ ] What are the **benefits** of using separate Lambda functions for each step (e.g., thumbnail vs HD processing)?
- [ ] How does **Lambda pricing** work at a high level? Which levers can you tune?
- [ ] What role did **IAM** play in this tutorial? What would break if permissions were too strict?
- [ ] How do S3, Lambda, and CloudWatch work together in this scenario?

Try to answer each question in 2–3 sentences as if you were in an interview.

---

## 6. Next Steps

If you want to go beyond this single video:

- [ ] Work through the broader **AWS Lambda Learning Plan** in `markdown-guides/AWS-Lambda-Learning-Plan.md`.
- [ ] Repeat the same pattern (event → Lambda → logs) with a **different trigger** (e.g., SQS or API Gateway).
- [ ] Turn this scenario into a small **portfolio project** and document it in your CV / GitHub README.

