import { memo } from 'react';
import { Flexbox } from 'react-layout-kit';

const BottomActions = memo(() => {
  return <Flexbox gap={8} />;
});

BottomActions.displayName = 'BottomActions';

export default BottomActions;
