# DataLayer Visualizer

A powerful Chrome DevTools extension for debugging Google Tag Manager (GTM) and Google Analytics 4 (GA4) implementations by visualizing dataLayer events in real-time.

## Features

### 🎨 Syntax Highlighting
- Color-coded JSON syntax highlighting for easy reading
- Different colors for keys, strings, numbers, booleans, null values, and brackets
- Collapsible JSON objects and arrays

### 📊 Two-Column Layout
- **Left Column**: Scrollable list of all dataLayer events with timestamps and indices
- **Right Column**: Detailed view of the selected event's payload
- Click any event to view its full data
- Visual highlighting of the currently selected event

### ↔️ Resizable Columns
- Drag the divider between columns to adjust the layout
- Column width preferences are saved automatically
- Default 30/70 split (events list / details)

### 🔍 GTM Preview Mode Detection
- Automatically detects when GTM Preview/Debug mode is active
- Shows a visual indicator with GTM container IDs
- Helps you know when you're debugging in preview mode

### 📈 GA4 DebugView Link
- Quick access button to open GA4 DebugView in Google Analytics
- Automatically detects GA4 Property ID from dataLayer
- Right-click the button to configure a custom property ID

### 🌐 Network Request Correlation
- Monitors network requests to analytics endpoints (GA4, Universal Analytics, GTM)
- Correlates dataLayer pushes with resulting network requests
- Shows request status (sent, pending, failed) with visual indicators
- Click events to see associated network request details

### 💾 Persist Across Navigation
- Maintains event history when navigating between pages
- Works with both Single Page Applications (SPA) and traditional navigation
- Visual navigation markers in the event timeline
- Shows the URL where each event was captured
- Toggle persistence on/off as needed
- "Clear All" button to reset history

## Installation

### From Source
1. Clone this repository:
   ```bash
   git clone https://github.com/kartalam-cb/datalayer-visualisation.git
   ```

2. Open Chrome and navigate to `chrome://extensions/`

3. Enable "Developer mode" (toggle in the top right)

4. Click "Load unpacked" and select the repository folder

5. The extension is now installed!

## Usage

1. Open Chrome DevTools (F12 or Right-click → Inspect)

2. Navigate to the **DataLayer** tab in DevTools

3. The extension will automatically start capturing dataLayer events

4. Click on any event in the left panel to view its details in the right panel

### Toolbar Features

- **GTM Preview Status**: Shows if GTM Preview mode is detected
- **📊 GA4 DebugView**: Opens GA4 DebugView (right-click to configure property ID)
- **💾 Persist**: Toggle persistence across page navigation
- **🗑️ Clear All**: Clear all captured events

### Event Details

- **Copy Button (📋)**: Copy the selected event's JSON to clipboard
- **Expand All (⬇️)**: Expand all JSON objects/arrays
- **Collapse All (⬆️)**: Collapse all JSON objects/arrays

## Network Request Correlation

Events that triggered network requests show colored badges:
- 🟢 **GA4**: Google Analytics 4 request
- 🟢 **UA**: Universal Analytics request  
- 🟢 **GTM**: Google Tag Manager request
- 🟡 **Pending**: Request in progress
- 🔴 **Failed**: Request failed

## Permissions

This extension requires the following permissions:

- **storage**: To save preferences (column width, GA4 property ID, persistence settings)
- **webRequest**: To monitor analytics network requests
- **tabs**: To track events across different tabs
- **host_permissions**: To inject content scripts and monitor requests on all websites

## Development

### Project Structure

```
datalayer-visualisation/
├── manifest.json          # Extension manifest (v3)
├── devtools.html         # DevTools entry point
├── devtools.js           # Creates the DataLayer panel
├── panel.html            # Main panel UI
├── panel.js              # Panel logic and event handling
├── panel.css             # Panel styles
├── background.js         # Background service worker
├── content.js            # Content script bridge
├── injected.js           # Page context script for dataLayer interception
└── icons/                # Extension icons
```

### How It Works

1. **Injected Script** (`injected.js`): Runs in the page context to intercept dataLayer pushes
2. **Content Script** (`content.js`): Bridges between the page and extension
3. **Background Script** (`background.js`): Monitors network requests and coordinates data
4. **DevTools Panel** (`panel.js`): Displays events and provides the UI

## Browser Support

- Chrome 88+ (Manifest V3 support required)
- Edge 88+ (Chromium-based)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - see LICENSE file for details

## Privacy

This extension:
- ✅ Runs entirely locally in your browser
- ✅ Does not send any data to external servers
- ✅ Does not track or collect user information
- ✅ Only monitors analytics requests for debugging purposes

## Support

For issues, questions, or suggestions, please open an issue on GitHub.