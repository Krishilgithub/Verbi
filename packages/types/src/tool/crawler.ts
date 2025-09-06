// Mental wellness-focused crawl result types
interface MentalWellnessCrawlErrorResult {
  error: string;
  message?: string;
  url: string;
}

interface MentalWellnessCrawlSuccessResult {
  content: string;
  description?: string;
  title: string;
  url: string;
  wellness_category?: 'mental_health' | 'therapy' | 'meditation' | 'crisis_support';
}

export interface CrawlSinglePageQuery {
  url: string;
}

export interface CrawlMultiPagesQuery {
  urls: string[];
}

export interface CrawlResult {
  crawler: string;
  data: MentalWellnessCrawlSuccessResult | MentalWellnessCrawlErrorResult;
  originalUrl: string;
}

export interface CrawlPluginState {
  results: CrawlResult[];
}
