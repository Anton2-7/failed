/* eslint-disable no-unused-vars */

import { DataGridInner, DataGridProvider } from ".";
const DataGrid = (props) => {
  return (
    <DataGridProvider {...props} groupedHeaders={props.groupedHeaders || false}>
      <DataGridInner groupedHeaders={props.groupedHeaders || false} />
    </DataGridProvider>
  );
};
export { DataGrid };
