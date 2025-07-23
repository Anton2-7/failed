import React from 'react';
import MuiDrawer from '@mui/material/Drawer';
import { styled } from '@mui/material/styles';
const StyledDrawer = styled(MuiDrawer)(() => ({
  '& .MuiDrawer-paper': {
    backgroundColor: 'var(--tw-drawer-background-color)',
    boxShadow: 'var(--tw-drawer-box-shadow)'
  },
  '& .MuiModal-backdrop': {
    backgroundColor: 'var(--tw-backdrop-background-color)'
  }
}));
const Drawer = props => {
  return <StyledDrawer {...props}>{props.children}</StyledDrawer>;
};
export { Drawer };