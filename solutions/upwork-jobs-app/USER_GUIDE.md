# User Guide - Upwork Jobs Listing & Bid Submission App

## Welcome! 👋

This app helps you browse Upwork jobs and submit bids directly from a beautiful interface.

## Getting Started

### Step 1: Open the App
Navigate to **http://localhost:3001** in your browser.

You'll see:
- A purple gradient header with the app title
- Skill filter buttons (.NET, React, Angular)
- Action buttons (Fetch Jobs, Download Jobs, Download Bids)

### Step 2: Browse Jobs

#### Filter by Skills
1. Click on skill buttons to toggle them on/off
2. Selected skills have a purple gradient background
3. Unselected skills have a white background with gray border

#### Fetch Jobs
1. Click the **"Fetch Jobs"** button
2. A loading spinner appears
3. Jobs load in a grid layout (15 sample jobs)

#### View Job Details
Each job card shows:
- **Title**: The job position
- **Skill Badge**: Color-coded skill tag
  - Purple = .NET
  - Cyan = React
  - Red = Angular
- **Description**: Brief job description
- **Budget**: Project budget or hourly rate
- **Duration**: Expected project length
- **Submit Bid Button**: Click to bid on the job

### Step 3: Submit a Bid

#### Open Bid Form
1. Find a job you're interested in
2. Click the **"Submit Bid"** button on the job card
3. A modal window opens with the bid form

#### Fill Out the Form

**1. Choose Bid Type**
- **Hourly Rate**: For time-based projects
- **Fixed Price**: For project-based work

**2. Enter Your Rate**
- If Hourly: Enter your hourly rate (e.g., 50)
- If Fixed: Enter total project price (e.g., 5000)

**3. Estimate Duration**
- Enter a number (e.g., 40)
- Select unit: Hours, Days, Weeks, or Months

**4. Write Cover Letter** ⭐ Most Important!
- Minimum 100 characters required
- Introduce yourself
- Explain why you're the best fit
- Highlight relevant experience
- Character counter shows your progress

**5. Add Milestones (Optional)**
- Break down the project into phases
- Example:
  ```
  Phase 1: Design and Planning (Week 1)
  Phase 2: Development (Weeks 2-4)
  Phase 3: Testing and Deployment (Week 5)
  ```

#### Preview Your Bid
1. Click **"Preview Bid"** button
2. Review all details:
   - Job information
   - Your bid type and rate
   - Estimated duration
   - Full cover letter
   - Milestones (if added)
3. Options:
   - **Edit Bid**: Go back to make changes
   - **Submit Bid to Upwork**: Finalize submission

#### Submit
1. Click **"Submit Bid to Upwork"**
2. A success message appears
3. The modal closes
4. The job card now shows **"✓ Bid Submitted"** in green

### Step 4: Track Your Bids

#### Visual Indicators
- Jobs you've bid on have:
  - Green left border
  - Light green background
  - Green checkmark button
  - "Bid Submitted" text

#### Summary Banner
After submitting bids, you'll see a banner showing:
- 📋 Icon
- "Your Submitted Bids" heading
- Total number of bids submitted
- Reminder to download bids

#### View All Bids
Your bids are saved in the browser's local storage and persist across sessions.

### Step 5: Download Data

#### Download Jobs
1. Click **"📥 Download Jobs"** button
2. A JSON file downloads: `upwork-jobs-YYYY-MM-DD.json`
3. Contains all fetched jobs with complete details

#### Download Bids
1. Click **"📤 Download Bids"** button
2. A JSON file downloads: `upwork-bids-YYYY-MM-DD.json`
3. Contains all your submitted bids with:
   - Job details
   - Your bid information
   - Cover letter
   - Submission timestamp

## Tips for Success 💡

### Writing Great Cover Letters
1. **Personalize**: Reference specific job requirements
2. **Be Concise**: Get to the point quickly
3. **Show Value**: Explain what you bring to the project
4. **Include Examples**: Mention relevant past work
5. **Professional Tone**: Be friendly but professional

### Setting Competitive Rates
1. **Research**: Check market rates for your skills
2. **Consider Complexity**: More complex = higher rate
3. **Factor in Time**: Include time for revisions
4. **Be Realistic**: Don't underprice or overprice

### Estimating Duration
1. **Break it Down**: Divide project into tasks
2. **Add Buffer**: Include time for unexpected issues
3. **Be Honest**: Realistic timelines build trust
4. **Consider Availability**: Factor in your schedule

## Keyboard Shortcuts ⌨️

- **Tab**: Navigate between form fields
- **Enter**: Submit form (when focused on button)
- **Esc**: Close modal (when bid form is open)
- **Space**: Toggle skill buttons

## Troubleshooting 🔧

### Jobs Not Loading?
- Check that at least one skill is selected
- Look for error messages in red banner
- Try refreshing the page

### Can't Submit Bid?
- Ensure cover letter is at least 100 characters
- Check that rate is greater than 0
- Verify duration is filled in
- Look for red error messages below fields

### Bid Not Saving?
- Check browser console for errors
- Ensure local storage is enabled
- Try a different browser

### Download Not Working?
- Check browser's download settings
- Ensure pop-ups are not blocked
- Try a different browser

## Demo Mode vs Production 🚀

### Current Demo Mode
- ✅ Browse mock jobs
- ✅ Submit bids (saved locally)
- ✅ Download jobs and bids as JSON
- ⚠️ Bids NOT sent to Upwork

### Production Mode (After Setup)
- ✅ Real Upwork jobs via API
- ✅ Actual bid submission to Upwork
- ✅ OAuth authentication
- ✅ Real-time job updates

See `BID_SUBMISSION_GUIDE.md` for production setup instructions.

## Need Help? 📚

- **Quick Start**: See `QUICKSTART.md`
- **API Setup**: See `UPWORK_API_GUIDE.md`
- **Bid Submission**: See `BID_SUBMISSION_GUIDE.md`
- **Features**: See `FEATURES.md`
- **Full Docs**: See `README.md`

---

**Happy Bidding! 🎉**

