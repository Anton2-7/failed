const formatDateForInput = (dateString) => {
  if (!dateString) return "";
  if (
    typeof dateString === "string" &&
    dateString.match(/^\d{4}-\d{2}-\d{2}$/)
  ) {
    return dateString;
  }
  return dateString.split(" ")[0];
};

export { formatDateForInput}