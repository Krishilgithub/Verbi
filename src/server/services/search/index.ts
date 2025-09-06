import pMap from 'p-map';

import { toolsEnv } from '@/envs/tools';
import { SearchParams } from '@/types/tool/search';

import { SearchImplType, SearchServiceImpl, createSearchServiceImpl } from './impls';

// Mental wellness-focused crawl result interface
interface MentalWellnessCrawlResult {
  url: string;
  title: string;
  content: string;
  status: 'success' | 'error';
  message?: string;
  wellness_category?: 'mental_health' | 'therapy' | 'meditation' | 'crisis_support';
}

const parseImplEnv = (envString: string = '') => {
  // 处理全角逗号和多余空格
  const envValue = envString.replaceAll('，', ',').trim();
  return envValue.split(',').filter(Boolean);
};

/**
 * Search service class for mental wellness
 * Uses different implementations for different search operations with mental health focus
 */
export class SearchService {
  private searchImpl: SearchServiceImpl;

  private get crawlerImpls() {
    // Return mental wellness-specific crawler implementations
    return ['mental_health_safe_crawler'];
  }

  constructor() {
    const impls = this.searchImpls;
    // TODO: need use turn mode
    this.searchImpl = createSearchServiceImpl(impls.length > 0 ? impls[0] : undefined);
  }

  /**
   * Mental wellness-focused page analysis
   * Processes wellness resource URLs with mental health context
   */
  async crawlPages(input: { urls: string[] }): Promise<{ results: MentalWellnessCrawlResult[] }> {
    // For mental wellness chatbot, we provide curated mental health resources
    // instead of general web crawling to ensure safety and relevance
    
    const results = await pMap(
      input.urls,
      async (url) => {
        try {
          // Validate URL is from trusted mental health sources
          const trustedDomains = [
            'psychology.org',
            'nimh.nih.gov',
            'mentalhealth.gov',
            'nami.org',
            'who.int',
            'samhsa.gov'
          ];
          
          const urlDomain = new URL(url).hostname.toLowerCase();
          const isTrusted = trustedDomains.some(domain => urlDomain.includes(domain));
          
          if (!isTrusted) {
            return {
              url,
              title: 'Untrusted Source',
              content: '',
              status: 'error' as const,
              message: 'For your safety, Verbi only processes content from verified mental health organizations. Please provide URLs from trusted mental health resources.',
              wellness_category: undefined
            };
          }
          
          // In a real implementation, you would use a safe HTTP client here
          // For now, return a placeholder response
          return {
            url,
            title: 'Mental Health Resource',
            content: 'This is a trusted mental health resource. Content analysis would be performed here.',
            status: 'success' as const,
            wellness_category: 'mental_health' as const
          };
          
        } catch (error) {
          return {
            url,
            title: 'Processing Error',
            content: '',
            status: 'error' as const,
            message: `Unable to process mental health resource: ${error instanceof Error ? error.message : 'Unknown error'}`,
            wellness_category: undefined
          };
        }
      },
      { concurrency: 2 } // Lower concurrency for careful mental health content processing
    );

    return { results };
  }

  private get searchImpls() {
    return parseImplEnv(toolsEnv.SEARCH_PROVIDERS) as SearchImplType[];
  }

  /**
   * Query for search results with mental wellness focus
   */
  async query(query: string, params?: SearchParams) {
    return this.searchImpl.query(query, params);
  }
}

// Add a default exported instance for convenience
export const searchService = new SearchService();
