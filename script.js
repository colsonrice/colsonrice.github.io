(function() {
  const root = document.documentElement;
  const toggle = document.getElementById('theme-toggle');
  const saved = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  if (saved) {
    root.setAttribute('data-theme', saved);
  } else if (prefersDark) {
    root.setAttribute('data-theme', 'dark');
  }
  const update = () => {
    const theme = root.getAttribute('data-theme');
    toggle.textContent = theme === 'dark' ? '☀️' : '🌙';
  };
  update();
  toggle.addEventListener('click', () => {
    const newTheme = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    update();
  });
})();
