'use client';

import { PropsWithChildren, memo } from 'react';
import { Center, Flexbox } from 'react-layout-kit';

import { featureFlagsSelectors, useServerConfigStore } from '@/store/serverConfig';

const Footer = memo<PropsWithChildren>(() => {
  const { hideGitHub } = useServerConfigStore(featureFlagsSelectors);

  return hideGitHub ? null : (
    <Flexbox justify={'flex-end'}>
      <Center
        as={'footer'}
        flex={'none'}
        horizontal
        padding={16}
        width={'100%'}
      >
        <div style={{ textAlign: 'center' }}>
          &copy; {new Date().getFullYear()} Verbi. All rights reserved.
        </div>
      </Center>
    </Flexbox>
  );
});

Footer.displayName = 'SettingFooter';

export default Footer;
