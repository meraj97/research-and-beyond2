/**
 * Runs in the browser before the page is drawn (see src/app/layout.tsx), so there is no flash of the wrong theme:
 *  - theme: the visitor's saved choice; otherwise THEME_DEFAULT
 *  - <html lang>: "en" on the English pages (/en), "bn" everywhere else
 *
 * THEME_DEFAULT: 'system' follows the visitor's device setting. Use 'light' or 'dark' to always start with one of them.
 */
export const THEME_DEFAULT: 'system' | 'light' | 'dark' = 'system';

export const bootScript = `(function(){var e=document.documentElement;try{var s=localStorage.getItem('rb-theme');var d='${THEME_DEFAULT}';var dark=s?s==='dark':d==='dark'||(d==='system'&&window.matchMedia('(prefers-color-scheme: dark)').matches);if(dark)e.classList.add('dark');}catch(_){}var p=location.pathname;if(p==='/en'||p.indexOf('/en/')===0)e.lang='en';})();`;
