// Create the DataLayer Visualizer panel
chrome.devtools.panels.create(
  "DataLayer",
  "icons/icon48.png",
  "panel.html",
  function(panel) {
    console.log("DataLayer Visualizer panel created");
  }
);
