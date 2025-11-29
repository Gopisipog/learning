import { ApifyClient } from 'apify-client';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Initialize the ApifyClient with your Apify API token
const client = new ApifyClient({
    token: process.env.APIFY_API_TOKEN,
});

// Job search configuration
const JOB_TITLES = [
    'Software Architect',
    'Solutions Architect',
    'Enterprise Architect',
    'Technical Architect',
    'Cloud Architect',
    'System Architect',
];

// Countries to search (excluding India)
const LOCATIONS = [
    'United States',
    'United Kingdom',
    'Canada',
    'Australia',
    'Germany',
    'Netherlands',
    'Singapore',
    'Ireland',
    'Remote',
];

// Prepare Actor input for career site job listing
const input = {
    // Search for architect-related jobs
    queries: JOB_TITLES.map(title => ({
        keyword: title,
        location: LOCATIONS,
    })),
    // Exclude India from results
    excludeCountries: ['India'],
    // Maximum number of results
    maxResults: 100,
};

async function searchArchitectJobs() {
    console.log('🔍 Searching for Architect jobs outside India...');
    console.log('📋 Job titles:', JOB_TITLES.join(', '));
    console.log('🌍 Locations:', LOCATIONS.join(', '));
    console.log('');

    try {
        // Run the Actor and wait for it to finish
        const run = await client.actor("fantastic-jobs/career-site-job-listing-api").call(input);

        console.log('✅ Actor run completed!');
        console.log(`💾 Check your data here: https://console.apify.com/storage/datasets/${run.defaultDatasetId}`);
        console.log('');

        // Fetch Actor results from the run's dataset
        const { items } = await client.dataset(run.defaultDatasetId).listItems();

        // Filter results to exclude any India-based jobs (double-check)
        const filteredJobs = items.filter(job => {
            const location = (job.location || job.jobLocation || '').toLowerCase();
            return !location.includes('india') && !location.includes('bangalore') && 
                   !location.includes('hyderabad') && !location.includes('mumbai') &&
                   !location.includes('pune') && !location.includes('chennai') &&
                   !location.includes('delhi') && !location.includes('gurgaon') &&
                   !location.includes('noida');
        });

        console.log(`📊 Found ${filteredJobs.length} architect jobs outside India:\n`);

        // Display results
        filteredJobs.forEach((job, index) => {
            console.log(`${index + 1}. ${job.title || job.jobTitle || 'N/A'}`);
            console.log(`   🏢 Company: ${job.company || job.companyName || 'N/A'}`);
            console.log(`   📍 Location: ${job.location || job.jobLocation || 'N/A'}`);
            console.log(`   🔗 URL: ${job.url || job.jobUrl || 'N/A'}`);
            if (job.salary || job.salaryRange) {
                console.log(`   💰 Salary: ${job.salary || job.salaryRange}`);
            }
            console.log('');
        });

        return filteredJobs;
    } catch (error) {
        console.error('❌ Error running the Actor:', error.message);
        throw error;
    }
}

// Run the search
searchArchitectJobs();

