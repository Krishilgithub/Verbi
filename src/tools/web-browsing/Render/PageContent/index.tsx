import { memo } from 'react';
import { Flexbox } from 'react-layout-kit';

import { CrawlPluginState } from '@/types/tool/crawler';

import Loading from './Loading';
import Result from './Result';

// Mental wellness-focused error result type
interface MentalWellnessCrawlErrorResult {
  error: string;
  message?: string;
  url: string;
}

interface PagesContentProps {
  messageId: string;
  results?: CrawlPluginState['results'];
  urls: string[];
}

const PagesContent = memo<PagesContentProps>(({ results, messageId, urls }) => {
  if (!results || results.length === 0) {
    return (
      <Flexbox gap={12} horizontal>
        {urls && urls.length > 0 && urls.map((url, index) => (
          <Loading key={`${url}_${index}`} url={url} />
        ))}
      </Flexbox>
    );
  }

  return (
    <Flexbox gap={12} horizontal>
      {results.map((result) => (
        <Result
          crawler={result.crawler}
          key={result.originalUrl}
          messageId={messageId}
          originalUrl={result.originalUrl}
          result={
            result.data ||
            // TODO: Remove this in v2 as it's deprecated - converted for mental wellness
            ({
              content: (result as any)?.content || '',
              error: (result as any)?.errorMessage || 'Unknown error',
              message: (result as any)?.errorType,
              url: result.originalUrl,
            } as MentalWellnessCrawlErrorResult)
          }
        />
      ))}
    </Flexbox>
  );
});

export default PagesContent;
