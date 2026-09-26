/** sessionStorage key: set once the splash has played in this tab. */
export const SPLASH_KEY = 'wireish:splash';

/**
 * Inline <head> script, runs before first paint. Repeat visitors in the same session never
 * see the splash; first-time visitors get scroll locked while it plays. The timeout is a
 * failsafe so a JavaScript error can never leave the page covered or unscrollable.
 */
export const SPLASH_BOOT_SCRIPT = `(function(){var d=document.documentElement;try{if(sessionStorage.getItem('${SPLASH_KEY}')){d.setAttribute('data-splash','done');return}}catch(e){}d.setAttribute('data-splash','active');setTimeout(function(){d.setAttribute('data-splash','done')},6500)})();`;
