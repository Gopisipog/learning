// Trigger to search for LinkedIn jobs using BrightData API
const perform = async (z, bundle) => {
  const { keywords, location, jobType, experienceLevel, datePosted } = bundle.inputData;

  // BrightData LinkedIn Jobs API endpoint
  // Note: Replace with actual BrightData endpoint for LinkedIn jobs
  const response = await z.request({
    url: 'https://api.brightdata.com/datasets/v3/trigger',
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${bundle.authData.brightdataApiKey}`,
      'Content-Type': 'application/json'
    },
    body: {
      dataset_id: 'gd_l7q7dkf244hwjntr0', // BrightData LinkedIn Jobs dataset ID
      endpoint: 'search',
      filters: {
        keywords: keywords || '',
        location: location || '',
        job_type: jobType || '',
        experience_level: experienceLevel || '',
        date_posted: datePosted || 'past_week'
      },
      limit: 100
    }
  });

  // BrightData returns a snapshot ID, we need to fetch the results
  const snapshotId = response.data.snapshot_id;
  
  // Wait a bit for data to be ready
  await z.request({
    url: `https://api.brightdata.com/datasets/v3/snapshot/${snapshotId}`,
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${bundle.authData.brightdataApiKey}`
    }
  });

  // Fetch the actual job data
  const jobsResponse = await z.request({
    url: `https://api.brightdata.com/datasets/v3/snapshot/${snapshotId}/data`,
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${bundle.authData.brightdataApiKey}`
    }
  });

  // Transform the data to a consistent format
  const jobs = jobsResponse.data.map((job, index) => ({
    id: job.job_id || `job_${index}_${Date.now()}`,
    title: job.title || job.job_title,
    company: job.company || job.company_name,
    location: job.location,
    description: job.description || job.job_description,
    url: job.url || job.job_url,
    postedDate: job.posted_date || job.date_posted,
    jobType: job.job_type || job.employment_type,
    experienceLevel: job.experience_level || job.seniority_level,
    salary: job.salary || job.salary_range,
    skills: job.skills || [],
    applicants: job.applicants || job.num_applicants,
    companySize: job.company_size,
    industry: job.industry,
    retrievedAt: new Date().toISOString()
  }));

  return jobs;
};

module.exports = {
  key: 'search_jobs',
  noun: 'Job',
  
  display: {
    label: 'New LinkedIn Job',
    description: 'Triggers when new LinkedIn jobs match your search criteria via BrightData API.'
  },

  operation: {
    type: 'polling',
    
    // Input fields for job search
    inputFields: [
      {
        key: 'keywords',
        label: 'Keywords',
        type: 'string',
        required: true,
        helpText: 'Job title, skills, or keywords to search for (e.g., "Software Engineer", "Python Developer")'
      },
      {
        key: 'location',
        label: 'Location',
        type: 'string',
        required: false,
        helpText: 'Job location (e.g., "San Francisco, CA", "Remote", "United States")'
      },
      {
        key: 'jobType',
        label: 'Job Type',
        type: 'string',
        required: false,
        choices: ['Full-time', 'Part-time', 'Contract', 'Temporary', 'Internship', 'Volunteer'],
        helpText: 'Type of employment'
      },
      {
        key: 'experienceLevel',
        label: 'Experience Level',
        type: 'string',
        required: false,
        choices: ['Internship', 'Entry level', 'Associate', 'Mid-Senior level', 'Director', 'Executive'],
        helpText: 'Required experience level'
      },
      {
        key: 'datePosted',
        label: 'Date Posted',
        type: 'string',
        required: false,
        default: 'past_week',
        choices: ['past_24_hours', 'past_week', 'past_month', 'any_time'],
        helpText: 'How recent the job posting should be'
      }
    ],

    perform: perform,

    // Sample output
    sample: {
      id: 'job_12345',
      title: 'Senior Software Engineer',
      company: 'Tech Corp',
      location: 'San Francisco, CA',
      description: 'We are looking for a Senior Software Engineer...',
      url: 'https://www.linkedin.com/jobs/view/12345',
      postedDate: '2025-11-20',
      jobType: 'Full-time',
      experienceLevel: 'Mid-Senior level',
      salary: '$120,000 - $180,000',
      skills: ['Python', 'JavaScript', 'React', 'Node.js'],
      applicants: 50,
      companySize: '1000-5000',
      industry: 'Technology',
      retrievedAt: '2025-11-24T14:00:00.000Z'
    }
  }
};

