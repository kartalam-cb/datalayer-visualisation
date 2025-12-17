# Quick Start Guide

Get up and running with DataLayer Visualizer in 5 minutes!

## 📦 Installation (2 minutes)

### Step 1: Get the Code
```bash
git clone https://github.com/kartalam-cb/datalayer-visualisation.git
```

Or download and extract the ZIP file from GitHub.

### Step 2: Load in Chrome
1. Open Chrome and go to `chrome://extensions/`
2. Toggle **"Developer mode"** ON (top-right corner)
3. Click **"Load unpacked"**
4. Select the `datalayer-visualisation` folder
5. Done! ✅

## 🚀 First Use (1 minute)

### Open the Extension
1. Open any website (or use the included `demo.html`)
2. Press **F12** to open DevTools
3. Click the **"DataLayer"** tab

You should see the extension interface!

### Try the Demo
1. Open `demo.html` from the extension folder in Chrome
2. Open DevTools → **DataLayer** tab
3. Click the **"Push Page View"** button on the demo page
4. Watch the event appear in the extension! 🎉

## 🎯 Basic Usage (2 minutes)

### View Events
- Events automatically appear in the **left panel**
- Each shows: name, timestamp, and index
- Click any event to see its full data on the **right**

### Explore the Data
- JSON is color-coded for easy reading
- Click **▼** arrows to collapse/expand objects
- Use **Expand All** / **Collapse All** buttons

### Copy Event Data
- Select an event
- Click the **📋** button to copy JSON
- Paste into your code editor

### Clear Events
- Click **🗑️ Clear All** to remove all events
- Fresh start for new debugging session

## 💡 Key Features at a Glance

### 1. Syntax Highlighting
```json
{
  "event": "purchase",      ← Blue string
  "value": 99.99,          ← Green number  
  "completed": true        ← Dark blue boolean
}
```

### 2. Network Correlation
Events that trigger analytics requests show badges:
- **GA4** 🟢 = Google Analytics 4
- **UA** 🟢 = Universal Analytics
- **GTM** 🟢 = Google Tag Manager

### 3. GTM Preview Detection
When GTM Preview is active:
- Status indicator turns green
- Shows "GTM Preview: Active"
- Displays container ID

### 4. Resizable Layout
- Hover over the **divider** between panels
- Drag left or right to adjust
- Your preference is saved automatically

### 5. Persistence
- Enable **💾 Persist** to keep events across pages
- Great for debugging multi-page flows
- Disable to clear events on each navigation

## 🎮 Interactive Demo

Try these on `demo.html`:

```javascript
// Open browser console and try:

// Basic event
dataLayer.push({ event: 'test_event' });

// E-commerce purchase
dataLayer.push({
  event: 'purchase',
  ecommerce: {
    transaction_id: 'T12345',
    value: 99.99,
    currency: 'USD'
  }
});

// User data
dataLayer.push({
  event: 'user_login',
  user_id: 'user_123',
  user_properties: {
    account_type: 'premium'
  }
});
```

Watch them appear in the extension instantly!

## 🔧 Common Tasks

### Task: Find a Specific Event
1. Look at event names in the left panel
2. Click the event to view details
3. Search within details using **Ctrl/Cmd + F**

### Task: Verify an Event Triggered Analytics
1. Look for colored badges (GA4, UA, GTM) next to events
2. Click the event to see network request details
3. Check status: completed ✅, pending ⏳, or failed ❌

### Task: Debug Multi-Page Flow
1. Enable **💾 Persist** toggle
2. Navigate through your pages
3. See all events with navigation markers (🔄)
4. Each event shows which page it came from

### Task: Share Event Data
1. Select the event you want to share
2. Click **📋 Copy** button
3. Paste into Slack, email, or bug report
4. JSON is nicely formatted and ready to share

### Task: Open GA4 DebugView
1. Click **📊 GA4 DebugView** button
2. If property ID isn't detected, right-click to configure
3. Enter your GA4 property ID
4. Click button again to open DebugView in new tab

## 📊 Real-World Example

### Scenario: Debugging a Purchase Event

1. **Navigate to checkout page**
2. **Open DevTools → DataLayer tab**
3. **Complete a test purchase**
4. **Look for `purchase` event in the list**
5. **Click it to view the full payload**
6. **Verify:**
   - ✅ Transaction ID is present
   - ✅ Product items are correct
   - ✅ Currency matches
   - ✅ Event has GA4 badge (request sent)
7. **Click event to see network details**
8. **Verify:**
   - ✅ Status: completed
   - ✅ Status code: 200
   - ✅ URL is correct analytics endpoint

### Scenario: GTM Container Debugging

1. **Enable GTM Preview mode** on your container
2. **Open the page with DevTools → DataLayer**
3. **Verify:**
   - ✅ Green dot shows "GTM Preview: Active"
   - ✅ Container ID is displayed
4. **Trigger tags** on the page
5. **Watch events appear** with GTM badges
6. **Correlate events** with GTM preview panel

## ⚡ Pro Tips

### Tip 1: Keep DevTools Open
Open DevTools **before** loading the page to catch early events like `gtm.js` and `gtm.dom`.

### Tip 2: Use Persistence for SPAs
Single Page Applications? Enable persistence to track events across virtual page views.

### Tip 3: Collapse Large Objects
Viewing complex ecommerce data? Collapse the objects you don't need to see. Keeps things clean!

### Tip 4: Adjust Column Width
Prefer more space for event details? Drag the divider to give the right panel more room.

### Tip 5: Copy-Paste for Analysis
Need to analyze events in a spreadsheet? Copy JSON and use a JSON-to-CSV converter online.

### Tip 6: Clear Frequently
Working with a busy site? Click "Clear All" frequently to avoid clutter and stay focused.

## 🐛 Troubleshooting

### Problem: Extension tab not showing
**Solution:** Refresh the page after installing the extension.

### Problem: No events appearing
**Solution:** 
- Check if the page has a dataLayer: `console.log(window.dataLayer)`
- Ensure DevTools is open before the page loads
- Try refreshing the page

### Problem: Network badges not showing
**Solution:**
- Check browser console for errors
- Ensure the extension has webRequest permissions
- Disable ad blockers temporarily

### Problem: GTM Preview not detected
**Solution:**
- Verify GTM Preview is actually active (look for the preview panel)
- Refresh the page with preview mode already enabled
- Check for `__TAG_ASSISTANT` cookie in DevTools → Application

### Problem: Events cleared on navigation
**Solution:** Enable the **💾 Persist** toggle to keep events across pages.

## 📚 Learn More

- **Full Documentation**: See [README.md](README.md)
- **All Features**: See [FEATURES.md](FEATURES.md)
- **Installation Guide**: See [INSTALLATION.md](INSTALLATION.md)
- **Testing**: See [TESTING.md](TESTING.md)
- **Architecture**: See [ARCHITECTURE.md](ARCHITECTURE.md)

## 🆘 Get Help

- **Issues**: [GitHub Issues](https://github.com/kartalam-cb/datalayer-visualisation/issues)
- **Questions**: Open a discussion on GitHub
- **Bug Reports**: Use the issue template with:
  - Chrome version
  - Extension version
  - Steps to reproduce
  - Screenshots if applicable

## 🎓 Next Steps

Now that you're set up, try:

1. ✅ Test on your own website
2. ✅ Configure your GA4 property ID
3. ✅ Try debugging a real user flow
4. ✅ Explore all the features
5. ✅ Share with your team!

---

**Happy Debugging! 🚀**

If this extension helps you, consider:
- ⭐ Starring the repo on GitHub
- 📣 Sharing with colleagues
- 🐛 Reporting bugs or suggesting features
- 💡 Contributing improvements

---

*Last Updated: December 2024*
*Version: 1.0.0*
