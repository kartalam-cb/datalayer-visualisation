// Create the DataLayer panel in DevTools
chrome.devtools.panels.create(
  'DataLayer',
  'icons/icon16.png',
  'panel.html',
  (panel) => {
    console.log('DataLayer panel created');
  }
);
