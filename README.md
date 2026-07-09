# Red Rose Sr. Sec. School - Static Website

A fully static, production-ready school website with no backend dependencies. All forms submit to WhatsApp.

## 🎯 What's Been Updated

### Form Handlers (WhatsApp Integration)
- **Admissions Form** (`assets/js/admission.js`) - Multi-step admission form submits to WhatsApp
- **Job Application** (`assets/js/apply-job.js`) - Job applications submit to WhatsApp  
- **Contact Form** (`assets/js/contact.js`) - Contact messages submit to WhatsApp

### Package Configuration
- **package.json** - Simplified to static site only (removed all Node dependencies)

All forms now:
- ✅ Validate data locally
- ✅ Generate formatted WhatsApp messages with `encodeURIComponent()`
- ✅ Open WhatsApp Web with message pre-filled
- ✅ Save backup to browser localStorage
- ✅ No server required

---

## 🚀 How to Deploy

### Option 1: GitHub Pages (Recommended)
1. Go to repository Settings → Pages
2. Select "Deploy from a branch"
3. Choose branch: `main` and folder: `/ (root)`
4. Your site will be live at: `https://k30097180-bit.github.io/red-rose-sr.-sec.-school`

### Option 2: Netlify
1. Connect your GitHub repo to Netlify
2. Build command: (leave empty)
3. Publish directory: `.` (root)
4. Deploy!

### Option 3: Local Development
```bash
# Python 3
python -m http.server 8000

# Or Node.js
npx http-server

# Visit http://localhost:8000
```

---

## 📋 Backend Files to Remove

These files are no longer needed and should be deleted:

```bash
# Delete these directories entirely:
rm -rf config/
rm -rf routes/
rm -rf controllers/
rm -rf middlewares/
rm -rf models/
rm -rf utils/

# Delete these files:
rm server.js
rm .env
rm .env.example
rm package-lock.json
```

**Note:** Only `package.json` was kept (updated version 2.0.0)

---

## 🔧 Updating WhatsApp Number

To change the receiving WhatsApp number, edit these three files:

### 1. `assets/js/admission.js` (Line 15)
```javascript
const WHATSAPP_NUMBER = "918233809870"; // ← Change this
```

### 2. `assets/js/apply-job.js` (Line 7)
```javascript
const WHATSAPP_NUMBER = "918233809870"; // ← Change this
```

### 3. `assets/js/contact.js` (Line 3)
```javascript
const WHATSAPP_NUMBER = "918233809870"; // ← Change this
```

---

## ✨ Features

### Admission Form
- 3-step multi-step form with progress indicator
- Student information (name, DOB, gender, class, stream)
- Parent information (names, contact details, address)
- Review before submission
- Generates formatted WhatsApp message
- Saves to localStorage as backup

### Job Application
- Name, email, phone, subject specialization
- Qualification and years of experience
- Teaching introduction/approach
- Generates formatted WhatsApp message
- LocalStorage backup

### Contact Form
- Simple contact form (name, email, phone, message)
- Generates WhatsApp message
- LocalStorage backup

---

## 📊 Message Format Examples

### Admission Request
```
🎓 NEW ADMISSION REQUEST

Student Name: John Doe
Father Name: Mr. Doe
Mother Name: Mrs. Doe
Mobile Number: 9876543210
Email: john@example.com
Date of Birth: 2010-05-15
Gender: Male
Address: 123 Main Street
City: Springfield
State: State Name
PIN Code: 123456
Class: Class 5
Stream: -
Category: General
Father's Occupation: Business
```

### Job Application
```
💼 JOB APPLICATION

Applicant Name: Jane Smith
Mobile: 9876543210
Email: jane@example.com
Subject Specialization: Mathematics
Qualification: M.Sc., B.Ed.
Years of Experience: 8

Introduction:
I am passionate about...
```

### Contact Message
```
📧 CONTACT REQUEST

Name: Contact Person
Email: contact@example.com
Phone: 9876543210

Message:
This is my message...
```

---

## 🔐 Security Notes

- ✅ No sensitive data sent to external servers
- ✅ All validation happens in the browser
- ✅ Data only transmitted to WhatsApp (encrypted)
- ✅ LocalStorage backup only on user's device
- ✅ No authentication required (forms are public)

---

## 📱 Browser Compatibility

- Chrome/Edge: ✅ Full support
- Firefox: ✅ Full support
- Safari: ✅ Full support
- Mobile browsers: ✅ Full support (opens WhatsApp app)

---

## 🐛 Troubleshooting

### "Unable to open WhatsApp" error
- Check browser popup settings
- Allow popups for your domain
- Ensure WhatsApp is installed (mobile) or accessible (web)

### Form data not submitting
- Check browser console for errors (F12)
- Verify WhatsApp number format (with country code)
- Ensure all required fields are filled

### LocalStorage backup not working
- Check browser privacy/incognito mode
- Clear browser cache and retry
- Check localStorage quota (usually 5-10MB)

---

## 📝 File Structure

```
red-rose-sr.-sec.-school/
├── index.html                    # Homepage
├── admissions.html               # Admission form
├── apply-job.html                # Job application
├── contact.html                  # Contact form
├── about.html                    # About page
├── teachers.html                 # Teachers listing
├── package.json                  # Static site metadata (v2.0.0)
├── assets/
│   ├── js/
│   │   ├── admission.js          # ✅ Updated - WhatsApp
│   │   ├── apply-job.js          # ✅ Updated - WhatsApp
│   │   ├── contact.js            # ✅ Updated - WhatsApp
│   │   ├── main.js
│   │   ├── navbar.js
│   │   └── ...
│   ├── css/
│   │   ├── style.css
│   │   ├── header.css
│   │   └── ...
│   └── images/
│       └── ...
└── auth.js                       # Client-side auth (unchanged)
```

---

## ✅ Checklist Before Going Live

- [ ] Update WhatsApp number in all 3 form handler files
- [ ] Test all 3 forms on desktop and mobile
- [ ] Verify WhatsApp messages are formatted correctly
- [ ] Delete backend folders (config, routes, etc.)
- [ ] Remove package-lock.json (if cleaned up)
- [ ] Test on GitHub Pages / Netlify
- [ ] Verify localStorage backup works
- [ ] Check mobile app opens WhatsApp correctly

---

## 📞 Support

For WhatsApp message issues, verify:
1. Phone number format: Country code + number (91XXXXXXXXXX for India)
2. Message encoding: Uses `encodeURIComponent()` for special characters
3. Browser popups: Enabled in browser settings
4. WhatsApp access: Available at wa.me service

---

**Version:** 2.0.0  
**Last Updated:** 2026-07-09  
**Status:** Production Ready ✅  
**Backend:** None (Static Site)  
**Dependencies:** 0 (HTML/CSS/JavaScript only)
