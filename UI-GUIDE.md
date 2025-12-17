# User Interface Guide

This guide describes the DataLayer Visualiser UI and its features.

## Panel Layout

```
╔═══════════════════════════════════════════════════════════════════════╗
║  DataLayer Monitor                      Events: 5  [ ] Auto-scroll    ║
║  Real-time monitoring of window.dataLayer pushes   [Clear History]    ║
╠═══════════════════════════════════════════════════════════════════════╣
║                                                                        ║
║  ┌──────────────────────────────────────────────────────────────┐    ║
║  │ Event #1                        12:34:56.789    [Collapse]   │    ║
║  ├──────────────────────────────────────────────────────────────┤    ║
║  │ {                                                             │    ║
║  │   "event": "page_view",                                       │    ║
║  │   "page_path": "/home",                                       │    ║
║  │   "timestamp": "2024-01-15T12:34:56.789Z"                    │    ║
║  │ }                                                             │    ║
║  └──────────────────────────────────────────────────────────────┘    ║
║                                                                        ║
║  ┌──────────────────────────────────────────────────────────────┐    ║
║  │ Event #2 (NEW!)                 12:34:57.123    [Collapse]   │    ║
║  ├──────────────────────────────────────────────────────────────┤    ║
║  │ {                                                             │    ║
║  │   "event": "button_click",                                    │    ║
║  │   "button_name": "Subscribe"                                 │    ║
║  │ }                                                             │    ║
║  └──────────────────────────────────────────────────────────────┘    ║
║                                                                        ║
╚═══════════════════════════════════════════════════════════════════════╝
```

## UI Components

### 1. Header Section

**Location:** Top of the panel (sticky)

**Elements:**
- **Title:** "DataLayer Monitor"
- **Subtitle:** "Real-time monitoring of window.dataLayer pushes"
- **Event Counter:** Shows total number of captured events
- **Auto-scroll Checkbox:** Toggle automatic scrolling to new events
- **Clear History Button:** Red button to reset all captured events

**Styling:**
- White background with subtle shadow
- Rounded corners
- Sticky position (stays at top when scrolling)

### 2. Events List

**Location:** Main content area below header

**Empty State:**
When no events have been captured, shows:
- Bar chart icon (gray)
- "No dataLayer events captured yet"
- "Waiting for dataLayer.push() calls..."

**Event Cards:**
Each event is displayed in a card with:

**Card Header:**
- Event badge (blue, rounded): "Event #N"
- Timestamp (gray, monospace): "HH:MM:SS.mmm"
- Toggle button (blue): "Collapse" or "Expand"

**Card Body:**
- JSON payload with syntax highlighting
- Color-coded types:
  - Keys: Blue (#0369a1)
  - Strings: Green (#16a34a)
  - Numbers: Red (#dc2626)
  - Booleans: Purple (#9333ea)
  - Null: Gray (#6b7280)

**Card Styling:**
- White background
- Rounded corners
- Blue left border (4px)
- Subtle shadow
- Highlighted background (yellow tint) for 2 seconds when new

### 3. Animations

**New Event Animation:**
1. **Fade In:** Event appears with 0.3s fade-in animation
2. **Slide Down:** Slight downward movement (10px)
3. **Highlight:** Background briefly turns yellow (#fef3c7) for 2 seconds

**Smooth Transitions:**
- Button hover effects
- Collapse/expand transitions
- Auto-scroll smooth behavior

## Color Palette

### Background Colors
- Panel background: `#f8f9fa` (light gray)
- Card background: `#ffffff` (white)
- Code background: `#f3f4f6` (light gray)
- Highlight: `#fef3c7` (soft yellow)

### Text Colors
- Primary text: `#1f2937` (dark gray)
- Secondary text: `#6b7280` (medium gray)
- JSON key: `#0369a1` (blue)
- JSON string: `#16a34a` (green)
- JSON number: `#dc2626` (red)
- JSON boolean: `#9333ea` (purple)
- JSON null: `#6b7280` (gray)

### Accent Colors
- Primary blue: `#3B82F6` (buttons, badges)
- Hover blue: `#2563EB`
- Red: `#ef4444` (clear button)
- Red hover: `#dc2626`

## Interaction Patterns

### 1. Viewing Events

**Initial Load:**
- Panel opens showing all existing dataLayer items
- Events are numbered sequentially starting from #1

**Real-time Updates:**
- New events appear at the bottom (or top, depending on preference)
- Visual highlight draws attention to new events
- Auto-scroll moves viewport to show new event

### 2. Collapsing Events

**Purpose:** Save space when viewing many events

**Behavior:**
- Click "Collapse" button on any event
- JSON payload is hidden
- Button text changes to "Expand"
- Click again to expand

### 3. Auto-scroll Control

**Purpose:** Control whether panel scrolls to new events

**Enabled (default):**
- New events automatically scroll into view
- Smooth scrolling animation

**Disabled:**
- New events appear but viewport stays in place
- Useful when reviewing older events

### 4. Clear History

**Purpose:** Reset the event log

**Behavior:**
- Click red "Clear History" button
- All events are removed
- Counter resets to 0
- Empty state is shown
- Page dataLayer is NOT affected (only the display)

## Typography

**Font Families:**
- UI text: System font stack (-apple-system, BlinkMacSystemFont, etc.)
- Code/JSON: Monospace

**Font Sizes:**
- Title: 2xl (1.5rem)
- Subtitle: sm (0.875rem)
- Event badge: sm (0.875rem)
- Timestamp: xs (0.75rem)
- JSON code: sm (0.875rem)

**Font Weights:**
- Title: Bold (700)
- Event badge: Semibold (600)
- JSON keys: Medium (500)
- Regular text: Normal (400)

## Accessibility

- **Contrast:** All text meets WCAG AA standards
- **Interactive elements:** Clear focus states
- **Keyboard navigation:** Tab through controls
- **Semantic HTML:** Proper heading hierarchy

## Responsive Design

The panel adapts to different DevTools sizes:
- **Max width:** 7xl (80rem) with auto margins
- **Padding:** Consistent 1.5rem (24px)
- **Card spacing:** 1rem (16px) gap between events

## Browser DevTools Integration

**Location:** Appears as a tab in Chrome DevTools

**Position:** After standard tabs (Elements, Console, Sources, Network)

**Tab label:** "DataLayer"

**Icon:** "DL" in blue rounded square

**Panel behavior:**
- Opens in same DevTools window
- Can be resized with DevTools
- Persists across page navigations (if DevTools stays open)
- Independent of Console/Network tabs

## Tips for Best Experience

1. **Keep DevTools Open:** Panel only captures when DevTools is open
2. **Use Auto-scroll:** Leave enabled when monitoring live events
3. **Collapse Old Events:** Focus on recent activity
4. **Clear Periodically:** Reset when starting new tests
5. **Check Timestamps:** Verify event timing and sequence

## Example Use Cases

### 1. Debugging GTM Implementation
- See what events fire on page load
- Verify event properties are correct
- Check timing of events

### 2. Testing Analytics Tracking
- Trigger user actions (clicks, forms)
- Verify correct events are pushed
- Inspect event data structure

### 3. QA/Validation
- Compare expected vs actual events
- Document event sequences
- Share screenshots with team

### 4. Development
- Test new GTM tags before deployment
- Verify variable values
- Debug dataLayer issues
