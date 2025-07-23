import { Container } from '@/components';
const Toolbar = ({
  children
}) => {
  return <div className="mb-5 lg:mb-7.5">
      <Container className="flex items-center justify-between flex-wrap gap-5">
        {children}
      </Container>
    </div>;
};
export { Toolbar };