# 🧠 InOfficeIQ

**Smart Tracker for Hybrid Employees**

InOfficeIQ is a lightweight, intelligent tool designed to help employees working in hybrid environments plan their in-office days more effectively. It factors in weekends, official holidays, and personal leaves to calculate how many days you need to attend office based on a monthly 10-day requirement.

---

## 🎯 Objective

Many modern workplaces follow a hybrid work model, requiring employees to attend the office for a minimum number of days per month (e.g., 10 days). InOfficeIQ simplifies this by:

- Automatically calculating the number of working days in a given month.
- Subtracting weekends, official holidays, and personal leaves.
- Showing you exactly which days you **must** go to the office to fulfill your quota.

---

## ⚙️ Logic Behind InOfficeIQ

Let’s break it down with an example (August - 31 days):

1. **Step 1**: Identify total days in the month → 31
2. **Step 2**: Exclude weekends (e.g., 10 days if Sat–Sun) → 31 - 10 = 21 working days
3. **Step 3**: You are allowed to work **11 days from home**, since you must go to the office only **10 days per month**
4. **Step 4**: Further reduce working days by:
   - Office Holidays (e.g., Aug 15, Aug 27)
   - Personal Leaves (e.g., Aug 8, Aug 14)

🧮 **Required In-Office Days** =  
👉 (Working Days - Holidays - Personal Leaves)  
👉 Out of the remaining, choose any 10 to visit the office

---

## 🧰 Features

- 📆 Auto-detects current, previous, and next month
- 🛠️ Lets you input:
  - Office holidays
  - Personal leave days
- ✅ Calculates how many days you need to go to office
- 📉 Highlights selected days, holidays, and remaining working days
- 🚀 Responsive and lightweight UI
- 🔄 Real-time feedback on "Go to Office" count

---

## 💡 Example Use Case

For **August**:
- Total Days: 31  
- Weekends: 10  
- Holidays: 2 (Aug 15, 27)  
- Personal Leaves: 2 (Aug 8, 14)  
→ Working Days = 21 - 2 - 2 = **17**  
→ Required Office Days = Minimum of **10**  
→ You can choose **10** days to attend out of the remaining **17**

---

## 🚀 Future Scope

- 🗓️ Add support for recurring holidays and weekends
- 🌐 Cloud sync or GitHub Gist for saving preferences
- 📱 Mobile responsive app
- 🧩 Add charts/visuals for monthly planning

---

## 🧑‍💻 Created by [Pavithran](https://github.com/Pavithran-P12)  
_💖 Contributions, ideas, and feedback welcome!_

