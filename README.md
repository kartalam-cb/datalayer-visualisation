# DataLayer Visualiser - Chrome Extension

A Chrome DevTools extension for visualizing and monitoring `window.dataLayer` in real-time. Perfect for debugging Google Tag Manager implementations and analytics tracking.

## Features

- ✨ **Real-time Monitoring** - Intercepts all `dataLayer.push()` calls as they happen
- 🎯 **Visual Highlights** - New events are highlighted with smooth animations
- 📊 **DevTools Integration** - Dedicated panel within Chrome DevTools
- 🎨 **Light Theme UI** - Clean, professional interface built with Tailwind CSS
- 📝 **Detailed Event Logs** - View full payload of each dataLayer push with syntax highlighting
- ⏱️ **Timestamps** - Precise timing information for each event
- 🔍 **Collapsible Events** - Expand/collapse individual events for better organization
- 🗑️ **Clear History** - Reset the event log with one click
- 📍 **Auto-scroll** - Automatically scroll to new events (toggleable)

## Installation

### Install from Source

1. **Clone or download this repository**:
   ```bash
   git clone https://github.com/kartalam-cb/datalayer-visualisation.git
   cd datalayer-visualisation
   ```

2. **Load the extension in Chrome**:
   - Open Chrome and navigate to `chrome://extensions/`
   - Enable "Developer mode" (toggle in the top right corner)
   - Click "Load unpacked"
   - Select the `datalayer-visualisation` directory

3. **Verify installation**:
   - You should see "DataLayer Visualiser" in your extensions list
   - The extension icon should appear in your Chrome toolbar

## Usage

1. **Open Chrome DevTools**:
   - Press `F12` or right-click on any webpage and select "Inspect"
   
2. **Navigate to the DataLayer panel**:
   - Look for the "DataLayer" tab in the DevTools panel (alongside Elements, Console, Network, etc.)
   - Click on it to open the DataLayer Visualiser

3. **Monitor dataLayer events**:
   - The panel will automatically capture all existing dataLayer items when you open it
   - Any new `dataLayer.push()` calls will appear in real-time with a highlight animation
   - Each event shows:
     - Event number (sequential counter)
     - Timestamp (precise to milliseconds)
     - Full JSON payload with syntax highlighting

4. **Interact with events**:
   - **Expand/Collapse**: Click the "Collapse" button on any event to hide its payload
   - **Auto-scroll**: Toggle the "Auto-scroll" checkbox to enable/disable automatic scrolling to new events
   - **Clear History**: Click "Clear History" to reset all captured events

## How It Works

### Architecture

The extension consists of several components working together:

1. **Content Script** (`content.js`):
   - Injects into every webpage at `document_start`
   - Intercepts the `dataLayer.push()` method before page scripts run
   - Captures existing dataLayer items on page load
   - Forwards all events to the background script

2. **Background Service Worker** (`background.js`):
   - Acts as a message hub between content scripts and DevTools panels
   - Maintains connections to open DevTools panels
   - Stores dataLayer data per tab

3. **DevTools Panel** (`panel.html`, `panel.js`):
   - Provides the user interface for viewing events
   - Formats and displays JSON with syntax highlighting
   - Manages event history and UI interactions

4. **DevTools Integration** (`devtools.html`, `devtools.js`):
   - Creates the "DataLayer" panel in Chrome DevTools
   - Establishes communication channels

### Key Features Implementation

- **Real-time Interception**: The content script overrides `window.dataLayer.push` before any page scripts execute (`document_start`)
- **Visual Highlights**: CSS animations provide a fade-in effect and temporary highlight for new events
- **Syntax Highlighting**: Custom JSON formatter with color-coded syntax
- **Persistent Monitoring**: Events are tracked even if you navigate to different DevTools tabs

## Development

### File Structure

```
datalayer-visualisation/
├── manifest.json          # Extension manifest (Manifest V3)
├── devtools.html         # DevTools page entry point
├── devtools.js           # Creates the DevTools panel
├── panel.html            # Panel UI with Tailwind CSS
├── panel.js              # Panel logic and event handling
├── content.js            # Content script for dataLayer interception
├── background.js         # Background service worker
├── icons/                # Extension icons
│   ├── icon16.png
│   ├── icon48.png
│   └── icon128.png
└── README.md
```

### Testing

To test the extension:

1. Load it in Chrome as described in the Installation section
2. Navigate to any website that uses Google Tag Manager or has a `dataLayer` object
3. Open Chrome DevTools and go to the DataLayer panel
4. Watch for existing events and trigger new events by interacting with the page

Example test page (create an HTML file):

```html
<!DOCTYPE html>
<html>
<head>
  <title>DataLayer Test</title>
  <script>
    // Initialize dataLayer
    window.dataLayer = window.dataLayer || [];
    
    // Push some initial data
    dataLayer.push({
      'event': 'pageview',
      'page': '/',
      'title': 'Test Page'
    });
  </script>
</head>
<body>
  <h1>DataLayer Test Page</h1>
  <button onclick="dataLayer.push({'event': 'button_click', 'button': 'test'})">
    Click Me
  </button>
</body>
</html>
```

## Browser Compatibility

- **Chrome**: Full support (Manifest V3)
- **Edge**: Full support (Chromium-based)
- **Other Chromium browsers**: Should work but untested

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - see [LICENSE](LICENSE) file for details

## Author

Karthik Talam

## Support

If you encounter any issues or have feature requests, please [open an issue](https://github.com/kartalam-cb/datalayer-visualisation/issues) on GitHub.