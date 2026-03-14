import axios from 'axios';
import * as cheerio from 'cheerio';

export async function scrapeJobPosting(url) {
  try {
    const { data: html } = await axios.get(url, {
      timeout: 10000,
      headers: {
        // Pretend to be a browser so sites don't block us
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });

    const $ = cheerio.load(html);

    // Remove noise elements
    $('script, style, nav, footer, header, .ads, [class*="cookie"]').remove();

    // Try LinkedIn-specific selectors first
    let jobText = '';
    
    if (url.includes('linkedin.com')) {
      jobText = $('.description__text').text() 
                || $('.show-more-less-html').text();
    } else if (url.includes('naukri.com')) {
      jobText = $('.job-desc').text() 
                || $('#job_description').text();
    } else if (url.includes('internshala.com')) {
      jobText = $('.internship_details').text();
    }

    // Generic fallback — grab all meaningful paragraph/div text
    if (!jobText || jobText.trim().length < 100) {
      jobText = $('main, article, [class*="job"], [class*="description"], [id*="job"]')
        .first()
        .text();
    }

    // Ultimate fallback — get body text
    if (!jobText || jobText.trim().length < 100) {
      jobText = $('body').text();
    }

    // Clean up whitespace
    jobText = jobText.replace(/\s+/g, ' ').trim().slice(0, 6000);

    if (jobText.length < 50) {
      throw new Error('Could not extract meaningful text from this URL. Try pasting the job text directly.');
    }

    return { text: jobText, sourceUrl: url };

  } catch (err) {
    if (err.message.includes('Could not extract')) throw err;
    throw new Error(`Failed to fetch URL: ${err.message}. Try pasting the job text directly.`);
  }
}