# Complete Zap Setup Guide
## LinkedIn Jobs Matcher with BrightData API

This guide will walk you through creating a complete Zap that retrieves LinkedIn jobs using BrightData API and matches them to your resume.

---

## 📋 Prerequisites Checklist

Before you start, make sure you have:

- [ ] BrightData account (sign up at https://brightdata.com)
- [ ] BrightData API key
- [ ] LinkedIn Jobs dataset subscription on BrightData
- [ ] Your resume in plain text format
- [ ] Zapier account
- [ ] This integration pushed to Zapier

---

## 🚀 Step-by-Step Zap Creation

### Step 1: Get Your BrightData API Key

1. Go to https://brightdata.com/cp/api_access
2. Click "Create API Token"
3. Copy your API key (starts with `Bearer ...`)
4. Save it securely

### Step 2: Prepare Your Resume

1. Open your resume
2. Copy all text content
3. Save it in a text file for easy access
4. Include:
   - Skills (Python, JavaScript, AWS, etc.)
   - Job titles you've held
   - Experience level
   - Preferred locations
   - Education

### Step 3: Deploy the Integration

```bash
# Navigate to the project
cd linkedin-jobs-matcher

# Login to Zapier
npx zapier-platform-cli login

# Register the integration
npx zapier-platform-cli register "LinkedIn Jobs Matcher"

# Push to Zapier
npx zapier-platform-cli push
```

### Step 4: Create Your First Zap

1. Go to https://zapier.com/app/zaps/create
2. Click "Create Zap"

---

## 🎯 Zap Configuration

### **Trigger: New LinkedIn Job**

1. **Search for your integration**
   - Type "LinkedIn Jobs Matcher"
   - Select "New LinkedIn Job"

2. **Connect your account**
   - Click "Sign in"
   - Enter your BrightData API Key
   - Paste your resume text
   - Click "Yes, Continue"

3. **Configure the trigger**
   - **Keywords**: `"Software Engineer"` (or your target role)
   - **Location**: `"Remote"` or `"San Francisco, CA"`
   - **Job Type**: `"Full-time"`
   - **Experience Level**: `"Mid-Senior level"`
   - **Date Posted**: `"past_week"`

4. **Test the trigger**
   - Click "Test trigger"
   - Wait for results (may take 30-60 seconds)
   - You should see LinkedIn job listings

---

### **Action: Match Job to Resume**

1. **Add a new step**
   - Click the "+" button
   - Search for "LinkedIn Jobs Matcher"
   - Select "Match Job to Resume"

2. **Configure the action**
   - **Job Data**: Select the entire job object from Step 1
     - Click in the field
     - Select "1. New LinkedIn Job" from the dropdown
     - Choose the full job data object
   
   - **Resume Text**: Leave blank (will use auth resume)
     - Or paste your resume if you want to override

3. **Test the action**
   - Click "Test action"
   - You should see:
     - Match Score (0-100)
     - Matched Skills
     - Match Reasons
     - Recommendation
     - Should Apply (true/false)

---

### **Filter: Only High Matches**

1. **Add a Filter step**
   - Click the "+" button
   - Search for "Filter"
   - Select "Filter by Zapier"

2. **Configure the filter**
   - **Field**: Match Score (from Step 2)
   - **Condition**: "Greater than or equal to"
   - **Value**: `70` (for highly recommended jobs)

3. **Test the filter**
   - Click "Test filter"
   - Should pass if match score >= 70

---

### **Action: Send Email Notification**

1. **Add Gmail action**
   - Click the "+" button
   - Search for "Gmail"
   - Select "Send Email"

2. **Configure the email**
   - **To**: Your email address
   - **Subject**: 
     ```
     🎯 High Match Job: {{2. Title}} at {{2. Company}}
     ```
   
   - **Body**:
     ```
     You have a highly matched job opportunity!
     
     📊 Match Score: {{2. Match Score}}/100
     ⭐ Recommendation: {{2. Recommendation}}
     
     📝 Job Details:
     Title: {{2. Title}}
     Company: {{2. Company}}
     Location: {{2. Location}}
     Job Type: {{2. Job Type}}
     Experience Level: {{2. Experience Level}}
     Salary: {{2. Salary}}
     
     🎯 Why It Matches:
     {{2. Match Reasons}}
     
     💼 Matched Skills:
     {{2. Matched Skills}}
     
     🔗 Apply Here:
     {{2. URL}}
     
     Posted: {{2. Posted Date}}
     Retrieved: {{2. Retrieved At}}
     
     ---
     This job was automatically matched to your resume.
     ```

3. **Test the email**
   - Click "Test action"
   - Check your inbox for the test email

---

### **Action: Save to Google Sheets (Optional)**

1. **Add Google Sheets action**
   - Click the "+" button
   - Search for "Google Sheets"
   - Select "Create Spreadsheet Row"

2. **Select your spreadsheet**
   - Choose existing or create new
   - Sheet name: "Job Applications"

3. **Map the fields**
   - **Job ID**: {{2. Job ID}}
   - **Title**: {{2. Title}}
   - **Company**: {{2. Company}}
   - **Location**: {{2. Location}}
   - **Match Score**: {{2. Match Score}}
   - **Matched Skills**: {{2. Matched Skills}}
   - **Recommendation**: {{2. Recommendation}}
   - **URL**: {{2. URL}}
   - **Posted Date**: {{2. Posted Date}}
   - **Status**: "To Apply"

4. **Test the action**
   - Click "Test action"
   - Check your Google Sheet

---

## 🎨 Advanced Zap Workflows

### Workflow A: Multi-Channel Notifications

```
1. Trigger: New LinkedIn Job
2. Action: Match Job to Resume
3. Filter: Match Score >= 70
4. Action: Send Email (Gmail)
5. Action: Send Slack Message
6. Action: Create Trello Card
7. Action: Add to Google Sheets
```

### Workflow B: Daily Digest

```
1. Trigger: Schedule (Every day at 9 AM)
2. Action: Search LinkedIn Jobs (past 24 hours)
3. Action: Match each job to resume
4. Filter: Match Score >= 50
5. Action: Format as digest
6. Action: Send single email with all matches
```

### Workflow C: Auto-Apply System

```
1. Trigger: New LinkedIn Job
2. Action: Match Job to Resume
3. Filter: Match Score >= 90
4. Action: Fill application form (if available)
5. Action: Send cover letter
6. Action: Log in Google Sheets
7. Action: Notify via Slack
```

---

## 🔧 Troubleshooting

### Issue: "Invalid API Key"
**Solution**: 
- Check your BrightData API key
- Make sure it includes "Bearer " prefix
- Regenerate key if needed

### Issue: "No jobs found"
**Solution**:
- Broaden your search keywords
- Change date range to "past_month"
- Check if BrightData subscription is active

### Issue: "Low match scores"
**Solution**:
- Update your resume text with more keywords
- Include all your skills
- Add location preferences
- Mention experience level

### Issue: "Zap times out"
**Solution**:
- BrightData API can be slow
- Increase Zapier timeout settings
- Use "past_week" instead of "past_month"

---

## 💡 Pro Tips

1. **Multiple Zaps for Different Roles**
   - Create separate Zaps for different job titles
   - Example: One for "Software Engineer", one for "Data Scientist"

2. **Adjust Match Threshold**
   - Start with 70+ for highly relevant jobs
   - Lower to 50+ if you want more options
   - Use 90+ for dream jobs only

3. **Update Resume Regularly**
   - Update your resume text in auth settings monthly
   - Add new skills as you learn them
   - Update location preferences

4. **Track Everything**
   - Always save to Google Sheets or Airtable
   - Track: Applied, Interview, Rejected, Offer
   - Analyze which types of jobs you match best

5. **Set Reasonable Polling**
   - Don't poll more than every 15 minutes
   - BrightData has rate limits
   - Daily digest is often better than real-time

---

## 📊 Sample Resume Format

```
PROFESSIONAL SUMMARY
Senior Software Engineer with 5+ years of experience in full-stack development.
Expert in Python, JavaScript, React, Node.js, and AWS.
Based in San Francisco, CA. Open to remote opportunities.

SKILLS
Languages: Python, JavaScript, TypeScript, Java, SQL
Frontend: React, Vue.js, Angular, HTML, CSS
Backend: Node.js, Django, Flask, Express
Cloud: AWS, Azure, GCP, Docker, Kubernetes
Tools: Git, CI/CD, Jenkins, Terraform
Methodologies: Agile, Scrum, TDD

EXPERIENCE
Senior Software Engineer - Tech Corp (2020-Present)
- Led development of microservices architecture
- Managed team of 5 engineers
- Implemented CI/CD pipelines

Software Engineer - Startup Inc (2018-2020)
- Built React applications
- Developed REST APIs
- Worked with AWS services

EDUCATION
BS Computer Science - University Name (2018)

PREFERENCES
- Remote or San Francisco Bay Area
- Full-time positions
- Mid-Senior to Senior level roles
- Interested in: AI/ML, Cloud, Full-Stack
```

---

## 🎉 You're All Set!

Your Zap is now ready to automatically find and match LinkedIn jobs to your resume!

**Next Steps:**
1. Turn on your Zap
2. Monitor the first few runs
3. Adjust filters as needed
4. Start applying to matched jobs!

Happy job hunting! 🚀

