const axios = require('axios');
const cheerio = require('cheerio');
const puppeteer = require('puppeteer');

class UsernameChecker {
  constructor() {
    this.browser = null;
    this.maxConcurrent = 5; // Maximum concurrent requests
    this.retryAttempts = 2;
    this.timeout = 10000; // 10 seconds timeout
    this.userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36';
  }

  async initBrowser() {
    if (!this.browser) {
      this.browser = await puppeteer.launch({
        headless: 'new',
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      });
    }
  }

  async closeBrowser() {
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
    }
  }

  // Check if a username is available across multiple sites
  async checkUsername(username) {
    const sites = require('../config/sites');
    const results = [];
    
    // Process sites in batches to avoid overwhelming servers
    const batches = this.chunkArray(sites, this.maxConcurrent);
    
    for (const batch of batches) {
      const batchPromises = batch.map(site => this.checkSingleSite(username, site));
      const batchResults = await Promise.allSettled(batchPromises);
      
      batchResults.forEach((result, index) => {
        if (result.status === 'fulfilled') {
          results.push(result.value);
        } else {
          results.push({
            site: batch[index].name,
            url: batch[index].url.replace('{username}', username),
            status: 'unknown',
            error: result.reason?.message || 'Unknown error',
            responseTime: 0,
            logo: batch[index].logo,
            category: batch[index].category
          });
        }
      });
    }

    return results;
  }

  // Check availability for a single site
  async checkSingleSite(username, site) {
    const startTime = Date.now();
    const url = site.url.replace('{username}', username);
    
    try {
      let result;
      
      if (site.checkType === 'puppeteer') {
        result = await this.checkWithPuppeteer(url, site, username);
      } else {
        result = await this.checkWithHttp(url, site, username);
      }
      
      const responseTime = Date.now() - startTime;
      
      return {
        site: site.name,
        url,
        status: result.status,
        responseTime,
        logo: site.logo,
        category: site.category,
        details: result.details || null,
        error: result.error || null
      };
      
    } catch (error) {
      const responseTime = Date.now() - startTime;
      console.error(`Error checking ${site.name}:`, error.message);
      
      return {
        site: site.name,
        url,
        status: 'unknown',
        responseTime,
        logo: site.logo,
        category: site.category,
        error: error.message
      };
    }
  }

  // HTTP-based checking with retries
  async checkWithHttp(url, site, username) {
    let lastError;
    
    for (let attempt = 0; attempt <= this.retryAttempts; attempt++) {
      try {
        const response = await axios.get(url, {
          timeout: this.timeout,
          headers: {
            'User-Agent': this.userAgent,
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.5',
            'Accept-Encoding': 'gzip, deflate',
            'Connection': 'keep-alive',
            'Upgrade-Insecure-Requests': '1'
          },
          maxRedirects: 5,
          validateStatus: () => true // Accept all status codes
        });

        const status = this.determineStatus(response, site, username);
        
        if (status !== 'unknown' || attempt === this.retryAttempts) {
          return { status, details: this.extractDetails(response, site) };
        }
        
      } catch (error) {
        lastError = error;
        if (attempt < this.retryAttempts) {
          // Wait before retry (exponential backoff)
          await this.sleep(Math.pow(2, attempt) * 1000);
        }
      }
    }
    
    throw lastError;
  }

  // Puppeteer-based checking for complex sites
  async checkWithPuppeteer(url, site, username) {
    await this.initBrowser();
    const page = await this.browser.newPage();
    
    try {
      await page.setUserAgent(this.userAgent);
      await page.setViewport({ width: 1280, height: 720 });
      
      const response = await page.goto(url, { 
        waitUntil: 'networkidle2', 
        timeout: this.timeout 
      });
      
      if (!response) {
        return { status: 'unknown', error: 'No response received' };
      }
      
      const status = this.determineStatusFromPage(page, site, username);
      const details = await this.extractDetailsFromPage(page, site);
      
      return { status, details };
      
    } finally {
      await page.close();
    }
  }

  // Determine availability status from HTTP response
  determineStatus(response, site, username) {
    const statusCode = response.status;
    const content = response.data;
    
    // Check for expected status codes
    if (site.expectedStatus && statusCode === site.expectedStatus) {
      return site.invertResult ? 'available' : 'taken';
    }
    
    // Check for common patterns
    if (statusCode === 404) {
      return 'available';
    }
    
    if (statusCode === 200) {
      // Additional checks for false positives
      if (this.hasFuzzyKeywords(content, username)) {
        return 'taken';
      }
      
      // Check for specific error messages
      if (this.hasErrorMessages(content)) {
        return 'available';
      }
      
      return 'taken';
    }
    
    // Check for redirects (often indicate taken usernames)
    if (statusCode >= 300 && statusCode < 400) {
      return 'taken';
    }
    
    return 'unknown';
  }

  // Determine status from Puppeteer page
  determineStatusFromPage(page, site, username) {
    // This would be implemented based on specific site requirements
    // For now, return unknown as we're primarily using HTTP checks
    return 'unknown';
  }

  // Check for fuzzy keyword matches in content
  hasFuzzyKeywords(content, username) {
    if (!content || typeof content !== 'string') return false;
    
    const lowerContent = content.toLowerCase();
    const lowerUsername = username.toLowerCase();
    
    // Check for exact username match
    if (lowerContent.includes(lowerUsername)) {
      return true;
    }
    
    // Check for similar usernames (fuzzy matching)
    const variations = this.generateUsernameVariations(username);
    return variations.some(variation => lowerContent.includes(variation.toLowerCase()));
  }

  // Generate username variations for fuzzy matching
  generateUsernameVariations(username) {
    const variations = [username];
    
    // Add common variations
    variations.push(username + '_official');
    variations.push(username + '_real');
    variations.push('the' + username);
    variations.push(username + 'official');
    
    // Add variations with numbers
    for (let i = 0; i <= 9; i++) {
      variations.push(username + i);
      variations.push(i + username);
    }
    
    return variations;
  }

  // Check for error messages that indicate username is available
  hasErrorMessages(content) {
    if (!content || typeof content !== 'string') return false;
    
    const errorPatterns = [
      'user not found',
      'profile not found',
      'page not found',
      'does not exist',
      'not available',
      'username not found',
      'account not found',
      'user does not exist'
    ];
    
    const lowerContent = content.toLowerCase();
    return errorPatterns.some(pattern => lowerContent.includes(pattern));
  }

  // Extract additional details from response
  extractDetails(response, site) {
    const details = {
      statusCode: response.status,
      contentType: response.headers['content-type'],
      contentLength: response.data?.length || 0
    };
    
    // Try to extract page title if it's HTML
    if (response.data && typeof response.data === 'string' && 
        response.headers['content-type']?.includes('text/html')) {
      try {
        const $ = cheerio.load(response.data);
        details.title = $('title').text().trim();
        details.hasProfileImage = $('img[alt*="profile"], img[alt*="avatar"]').length > 0;
      } catch (e) {
        // Ignore parsing errors
      }
    }
    
    return details;
  }

  // Extract details from Puppeteer page
  async extractDetailsFromPage(page, site) {
    try {
      const title = await page.title();
      const hasProfileImage = await page.$('img[alt*="profile"], img[alt*="avatar"]') !== null;
      
      return {
        title,
        hasProfileImage
      };
    } catch (e) {
      return {};
    }
  }

  // Utility function to chunk array into smaller arrays
  chunkArray(array, chunkSize) {
    const chunks = [];
    for (let i = 0; i < array.length; i += chunkSize) {
      chunks.push(array.slice(i, i + chunkSize));
    }
    return chunks;
  }

  // Utility function for delays
  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

module.exports = new UsernameChecker();
