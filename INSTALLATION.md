# Installation and Testing Guide

## Prerequisites
- Google Chrome browser (version 88 or later)
- Basic familiarity with Chrome DevTools

## Installation Steps

### Method 1: Load Unpacked Extension (Development)

1. **Clone or Download the Repository**
   ```bash
   git clone https://github.com/kartalam-cb/datalayer-visualisation.git
   cd datalayer-visualisation
   ```

2. **Open Chrome Extensions Page**
   - Open Google Chrome
   - Navigate to `chrome://extensions/`
   - Or: Menu → More Tools → Extensions

3. **Enable Developer Mode**
   - Toggle the "Developer mode" switch in the top-right corner

4. **Load the Extension**
   - Click the "Load unpacked" button
   - Navigate to the `datalayer-visualisation` folder
   - Click "Select Folder"

5. **Verify Installation**
   - You should see "DataLayer Visualizer" in your extensions list
   - The extension icon should appear with a blue background and "DL" text

## Testing the Extension

### Using the Demo Page

1. **Open the Demo Page**
   - Navigate to the `demo.html` file in the repository
   - Open it in Chrome (you can drag and drop it into the browser)

2. **Open DevTools**
   - Press `F12` or right-click and select "Inspect"
   - Look for the new "DataLayer" tab in DevTools (it should be at the top level)

3. **Test Features**
   
   #### Basic Event Capture
   - Click the buttons on the demo page to push events
   - Events should appear in the left panel immediately
   - Click an event to see its details in the right panel

   #### Syntax Highlighting
   - Select any event
   - Notice the color-coded JSON in the right panel:
     - Keys are purple
     - Strings are blue
     - Numbers are green
     - Booleans are dark blue
     - Null values are purple/italic

   #### Collapsible JSON
   - Click the ▼ arrows next to objects and arrays to collapse them
   - Use "Expand All" and "Collapse All" buttons at the top

   #### Resizable Columns
   - Hover over the divider between the two panels
   - Drag left or right to resize
   - Refresh the page - your width preference should be saved

   #### Copy JSON
   - Select an event
   - Click the 📋 button to copy its JSON to clipboard
   - Paste into a text editor to verify

   #### Clear Events
   - Click the "🗑️ Clear All" button
   - All events should be removed

   #### Persistence
   - Enable persistence (💾 button should be blue)
   - Navigate to another page
   - Return to DevTools - events should still be visible
   - Disable persistence and navigate - events should clear

### Testing on Real Websites

1. **Visit a Site with GTM**
   - Navigate to any website that uses Google Tag Manager
   - Open DevTools → DataLayer tab
   - You should see existing dataLayer events

2. **GTM Preview Detection**
   - Enable GTM Preview mode on a container
   - The GTM status indicator should show "Active" with a green dot
   - Container IDs should be displayed

3. **Network Correlation**
   - Events that trigger analytics requests show badges (GA4, UA, GTM)
   - Click an event to see network request details
   - Status indicators show: sent (green), pending (yellow), failed (red)

4. **GA4 DebugView Link**
   - Click the "📊 GA4 DebugView" button
   - If property ID is detected, it opens DebugView
   - Right-click to configure a custom property ID

### Testing Scenarios

#### Scenario 1: E-commerce Purchase Flow
```javascript
// Simulate in browser console
dataLayer.push({
  event: 'purchase',
  ecommerce: {
    transaction_id: 'T12345',
    value: 250.00,
    currency: 'USD',
    items: [{
      item_id: 'PROD_001',
      item_name: 'Test Product',
      price: 250.00,
      quantity: 1
    }]
  }
});
```

#### Scenario 2: User Authentication
```javascript
dataLayer.push({
  event: 'login',
  user_id: 'user123',
  method: 'email'
});
```

#### Scenario 3: Custom Events
```javascript
dataLayer.push({
  event: 'video_play',
  video_id: 'VID_789',
  video_title: 'Demo Video',
  video_duration: 180
});
```

## Troubleshooting

### Extension Not Appearing in DevTools
- **Solution**: Refresh the browser page after installing the extension
- **Solution**: Check if developer mode is enabled in chrome://extensions/
- **Solution**: Try removing and re-adding the extension

### Events Not Showing Up
- **Solution**: Ensure the dataLayer exists on the page (check console: `window.dataLayer`)
- **Solution**: Refresh the page with DevTools already open
- **Solution**: Check that content script is running (console messages)

### Network Requests Not Correlating
- **Solution**: Ensure the extension has permissions to monitor network requests
- **Solution**: Check if the website is using supported analytics endpoints
- **Solution**: Some ad blockers may interfere - try disabling them

### GTM Preview Not Detected
- **Solution**: Ensure GTM Preview mode is actually active (look for the preview panel)
- **Solution**: Refresh the page with preview mode already enabled
- **Solution**: Check browser cookies for `__TAG_ASSISTANT`

### Persistence Not Working
- **Solution**: Check if the persistence toggle is enabled (blue)
- **Solution**: Clear chrome.storage if corrupted: Settings → Privacy → Clear browsing data → Hosted app data
- **Solution**: Some incognito windows may not support storage APIs

## Known Limitations

1. **Network Correlation Timing**: The extension correlates network requests based on timing. Requests may occasionally be associated with the wrong event if multiple events fire simultaneously.

2. **Cross-Origin Iframes**: Events from iframes on different domains may not be captured due to security restrictions.

3. **Property ID Detection**: GA4 property ID detection works for standard implementations. Custom implementations may require manual configuration.

4. **Preview Mode Detection**: GTM preview detection works for standard GTM containers. Custom or older implementations may not be detected.

## Performance Notes

- The extension has minimal performance impact
- Event storage is limited by browser storage quotas (typically 10MB for session storage)
- Very high-frequency dataLayer pushes (100+ per second) may cause UI lag

## Security and Privacy

- All data processing happens locally in your browser
- No data is sent to external servers
- The extension only monitors pages where you have DevTools open
- Network monitoring only tracks analytics-related requests

## Getting Help

- GitHub Issues: [Report a bug or request a feature](https://github.com/kartalam-cb/datalayer-visualisation/issues)
- Check existing issues for solutions
- Include Chrome version and extension version in bug reports

## Updating the Extension

When updates are available:

1. Pull the latest changes:
   ```bash
   git pull origin main
   ```

2. Go to `chrome://extensions/`

3. Click the refresh icon on the DataLayer Visualizer card

4. Refresh any open tabs to load the new version

## Uninstalling

1. Navigate to `chrome://extensions/`
2. Find "DataLayer Visualizer"
3. Click "Remove"
4. Confirm the removal

Your settings and preferences will be removed automatically.
