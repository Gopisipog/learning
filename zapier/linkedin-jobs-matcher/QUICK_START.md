# Quick Start - LinkedIn Jobs Matcher

## 🚀 5-Minute Setup

### What You Need
1. BrightData API key → https://brightdata.com/cp/api_access
2. Your resume (plain text)
3. Zapier account → https://zapier.com

### Create Your Zap

**Go to**: https://zapier.com/app/zaps/create

---

## Zap Structure

```
1. Schedule (Every Day at 9 AM)
   ↓
2. Webhooks POST → BrightData API (Search Jobs)
   ↓
3. Delay (2 minutes)
   ↓
4. Webhooks GET → BrightData API (Get Results)
   ↓
5. Code by Zapier (Match to Resume)
   ↓
6. Filter (Match Score >= 50)
   ↓
7. Looping (For Each Job)
   ↓
8. Gmail (Send Email)
   ↓
9. Google Sheets (Track Application)
```

---

## Step 1: Schedule Trigger

- **App**: Schedule by Zapier
- **Frequency**: Every Day
- **Time**: 9:00 AM
- **Timezone**: Your timezone

---

## Step 2: Search Jobs (Webhooks POST)

**URL**: `https://api.brightdata.com/datasets/v3/trigger`

**Method**: POST

**Headers**:
```
Authorization: Bearer YOUR_API_KEY
Content-Type: application/json
```

**Body** (JSON):
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

**Customize**:
- Change `keywords` to your target role
- Update `location`
- Adjust `experience_level`

---

## Step 3: Delay

- **App**: Delay by Zapier
- **Action**: Delay For
- **Time**: 2 minutes

---

## Step 4: Get Results (Webhooks GET)

**URL**: `https://api.brightdata.com/datasets/v3/snapshot/{{2. Snapshot ID}}/data`

**Headers**:
```
Authorization: Bearer YOUR_API_KEY
```

---

## Step 5: Match Jobs (Code by Zapier)

**Language**: Python

**Input Data**:
- `jobs`: {{4. Data}}
- `resume`: [Paste your resume here]

**Code**: See MANUAL_ZAP_SETUP.md for full Python code

**Key Features**:
- Matches skills (Python, JavaScript, AWS, etc.)
- Scores 0-100
- Filters jobs with score >= 50
- Returns matched jobs sorted by score

---

## Step 6: Filter

- **App**: Filter by Zapier
- **Condition**: Matched Count > 0

---

## Step 7: Loop

- **App**: Looping by Zapier
- **Values**: {{5. Matched Jobs}}

---

## Step 8: Send Email

- **App**: Gmail
- **To**: your@email.com
- **Subject**: `🎯 Job Match ({{Loop. Match Score}}/100): {{Loop. Title}}`
- **Body**: Include job details, match score, matched skills, URL

---

## Step 9: Track in Sheets

- **App**: Google Sheets
- **Spreadsheet**: "Job Applications"
- **Columns**: Job ID, Title, Company, Match Score, URL, Status

---

## 🎯 Expected Results

**Daily Email Example**:
```
Subject: 🎯 Job Match (85/100): Senior Python Engineer at TechCorp

Match Score: 85/100
Recommendation: Highly Recommended

Skills Matched: Python, AWS, Docker, React, PostgreSQL
Why It Matches: Title matches | Experience level: mid-senior | Skills: python, aws, docker

Apply: https://linkedin.com/jobs/...
```

---

## 💡 Customization Tips

### Higher Quality Matches
Change filter threshold in Python code:
```python
if match_result['score'] >= 70:  # Instead of 50
```

### More Frequent Updates
Change schedule to "Every Hour" instead of "Every Day"

### Multiple Job Types
Create separate Zaps for:
- Software Engineer
- Data Scientist
- DevOps Engineer

### Better Resume Matching
Include in your resume text:
```
SKILLS: Python, JavaScript, React, Node.js, AWS, Docker, Kubernetes
EXPERIENCE: Senior Software Engineer, 5+ years
LOCATION: San Francisco, Remote
PREFERENCES: Full-time, Startup, AI/ML, Cloud
EDUCATION: BS Computer Science
```

---

## 📊 Monitoring

**Check**:
1. Zap History → See all runs
2. Gmail → Matched job emails
3. Google Sheets → All tracked jobs

**Metrics**:
- Total jobs searched: ~50/day
- Matched jobs: ~5-15/day (score >= 50)
- High matches: ~2-5/day (score >= 70)

---

## 🔧 Troubleshooting

| Issue | Solution |
|-------|----------|
| No jobs found | Broaden keywords, change date to "past_month" |
| Low match scores | Add more skills to resume text |
| Too many emails | Increase threshold to 70+ |
| API timeout | Increase delay to 3 minutes |
| Invalid API key | Check BrightData dashboard |

---

## 📚 Full Documentation

- **Complete Setup**: See `MANUAL_ZAP_SETUP.md`
- **Integration Code**: See `triggers/search_jobs.js` and `creates/match_jobs.js`
- **README**: See `README.md`

---

## 🎉 You're Ready!

1. ✅ Create the Zap following steps above
2. ✅ Test each step
3. ✅ Turn ON the Zap
4. ✅ Wait for your first matched jobs!

**Zap URL**: https://zapier.com/app/zaps/create

Happy job hunting! 🚀

