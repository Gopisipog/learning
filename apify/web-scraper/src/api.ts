import axios from 'axios';
import type { ScrapeRequest, ScrapeResponse } from './types';

const API_URL = '/api/scraper/browser';

export async function scrapeUrl(apiKey: string, request: ScrapeRequest): Promise<ScrapeResponse> {
  const response = await axios.get(API_URL, {
    params: {
      url: request.url,
      country: request.country,
      method: request.method,
      headers: request.headers || '{}',
      payload: request.payload || '{}',
      screenshot: request.screenshot.toString(),
      fullScreenshot: request.fullScreenshot.toString(),
    },
    headers: {
      'x-rapidapi-key': apiKey,
      'x-rapidapi-host': 'the-web-scraping-api.p.rapidapi.com',
    },
  });

  return response.data;
}

// Extract text content from HTML
export function extractTextFromHtml(html: string): string {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  
  // Remove scripts and styles
  const scripts = doc.querySelectorAll('script, style, noscript');
  scripts.forEach(el => el.remove());
  
  return doc.body.textContent?.trim() || '';
}

// Extract links from HTML
export function extractLinksFromHtml(html: string, baseUrl: string): Array<{ text: string; href: string }> {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  const links: Array<{ text: string; href: string }> = [];
  
  doc.querySelectorAll('a[href]').forEach(a => {
    const href = a.getAttribute('href') || '';
    const text = a.textContent?.trim() || '';
    if (href && text) {
      try {
        const absoluteUrl = new URL(href, baseUrl).toString();
        links.push({ text, href: absoluteUrl });
      } catch {
        links.push({ text, href });
      }
    }
  });
  
  return links;
}

// Extract images from HTML
export function extractImagesFromHtml(html: string, baseUrl: string): Array<{ alt: string; src: string }> {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  const images: Array<{ alt: string; src: string }> = [];
  
  doc.querySelectorAll('img[src]').forEach(img => {
    const src = img.getAttribute('src') || '';
    const alt = img.getAttribute('alt') || '';
    if (src) {
      try {
        const absoluteUrl = new URL(src, baseUrl).toString();
        images.push({ alt, src: absoluteUrl });
      } catch {
        images.push({ alt, src });
      }
    }
  });
  
  return images;
}

// Extract meta information
export function extractMetaFromHtml(html: string): Record<string, string> {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  const meta: Record<string, string> = {};
  
  const title = doc.querySelector('title');
  if (title) meta.title = title.textContent || '';
  
  doc.querySelectorAll('meta').forEach(m => {
    const name = m.getAttribute('name') || m.getAttribute('property');
    const content = m.getAttribute('content');
    if (name && content) meta[name] = content;
  });
  
  return meta;
}

