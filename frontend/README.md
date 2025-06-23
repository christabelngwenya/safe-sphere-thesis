# Safe Sphere Web App

A modern, privacy-focused safety and mental health toolkit for university students, with a special focus on female safety. Built with React and Vite.

## Features Overview

### 1. **Safety & Mental Health Toolkit**
- **Personal Safety Tips:** Engaging, expandable cards with best practices for physical and digital safety.
- **Mental Health Self-Check:** Interactive quiz with instant, encouraging feedback and localStorage-based response saving. No backend required.

### 2. **Virtual Walk Companion**
- **Live Walk Session:** User sets their destination, total walk duration, and check-in interval.
- **Automated WhatsApp Alerts:**
  - At session start, a WhatsApp message is sent to the emergency contact with the walk details and location.
  - User must tap "I'm Safe" at each check-in interval. If two check-ins are missed, an automatic WhatsApp distress message (with last known location and intended destination) is sent to the emergency contact.
- **Loud Alarm:** If a check-in is missed, a loud alarm sounds on the user's device as a deterrent and attention-grabber.
- **All logic is browser-based:** No backend or WhatsApp API required; uses WhatsApp deep links.

### 3. **Whistleblower Portal**
- **Anonymous Reporting:** Users can submit detailed reports about misconduct, harassment, or other issues.
- **Protected & Encrypted:** Submissions are anonymous and secure.
- **Categories, Location, and Date:** Users can specify the type of incident, where and when it happened, and provide details.

### 4. **Counseling & Educational Resources**
- **Counseling:** Information and resources for mental health support.
- **Educational:** Curated resources for personal safety, digital security, and well-being.

### 5. **User Settings**
- **Emergency Contact:** Users can set and update their emergency contact number, which is used for all WhatsApp alerts.
- **Profile Management:** Update personal details securely.

### 6. **Dashboard & Navigation**
- **Sidebar Navigation:** Quick access to all features, including Home, Counseling, Report Abuse, Educational, Safety Toolkit, Virtual Walk, Whistleblower, and Settings.
- **Responsive Design:** Fully mobile-friendly and accessible.

## Technical Highlights
- **No backend required for core safety features:** All logic for the Virtual Walk Companion and Safety Toolkit is handled in the browser.
- **WhatsApp Deep Links:** Used for all emergency notifications, ensuring privacy and reliability.
- **LocalStorage:** Used for saving quiz responses and emergency contact info.
- **Styled Components:** For modern, maintainable UI.

## How to Use
1. **Set your emergency contact** in the Settings page.
2. **Use the Virtual Walk Companion** before any risky walk or commute:
   - Enter your destination, walk duration, and check-in interval.
   - Start the session to notify your contact.
   - Tap "I'm Safe" at each interval. If you miss two, your contact is automatically alerted.
3. **Explore the Safety Toolkit** for tips and mental health self-checks.
4. **Report issues anonymously** via the Whistleblower Portal.

## Development
- Built with React + Vite
- Uses styled-components for styling
- No backend required for most features

---

**Stay safe, stay connected.**
