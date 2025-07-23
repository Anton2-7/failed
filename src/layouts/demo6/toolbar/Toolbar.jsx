import { Container } from '@/components';
const Toolbar = ({
  children
}) => {
  return <div className="pb-5">
      <Container className="flex items-center justify-between flex-wrap gap-3">
        {children}
      </Container>
    </div>;
};
export { Toolbar };