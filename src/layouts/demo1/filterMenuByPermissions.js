export const filterMenuByPermissions = (menu, allowedNames) => {
  if (!Array.isArray(allowedNames)) return [];

  return menu.filter((item) => allowedNames.includes(item.title));
};
