# Visual Examples

This document describes what users will see when using the DataLayer Visualiser extension.

## 1. Extension in Chrome Extensions Page

When loaded in `chrome://extensions/`:

```
╔════════════════════════════════════════════════════════════╗
║ Extensions                                    Developer mode║
╠════════════════════════════════════════════════════════════╣
║                                                             ║
║  ┌──┐  DataLayer Visualiser                      1.0.0    ║
║  │DL│  Visualize and monitor window.dataLayer in real-time║
║  └──┘                                                       ║
║       ID: [unique-extension-id]                            ║
║       ☑ Enabled                                            ║
║       [Details] [Remove]                                   ║
║                                                             ║
╚════════════════════════════════════════════════════════════╝
```

**What to see:**
- Blue icon with "DL" text
- Extension name and version
- Description text
- Enabled status
- No error messages

---

## 2. DevTools Panel Tab

When DevTools is open (`F12`):

```
╔════════════════════════════════════════════════════════════════╗
║ Elements Console Sources Network Performance ... ▶ DataLayer  ║
╠════════════════════════════════════════════════════════════════╣
║                                                                 ║
║  [Panel content appears here]                                  ║
║                                                                 ║
╚════════════════════════════════════════════════════════════════╝
```

**What to see:**
- "DataLayer" tab appears in the main tab bar
- Tab is clickable and opens the panel
- Icon appears next to tab name (if visible)

---

## 3. Empty State (No Events)

When panel is first opened with no dataLayer events:

```
╔════════════════════════════════════════════════════════════════╗
║ DataLayer Monitor                    Events: 0  ☑ Auto-scroll ║
║ Real-time monitoring of window.dataLayer         [Clear History]
╠════════════════════════════════════════════════════════════════╣
║                                                                 ║
║                         ┌─────────┐                            ║
║                         │  📊    │                             ║
║                         └─────────┘                            ║
║                                                                 ║
║              No dataLayer events captured yet                  ║
║           Waiting for dataLayer.push() calls...                ║
║                                                                 ║
╚════════════════════════════════════════════════════════════════╝
```

**What to see:**
- Clean header with controls
- Event counter showing "0"
- Checked auto-scroll checkbox
- Red "Clear History" button
- Centered placeholder with icon
- Helpful message text

---

## 4. Single Event Display

After first dataLayer push:

```
╔════════════════════════════════════════════════════════════════╗
║ DataLayer Monitor                    Events: 1  ☑ Auto-scroll ║
║ Real-time monitoring of window.dataLayer         [Clear History]
╠════════════════════════════════════════════════════════════════╣
║                                                                 ║
║  ┌──────────────────────────────────────────────────────────┐ ║
║  │ │ Event #1              14:32:15.789      [Collapse]     │ ║
║  │ ├────────────────────────────────────────────────────────┤ ║
║  │ │ {                                                       │ ║
║  │ │   "event": "page_view",                                │ ║
║  │ │   "page_path": "/home",                                │ ║
║  │ │   "page_title": "Home Page"                            │ ║
║  │ │ }                                                       │ ║
║  │ └────────────────────────────────────────────────────────┘ ║
║                                                                 ║
╚════════════════════════════════════════════════════════════════╝
```

**What to see:**
- Event counter now shows "1"
- White card with blue left border
- Event number badge in blue
- Timestamp in gray monospace font
- "Collapse" button in blue
- JSON with syntax highlighting:
  - Keys in blue
  - String values in green
- Proper indentation

---

## 5. Multiple Events with Highlight

When a new event is pushed (shows highlight animation):

```
╔════════════════════════════════════════════════════════════════╗
║ DataLayer Monitor                    Events: 3  ☑ Auto-scroll ║
║ Real-time monitoring of window.dataLayer         [Clear History]
╠════════════════════════════════════════════════════════════════╣
║                                                                 ║
║  ┌──────────────────────────────────────────────────────────┐ ║
║  │ │ Event #1              14:32:15.789      [Collapse]     │ ║
║  │ │ {...}                                                   │ ║
║  └──────────────────────────────────────────────────────────┘ ║
║                                                                 ║
║  ┌──────────────────────────────────────────────────────────┐ ║
║  │ │ Event #2              14:32:18.456      [Collapse]     │ ║
║  │ │ {...}                                                   │ ║
║  └──────────────────────────────────────────────────────────┘ ║
║                                                                 ║
║  ┌──────────────────────────────────────────────────────────┐ ║
║  │ │ Event #3 ✨           14:32:20.123      [Collapse]     │ ║
║  │ │ {                                       ← HIGHLIGHTED   │ ║
║  │ │   "event": "button_click",              ← (Yellow bg)  │ ║
║  │ │   "button_name": "Subscribe"                           │ ║
║  │ │ }                                                       │ ║
║  └──────────────────────────────────────────────────────────┘ ║
║                                                                 ║
╚════════════════════════════════════════════════════════════════╝
```

**What to see:**
- Event counter shows "3"
- Older events remain visible
- Newest event (#3) has:
  - Yellow/cream background (fades to white over 2 seconds)
  - Fade-in animation
  - Slide-down effect
- Auto-scroll has moved to show new event

---

## 6. Collapsed Event

When "Collapse" button is clicked:

```
╔════════════════════════════════════════════════════════════════╗
║                                                                 ║
║  ┌──────────────────────────────────────────────────────────┐ ║
║  │ │ Event #1              14:32:15.789      [Expand]       │ ║
║  └──────────────────────────────────────────────────────────┘ ║
║                                                                 ║
╚════════════════════════════════════════════════════════════════╝
```

**What to see:**
- Event card is much smaller (no JSON visible)
- Button text changed to "Expand"
- Event number and timestamp still visible
- Takes less space for easier browsing

---

## 7. Complex Nested Data

E-commerce event with nested objects and arrays:

```
╔════════════════════════════════════════════════════════════════╗
║  ┌──────────────────────────────────────────────────────────┐ ║
║  │ │ Event #5              14:35:42.987      [Collapse]     │ ║
║  │ ├────────────────────────────────────────────────────────┤ ║
║  │ │ {                                                       │ ║
║  │ │   "event": "purchase",                                 │ ║
║  │ │   "ecommerce": {                                       │ ║
║  │ │     "transaction_id": "T12345",                        │ ║
║  │ │     "value": 99.99,                                    │ ║
║  │ │     "currency": "USD",                                 │ ║
║  │ │     "items": [                                         │ ║
║  │ │       {                                                │ ║
║  │ │         "item_id": "SKU001",                           │ ║
║  │ │         "item_name": "Blue Widget",                    │ ║
║  │ │         "price": 49.99,                                │ ║
║  │ │         "quantity": 2                                  │ ║
║  │ │       }                                                │ ║
║  │ │     ]                                                  │ ║
║  │ │   }                                                    │ ║
║  │ │ }                                                      │ ║
║  └──────────────────────────────────────────────────────────┘ ║
╚════════════════════════════════════════════════════════════════╝
```

**What to see:**
- Nested objects properly indented
- Arrays displayed with [ ]
- Numbers shown without quotes (in red)
- Strings shown in quotes (in green)
- Keys always in blue
- Clear hierarchy with indentation

---

## 8. Syntax Highlighting Colors

Different data types with their colors:

```
{
  "string_key": "string_value"      ← Blue key, Green value
  "number_key": 42                  ← Blue key, Red value
  "boolean_key": true               ← Blue key, Purple value
  "null_key": null                  ← Blue key, Gray value
  "object_key": {                   ← Blue key, nested object
    "nested": "value"
  }
  "array_key": [                    ← Blue key, array
    "item1",
    "item2"
  ]
}
```

**Color Legend:**
- **Keys**: Blue (#0369a1)
- **Strings**: Green (#16a34a)
- **Numbers**: Red (#dc2626)
- **Booleans**: Purple (#9333ea)
- **Null**: Gray (#6b7280)

---

## 9. Header Controls in Action

### Auto-scroll Enabled (Default)
```
Events: 5  ☑ Auto-scroll  [Clear History]
           ^
           Checked - panel scrolls to new events
```

### Auto-scroll Disabled
```
Events: 5  ☐ Auto-scroll  [Clear History]
           ^
           Unchecked - panel stays at current position
```

### After Clear History
```
Events: 0  ☑ Auto-scroll  [Clear History]
^
Counter reset, panel shows empty state again
```

---

## 10. Test Page in Action

Using the test HTML file:

```
╔════════════════════════════════════════════════════════════════╗
║ 🧪 DataLayer Visualiser Test Page                             ║
╠════════════════════════════════════════════════════════════════╣
║                                                                 ║
║ Instructions:                                                   ║
║ 1. Open Chrome DevTools (F12)                                  ║
║ 2. Navigate to the "DataLayer" tab                             ║
║ 3. Click buttons below to trigger events                       ║
║                                                                 ║
║ Test Buttons:                                                   ║
║ [Simple Event] [Complex Event] [Form Submit]                   ║
║ [Array Test] [Nested Event] [Rapid Fire]                      ║
║                                                                 ║
║ ↓ DevTools Panel Below ↓                                       ║
║                                                                 ║
╠════════════════════════════════════════════════════════════════╣
║ DataLayer Monitor                   Events: 12  ☑ Auto-scroll ║
║ [Shows captured events in real-time as buttons are clicked]   ║
╚════════════════════════════════════════════════════════════════╝
```

**What to see:**
- Test page in browser viewport
- DevTools open below or on side
- Clicking buttons instantly shows events
- Counter increments with each click
- New events highlighted as they appear

---

## Tips for Screenshots

If creating actual screenshots:

1. **Loading Extension**: Show chrome://extensions/ with extension installed
2. **DevTools Tab**: Show the DataLayer tab among other DevTools tabs
3. **Empty State**: Capture when no events are present
4. **First Event**: Show single event with full JSON visible
5. **Multiple Events**: Show 3-5 events with variety of data
6. **Highlight Animation**: Capture during yellow highlight (tricky!)
7. **Collapsed View**: Show mix of expanded and collapsed events
8. **Complex Data**: Show e-commerce or nested object example
9. **Color Coding**: Zoom in to show syntax highlighting clearly
10. **Test Page**: Split screen showing test page + DevTools panel

---

## User Experience Flow

1. **Install** → See extension in chrome://extensions/
2. **Navigate** → Go to any website
3. **Open DevTools** → Press F12
4. **Find Panel** → Click "DataLayer" tab
5. **See Events** → View existing dataLayer items
6. **Interact** → Click buttons, submit forms on page
7. **Watch Live** → See new events appear with highlights
8. **Explore** → Collapse/expand, scroll through history
9. **Clean Up** → Click "Clear History" when done
10. **Continue** → Navigate to new pages, repeat

---

## Common Scenarios

### Scenario 1: GTM Debugging
- Open page with GTM
- See GTM initialization events
- Trigger custom events
- Verify data structure matches spec

### Scenario 2: Analytics Testing
- Open test environment
- Perform user actions (clicks, scrolls)
- Verify correct events fire
- Check property values

### Scenario 3: QA Validation
- Open production page
- Verify expected events present
- Check timing and sequence
- Document any issues

---

This extension provides a clean, intuitive interface for monitoring dataLayer
activity in real-time, making it easy to debug Google Tag Manager and
analytics implementations.
