import clsx from 'clsx';
import { useSettings } from '../../providers/SettingsProvider';
const Container = ({
  children,
  width,
  className = ''
}) => {
  const {
    settings
  } = useSettings();
  const {
    container
  } = settings;
  const widthMode = width ?? container;
  return <div className={clsx(className, widthMode === 'fixed' ? 'container-fixed' : 'container-fluid')}>
      {children}
    </div>;
};
export { Container };