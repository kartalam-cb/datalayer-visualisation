# Feature Documentation

This document provides detailed information about each feature of the DataLayer Visualizer extension.

## Table of Contents
1. [Syntax Highlighting](#syntax-highlighting)
2. [Column View Layout](#column-view-layout)
3. [Resizable Columns](#resizable-columns)
4. [GTM Preview Mode Detection](#gtm-preview-mode-detection)
5. [GA4 DebugView Link](#ga4-debugview-link)
6. [Network Request Correlation](#network-request-correlation)
7. [Persist Across Navigation](#persist-across-navigation)

---

## Syntax Highlighting

### Overview
JSON data is displayed with color-coded syntax highlighting to improve readability and make it easier to parse complex dataLayer objects.

### Color Scheme
- **Keys (Property Names)**: Purple (`#881280`)
- **Strings**: Blue (`#1a1aa6`)
- **Numbers**: Green (`#164`)
- **Booleans**: Dark Blue (`#219`)
- **Null Values**: Purple/Italic (`#708`)
- **Brackets/Braces**: Dark Gray (`#444`)

### Interactive Features
- **Collapsible Objects**: Click ▼ to collapse objects and arrays
- **Expand/Collapse All**: Buttons in the toolbar to expand or collapse all nodes
- **Nested Visualization**: Proper indentation shows the structure hierarchy

### Example
```json
{
  "event": "purchase",           // Purple key, blue string
  "value": 99.99,                // Purple key, green number
  "completed": true,             // Purple key, dark blue boolean
  "metadata": null,              // Purple key, purple null
  "items": [                     // Purple key, gray bracket
    {
      "id": "SKU123",
      "quantity": 1
    }
  ]
}
```

---

## Column View Layout

### Overview
The panel is split into two columns for efficient navigation and detailed inspection of events.

### Left Column: Events List
- **Event Name**: Primary identifier (e.g., `page_view`, `purchase`, `gtm.js`)
- **Timestamp**: Precise time the event occurred (HH:MM:SS.mmm)
- **Index**: Sequential number (#0, #1, #2...)
- **URL**: Truncated URL where the event was captured
- **Network Indicators**: Badges showing associated requests (GA4, UA, GTM)
- **Selection State**: Blue highlight and left border for selected event

### Right Column: Event Details
- **Full JSON Display**: Complete event payload with syntax highlighting
- **Network Details**: Associated request information (if applicable)
- **Action Buttons**: Copy, Expand All, Collapse All

### Navigation
- Click any event in the left column to view its details
- Scroll independently in each column
- Selected event remains highlighted during navigation

---

## Resizable Columns

### Overview
Users can adjust the width of the event list and details panel to suit their preference.

### Features
- **Drag Handle**: Visible divider between columns
- **Visual Feedback**: Divider changes color when hovering/dragging
- **Persistent Preferences**: Column width is saved to localStorage
- **Constraints**: Width can be adjusted between 15% and 70%
- **Default Split**: 30% event list, 70% details panel

### How to Use
1. Hover over the divider between columns (cursor changes to ↔)
2. Click and drag left or right
3. Release to set the new width
4. Preference is automatically saved

### Reset to Default
To reset: Manually drag back to approximately 30%, or clear browser localStorage for the extension.

---

## GTM Preview Mode Detection

### Overview
Automatically detects when Google Tag Manager's Preview/Debug mode is active on the current page.

### Detection Methods
1. **Tag Assistant API**: Checks for `window.__TAG_ASSISTANT_API`
2. **Preview Cookies**: Looks for `__TAG_ASSISTANT` cookies
3. **GTM Container Objects**: Inspects `window.google_tag_manager`
4. **Debug Indicators**: Checks for GTM debug panel presence

### Visual Indicator
**When Inactive:**
- Gray dot
- Text: "GTM Preview: Inactive"

**When Active:**
- Green pulsing dot (animated)
- Text: "GTM Preview: Active (GTM-XXXXXX)"
- Shows container ID(s)

### Use Cases
- Verify preview mode is working before debugging
- Know which container you're testing
- Avoid confusion between live and preview data

---

## GA4 DebugView Link

### Overview
Quick access button to open Google Analytics 4 DebugView for the current property.

### Features
- **Automatic Detection**: Attempts to extract GA4 measurement ID from dataLayer
- **Manual Configuration**: Right-click to set a custom property ID
- **Direct Link**: Opens DebugView in a new tab
- **Persistent Settings**: Property ID is saved to chrome.storage.sync

### Supported Formats
- Measurement ID: `G-XXXXXXXXXX` (needs numeric property ID)
- Property ID: `123456789` (used directly)

### How to Use

#### Automatic Mode
1. Click the "📊 GA4 DebugView" button
2. If property ID is detected, DebugView opens
3. If not detected, settings modal appears

#### Manual Configuration
1. Right-click the "📊 GA4 DebugView" button
2. Enter your GA4 property ID in the modal
3. Format: Either `G-XXXXXXXXXX` or numeric property ID
4. Click "Save"
5. Click the button to open DebugView

### Finding Your Property ID
1. Go to Google Analytics 4 property
2. Admin → Property Settings
3. Copy the Property ID (numeric)

---

## Network Request Correlation

### Overview
Monitors network requests to analytics endpoints and correlates them with dataLayer events.

### Monitored Endpoints
- **GA4**: `google-analytics.com/g/collect`
- **Universal Analytics**: `google-analytics.com/collect`
- **GTM**: `googletagmanager.com/gtm.js`, `googletagmanager.com/gtag/`
- **GA**: `analytics.google.com`

### Visual Indicators

#### Badge Colors
- **Green**: Successful request (GA4, UA, GTM, GA)
- **Yellow**: Pending request (in progress)
- **Red**: Failed request (error occurred)

#### Badge Types
- `GA4` - Google Analytics 4 request
- `UA` - Universal Analytics request
- `GTM` - Google Tag Manager request
- `GA` - Generic Google Analytics request

### Event Details
When an event with a network request is selected, additional information is shown:
- **Type**: Request type (GA4, UA, GTM)
- **Status**: pending, completed, or failed
- **URL**: Full request URL
- **Status Code**: HTTP status code (for completed requests)
- **Error**: Error message (for failed requests)

### Correlation Logic
The extension correlates requests with the most recent dataLayer event (within a short time window). This works well for standard implementations but may occasionally associate requests incorrectly if multiple events fire simultaneously.

### Use Cases
- Verify that dataLayer events trigger analytics requests
- Debug failed analytics requests
- Understand the flow from dataLayer to network
- Identify timing issues

---

## Persist Across Navigation

### Overview
Maintains event history when navigating between pages, useful for debugging user journeys and single-page applications.

### Features
- **Session Storage**: Uses `chrome.storage.session` to persist data
- **Navigation Markers**: Visual separators showing page changes
- **URL Tracking**: Each event shows the URL where it was captured
- **Toggle Control**: Enable or disable persistence as needed
- **Manual Clear**: "Clear All" button to reset history

### Persistence Toggle States

#### Enabled (Blue 💾 Icon)
- Events persist across navigation
- Navigation events create visual markers
- Event list shows URLs for each event
- Session storage is updated continuously

#### Disabled (Gray 📋 Icon)
- Events clear on navigation
- Each page starts with a fresh event list
- More similar to traditional DevTools panels

### Navigation Markers
When persistence is enabled and you navigate to a new page:
- A yellow marker is inserted: "🔄 Navigation"
- Shows the new URL
- Timestamp of navigation
- Cannot be selected (no details view)

### Use Cases
- **Multi-page Funnels**: Track dataLayer events across checkout flows
- **SPA Navigation**: Monitor events during client-side route changes
- **Before/After Analysis**: Compare events before and after a navigation
- **User Journey Debugging**: See the complete event sequence

### Storage Limits
- Session storage: ~10MB typical limit
- Events are stored as JSON
- Old events may be removed if limit is reached
- Cleared when browser/tab is closed

### Manual Clear
The "🗑️ Clear All" button:
- Removes all events from the display
- Clears session storage
- Clears background script data
- Does not affect localStorage preferences (column width, etc.)

---

## Tips and Best Practices

### Performance Optimization
1. Use "Clear All" periodically on high-traffic sites
2. Disable persistence when not needed
3. Collapse large objects to improve rendering

### Debugging Workflow
1. Open DevTools before loading the page to catch early events
2. Enable persistence when debugging multi-page flows
3. Use network correlation to verify request success
4. Copy JSON to external tools for detailed analysis

### Working with GTM
1. Enable GTM Preview mode before debugging
2. Use the GTM status indicator to confirm preview is active
3. Look for `gtm.js` and `gtm.dom` events
4. Check network indicators for tag firing

### GA4 Debugging
1. Configure your property ID for quick DebugView access
2. Compare extension events with DebugView in real-time
3. Use network correlation to verify events are sent
4. Check for `measurement_id` in events

---

## Keyboard Shortcuts

Currently, the extension does not implement custom keyboard shortcuts, but standard browser shortcuts work:

- `Ctrl/Cmd + F`: Search within the details panel
- `Ctrl/Cmd + C`: Copy (when text is selected)
- `F5`: Refresh page (may clear events if persistence is off)
- `F12`: Toggle DevTools

---

## Customization

### Adjustable Settings
- Column width (drag divider)
- GA4 Property ID (right-click button)
- Persistence preference (toggle button)

### Browser Settings
- Panel position (dock DevTools left, right, bottom, or separate window)
- DevTools theme (light/dark affects overall appearance)

---

## Technical Details

### Architecture
```
┌─────────────┐
│   Page      │
│  (Website)  │
└──────┬──────┘
       │
┌──────▼──────────┐
│  injected.js    │  ← Intercepts dataLayer
└──────┬──────────┘
       │ postMessage
┌──────▼──────────┐
│  content.js     │  ← Bridge script
└──────┬──────────┘
       │ chrome.runtime
┌──────▼──────────┐
│  background.js  │  ← Network monitoring
└──────┬──────────┘
       │
┌──────▼──────────┐
│   panel.js      │  ← UI and display
│   (DevTools)    │
└─────────────────┘
```

### Message Flow
1. Page pushes to dataLayer
2. injected.js intercepts and sends postMessage
3. content.js receives and forwards to background
4. background.js stores and monitors network
5. panel.js receives updates and renders UI

### Storage Usage
- **localStorage**: Column width preference
- **chrome.storage.sync**: GA4 property ID
- **chrome.storage.session**: Persisted events
- **Background Map**: Tab-specific event data

---

## Future Enhancements (Potential)

### Planned Features
- Export events to JSON/CSV
- Filter events by type or property
- Search within event data
- Event comparison view
- Custom event highlighting rules
- Dark mode toggle
- Keyboard shortcuts
- Event replay/rewind
- Integration with GA4 measurement protocol

### Community Contributions
Contributions are welcome! See CONTRIBUTING.md for guidelines.

---

## Version History

### v1.0.0 (Current)
- ✅ Syntax highlighting
- ✅ Two-column layout
- ✅ Resizable columns
- ✅ GTM preview detection
- ✅ GA4 DebugView link
- ✅ Network request correlation
- ✅ Persist across navigation
- ✅ Copy JSON functionality
- ✅ Collapsible JSON
- ✅ Navigation markers
- ✅ URL tracking

---

## Support

For questions, issues, or feature requests:
- GitHub Issues: https://github.com/kartalam-cb/datalayer-visualisation/issues
- Documentation: README.md, INSTALLATION.md
