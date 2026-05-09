# 📋 Google Sheets Setup Guide — Cakery Contact Form

Follow these steps to connect your contact form to Google Sheets.
Takes about 5 minutes!

---

## Step 1 — Create a Google Sheet

1. Go to https://sheets.google.com
2. Create a **New Spreadsheet**
3. Name it: `Cakery Contact Submissions`
4. In **Row 1**, add these headers (one per column):

   | A | B | C | D | E | F | G |
   |---|---|---|---|---|---|---|
   | Timestamp | Type | Name | Email | Phone | Subject | Message |

---

## Step 2 — Create the Apps Script

1. In your Google Sheet, click **Extensions → Apps Script**
2. Delete the default code
3. Paste the following code:

```javascript
const SHEET_NAME = "Sheet1"; // change if your tab has a different name

function doPost(e) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
    const data  = JSON.parse(e.postData.contents);

    if (data.type === "newsletter") {
      sheet.appendRow([
        data.timestamp,
        "Newsletter",
        "—",
        data.email,
        "—",
        "—",
        "—"
      ]);
    } else {
      sheet.appendRow([
        data.timestamp,
        "Contact",
        data.name,
        data.email,
        data.phone,
        data.subject,
        data.message
      ]);
    }

    return ContentService
      .createTextOutput(JSON.stringify({ status: "success" }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: "error", message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Test function — run this manually to verify the sheet works
function test() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
  sheet.appendRow(["Test", "Contact", "Test User", "test@test.com", "1234567890", "Test", "Hello!"]);
}
```

4. Click **Save** (💾 icon) and name the project `CakeryFormHandler`

---

## Step 3 — Deploy as Web App

1. Click **Deploy → New Deployment**
2. Click the ⚙️ gear icon next to "Select type" → choose **Web app**
3. Fill in the settings:
   - **Description**: Cakery Contact Form Handler
   - **Execute as**: Me (your Google account)
   - **Who has access**: **Anyone** ← This is important!
4. Click **Deploy**
5. Click **Authorize access** → choose your Google account → Allow
6. **Copy the Web App URL** — it looks like:
   `https://script.google.com/macros/s/AKfycb.../exec`

---

## Step 4 — Add the URL to main.js

Open `main.js` and replace this line at the top:

```javascript
const GOOGLE_SCRIPT_URL = "YOUR_GOOGLE_APPS_SCRIPT_URL_HERE";
```

With your copied URL:

```javascript
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycb.../exec";
```

Save the file. **That's it — you're done!** 🎉

---

## 📬 How data appears in Google Sheets

Every form submission creates a new row:

| Timestamp | Type | Name | Email | Phone | Subject | Message |
|---|---|---|---|---|---|---|
| 09/05/2025, 10:30 AM | Contact | Priya Sharma | priya@email.com | 9876543210 | Custom Cake Order | I'd like a 3-tier cake... |
| 09/05/2025, 11:00 AM | Newsletter | — | news@email.com | — | — | — |

---

## ⚠️ Troubleshooting

| Problem | Fix |
|---|---|
| Form says "URL not configured" | Make sure you replaced the placeholder URL in main.js |
| Data not appearing in sheet | Re-deploy with "Anyone" access, and make sure Execute as "Me" |
| Script authorization error | Run the `test()` function manually first to trigger authorization |
| Old deployment not working | Create a **New Deployment** each time you change the script |

---

*Need help? Email: hello@cakery.com*
