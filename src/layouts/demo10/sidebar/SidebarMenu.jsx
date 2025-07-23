import { SidebarMenuPrimary, SidebarMenuSecondary } from '.';
const SidebarMenu = ({
  height = 0
}) => {
  return <div className="flex items-stretch grow shrink-0 justify-center my-5">
      <div className="scrollable-y-auto grow [--tw-scrollbar-thumb-color:var(--tw-gray-300)]" style={{
      ...(height > 0 && {
        height: `${height}px`
      })
    }}>
        <SidebarMenuPrimary />
        <SidebarMenuSecondary />
      </div>
    </div>;
};
export { SidebarMenu };