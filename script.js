// Initialize data
let currentDate = new Date();
let currentMonth = currentDate.getMonth();
let currentYear = currentDate.getFullYear();

// Arrays to hold dates
const holidaysArr = [];
const leavesArr = [];
const officeDaysArr = [];
const wfhDaysArr = [];

// Current painting mode (holiday, leave, office, wfh, clear)
let currentMode = 'wfh';

// Load data from localStorage if available
function loadSavedData() {
    if (localStorage.getItem('workDaysTracker')) {
        try {
            const data = JSON.parse(localStorage.getItem('workDaysTracker'));
            if (data.holidays) data.holidays.forEach(d => holidaysArr.push(d));
            if (data.leaves) data.leaves.forEach(d => leavesArr.push(d));
            if (data.officeDays) data.officeDays.forEach(d => officeDaysArr.push(d));
            if (data.wfhDays) data.wfhDays.forEach(d => wfhDaysArr.push(d));
            if (data.targetDays) document.getElementById('target-days').value = data.targetDays;
        } catch(e) {
            console.error("Error loading saved data:", e);
        }
    }
    
    // Initialize with example data if no data exists
    if (holidaysArr.length === 0 && leavesArr.length === 0 && officeDaysArr.length === 0) {
        console.log("Initializing with example data");
        
        // Holiday dates
        holidaysArr.push('2025-08-15');
        holidaysArr.push('2025-08-27');
        
        // Personal leave dates
        leavesArr.push('2025-08-08');
        leavesArr.push('2025-08-14');
        
        // Additional leaves that appear in your screenshot
        leavesArr.push('2025-08-15');  // Aug 15 appears red in your screenshot
        leavesArr.push('2025-08-27');  // Aug 27 appears red in your screenshot
        
        console.log("After init - holidays:", holidaysArr);
        console.log("After init - leaves:", leavesArr);
    }
}

// Save data to localStorage
function saveData() {
    const data = {
        holidays: holidaysArr,
        leaves: leavesArr,
        officeDays: officeDaysArr,
        wfhDays: wfhDaysArr,
        targetDays: document.getElementById('target-days').value
    };
    localStorage.setItem('workDaysTracker', JSON.stringify(data));
}

// Parse date from input format
function parseDateInput(input) {
    // Check if the input is in dd-mm-yyyy format
    const parts = input.split('-');
    if (parts.length === 3) {
        const day = parseInt(parts[0]);
        const month = parseInt(parts[1]) - 1;
        const year = parseInt(parts[2]);
        const date = new Date(year, month, day);
        return date.toISOString().slice(0, 10); // Convert to YYYY-MM-DD
    }
    return null;
}

// Format date to display format
function formatDate(date, includeWeekday = false) {
    const day = date.getDate();
    const month = date.toLocaleString('default', { month: 'short' });
    
    if (includeWeekday) {
        const weekday = date.toLocaleString('default', { weekday: 'short' });
        return `${weekday}, ${month} ${day}`;
    }
    return `${month} ${day}`;
}

// Update the month display and calendar when navigating
function updateMonth() {
    const monthNames = ["January", "February", "March", "April", "May", "June",
                      "July", "August", "September", "October", "November", "December"];
    document.getElementById('current-month-display').textContent = `${monthNames[currentMonth]} ${currentYear}`;
    updateCalendar();
    updateSummary();
}

// Generate calendar for current month
function updateCalendar() {
    const calendarContainer = document.getElementById('calendar-container');
    const targetDays = parseInt(document.getElementById('target-days').value) || 10;
    
    // Get first day and days in month
    const firstDay = new Date(currentYear, currentMonth, 1).getDay();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    
    // Create calendar table
    let calendarHTML = '<table class="calendar">';
    calendarHTML += '<tr class="calendar-header"><th>Sun</th><th>Mon</th><th>Tue</th><th>Wed</th><th>Thu</th><th>Fri</th><th>Sat</th></tr>';
    
    // Initialize date counter
    let date = 1;
    
    // Create calendar rows
    for (let i = 0; i < 6; i++) {
        // Break if we've handled all days
        if (date > daysInMonth) break;
        
        calendarHTML += '<tr>';
        
        // Create calendar cells for each day
        for (let j = 0; j < 7; j++) {
            if (i === 0 && j < firstDay) {
                // Empty cells before month starts
                calendarHTML += '<td class="empty"></td>';
            } else if (date > daysInMonth) {
                // Empty cells after month ends
                calendarHTML += '<td class="empty"></td>';
            } else {
                // Create formatted date string (using local date to avoid timezone issues)
                const currentDateObj = new Date(currentYear, currentMonth, date);
                // Format as YYYY-MM-DD
                const dateStr = `${currentYear}-${(currentMonth + 1).toString().padStart(2, '0')}-${date.toString().padStart(2, '0')}`;
                
                // Get day of week directly from j (column index)
                // j is 0-6 representing Sun-Sat in the calendar
                const isWeekend = j === 0 || j === 6; // Sunday or Saturday
                
                // Determine cell class
                let cellClass = '';
                
                if (isWeekend) {
                    cellClass = 'weekend';
                } else if (holidaysArr.includes(dateStr)) {
                    cellClass = 'holiday';
                } else if (leavesArr.includes(dateStr)) {
                    cellClass = 'leave';
                } else if (officeDaysArr.includes(dateStr)) {
                    cellClass = 'office-day';
                } else if (wfhDaysArr.includes(dateStr)) {
                    cellClass = 'wfh-day';
                } else {
                    // Default: all untagged weekdays are WFH
                    cellClass = 'wfh-day';
                }
                
                // Add today's date highlight
                const today = new Date();
                if (date === today.getDate() && 
                    currentMonth === today.getMonth() && 
                    currentYear === today.getFullYear()) {
                    cellClass += ' today';
                }
                
                // Create cell with click handler
                calendarHTML += `<td class="${cellClass}" data-date="${dateStr}" onclick="toggleWorkDay('${dateStr}')">`;
                calendarHTML += date;
                calendarHTML += '</td>';
                
                date++;
            }
        }
        
        calendarHTML += '</tr>';
    }
    
    calendarHTML += '</table>';
    calendarContainer.innerHTML = calendarHTML;
}

// Set the active painting mode
window.setMode = function(mode) {
    currentMode = mode;
    // Update active button styling
    document.querySelectorAll('.mode-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.mode === mode);
    });
};

// Remove a date from all arrays
function removeFromAll(dateStr) {
    const arrays = [holidaysArr, leavesArr, officeDaysArr, wfhDaysArr];
    arrays.forEach(arr => {
        const idx = arr.indexOf(dateStr);
        if (idx !== -1) arr.splice(idx, 1);
    });
}

// Get which array a date currently belongs to
function getCurrentStatus(dateStr) {
    if (holidaysArr.includes(dateStr)) return 'holiday';
    if (leavesArr.includes(dateStr)) return 'leave';
    if (officeDaysArr.includes(dateStr)) return 'office';
    if (wfhDaysArr.includes(dateStr)) return 'wfh';
    return 'none';
}

// Apply the selected mode to a clicked date
window.toggleWorkDay = function(dateStr) {
    // Parse date to check for weekends
    const parts = dateStr.split('-');
    const year = parseInt(parts[0]);
    const month = parseInt(parts[1]) - 1;
    const day = parseInt(parts[2]);
    const date = new Date(year, month, day);
    const dayOfWeek = date.getDay();
    
    // Cannot select weekends
    if (dayOfWeek === 0 || dayOfWeek === 6) return;
    
    const status = getCurrentStatus(dateStr);
    
    // If clicking a date that already has the selected mode, toggle it off
    if ((currentMode === 'holiday' && status === 'holiday') ||
        (currentMode === 'leave' && status === 'leave') ||
        (currentMode === 'office' && status === 'office') ||
        (currentMode === 'wfh' && status === 'wfh') ||
        currentMode === 'clear') {
        removeFromAll(dateStr);
    } else {
        // Remove from any existing array first, then add to selected mode
        removeFromAll(dateStr);
        switch (currentMode) {
            case 'holiday': holidaysArr.push(dateStr); break;
            case 'leave':   leavesArr.push(dateStr); break;
            case 'office':  officeDaysArr.push(dateStr); break;
            case 'wfh':     wfhDaysArr.push(dateStr); break;
        }
    }
    
    updateCalendar();
    updateSummary();
    saveData();
};

// Calculate working days and office days needed
function calculateDays() {
    const targetDays = parseInt(document.getElementById('target-days').value) || 10;
    
    // Get total days in month
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    
    let totalWorkingDays = 0;
    let skipDays = 0;
    let selectedDaysInMonth = 0;
    let weekendCount = 0;
    
    // Calculate workdays and skipDays in current month
    for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(currentYear, currentMonth, day);
        // Format as YYYY-MM-DD consistently with our other code
        const dateStr = `${currentYear}-${(currentMonth + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
        const dayOfWeek = date.getDay();
        
        // Count weekends (Saturday & Sunday)
        if (dayOfWeek === 0 || dayOfWeek === 6) {
            weekendCount++;
            continue;
        }
        
        // Count working days (excluding weekends)
        totalWorkingDays++;
        
        // Count holidays and leaves that fall on working days → SkipDays
        if (holidaysArr.includes(dateStr) || leavesArr.includes(dateStr)) {
            skipDays++;
            console.log(`SkipDay found: ${dateStr} - Holiday: ${holidaysArr.includes(dateStr)}, Leave: ${leavesArr.includes(dateStr)}`);
        }
        
        // Count selected days in current month
        if (officeDaysArr.includes(dateStr)) {
            selectedDaysInMonth++;
        }
    }
    
    // Calculate Work From Home (WFH) Days = Total Working Days - 10
    const wfhDays = Math.max(totalWorkingDays - targetDays, 0);
    
    // Final required office days: RequiredOfficeDays = max(10 - SkipDays, 0)
    const requiredOfficeDays = Math.max(targetDays - skipDays, 0);
    
    // Calculate remaining days to select
    const remainingDays = Math.max(requiredOfficeDays - selectedDaysInMonth, 0);
    
    // Count holidays and leaves separately for display
    const holidayCount = holidaysArr.filter(date => {
        const [year, month] = date.split('-').map(Number);
        return year === currentYear && month === currentMonth + 1;
    }).length;
    
    const leaveCount = leavesArr.filter(date => {
        const [year, month] = date.split('-').map(Number);
        return year === currentYear && month === currentMonth + 1;
    }).length;
    
    console.log(`Debug counts - Holidays: ${holidayCount}, Leaves: ${leaveCount}, Skip Days: ${skipDays}`);
    console.log('All holidays:', holidaysArr);
    console.log('All leaves:', leavesArr);
    
    return {
        totalDays: daysInMonth,
        weekendCount: weekendCount,
        totalWorkingDays: totalWorkingDays, // WD = Total days - Weekends
        skipDays: skipDays,                 // Holidays and leaves on working days
        holidayCount: holidayCount,         // Actual count of holidays in current month
        leaveCount: leaveCount,             // Actual count of leaves in current month
        wfhDays: wfhDays,                   // WFH Days = WD - 10
        requiredOfficeDays: requiredOfficeDays, // max(10 - SkipDays, 0)
        selectedDaysInMonth: selectedDaysInMonth,
        remainingDays: remainingDays
    };
}

// Update summary section
function updateSummary() {
    const targetDays = parseInt(document.getElementById('target-days').value) || 10;
    const stats = calculateDays();
    
    // Update summary information
    document.getElementById('total-workdays').textContent = stats.totalWorkingDays;
    document.getElementById('days-selected').textContent = stats.selectedDaysInMonth;
    document.getElementById('target-display').textContent = stats.requiredOfficeDays;
    document.getElementById('remaining-days').textContent = stats.remainingDays;
    
    // Update the big remaining days count
    document.getElementById('big-remaining-count').textContent = stats.remainingDays;
    
    // Update holiday and leave counts separately
    document.getElementById('holiday-count').textContent = stats.holidayCount;
    document.getElementById('leave-count').textContent = stats.leaveCount;
    
    // Update summary sections with additional info if the HTML elements exist
    if (document.getElementById('wfh-days')) {
        document.getElementById('wfh-days').textContent = stats.wfhDays;
    }
    if (document.getElementById('skip-days')) {
        document.getElementById('skip-days').textContent = stats.skipDays;
    }
}

// Event listeners for month navigation
document.getElementById('prev-month').onclick = () => {
    currentMonth--;
    if (currentMonth < 0) {
        currentMonth = 11;
        currentYear--;
    }
    updateMonth();
};

document.getElementById('next-month').onclick = () => {
    currentMonth++;
    if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
    }
    updateMonth();
};

// Handle target days change
document.getElementById('target-days').onchange = () => {
    updateCalendar();
    updateSummary();
    saveData();
};

// Target +/- stepper buttons
document.getElementById('target-minus').onclick = () => {
    const input = document.getElementById('target-days');
    const val = parseInt(input.value) || 10;
    if (val > 1) {
        input.value = val - 1;
        input.dispatchEvent(new Event('change'));
    }
};

document.getElementById('target-plus').onclick = () => {
    const input = document.getElementById('target-days');
    const val = parseInt(input.value) || 10;
    input.value = val + 1;
    input.dispatchEvent(new Event('change'));
};

// Helper function to debug date issues
function debugDates() {
    console.log("=== DEBUG DATE INFORMATION ===");
    console.log("Current Year/Month:", currentYear, currentMonth);
    
    // Log all leaves
    console.log("All leaves:", leavesArr);
    
    // Check each leave date format
    leavesArr.forEach(dateStr => {
        const parts = dateStr.split('-');
        console.log(`Leave date: ${dateStr}, parsed as Year: ${parts[0]}, Month: ${parts[1]}, Day: ${parts[2]}`);
        
        // Check if this date is in current month
        const year = parseInt(parts[0]);
        const month = parseInt(parts[1]);
        const isCurrentMonth = (year === currentYear && month === currentMonth + 1);
        console.log(`  Is in current month? ${isCurrentMonth}`);
    });
    
    // Check specific dates from your example (2025-08-08, 2025-08-14)
    const testDate1 = "2025-08-08";
    const testDate2 = "2025-08-14";
    console.log(`Is ${testDate1} in leaves array? ${leavesArr.includes(testDate1)}`);
    console.log(`Is ${testDate2} in leaves array? ${leavesArr.includes(testDate2)}`);
}

// Download page as image
window.downloadAsImage = function() {
    const monthNames = ["January", "February", "March", "April", "May", "June",
                      "July", "August", "September", "October", "November", "December"];
    const monthLabel = `${monthNames[currentMonth]}_${currentYear}`;
    
    if (!confirm(`Download your ${monthNames[currentMonth]} ${currentYear} plan as an image?`)) {
        return;
    }

    // Gather stats
    const officeCount = document.getElementById('days-selected').textContent;
    const holidayCount = document.getElementById('holiday-count').textContent;
    const leaveCount = document.getElementById('leave-count').textContent;
    const remainingCount = document.getElementById('big-remaining-count').textContent;
    const totalWorkdays = document.getElementById('total-workdays').textContent;
    const wfhEligible = document.getElementById('wfh-days').textContent;

    // Build off-screen wrapper for a professional-looking image
    const wrapper = document.createElement('div');
    wrapper.style.cssText = `
        position: fixed; left: -9999px; top: 0;
        width: 460px;
        background: #ffffff;
        font-family: 'Inter', sans-serif;
        padding: 28px 24px 20px;
        border-radius: 16px;
        color: #1e293b;
    `;

    // Header with branding + month
    const header = document.createElement('div');
    header.style.cssText = 'text-align:center; margin-bottom:18px;';
    header.innerHTML = `
        <div style="font-size:22px; font-weight:700; color:#1e3a5f; letter-spacing:-0.02em;">📅 InOfficeIQ</div>
        <div style="font-size:15px; font-weight:500; color:#64748b; margin-top:4px;">${monthNames[currentMonth]} ${currentYear}</div>
    `;
    wrapper.appendChild(header);

    // Stats row
    const stats = document.createElement('div');
    stats.style.cssText = 'display:flex; gap:8px; margin-bottom:16px;';
    const statItems = [
        { val: remainingCount, label: 'Remaining', bg: '#eff6ff', color: '#1e40af' },
        { val: officeCount, label: 'Office', bg: '#dbeafe', color: '#1e40af' },
        { val: holidayCount, label: 'Holidays', bg: '#fef3c7', color: '#b45309' },
        { val: leaveCount, label: 'Leaves', bg: '#ffe4e6', color: '#be123c' }
    ];
    statItems.forEach(s => {
        const card = document.createElement('div');
        card.style.cssText = `flex:1; text-align:center; background:${s.bg}; border-radius:10px; padding:10px 4px;`;
        card.innerHTML = `
            <div style="font-size:20px; font-weight:700; color:${s.color};">${s.val}</div>
            <div style="font-size:10px; font-weight:600; color:#64748b; margin-top:2px; text-transform:uppercase; letter-spacing:0.04em;">${s.label}</div>
        `;
        stats.appendChild(card);
    });
    wrapper.appendChild(stats);

    // Clone calendar
    const calClone = document.querySelector('.calendar-container').cloneNode(true);
    calClone.style.cssText = 'margin-bottom:12px; border-radius:10px; overflow:hidden; border:1px solid #e2e8f0; box-shadow:0 1px 3px rgba(0,0,0,0.06);';
    // Ensure table fills width
    const table = calClone.querySelector('table');
    if (table) {
        table.style.cssText = 'width:100%; border-collapse:collapse; table-layout:fixed;';
    }
    wrapper.appendChild(calClone);

    // Clone legend
    const legendClone = document.querySelector('.legend-bar').cloneNode(true);
    legendClone.style.cssText = 'display:flex; flex-wrap:wrap; gap:6px; justify-content:center; margin-bottom:14px; padding:0 4px;';
    wrapper.appendChild(legendClone);

    // Divider
    const divider = document.createElement('div');
    divider.style.cssText = 'border-top:1px solid #e2e8f0; margin:0 0 12px;';
    wrapper.appendChild(divider);

    // Summary row
    const summary = document.createElement('div');
    summary.style.cssText = 'display:flex; justify-content:space-between; font-size:11px; color:#64748b; padding:0 4px;';
    summary.innerHTML = `
        <span>Working Days: <strong style="color:#1e293b;">${totalWorkdays}</strong></span>
        <span>WFH Eligible: <strong style="color:#166534;">${wfhEligible}</strong></span>
    `;
    wrapper.appendChild(summary);

    // Footer
    const footer = document.createElement('div');
    footer.style.cssText = 'text-align:center; margin-top:14px; font-size:9px; color:#94a3b8; letter-spacing:0.03em;';
    footer.textContent = 'Generated by InOfficeIQ';
    wrapper.appendChild(footer);

    document.body.appendChild(wrapper);

    html2canvas(wrapper, {
        backgroundColor: '#ffffff',
        scale: 2,
        useCORS: true,
        logging: false
    }).then(canvas => {
        document.body.removeChild(wrapper);
        const link = document.createElement('a');
        link.download = `InOfficeIQ_${monthLabel}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
    }).catch(err => {
        document.body.removeChild(wrapper);
        console.error('Download failed:', err);
        alert('Failed to generate image. Please try again.');
    });
};

// Initialize the app
document.addEventListener('DOMContentLoaded', function() {
    loadSavedData();
    updateMonth();
    // Run debug after a short delay to ensure data is loaded
    setTimeout(debugDates, 1000);
});
