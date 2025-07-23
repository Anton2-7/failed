export function getPhotoSrc(photo) {
  if (!photo) return "";
  if (photo.startsWith("data:")) return photo;
  if (/^https?:\/\//.test(photo)) return photo;
  return `http://${photo}`;
}
