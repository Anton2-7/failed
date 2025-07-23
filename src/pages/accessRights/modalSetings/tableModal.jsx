const RenderUserInfoTable = ({ data }) => {
  console.log("RENDER TABLE", data);

  return (
    <div style={{ borderRadius: "4px", border: "1px solid #F1F1F4" }}>
      <table className="w-full border-collapse text-sm">
        <tbody>
          {data.map((user, index) => (
            <tr
              className={`border-gray-200 ${
                index % 2 === 0 ? "bg-table-row-even" : "bg-table-row-odd"
              }`}
              key={index}
            >
              <td className="px-4 fz-14 max-sm:w-[100px] py-2">
                <div className="w-[145px]">{user.x1}</div>
              </td>
              <td className="py-[0.34rem] m:pl-[40px] pb-2 md:pl-[116px] ">
                <div>{user.x2}</div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
export { RenderUserInfoTable };
