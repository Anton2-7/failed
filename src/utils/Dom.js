const getViewPort = () => {
  let e = window;
  let a = 'inner';
  if (!('innerWidth' in window)) {
    a = 'client';
    e = document.documentElement || document.body;
  }
  return {
    width: e[a + 'Width'],
    height: e[a + 'Height']
  };
};
const getHeight = element => {
  if (!element) return 0;
  const styles = window.getComputedStyle(element);
  const height = element.getBoundingClientRect().height; // Actual height of the element
  const marginTop = parseFloat(styles.marginTop);
  const marginBottom = parseFloat(styles.marginBottom);
  const totalHeight = height + marginTop + marginBottom;
  return totalHeight;
};
export { getHeight, getViewPort };