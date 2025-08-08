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

1. **Find Total Working Days**  
   `Total Working Days = Total Days in Month - Weekends`

2. **Calculate WFH-Eligible Days**  
   `WFH-Eligible Days = Total Working Days - Target Office Days`

3. **Adjust Target Based on Holidays & Leaves**  
   `Required Office Days = Target Office Days - (Holidays + Personal Leaves)`

4. **Final Remaining Days**  
   The app shows how many **more days** you must attend the office after accounting for all holidays and leaves.


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

## 📄 License
This project is open-source and available under the MIT License.

---

**Created with ❤️ by [Pavithran](https://github.com/YourGitHubUsername)**
