# Architecture Documentation

## System Architecture

### Component Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        Chrome Browser                           │
│                                                                 │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │                    Inspected Page                          │ │
│  │                                                            │ │
│  │  ┌──────────────────────────────────────────────┐        │ │
│  │  │           injected.js (Page Context)          │        │ │
│  │  │  • Intercepts window.dataLayer.push()         │        │ │
│  │  │  • Detects GTM preview mode                   │        │ │
│  │  │  • Detects GA4 property ID                    │        │ │
│  │  │  • Sends data via postMessage                 │        │ │
│  │  └──────────────────┬───────────────────────────┘        │ │
│  │                     │ postMessage                         │ │
│  │  ┌──────────────────▼───────────────────────────┐        │ │
│  │  │        content.js (Content Script)            │        │ │
│  │  │  • Receives messages from injected.js         │        │ │
│  │  │  • Bridges page context to extension          │        │ │
│  │  │  • Forwards events to background              │        │ │
│  │  └──────────────────┬───────────────────────────┘        │ │
│  └───────────────────────┼────────────────────────────────────┘ │
│                          │ chrome.runtime.sendMessage          │
│  ┌───────────────────────▼────────────────────────────────────┐ │
│  │         background.js (Service Worker)                     │ │
│  │  • Monitors webRequest for analytics endpoints            │ │
│  │  • Correlates network requests with events                │ │
│  │  • Stores tab-specific event data                         │ │
│  │  • Forwards events to DevTools panel                      │ │
│  └───────────────────────┬────────────────────────────────────┘ │
│                          │ chrome.runtime.sendMessage          │
│  ┌───────────────────────▼────────────────────────────────────┐ │
│  │              DevTools Panel                                │ │
│  │                                                            │ │
│  │  ┌──────────────────────────────────────────────┐        │ │
│  │  │         devtools.js / devtools.html           │        │ │
│  │  │  • Creates "DataLayer" tab in DevTools        │        │ │
│  │  └──────────────────┬───────────────────────────┘        │ │
│  │                     │                                      │ │
│  │  ┌──────────────────▼───────────────────────────┐        │ │
│  │  │      panel.html / panel.js / panel.css        │        │ │
│  │  │  • Displays events in two-column layout       │        │ │
│  │  │  • Syntax highlights JSON                     │        │ │
│  │  │  • Manages UI interactions                    │        │ │
│  │  │  • Handles persistence and settings           │        │ │
│  │  └───────────────────────────────────────────────┘        │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## Data Flow

### 1. DataLayer Event Capture

```
Page JavaScript                injected.js              content.js
     │                             │                        │
     │  dataLayer.push({...})      │                        │
     ├────────────────────────────>│                        │
     │                             │                        │
     │                             │  postMessage           │
     │                             ├───────────────────────>│
     │                             │                        │
     │                             │                        │
                                   │                        │
                              background.js            panel.js
                                   │                        │
                                   │  runtime.sendMessage   │
                                   │<───────────────────────┤
                                   │                        │
                                   │  Event stored          │
                                   │  + forwarded           │
                                   ├───────────────────────>│
                                   │                        │
                                   │                   Display event
```

### 2. Network Request Monitoring

```
Page                         Browser Network           background.js
 │                                 │                         │
 │  Analytics Request              │                         │
 ├────────────────────────────────>│                         │
 │                                 │                         │
 │                                 │  webRequest.onBefore    │
 │                                 ├────────────────────────>│
 │                                 │                         │
 │                                 │                    Store request
 │                                 │                    Correlate with
 │                                 │                    recent event
 │                                 │                         │
 │                                 │  webRequest.onComplete  │
 │                                 ├────────────────────────>│
 │                                 │                         │
 │                                 │                    Update status
 │                                 │                    Notify panel
```

### 3. User Interaction Flow

```
User Action              panel.js              Storage/Background
    │                        │                         │
    │  Click event           │                         │
    ├───────────────────────>│                         │
    │                        │                         │
    │                   Render details                 │
    │                   Highlight event                │
    │                        │                         │
    │  Drag divider          │                         │
    ├───────────────────────>│                         │
    │                        │                         │
    │                   Resize columns                 │
    │                        │  Save to localStorage   │
    │                        ├────────────────────────>│
    │                        │                         │
    │  Click "Clear All"     │                         │
    ├───────────────────────>│                         │
    │                        │                         │
    │                   Clear UI                       │
    │                        │  Clear session storage  │
    │                        ├────────────────────────>│
    │                        │  Clear background data  │
    │                        ├────────────────────────>│
```

---

## UI Layout

### Panel Structure

```
┌──────────────────────────────────────────────────────────────────┐
│                         Toolbar                                  │
│  ┌─────────────────┐  ┌───────────┐ ┌──────────┐ ┌──────────┐  │
│  │ GTM: Inactive ● │  │ GA4 Debug │ │ Persist  │ │ Clear All│  │
│  └─────────────────┘  └───────────┘ └──────────┘ └──────────┘  │
└──────────────────────────────────────────────────────────────────┘
│                                                                  │
│  ┌─────────────────────┬─┬──────────────────────────────────┐  │
│  │   Events Panel      │ │      Details Panel               │  │
│  │   (Left 30%)        │D│      (Right 70%)                 │  │
│  │                     │i│                                   │  │
│  │ ┌─────────────────┐ │v│  ┌────────────────────────────┐  │  │
│  │ │ Events (5)      │ │i│  │ Event Details              │  │  │
│  │ └─────────────────┘ │d│  │ ┌──┐ ┌──┐ ┌──┐            │  │  │
│  │                     │e│  │ │📋│ │⬇│ │⬆│            │  │  │
│  │ ┌─────────────────┐ │r│  │ └──┘ └──┘ └──┘            │  │  │
│  │ │#0  page_view    │ │ │  └────────────────────────────┘  │  │
│  │ │    12:34:56.789 │ │ │                                   │  │
│  │ │    example.com  │ │ │  ┌────────────────────────────┐  │  │
│  │ └─────────────────┘ │ │  │ {                          │  │  │
│  │                     │ │  │   "event": "page_view",    │  │  │
│  │ ┌─────────────────┐ │ │  │   "page_title": "Demo",    │  │  │
│  │ │#1  purchase  🟢│ │ │  │   "page_location": "...",  │  │  │
│  │ │    12:34:57.123 │ │ │  │   "measurement_id": "..."  │  │  │
│  │ │    example.com  │ │ │  │ }                          │  │  │
│  │ └─────────────────┘ │ │  │                            │  │  │
│  │                     │ │  │ Network Request            │  │  │
│  │ ┌─────────────────┐ │ │  │ Type: GA4                  │  │  │
│  │ │#2  user_data    │ │ │  │ Status: completed          │  │  │
│  │ │    12:34:58.456 │ │ │  │ URL: google-analytics...   │  │  │
│  │ │    example.com  │ │ │  └────────────────────────────┘  │  │
│  │ └─────────────────┘ │ │                                   │  │
│  │                     │ │                                   │  │
│  │ ┌─────────────────┐ │ │                                   │  │
│  │ │🔄 Navigation    │ │ │                                   │  │
│  │ │    12:35:00.000 │ │ │                                   │  │
│  │ │    /page2       │ │ │                                   │  │
│  │ └─────────────────┘ │ │                                   │  │
│  │                     │ │                                   │  │
│  │ ┌─────────────────┐ │ │                                   │  │
│  │ │#3  gtm.js       │ │ │                                   │  │
│  │ │    12:35:01.234 │ │ │                                   │  │
│  │ │    /page2       │ │ │                                   │  │
│  │ └─────────────────┘ │ │                                   │  │
│  │                     │ │                                   │  │
│  └─────────────────────┴─┴──────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────────┘
```

### Toolbar Components

```
┌────────────────────────────────────────────────────────────────┐
│  Left Side                          Right Side                 │
│  ┌─────────────────────────┐  ┌──────────────────────────────┐│
│  │ GTM Preview Status      │  │ Action Buttons                ││
│  │ ● GTM Preview: Active   │  │ [📊 GA4]  [💾 Persist]  [🗑]││
│  │   (GTM-DEMO123)         │  │                               ││
│  └─────────────────────────┘  └──────────────────────────────┘│
└────────────────────────────────────────────────────────────────┘
```

### Event Item Structure

```
┌────────────────────────────────────┐
│ #0  page_view               GA4 🟢│  ← Header (name + badge)
│ 12:34:56.789               #0     │  ← Metadata (time + index)
│ https://example.com/page          │  ← URL
└────────────────────────────────────┘
  ↑
  Blue border when selected
```

### JSON Syntax Highlighting

```
{                                    ← Gray bracket
  "event": "purchase",              ← Purple key, blue string
  "value": 99.99,                   ← Purple key, green number
  "completed": true,                ← Purple key, dark blue boolean
  "metadata": null,                 ← Purple key, purple null
  "ecommerce": {                    ← Purple key, gray bracket
    ▼ "items": [                    ← Collapsible (▼/▶)
        {
          "id": "SKU123",
          "quantity": 1
        }
      ]
  }
}
```

---

## Storage Architecture

### localStorage (Persistent)
```javascript
{
  "columnWidth": 35,              // Percentage (15-70)
  "persistEnabled": true          // Boolean
}
```

### chrome.storage.sync (Persistent, Synced)
```javascript
{
  "ga4PropertyId": "G-XXXXXXXXXX"  // String or numeric
}
```

### chrome.storage.session (Session-only)
```javascript
{
  "persistedEvents": [              // Array of event objects
    {
      "index": 0,
      "timestamp": 1234567890000,
      "url": "https://example.com",
      "data": { /* event data */ },
      "gtmPreview": { /* preview info */ },
      "ga4PropertyId": "G-XXXXX"
    },
    // ... more events
  ]
}
```

### Background Script Memory (Tab-specific)
```javascript
Map<TabId, Array<EventData>>
Map<RequestId, NetworkRequestInfo>
```

---

## Message Passing Protocol

### Message Types

#### From Page to Extension

**DATALAYER_EVENT**
```javascript
{
  type: 'DATALAYER_EVENT',
  data: {
    index: 0,
    timestamp: 1234567890000,
    url: 'https://example.com',
    data: { /* original event data */ },
    gtmPreview: {
      active: true,
      containerIds: ['GTM-XXXXX']
    },
    ga4PropertyId: 'G-XXXXX'
  }
}
```

#### From Background to Panel

**NETWORK_REQUEST**
```javascript
{
  type: 'NETWORK_REQUEST',
  data: {
    requestId: 'req_123',
    url: 'https://google-analytics.com/...',
    method: 'POST',
    timestamp: 1234567890000,
    tabId: 123,
    status: 'pending',
    type: 'GA4'
  }
}
```

**NETWORK_REQUEST_COMPLETED**
```javascript
{
  type: 'NETWORK_REQUEST_COMPLETED',
  data: {
    requestId: 'req_123',
    status: 'completed',
    statusCode: 200
  }
}
```

**NETWORK_REQUEST_FAILED**
```javascript
{
  type: 'NETWORK_REQUEST_FAILED',
  data: {
    requestId: 'req_123',
    status: 'failed',
    error: 'net::ERR_CONNECTION_REFUSED'
  }
}
```

#### From Panel to Background

**GET_TAB_DATA**
```javascript
{
  type: 'GET_TAB_DATA',
  tabId: 123
}
// Response: { data: Array<EventData> }
```

**CLEAR_TAB_DATA**
```javascript
{
  type: 'CLEAR_TAB_DATA',
  tabId: 123
}
// Response: { success: true }
```

---

## Security Model

### Content Security Policy
- No inline scripts in HTML
- All JavaScript in separate files
- No eval() or similar dynamic code execution
- No external script loading

### Permissions Usage

**storage**: 
- localStorage for UI preferences
- chrome.storage.sync for GA4 property ID
- chrome.storage.session for event persistence

**webRequest**:
- Monitor network requests to analytics endpoints
- Read-only access to request metadata
- No modification of requests

**tabs**:
- Get current tab information
- No modification of tab content
- No creation/closing of tabs (except GA4 link)

**host_permissions**:
- Required for content script injection
- Required for webRequest monitoring
- Applied to all URLs to capture all analytics requests

### Isolation

- **Page Context**: injected.js has full page access
- **Content Script**: content.js is isolated from page
- **Background**: background.js has limited access
- **DevTools**: panel.js is isolated in DevTools context

### Data Flow Security

```
Page (Untrusted)
    │
    │ postMessage (safe)
    ▼
Content Script (Sandboxed)
    │
    │ chrome.runtime.sendMessage (safe)
    ▼
Background (Privileged)
    │
    │ chrome.runtime.sendMessage (safe)
    ▼
DevTools Panel (Privileged)
    │
    │ Render with sanitization
    ▼
Display
```

---

## Performance Considerations

### Memory Management
- Events stored per-tab (isolated)
- Session storage limits (~10MB)
- Old events may be pruned if limit reached
- Background script uses Map for O(1) lookups

### CPU Optimization
- JSON highlighting is lazy (on-demand)
- List virtualization not implemented (consider for >1000 events)
- Debouncing on resize operations
- Event delegation for click handlers

### Network Monitoring
- Filters applied at webRequest level
- Only analytics domains monitored
- Minimal overhead (<1ms per request)

---

## Extension Lifecycle

### Installation
1. Manifest loaded by Chrome
2. Background service worker registered
3. Content script registered for injection
4. Icons and resources cached

### Page Load
1. Content script injected into page
2. Content script injects injected.js
3. injected.js starts monitoring dataLayer
4. Existing events captured and sent

### DevTools Open
1. devtools.js executed
2. "DataLayer" panel created
3. panel.html loaded
4. panel.js initializes
5. Requests existing events from background
6. Connects message listener

### Page Navigation (Persist ON)
1. Navigation detected via chrome.devtools.network.onNavigated
2. Navigation marker added to events
3. Events persist in session storage
4. New page events append to list

### Page Navigation (Persist OFF)
1. Navigation detected
2. Events cleared from display
3. Session storage cleared
4. Fresh start on new page

### DevTools Close
1. Panel unloaded
2. Message listeners removed
3. Events remain in background (for potential reopen)

### Tab Close
1. Background detects tab close
2. Tab-specific data removed from Maps
3. Memory freed

---

## Error Handling

### Network Errors
- Failed requests shown with red badge
- Error message displayed in details
- Extension continues functioning

### Data Errors
- Invalid JSON handled gracefully
- Null/undefined displayed correctly
- Circular references handled (if possible)

### Storage Errors
- Quota exceeded: oldest events pruned
- Storage API failure: defaults used
- Sync conflict: last write wins

### Communication Errors
- Message send failure: silently ignored (DevTools may be closed)
- Port disconnect: reconnect attempted
- Timeout: operation cancelled

---

## Testing Strategy

### Unit Testing
- Individual functions tested
- Mock Chrome APIs
- Test data sanitization
- Test JSON highlighting

### Integration Testing
- Test message passing
- Test storage operations
- Test network monitoring
- Test UI interactions

### End-to-End Testing
- Test on demo page
- Test on real websites
- Test with GTM preview
- Test across navigation

### Performance Testing
- Memory profiling
- CPU profiling
- Large event lists (100+)
- Rapid event firing

---

## Future Architecture Considerations

### Potential Enhancements

1. **Worker Thread for JSON Processing**
   - Move syntax highlighting to worker
   - Keep UI thread responsive

2. **Virtual Scrolling**
   - Render only visible events
   - Support 1000+ events efficiently

3. **IndexedDB Storage**
   - Store more events
   - Faster queries
   - Better performance

4. **WebSocket for Real-time Sync**
   - Sync across multiple DevTools instances
   - Share state between developers

5. **Service Worker Persistence**
   - Keep background script alive longer
   - Reduce startup latency

---

## Debugging the Extension

### Chrome DevTools for DevTools
1. Right-click extension icon
2. Select "Inspect popup" or "Inspect background page"
3. Open console for logs

### Background Script Logs
- Open chrome://extensions/
- Click "background page" under extension
- View console logs

### Content Script Logs
- Open page DevTools (separate from extension)
- Console shows content script logs

### Panel Logs
- Open panel DevTools (right-click in panel)
- Select "Inspect"
- View console for panel.js logs

---

## Maintenance Guidelines

### Code Style
- Use ES6+ features
- Descriptive variable names
- Comments for complex logic
- Consistent indentation (2 spaces)

### Version Control
- Semantic versioning (MAJOR.MINOR.PATCH)
- Meaningful commit messages
- Feature branches
- Pull request reviews

### Documentation
- Update README for user-facing changes
- Update ARCHITECTURE for technical changes
- Update FEATURES for new features
- Update TESTING for new test cases

### Security
- Run CodeQL on all changes
- Review all user inputs
- Sanitize all outputs
- Follow least privilege principle
