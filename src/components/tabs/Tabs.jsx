import React, { forwardRef } from 'react';
import { Tabs as MuiTabs } from '@mui/base/Tabs';

// Define the extended tab component
const Tabs = forwardRef((props, ref) => {
  return <MuiTabs {...props} ref={ref} />;
});
export { Tabs };