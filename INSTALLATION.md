# Installation Guide

## Quick Start

### Step 1: Load the Extension

1. Download or clone this repository:
   ```bash
   git clone https://github.com/kartalam-cb/datalayer-visualisation.git
   ```

2. Open Google Chrome and navigate to:
   ```
   chrome://extensions/
   ```

3. Enable **Developer mode** using the toggle in the top-right corner

4. Click **Load unpacked**

5. Select the `datalayer-visualisation` folder

6. The extension should now appear in your extensions list with the "DL" icon

### Step 2: Use the Extension

1. Navigate to any website (or open the test page provided)

2. Open Chrome DevTools:
   - Press `F12`, or
   - Right-click and select "Inspect", or
   - Use `Ctrl+Shift+I` (Windows/Linux) or `Cmd+Option+I` (Mac)

3. Find and click the **DataLayer** tab in the DevTools panel

4. You should now see any existing dataLayer events and watch new ones appear in real-time

## Testing the Extension

A test HTML file is provided in `/tmp/test-datalayer.html` with various test buttons to trigger different types of dataLayer events.

To use it:
1. Open the file in Chrome: `file:///tmp/test-datalayer.html`
2. Open DevTools and go to the DataLayer tab
3. Click the test buttons to see events captured in real-time

## Troubleshooting

### Extension not showing up
- Make sure Developer mode is enabled
- Try reloading the extension page (`chrome://extensions/`)
- Check the extension details for any error messages

### DataLayer tab not visible
- Make sure you've opened DevTools (`F12`)
- Try closing and reopening DevTools
- Check that the extension is enabled

### Events not captured
- Refresh the webpage with DevTools open
- Check the Console tab for any error messages
- Verify that the page actually has a `window.dataLayer` object

### Events showing but panel is empty
- Try clicking the "Clear History" button and refreshing the page
- Check if auto-scroll is enabled
- Look for any JavaScript errors in the Console

## Updating the Extension

When you make changes to the extension code:

1. Go to `chrome://extensions/`
2. Find the DataLayer Visualiser extension
3. Click the refresh icon (🔄) to reload the extension
4. Close and reopen DevTools to see the changes

## Uninstalling

To remove the extension:

1. Go to `chrome://extensions/`
2. Find the DataLayer Visualiser extension
3. Click **Remove**
4. Confirm the removal

## Support

For issues or questions:
- Check the main [README.md](README.md) for detailed documentation
- Open an issue on GitHub: https://github.com/kartalam-cb/datalayer-visualisation/issues
