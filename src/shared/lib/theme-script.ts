export const themeScript = `(() => {
  try {
    if (localStorage.getItem('theme') === 'dark') document.documentElement.dataset.theme = 'dark';
  } catch {}
})();`;
