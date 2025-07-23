const RenderUserInfoTable = ({ data }) => {
  return (
    <div style={{ borderRadius: "4px", border: "1px solid #F1F1F4" }}>
      <table className="w-full border-collapse text-sm">
        <tbody>
          {data.map((user, index) => (
            <tr
              className={`border-gray-200 ${
                index % 2 === 0 ? "bg-table-row-odd" : "bg-table-row-even"
              }`}
              key={index}
            >
              <td className="w-1/2 px-4 fz-14 py-2 first:border-t-0 border-t last:border-b-0 border-b">
                <div className="w-full">{user.x1}</div>
              </td>
              <td className="w-1/2 py-2 px-4 pb-2 first:border-t-0 border-t last:border-b-0 border-b border-l">
                <div className="w-full">{user.x2}</div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
export { RenderUserInfoTable };
