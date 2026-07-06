let currentYear, currentMonth;
let selectedDate = null;
let moonData = null;

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const DAYS_OF_WEEK = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

function setup() {
  createCanvas(750, 450);
  
  // Start with the current real-world month and year
  let d = new Date();
  currentYear = d.getFullYear();
  currentMonth = d.getMonth();
  
  // Default selection to today
  selectDate(d.getDate(), currentMonth, currentYear);
}

function draw() {
  background(245);
  
  // Draw layout dividers
  stroke(200);
  line(400, 0, 400, height);
  
  // Render Components
  drawCalendar(20, 20, 360, 400);
  drawSidebar(420, 20, 310, 400);
}

function drawCalendar(x, y, w, h) {
  push();
  translate(x, y);
  
  // Month and Year Title
  fill(30);
  noStroke();
  textSize(20);
  textAlign(LEFT, TOP);
  text(`${MONTH_NAMES[currentMonth]} ${currentYear}`, 10, 5);
  
  // Navigation Buttons
  drawButton("<", w - 70, 0, 30, 25);
  drawButton(">", w - 35, 0, 30, 25);
  
  // Weekday Headers
  fill(100);
  textSize(14);
  textAlign(CENTER, CENTER);
  let colWidth = w / 7;
  for (let i = 0; i < 7; i++) {
    text(DAYS_OF_WEEK[i], colWidth * i + colWidth / 2, 45);
  }
  
  // Calendar Grid Calculations
  let firstDay = new Date(currentYear, currentMonth, 1).getDay();
  let numDays = new Date(currentYear, currentMonth + 1, 0).getDate();
  
  let row = 0;
  let col = firstDay;
  
  for (let day = 1; day <= numDays; day++) {
    let cellX = col * colWidth;
    let cellY = 70 + row * 50;
    
    // Check if this cell is the selected date
    let isSelected = (selectedDate && selectedDate.day === day && 
                      selectedDate.month === currentMonth && 
                      selectedDate.year === currentYear);
    
    // Draw cell highlight/hover effects
    if (isSelected) {
      fill(63, 81, 181); // Elegant Blue
      rect(cellX + 2, cellY + 2, colWidth - 4, 46, 6);
      fill(255);
    } else {
      fill(255);
      stroke(230);
      rect(cellX + 2, cellY + 2, colWidth - 4, 46, 6);
      fill(50);
    }
    
    // Draw Day Number
    noStroke();
    textSize(15);
    textAlign(CENTER, CENTER);
    text(day, cellX + colWidth / 2, cellY + 25);
    
    // Move to next grid position
    col++;
    if (col > 6) {
      col = 0;
      row++;
    }
  }
  pop();
}

function drawButton(txt, x, y, w, h) {
  fill(230);
  if (mouseX > x + 20 && mouseX < x + 20 + w && mouseY > y + 20 && mouseY < y + 20 + h) {
    fill(210); // Hover state
  }
  noStroke();
  rect(x, y, w, h, 4);
  
  fill(50);
  textSize(14);
  textAlign(CENTER, CENTER);
  text(txt, x + w / 2, y + h / 2);
}

function drawSidebar(x, y, w, h) {
  if (!moonData) return;
  
  push();
  translate(x, y);
  
  // Date Header
  fill(50);
  noStroke();
  textSize(18);
  textAlign(LEFT, TOP);
  text(`${selectedDate.day} ${MONTH_NAMES[selectedDate.month]} ${selectedDate.year}`, 0, 5);
  
  // Draw the Moon Shape
  drawMoonIcon(w / 2, 90, 50, moonData.phase);
  
  // Phase & Paksha Details
  fill(30);
  textAlign(CENTER, TOP);
  textSize(22);
  text(moonData.paksha, w / 2, 160);
  
  textSize(16);
  fill(80);
  text(`Tithi: ${moonData.tithi}`, w / 2, 195);
  
  // Countdown section
  stroke(220);
  line(20, 240, w - 20, 240);
  noStroke();
  
  textAlign(LEFT, TOP);
  fill(60);
  textSize(14);
  text(`• Days until Full Moon (Purnima):`, 10, 265);
  textAlign(RIGHT, TOP);
  fill(0);
  text(`${moonData.daysToFull.toFixed(1)} days`, w - 10, 265);
  
  textAlign(LEFT, TOP);
  fill(60);
  text(`• Days until New Moon (Amavasya):`, 10, 300);
  textAlign(RIGHT, TOP);
  fill(0);
  text(`${moonData.daysToNew.toFixed(1)} days`, w - 10, 300);
  
  pop();
}

function drawMoonIcon(cx, cy, r, phase) {
  push();
  translate(cx, cy);
  
  // Background (Dark universe/shadow part)
  fill(40, 44, 52);
  noStroke();
  ellipse(0, 0, r * 2, r * 2);
  
  // Lit part color (Soft Moon Glow)
  fill(254, 252, 215);
  
  if (phase <= 0.5) {
    // Waxing hemisphere (Right side is lit)
    arc(0, 0, r * 2, r * 2, -HALF_PI, HALF_PI);
    // Overlay mapping for crescent/gibbous curve
    let mapW = map(phase, 0, 0.5, r * 2, -r * 2);
    if (mapW > 0) {
      fill(40, 44, 52); // Crescent shadow overlay
      arc(0, 0, mapW, r * 2, -HALF_PI, HALF_PI);
    } else {
      fill(254, 252, 215); // Gibbous light overlay
      arc(0, 0, abs(mapW), r * 2, HALF_PI, -HALF_PI);
    }
  } else {
    // Waning hemisphere (Left side is lit)
    arc(0, 0, r * 2, r * 2, HALF_PI, -HALF_PI);
    // Overlay mapping
    let mapW = map(phase, 0.5, 1.0, -r * 2, r * 2);
    if (mapW < 0) {
      fill(254, 252, 215); // Gibbous light overlay
      arc(0, 0, abs(mapW), r * 2, -HALF_PI, HALF_PI);
    } else {
      fill(40, 44, 52); // Crescent shadow overlay
      arc(0, 0, mapW, r * 2, HALF_PI, -HALF_PI);
    }
  }
  pop();
}

function mousePressed() {
  // Check Month Prev/Next Button Clicks
  let btnY = 20;
  let prevBtnX = 20 + 360 - 70;
  let nextBtnX = 20 + 360 - 35;
  
  if (mouseY > btnY && mouseY < btnY + 25) {
    if (mouseX > prevBtnX && mouseX < prevBtnX + 30) {
      currentMonth--;
      if (currentMonth < 0) {
        currentMonth = 11;
        currentYear--;
      }
      return;
    }
    if (mouseX > nextBtnX && mouseX < nextBtnX + 30) {
      currentMonth++;
      if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
      }
      return;
    }
  }
  
  // Check Date Selection Clicks
  let firstDay = new Date(currentYear, currentMonth, 1).getDay();
  let numDays = new Date(currentYear, currentMonth + 1, 0).getDate();
  let colWidth = 360 / 7;
  
  let row = 0;
  let col = firstDay;
  
  for (let day = 1; day <= numDays; day++) {
    let cellX = 20 + col * colWidth;
    let cellY = 20 + 70 + row * 50;
    
    if (mouseX > cellX && mouseX < cellX + colWidth && mouseY > cellY && mouseY < cellY + 50) {
      selectDate(day, currentMonth, currentYear);
      break;
    }
    
    col++;
    if (col > 6) { col = 0; row++; }
  }
}

function selectDate(day, month, year) {
  selectedDate = { day, month, year };
  moonData = calculateMoonData(day, month, year);
}

// --- ASTRONOMICAL & HINDU CALENDAR CALCULATIONS ---
function calculateMoonData(day, month, year) {
  // Approximate Julian Date mapping
  let d = new Date(year, month, day);
  let timeMS = d.getTime();
  
  // Known reference New Moon: JDN 2451550.1 (Jan 6, 2000)
  let refMS = Date.UTC(2000, 0, 6, 18, 14, 0); 
  let synodicPeriod = 29.530588853; // Length of a lunar month in days
  
  let deltaDays = (timeMS - refMS) / (1000 * 60 * 60 * 24);
  
  // Calculate raw lunar phase (Normalized 0.0 to 1.0)
  let phase = deltaDays / synodicPeriod;
  phase = phase - floor(phase);
  if (phase < 0) phase += 1.0;
  
  // Map phase to Tithi (30 Tithis per lunar cycle, 15 per Paksha)
  let exactTithi = phase * 30;
  let tithiNum = floor(exactTithi) + 1;
  
  let paksha = "";
  let tithiName = "";
  
  if (tithiNum <= 15) {
    paksha = "Shukla Paksha (Waxing)";
    tithiName = getTithiName(tithiNum);
  } else {
    paksha = "Krishna Paksha (Waning)";
    tithiName = getTithiName(tithiNum - 15);
  }
  
  // Edge-case naming for New Moon & Full Moon titles
  if (tithiNum === 15) tithiName = "Purnima (Full Moon)";
  if (tithiNum === 30) tithiName = "Amavasya (New Moon)";
  
  // Days Remaining calculations
  let currentAgeInDays = phase * synodicPeriod;
  
  let daysToFull = 14.765 - currentAgeInDays;
  if (daysToFull < 0) daysToFull += synodicPeriod;
  
  let daysToNew = synodicPeriod - currentAgeInDays;
  if (daysToNew < 0) daysToNew += synodicPeriod;
  
  return {
    phase: phase,
    paksha: paksha,
    tithi: tithiName,
    daysToFull: daysToFull,
    daysToNew: daysToNew
  };
}

function getTithiName(n) {
  const tithis = [
    "Prathama", "Dwitiya", "Tritiya", "Chaturthi", "Panchami", 
    "Shashthi", "Saptami", "Ashtami", "Navami", "Dashami", 
    "Ekadashi", "Dwadashi", "Trayodashi", "Chaturdashi", "Purnima/Amavasya"
  ];
  return tithis[n - 1] || "";
}
