import { KeenIcon } from '@/components';
import React from 'react';
const ModalSearchSettingsItems = ({
  items
}) => {
  return <>
      {items.map((item, index) => <div className="menu-item" key={index}>
          <a href="#" className="menu-link">
            <span className="menu-icon">
              <KeenIcon icon={item.icon} />
            </span>
            <span className="menu-title">{item.info}</span>
          </a>
        </div>)}
    </>;
};
export { ModalSearchSettingsItems };