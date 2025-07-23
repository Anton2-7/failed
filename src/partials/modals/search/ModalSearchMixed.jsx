import React from 'react';
import { ModalSearchIntegrations } from './ModalSearchIntegrations';
import { ModalSearchUsers } from './ModalSearchUsers';
import { ModalSearchSettingsItems } from './ModalSearchSettingsItems';
const ModalSearchMixed = ({
  settings,
  integrations,
  users
}) => {
  return <div className="flex flex-col gap-2.5">
      <div>
        <div className="text-xs text-gray-600 font-medium pt-2.5 pb-1.5 ps-5">Settings</div>

        <div className="menu menu-default p-0 flex-col">
          <ModalSearchSettingsItems items={settings} />
        </div>
      </div>

      <div className="border-b border-b-gray-200"></div>

      <div>
        <div className="text-xs text-gray-600 font-medium pt-2.5 pb-1.5  ps-5">Integrations</div>
        <ModalSearchIntegrations items={integrations} />
      </div>

      <div className="border-b border-b-gray-200"></div>

      <div>
        <div className="text-xs text-gray-600 font-medium pt-2.5 pb-1.5 ps-5">Users</div>
        <ModalSearchUsers items={users} />
      </div>
    </div>;
};
export { ModalSearchMixed };