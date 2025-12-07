# Manual Zap Setup Guide
## LinkedIn Jobs Retrieval with BrightData API + Resume Matching

This guide shows you how to create a Zap that retrieves LinkedIn jobs using BrightData API and matches them to your resume **without needing to deploy a custom integration**.

---

## 🎯 What You'll Build

A complete automated job search system that:
1. **Searches LinkedIn** for jobs matching your criteria (via BrightData)
2. **Matches jobs** to your resume using Code by Zapier
3. **Filters** for high-match jobs only
4. **Notifies** you via email/Slack
5. **Tracks** applications in Google Sheets

---

## 📋 Prerequisites

- [ ] BrightData account with LinkedIn Jobs dataset access
- [ ] BrightData API key
- [ ] Your resume in plain text
- [ ] Zapier account (free or paid)

---

## 🚀 Step-by-Step Zap Creation

### Step 1: Get BrightData API Credentials

1. Sign up at https://brightdata.com
2. Subscribe to **LinkedIn Jobs** dataset
3. Go to https://brightdata.com/cp/api_access
4. Create an API token
5. Copy your API key (format: `Bearer xxx...`)

### Step 2: Create the Zap

Go to https://zapier.com/app/zaps/create

---

## 📝 Zap Configuration

### **Trigger: Schedule by Zapier**

**Why**: Run the job search on a schedule (daily, hourly, etc.)

1. Search for "Schedule"
2. Select "Schedule by Zapier"
3. Choose frequency:
   - **Every Day** at 9 AM (recommended for daily digest)
   - **Every Hour** (for real-time job alerts)
   - **Every Week** on Monday (for weekly digest)

4. Set timezone
5. Test trigger

---

### **Action 1: Webhooks - POST Request to BrightData**

**Purpose**: Search LinkedIn jobs via BrightData API

1. Click "+" to add action
2. Search for "Webhooks by Zapier"
3. Select "POST"

4. **Configure the webhook:**

   **URL**:
   ```
   https://api.brightdata.com/datasets/v3/trigger
   ```

   **Payload Type**: `json`

   **Data** (JSON):
   ```json
   {
     "dataset_id": "gd_l7q7dkf244hwjntr0",
     "endpoint": "search",
     "filters": {
       "keywords": "Software Engineer Python",
       "location": "Remote",
       "job_type": "Full-time",
       "experience_level": "Mid-Senior level",
       "date_posted": "past_week"
     },
     "limit": 50
   }
   ```

   **Headers**:
   - `Authorization`: `Bearer YOUR_BRIGHTDATA_API_KEY`
   - `Content-Type`: `application/json`

5. **Customize the search**:
   - Change `keywords` to your target role
   - Update `location` (e.g., "San Francisco", "New York", "Remote")
   - Adjust `experience_level`
   - Set `date_posted` (past_24_hours, past_week, past_month)

6. Test the action
   - You'll get a `snapshot_id` in the response
   - Save this for the next step

---

### **Action 2: Delay (Wait for Data)**

**Purpose**: Give BrightData time to collect the data

1. Add "Delay by Zapier"
2. Select "Delay For"
3. Set delay: **2 minutes**
4. Test

---

### **Action 3: Webhooks - GET Snapshot Data**

**Purpose**: Retrieve the actual job listings

1. Add "Webhooks by Zapier"
2. Select "GET"

3. **URL**:
   ```
   https://api.brightdata.com/datasets/v3/snapshot/{{snapshot_id}}/data
   ```
   - Replace `{{snapshot_id}}` with the output from Action 1

4. **Headers**:
   - `Authorization`: `Bearer YOUR_BRIGHTDATA_API_KEY`

5. Test the action
   - You should see LinkedIn job listings in JSON format

---

### **Action 4: Code by Zapier - Match Jobs to Resume**

**Purpose**: Calculate match score for each job

1. Add "Code by Zapier"
2. Select "Run Python"

3. **Input Data**:
   - `jobs`: {{3. Data}} (from webhook response)
   - `resume`: Paste your resume text here

4. **Code**:

```python
import json

# Parse input
jobs_data = input_data.get('jobs', '[]')
resume = input_data.get('resume', '').lower()

# Parse jobs if string
if isinstance(jobs_data, str):
    jobs = json.loads(jobs_data)
else:
    jobs = jobs_data

# Common tech skills to match
SKILLS = [
    'python', 'javascript', 'java', 'react', 'node.js', 'angular', 'vue',
    'sql', 'mongodb', 'aws', 'azure', 'gcp', 'docker', 'kubernetes',
    'machine learning', 'ai', 'data science', 'devops', 'agile', 'scrum',
    'typescript', 'go', 'rust', 'c++', 'c#', '.net', 'ruby', 'php'
]

def calculate_match(job, resume):
    score = 0
    matched_skills = []
    reasons = []

    job_desc = (job.get('description', '') + ' ' + job.get('title', '')).lower()

    # Skill matching
    for skill in SKILLS:
        if skill in resume and skill in job_desc:
            score += 10
            matched_skills.append(skill)

    # Title matching
    title_words = job.get('title', '').lower().split()
    resume_words = resume.split()
    title_matches = [w for w in title_words if len(w) > 3 and w in resume_words]
    score += len(title_matches) * 5

    if title_matches:
        reasons.append(f"Title matches: {', '.join(title_matches)}")

    # Experience level
    exp_level = job.get('experience_level', '').lower()
    if exp_level and exp_level in resume:
        score += 15
        reasons.append(f"Experience level: {exp_level}")

    # Location
    location = job.get('location', '').lower()
    if location and location in resume:
        score += 10
        reasons.append(f"Location: {location}")

    # Normalize score
    score = min(100, score)

    if matched_skills:
        reasons.append(f"Skills: {', '.join(matched_skills[:5])}")

    recommendation = (
        'Highly Recommended' if score >= 70 else
        'Good Match' if score >= 50 else
        'Possible Match' if score >= 30 else
        'Low Match'
    )

    return {
        'score': score,
        'matched_skills': ', '.join(matched_skills),
        'reasons': ' | '.join(reasons),
        'recommendation': recommendation,
        'should_apply': score >= 50
    }

# Match all jobs
matched_jobs = []
for job in jobs:
    match_result = calculate_match(job, resume)

    matched_job = {
        'id': job.get('job_id', job.get('id', '')),
        'title': job.get('title', job.get('job_title', '')),
        'company': job.get('company', job.get('company_name', '')),
        'location': job.get('location', ''),
        'url': job.get('url', job.get('job_url', '')),
        'posted_date': job.get('posted_date', job.get('date_posted', '')),
        'salary': job.get('salary', job.get('salary_range', '')),
        'match_score': match_result['score'],
        'matched_skills': match_result['matched_skills'],
        'match_reasons': match_result['reasons'],
        'recommendation': match_result['recommendation'],
        'should_apply': match_result['should_apply']
    }

    # Only include jobs with score >= 50
    if match_result['score'] >= 50:
        matched_jobs.append(matched_job)

# Sort by match score
matched_jobs.sort(key=lambda x: x['match_score'], reverse=True)

output = {
    'matched_jobs': matched_jobs,
    'total_jobs': len(jobs),
    'matched_count': len(matched_jobs),
    'top_match': matched_jobs[0] if matched_jobs else None
}
```

5. Test the code
   - You should see matched jobs with scores

---

### **Action 5: Filter - Only High Matches**

1. Add "Filter by Zapier"
2. **Condition**:
   - Field: `4. Matched Count`
   - Condition: "Greater than"
   - Value: `0`

3. Test filter

---

### **Action 6: Looping - Process Each Job**

1. Add "Looping by Zapier"
2. **Create Loop From Line Items**
3. **Values**: `4. Matched Jobs`

---

### **Action 7: Gmail - Send Email for Each Match**

1. Add "Gmail"
2. Select "Send Email"

3. **Configure**:
   - **To**: your@email.com
   - **Subject**:
     ```
     🎯 Job Match ({{Loop. Match Score}}/100): {{Loop. Title}} at {{Loop. Company}}
     ```

   - **Body**:
     ```
     You have a new job match!

     📊 Match Score: {{Loop. Match Score}}/100
     ⭐ Recommendation: {{Loop. Recommendation}}

     📝 Job Details:
     Title: {{Loop. Title}}
     Company: {{Loop. Company}}
     Location: {{Loop. Location}}
     Salary: {{Loop. Salary}}
     Posted: {{Loop. Posted Date}}

     🎯 Why It Matches:
     {{Loop. Match Reasons}}

     💼 Matched Skills:
     {{Loop. Matched Skills}}

     🔗 Apply Here:
     {{Loop. URL}}

     ---
     Automated by Zapier + BrightData
     ```

4. Test the email

---

### **Action 8: Google Sheets - Track Applications**

1. Add "Google Sheets"
2. Select "Create Spreadsheet Row"

3. **Spreadsheet**: Create or select "Job Applications"
4. **Worksheet**: "Sheet1"

5. **Map fields**:
   - Job ID: `{{Loop. ID}}`
   - Title: `{{Loop. Title}}`
   - Company: `{{Loop. Company}}`
   - Location: `{{Loop. Location}}`
   - Match Score: `{{Loop. Match Score}}`
   - Matched Skills: `{{Loop. Matched Skills}}`
   - Recommendation: `{{Loop. Recommendation}}`
   - URL: `{{Loop. URL}}`
   - Posted Date: `{{Loop. Posted Date}}`
   - Retrieved Date: `{{Zap Meta Timestamp}}`
   - Status: "To Review"

6. Test the action

---

## 🎉 Turn On Your Zap!

1. Name your Zap: "LinkedIn Jobs Matcher - BrightData"
2. Click "Publish"
3. Turn it ON

---

## 💡 Pro Tips

### Customize Your Resume Text

Include in your resume:
```
SKILLS: Python, JavaScript, React, AWS, Docker, Kubernetes
EXPERIENCE: Senior Software Engineer, 5+ years
LOCATION: San Francisco, Remote
PREFERENCES: Full-time, Startup, AI/ML
```

### Adjust Match Threshold

In the Python code, change this line:
```python
if match_result['score'] >= 50:  # Change 50 to 70 for stricter matching
```

### Multiple Job Searches

Create separate Zaps for different roles:
- Zap 1: "Software Engineer" + "Python"
- Zap 2: "Data Scientist" + "Machine Learning"
- Zap 3: "DevOps Engineer" + "Kubernetes"

---

## 📊 Expected Results

- **Daily**: 5-20 matched jobs (depending on criteria)
- **Match Scores**: 50-100 (only shows good matches)
- **Email**: One per matched job
- **Google Sheets**: Automatic tracking

---

## 🔧 Troubleshooting

**Issue**: No jobs found
- Broaden keywords
- Change date range to "past_month"
- Check BrightData subscription

**Issue**: Low match scores
- Add more skills to resume text
- Include synonyms (e.g., "JS" and "JavaScript")
- Add location preferences

**Issue**: Too many emails
- Increase match threshold to 70+
- Use digest format (one email with all jobs)
- Reduce polling frequency

---

## 🚀 You're Done!

Your automated LinkedIn job matcher is now running!

**What happens next:**
1. Zap runs on schedule
2. Searches LinkedIn via BrightData
3. Matches jobs to your resume
4. Emails you high-match jobs
5. Tracks everything in Google Sheets

Happy job hunting! 🎯
