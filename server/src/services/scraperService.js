import axios from 'axios';
import * as cheerio from 'cheerio';
import dotenv from 'dotenv';
dotenv.config();

// Sites that are known to block scraping
const BLOCKED_SITES = [
  'linkedin.com',
  'facebook.com',
  'instagram.com',
  'twitter.com',
  'x.com',
];

// Sites that need special handling
const SITE_SELECTORS = {
  'naukri.com':       ['#job_description', '.job-desc', '.jd-desc', 'section.job-desc'],
  'internshala.com':  ['.internship_details', '.job_description', '#about_internship'],
  'indeed.com':       ['#jobDescriptionText', '.jobsearch-jobDescriptionText'],
  'glassdoor.com':    ['.jobDescriptionContent', '#JobDescriptionContainer'],
  'shine.com':        ['.job-desc', '.jd-text'],
  'monster.com':      ['.job-description', '#JobDescription'],
  'foundit.in':       ['.jd-desc', '.job-description'],
};

export async function scrapeJobPosting(url) {
  // Validate URL
  let urlObj;
  try {
    urlObj = new URL(url);
  } catch {
    throw new Error('Invalid URL. Please check the link and try again.');
  }

  const hostname = urlObj.hostname.replace('www.', '');

  // Check if site is known to block scraping
  const isBlocked = BLOCKED_SITES.some(site => hostname.includes(site));
  if (isBlocked) {
    throw new Error(
      `${hostname} blocks automated access. Please copy the job description text and use "Paste Text" instead — it works better anyway!`
    );
  }

  try {
    const { data: html } = await axios.get(url, {
      timeout: 12000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Accept-Encoding': 'gzip, deflate',
        'Connection': 'keep-alive',
      }
    });

    const $ = cheerio.load(html);

    // Remove noise
    $('script, style, nav, footer, header, iframe, .cookie-banner, .ads, [class*="cookie"], [class*="banner"], [class*="popup"]').remove();

    let jobText = '';

    // Try site-specific selectors first
    const siteKey = Object.keys(SITE_SELECTORS).find(s => hostname.includes(s));
    if (siteKey) {
      for (const selector of SITE_SELECTORS[siteKey]) {
        const text = $(selector).text().trim();
        if (text.length > 100) {
          jobText = text;
          break;
        }
      }
    }

    // Generic fallback selectors
    if (!jobText || jobText.length < 100) {
      const genericSelectors = [
        'main',
        'article',
        '[class*="job-desc"]',
        '[class*="jobDesc"]',
        '[class*="description"]',
        '[id*="description"]',
        '[class*="job-detail"]',
        '[class*="vacancy"]',
        '.content',
        '#content',
      ];

      for (const selector of genericSelectors) {
        const text = $(selector).first().text().trim();
        if (text.length > 100) {
          jobText = text;
          break;
        }
      }
    }

    // Last resort — full body
    if (!jobText || jobText.length < 100) {
      jobText = $('body').text();
    }

    // Clean up whitespace
    jobText = jobText
      .replace(/\t/g, ' ')
      .replace(/\n{3,}/g, '\n\n')
      .replace(/ {2,}/g, ' ')
      .trim()
      .slice(0, 6000);

    if (jobText.length < 80) {
      throw new Error(
        'Could not extract job text from this URL. The site may require login or block automated access. Please paste the job description text directly using "Paste Text".'
      );
    }

    return { text: jobText, sourceUrl: url };

  } catch (err) {
    // Re-throw our custom errors as-is
    if (err.message.includes('Paste Text') || err.message.includes('blocks')) {
      throw err;
    }

    // Handle axios errors with helpful messages
    if (err.code === 'ECONNREFUSED' || err.code === 'ENOTFOUND') {
      throw new Error('Could not reach this URL. Please check the link is correct and accessible.');
    }
    if (err.code === 'ETIMEDOUT' || err.code === 'ECONNABORTED') {
      throw new Error('The website took too long to respond. Please paste the job text directly using "Paste Text".');
    }
    if (err.response?.status === 403) {
      throw new Error('This website blocked access. Please copy the job description and use "Paste Text" instead.');
    }
    if (err.response?.status === 404) {
      throw new Error('Job posting not found. The listing may have been removed or the URL is incorrect.');
    }

    throw new Error('Could not fetch this URL. Please paste the job description text directly using "Paste Text".');
  }
}