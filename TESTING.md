# Testing Checklist for DataLayer Visualizer

This document provides a comprehensive testing checklist for verifying all features of the DataLayer Visualizer extension.

## Prerequisites
- [ ] Chrome browser installed (version 88+)
- [ ] Extension loaded in Chrome via chrome://extensions/
- [ ] Demo page (demo.html) accessible
- [ ] Access to a website with GTM/GA4 for real-world testing

---

## Installation Testing

### Loading the Extension
- [ ] Can load extension in Developer Mode
- [ ] No errors in chrome://extensions/
- [ ] Extension icon appears in the list
- [ ] Version number displays correctly (1.0.0)

### DevTools Integration
- [ ] "DataLayer" tab appears in Chrome DevTools
- [ ] Tab is visible at the top level (not hidden)
- [ ] Panel loads without errors
- [ ] Panel layout renders correctly

---

## Feature Testing

### 1. Syntax Highlighting

**Test on demo.html:**
- [ ] Open demo.html in Chrome
- [ ] Open DevTools → DataLayer tab
- [ ] Click "Push Purchase Event"
- [ ] Select the purchase event from the list

**Verify:**
- [ ] Property names (keys) are displayed in purple
- [ ] String values are displayed in blue
- [ ] Number values are displayed in green
- [ ] Boolean values are displayed in dark blue
- [ ] Null values are displayed in purple/italic
- [ ] Brackets and braces are displayed in gray
- [ ] Indentation is correct for nested objects

**Collapsible Objects:**
- [ ] Click ▼ next to an object - it collapses to ▶
- [ ] Click ▶ next to a collapsed object - it expands to ▼
- [ ] Nested objects collapse independently
- [ ] Arrays can be collapsed and expanded
- [ ] Click "Expand All" button - all nodes expand
- [ ] Click "Collapse All" button - all nodes collapse

---

### 2. Column View Layout

**Left Column (Events List):**
- [ ] Events appear in chronological order
- [ ] Event name is displayed clearly (e.g., "page_view", "purchase")
- [ ] Timestamp shows HH:MM:SS.mmm format
- [ ] Index number (#0, #1, #2...) is visible
- [ ] URL is displayed (truncated if long)
- [ ] List is scrollable when many events exist

**Right Column (Event Details):**
- [ ] Shows placeholder text when no event selected
- [ ] Displays full event JSON when event is selected
- [ ] Details update immediately when selecting different events
- [ ] Content is scrollable for large events

**Selection:**
- [ ] Clicking an event in the list selects it
- [ ] Selected event has blue highlight
- [ ] Selected event has blue left border
- [ ] Previously selected event is deselected
- [ ] Selection persists when scrolling the list

**Event Counter:**
- [ ] Event count in header updates correctly
- [ ] Count shows 0 initially
- [ ] Count increments with each new event
- [ ] Count resets to 0 after "Clear All"

---

### 3. Resizable Columns

**Initial State:**
- [ ] Default split is approximately 30% / 70%
- [ ] Divider is visible between columns
- [ ] Divider has a distinct appearance

**Resizing:**
- [ ] Hover over divider - cursor changes to ↔
- [ ] Divider highlights on hover
- [ ] Can drag divider left to make events panel smaller
- [ ] Can drag divider right to make events panel larger
- [ ] Minimum width is enforced (15%)
- [ ] Maximum width is enforced (70%)
- [ ] Columns resize smoothly during drag

**Persistence:**
- [ ] Resize columns to 40%
- [ ] Refresh the page (F5)
- [ ] Column width is preserved at 40%
- [ ] Open DevTools in a different tab
- [ ] Column width matches the saved preference

---

### 4. GTM Preview Mode Detection

**Without GTM Preview:**
- [ ] Status indicator shows gray dot
- [ ] Text reads "GTM Preview: Inactive"

**Test on demo.html (simulated):**
- [ ] Open demo.html
- [ ] GTM status might show as inactive (demo has limited simulation)

**Test on Real GTM Site:**
- [ ] Navigate to a site with GTM
- [ ] Enable GTM Preview mode
- [ ] Open DevTools → DataLayer tab

**Verify Active State:**
- [ ] Status indicator shows green dot
- [ ] Green dot has pulsing animation
- [ ] Text reads "GTM Preview: Active"
- [ ] Container ID(s) are displayed (e.g., "GTM-XXXXX")
- [ ] Multiple container IDs shown if multiple containers exist

**Detection Methods:**
- [ ] Detects via `__TAG_ASSISTANT_API`
- [ ] Detects via `__TAG_ASSISTANT` cookie
- [ ] Detects via `google_tag_manager` object

---

### 5. GA4 DebugView Link

**No Property ID Configured:**
- [ ] Click "📊 GA4 DebugView" button
- [ ] Settings modal opens
- [ ] Modal has input field for Property ID
- [ ] Modal has Save and Cancel buttons

**Configure Property ID:**
- [ ] Enter a test property ID (e.g., "123456789")
- [ ] Click Save
- [ ] Modal closes
- [ ] Setting is saved

**With Property ID:**
- [ ] Click "📊 GA4 DebugView" button
- [ ] New tab opens
- [ ] URL is https://analytics.google.com/analytics/web/#/p{ID}/debugview
- [ ] Property ID in URL matches configured ID

**Auto-Detection:**
- [ ] Push an event with measurement_id: "G-XXXXXXXX"
- [ ] Property ID is detected from the event
- [ ] Click button - opens with detected ID

**Right-Click Settings:**
- [ ] Right-click "📊 GA4 DebugView" button
- [ ] Settings modal opens
- [ ] Previously saved ID is pre-filled
- [ ] Can update and save new ID

---

### 6. Network Request Correlation

**Setup:**
- [ ] Open a website with GA4 or GTM
- [ ] Open DevTools → DataLayer tab
- [ ] Trigger an event that sends analytics requests

**Visual Indicators:**
- [ ] Events with network requests show badges
- [ ] GA4 badge appears for GA4 requests
- [ ] UA badge appears for Universal Analytics requests
- [ ] GTM badge appears for GTM requests

**Badge Colors:**
- [ ] Green badge for completed requests
- [ ] Yellow badge for pending requests
- [ ] Red badge for failed requests

**Request Details:**
- [ ] Select an event with a network request
- [ ] Network details section appears below JSON
- [ ] Shows request type (GA4/UA/GTM)
- [ ] Shows status (pending/completed/failed)
- [ ] Shows full URL
- [ ] Shows status code (for completed)
- [ ] Shows error message (for failed)

**URL Validation:**
- [ ] Only Google Analytics/GTM domains are monitored
- [ ] google-analytics.com requests are captured
- [ ] analytics.google.com requests are captured
- [ ] googletagmanager.com requests are captured
- [ ] Other domains are ignored

---

### 7. Persist Across Navigation

**Persistence Toggle:**
- [ ] Toggle button displays 💾 when enabled
- [ ] Toggle button is blue when enabled
- [ ] Toggle button displays 📋 when disabled
- [ ] Toggle button is gray when disabled
- [ ] Click toggles between enabled/disabled
- [ ] Preference is saved across sessions

**With Persistence Enabled:**
- [ ] Push several events on demo.html
- [ ] Navigate to another page (e.g., google.com)
- [ ] Navigation marker appears: "🔄 Navigation"
- [ ] Marker shows new URL
- [ ] Marker shows timestamp
- [ ] Previous events are still visible
- [ ] New events appear after marker
- [ ] Each event shows its original URL

**With Persistence Disabled:**
- [ ] Disable persistence toggle
- [ ] Push several events
- [ ] Navigate to another page
- [ ] All events are cleared
- [ ] Fresh event list on new page

**Navigation Markers:**
- [ ] Marker has yellow background
- [ ] Marker has red left border
- [ ] Marker is not selectable (no details view)
- [ ] Marker doesn't count as regular event
- [ ] Multiple markers appear for multiple navigations

**URL Display:**
- [ ] Each event shows full URL (if short)
- [ ] Long URLs are truncated with "..."
- [ ] Hover shows full URL in title attribute (if implemented)
- [ ] Different pages show different URLs correctly

---

### 8. Clear All Functionality

**Clear Button:**
- [ ] "🗑️ Clear All" button is visible in toolbar
- [ ] Button is in danger/red color scheme
- [ ] Button is clickable

**Clearing Events:**
- [ ] Push several events
- [ ] Click "Clear All"
- [ ] All events are removed from list
- [ ] Event count shows 0
- [ ] Details panel shows placeholder
- [ ] Selected event is cleared
- [ ] Placeholder text appears: "👈 Select an event to view details"

**Storage Cleared:**
- [ ] Session storage is cleared
- [ ] Background script data is cleared
- [ ] Preferences (column width) are NOT cleared
- [ ] GA4 property ID is NOT cleared

---

### 9. Copy JSON Functionality

**Copy Button:**
- [ ] Copy button (📋) is visible when event is selected
- [ ] Button is in the details panel header

**Copying:**
- [ ] Select an event
- [ ] Click copy button
- [ ] Button changes to ✅ briefly
- [ ] Button reverts to 📋 after ~1 second
- [ ] Paste clipboard content
- [ ] Pasted content is valid JSON
- [ ] Pasted content matches the event data
- [ ] Pretty-printed with 2-space indentation

---

### 10. Multi-Event Testing

**Rapid Events:**
- [ ] Click "Trigger Multiple Events" on demo.html
- [ ] All events appear in order
- [ ] No events are lost
- [ ] Timestamps are sequential
- [ ] Indices are sequential (#0, #1, #2...)

**Various Event Types:**
- [ ] Push page_view event
- [ ] Push purchase event with ecommerce object
- [ ] Push user_data event with nested properties
- [ ] Push custom event with metadata
- [ ] Push gtm.js event
- [ ] All event types render correctly
- [ ] All event types can be selected
- [ ] All event types show proper syntax highlighting

**Large Events:**
- [ ] Push an event with deeply nested objects (5+ levels)
- [ ] Event renders without errors
- [ ] All levels are collapsible
- [ ] Scrolling works in details panel
- [ ] Performance is acceptable

**Many Events:**
- [ ] Generate 50+ events rapidly
- [ ] All events appear in the list
- [ ] List is scrollable
- [ ] Selection still works
- [ ] No significant performance degradation
- [ ] Event counter shows correct count

---

## Error Handling Testing

### Invalid Data:
- [ ] Push `dataLayer.push(null)` - handles gracefully
- [ ] Push `dataLayer.push(undefined)` - handles gracefully
- [ ] Push `dataLayer.push("string")` - displays correctly
- [ ] Push `dataLayer.push(123)` - displays correctly
- [ ] Push circular reference - handles without crash (if possible)

### Edge Cases:
- [ ] Open DevTools on a page with no dataLayer - no errors
- [ ] Close and reopen DevTools - state is maintained
- [ ] Resize browser window - layout adjusts
- [ ] Minimize and restore DevTools - layout is correct
- [ ] Undock DevTools - extension works normally
- [ ] Dock DevTools - extension works normally

### Network Issues:
- [ ] Block analytics domains in network tab
- [ ] Push events - they appear but without network badges
- [ ] Unblock domains - future events show network badges

---

## Browser Compatibility

### Chrome:
- [ ] Works on Chrome 88+
- [ ] Works on latest Chrome version
- [ ] Works on Chrome Beta
- [ ] Works on Chrome Canary (if available)

### Chromium-based:
- [ ] Works on Microsoft Edge (Chromium)
- [ ] Works on Brave (if Manifest V3 supported)
- [ ] Works on Opera (if Manifest V3 supported)

---

## Performance Testing

### CPU Usage:
- [ ] Monitor CPU while extension is active
- [ ] CPU usage is minimal when idle
- [ ] CPU spikes briefly when processing events
- [ ] No continuous high CPU usage

### Memory:
- [ ] Monitor memory in Task Manager (Shift+Esc in Chrome)
- [ ] Extension memory usage is reasonable (<50MB typical)
- [ ] Memory doesn't continuously grow
- [ ] No memory leaks over extended use

### Responsiveness:
- [ ] UI remains responsive with 100+ events
- [ ] Selecting events is instantaneous
- [ ] Scrolling is smooth
- [ ] Resizing columns is smooth
- [ ] No UI freezes or hangs

---

## Security Testing

### Permissions:
- [ ] Extension requests appropriate permissions only
- [ ] Manifest permissions match actual usage
- [ ] No unnecessary host_permissions

### Data Privacy:
- [ ] No data sent to external servers
- [ ] All processing is local
- [ ] No tracking or analytics in the extension itself

### Content Security:
- [ ] Runs CodeQL scan successfully (0 alerts)
- [ ] URL validation prevents injection
- [ ] No XSS vulnerabilities
- [ ] No CSRF vulnerabilities

---

## Usability Testing

### First-Time User:
- [ ] Extension purpose is clear
- [ ] UI is intuitive
- [ ] Features are discoverable
- [ ] Buttons have clear labels
- [ ] Icons are meaningful

### Documentation:
- [ ] README.md is comprehensive
- [ ] INSTALLATION.md is clear
- [ ] FEATURES.md explains all features
- [ ] Demo page works as expected

### Visual Design:
- [ ] Colors are readable
- [ ] Contrast is sufficient
- [ ] Layout is logical
- [ ] Spacing is appropriate
- [ ] Fonts are clear

---

## Regression Testing

After any code changes, verify:
- [ ] All existing features still work
- [ ] No new console errors
- [ ] Performance hasn't degraded
- [ ] UI hasn't broken
- [ ] Settings are preserved

---

## Sign-Off

**Tester Name:** _________________

**Date:** _________________

**Chrome Version:** _________________

**Extension Version:** _________________

**Overall Assessment:** 
- [ ] All critical features working
- [ ] No blocking issues found
- [ ] Ready for release
- [ ] Needs fixes (list below)

**Issues Found:**
1. 
2. 
3. 

**Notes:**
