export function StatusColorGiveaway({status}) {
    const statusColor =
    status === "Ожидается"
      ? "#1B84FF"
      : status === "Идет"
        ? "#04B440"
        : "#DFA000";
  return (
    <s
      style={{
        display:'inline-block',
        width: "8px",
        height: "8px",
        borderRadius: "50%",
        backgroundColor: statusColor,
        marginRight:'8px'
      }}
    />
  );
}
