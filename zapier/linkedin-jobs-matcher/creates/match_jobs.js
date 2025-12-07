// Action to match jobs against resume using AI
const calculateMatchScore = (job, resume) => {
  // Simple keyword matching algorithm
  // In production, you'd use AI/ML for better matching
  
  const resumeLower = resume.toLowerCase();
  const jobDescLower = (job.description || '').toLowerCase();
  const jobTitleLower = (job.title || '').toLowerCase();
  
  let score = 0;
  let matchedSkills = [];
  let reasons = [];
  
  // Extract skills from resume (simple approach)
  const commonSkills = [
    'python', 'javascript', 'java', 'react', 'node.js', 'angular', 'vue',
    'sql', 'mongodb', 'aws', 'azure', 'gcp', 'docker', 'kubernetes',
    'machine learning', 'ai', 'data science', 'devops', 'agile', 'scrum',
    'typescript', 'go', 'rust', 'c++', 'c#', '.net', 'ruby', 'php',
    'html', 'css', 'git', 'ci/cd', 'terraform', 'jenkins', 'rest api'
  ];
  
  // Check for skill matches
  commonSkills.forEach(skill => {
    if (resumeLower.includes(skill) && jobDescLower.includes(skill)) {
      score += 10;
      matchedSkills.push(skill);
    }
  });
  
  // Check for title relevance
  const resumeWords = resumeLower.split(/\s+/);
  const titleWords = jobTitleLower.split(/\s+/);
  const titleMatches = titleWords.filter(word => 
    word.length > 3 && resumeWords.includes(word)
  );
  score += titleMatches.length * 5;
  
  if (titleMatches.length > 0) {
    reasons.push(`Title matches your background: ${titleMatches.join(', ')}`);
  }
  
  // Check for experience level match
  if (job.experienceLevel && resumeLower.includes(job.experienceLevel.toLowerCase())) {
    score += 15;
    reasons.push(`Experience level matches: ${job.experienceLevel}`);
  }
  
  // Check for location preference
  if (job.location && resumeLower.includes(job.location.toLowerCase())) {
    score += 10;
    reasons.push(`Location matches your preference: ${job.location}`);
  }
  
  // Normalize score to 0-100
  score = Math.min(100, score);
  
  if (matchedSkills.length > 0) {
    reasons.push(`Matched skills: ${matchedSkills.slice(0, 5).join(', ')}`);
  }
  
  return {
    score,
    matchedSkills,
    reasons,
    recommendation: score >= 70 ? 'Highly Recommended' : 
                   score >= 50 ? 'Good Match' : 
                   score >= 30 ? 'Possible Match' : 'Low Match'
  };
};

const perform = async (z, bundle) => {
  const { jobData, resumeText } = bundle.inputData;
  
  // Use resume from auth if not provided
  const resume = resumeText || bundle.authData.resumeText || '';
  
  if (!resume) {
    throw new Error('Resume text is required. Please provide it in the action or in your authentication settings.');
  }
  
  // Parse job data if it's a string
  let job;
  try {
    job = typeof jobData === 'string' ? JSON.parse(jobData) : jobData;
  } catch (e) {
    job = jobData;
  }
  
  // Calculate match score
  const matchResult = calculateMatchScore(job, resume);
  
  // Create matched job object
  const matchedJob = {
    id: `match_${job.id}_${Date.now()}`,
    jobId: job.id,
    title: job.title,
    company: job.company,
    location: job.location,
    description: job.description,
    url: job.url,
    postedDate: job.postedDate,
    jobType: job.jobType,
    experienceLevel: job.experienceLevel,
    salary: job.salary,
    
    // Match information
    matchScore: matchResult.score,
    matchedSkills: matchResult.matchedSkills.join(', '),
    matchReasons: matchResult.reasons.join(' | '),
    recommendation: matchResult.recommendation,
    shouldApply: matchResult.score >= 50,
    
    // Metadata
    matchedAt: new Date().toISOString()
  };
  
  return matchedJob;
};

module.exports = {
  key: 'match_jobs',
  noun: 'Job Match',
  
  display: {
    label: 'Match Job to Resume',
    description: 'Analyzes a job posting and calculates how well it matches your resume.'
  },

  operation: {
    // Input fields
    inputFields: [
      {
        key: 'jobData',
        label: 'Job Data',
        type: 'string',
        required: true,
        helpText: 'The job data from the LinkedIn Jobs trigger (or paste job JSON)'
      },
      {
        key: 'resumeText',
        label: 'Resume Text (Optional)',
        type: 'text',
        required: false,
        helpText: 'Your resume text. If not provided, will use the resume from authentication settings.'
      }
    ],

    perform: perform,

    // Sample output
    sample: {
      id: 'match_job_12345_1732456789',
      jobId: 'job_12345',
      title: 'Senior Software Engineer',
      company: 'Tech Corp',
      location: 'San Francisco, CA',
      url: 'https://www.linkedin.com/jobs/view/12345',
      matchScore: 85,
      matchedSkills: 'python, javascript, react, aws, docker',
      matchReasons: 'Title matches your background | Matched skills: python, javascript, react',
      recommendation: 'Highly Recommended',
      shouldApply: true,
      matchedAt: '2025-11-24T14:00:00.000Z'
    }
  }
};

