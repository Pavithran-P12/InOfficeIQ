# 🏢 InOfficeIQ

**InOfficeIQ** is a simple, interactive **Work Days Tracker** that helps you keep track of how many days you need to go to the office each month, based on your target office days, holidays, and personal leaves.

The app is fully **click-based** — select days directly on the calendar to mark them as holidays, personal leaves, office days, or work-from-home days, and the tracker will instantly update your remaining required office days.

---

## ✨ Features
- 📅 Interactive calendar with click-to-toggle status
- 🟥 Holiday, 🟧 Personal Leave, 🟦 Office Day, 🟩 Work From Home, and Weekend indicators
- 📊 Automatic calculation of:
  - Total working days
  - WFH-eligible days
  - Remaining required office days
- 🔄 Navigation between previous, current, and next months
- 💾 Option to store your selections locally for persistence (can be added)

---

## 🧠 Core Logic (Click-based)

1. **Working Days** = Total Days in Month - Weekends  
2. **WFH-Eligible Days** = Working Days - Target Office Days (default: 10)  
3. **Office Days Required** =  
   ```
   Target Office Days - (Marked Holidays + Personal Leaves)
   ```
4. **Remaining to Select** =  
   ```
   Office Days Required - Marked Office Days
   ```
5. If **Office Days Required** is less than `0`, it is set to `0`.

---

## 🔄 Logic Flow Diagram

```mermaid
flowchart TD
    A[Start] --> B[Get Total Days in Month]
    B --> C[Subtract Weekends → Working Days]
    C --> D[Set Target Office Days]
    D --> E[Mark Holidays & Personal Leaves]
    E --> F[Office Days Required = Target Office Days - (Holidays + Leaves)]
    F --> G[If Office Days Required < 0 → Set to 0]
    G --> H[Mark Office Days on Calendar]
    H --> I[Remaining Days = Office Days Required - Marked Office Days]
    I --> J[Display WFH-Eligible Days & Remaining Days]
    J --> K[End]
```

---

## 📌 Example

For **August 2025**:
- Total Days: 31  
- Weekends: 10  
- **Total Working Days** = 21  
- Target Office Days = 10  
- Holidays: Aug 15, 27  
- Personal Leaves: Aug 8, 14  
- Office Days Selected: Aug 4, 5, 6, 7  

**Result:**
- **WFH-Eligible Days** = 11  
- **Office Days Required** = 6  
- **Remaining to Select** = 2  

---

## 🛠️ How to Use
1. Open the tracker in your browser.
2. Use `< Previous` and `Next >` buttons to navigate months.
3. Click on any date to cycle through the available statuses:
   - Weekend (auto)
   - Holiday
   - Personal Leave
   - Office Day
   - Work From Home
4. The counters will update automatically.

---

## 📷 Screenshot

![InOfficeIQ Screenshot](screenshot.png)

---

## 📄 License
This project is open-source and available under the MIT License.

---

**Created with ❤️ by [Pavithran](https://github.com/YourGitHubUsername)**
