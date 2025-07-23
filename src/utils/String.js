export const camelToSnakeCase = str => {
  return str.replace(/([a-z])([A-Z])/g, '$1_$2').toLowerCase();
};
export const snakeToCamelCase = str => {
  return str.replace(/(_\w)/g, match => match[1].toUpperCase());
};