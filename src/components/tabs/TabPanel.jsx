import React, { forwardRef } from 'react';
import { TabPanel as MuiTabPanel } from '@mui/base/TabPanel';

// Define the extended tab component
const TabPanel = forwardRef((props, ref) => {
  return <MuiTabPanel {...props} ref={ref} />;
});
export { TabPanel };