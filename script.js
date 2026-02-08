/* ========================================
   Smart Livestock Health Monitoring System
   Vanilla JavaScript — no frameworks
   ======================================== */

// ---- SVG Icon Templates ----
const ICONS = {
  activity: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2"/></svg>',
  heart: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>',
  thermometer: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 4v10.54a4 4 0 1 1-4 0V4a2 2 0 0 1 4 0Z"/></svg>',
  wind: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.7 7.7a2.5 2.5 0 1 1 1.8 4.3H2"/><path d="M9.6 4.6A2 2 0 1 1 11 8H2"/><path d="M12.6 19.4A2 2 0 1 0 14 16H2"/></svg>',
  bell: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>',
  shieldCheck: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><path d="m9 12 2 2 4-4"/></svg>',
  alertTriangle: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>',
  alertCircle: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 8v4"/><path d="M12 16h.01"/></svg>',
  flame: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></svg>',
  search: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>',
  filter: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>',
};

// ---- Data Generation (mirrors livestock-data.js) ----
const ANIMAL_NAMES = [
  "Bella","Daisy","Rosie","Clover","Buttercup",
  "Maggie","Luna","Penny","Dolly","Ginger",
  "Hazel","Maple","Willow","Star","Ruby",
];

const BREEDS = [
  "Holstein","Jersey","Angus","Hereford","Simmental",
  "Charolais","Brahman","Limousin",
];

function rand(min, max) {
  return Math.round((Math.random() * (max - min) + min) * 10) / 10;
}

function generateAnimal(i) {
  var roll = Math.random();
  var status = "Healthy", hr = rand(60, 80), temp = rand(38.0, 39.0), spo2 = rand(95, 100);
  if (roll > 0.85) {
    status = "Critical"; hr = rand(95, 130); temp = rand(40.0, 41.5); spo2 = rand(82, 89);
  } else if (roll > 0.65) {
    status = "Warning"; hr = rand(80, 100); temp = rand(39.2, 40.2); spo2 = rand(89, 94);
  }
  var acts = ["Active","Resting","Grazing","Idle"];
  return {
    id: "LV-" + String(i + 1).padStart(3, "0"),
    name: ANIMAL_NAMES[i % ANIMAL_NAMES.length],
    breed: BREEDS[Math.floor(Math.random() * BREEDS.length)],
    heartRate: hr, temperature: temp, spo2: spo2,
    activityStatus: status === "Critical" ? "Idle" : acts[Math.floor(Math.random() * acts.length)],
    healthStatus: status,
    heatCycleDetected: Math.random() > 0.8,
    lastUpdated: new Date(Date.now() - Math.floor(Math.random() * 600000)).toISOString(),
  };
}

function generateAnimals(n) {
  return Array.from({ length: n }, function (_, i) { return generateAnimal(i); });
}

function generateTrend(baseValue, variance, minVal, maxVal) {
  var hours = ["6AM","8AM","10AM","12PM","2PM","4PM","6PM","8PM"];
  var v = baseValue;
  return hours.map(function (t) {
    v = Math.max(minVal, Math.min(maxVal, v + rand(-variance, variance)));
    return { time: t, value: Math.round(v * 10) / 10 };
  });
}

function generateAlerts(animals) {
  var alerts = [];
  animals.forEach(function (a) {
    if (a.healthStatus === "Critical") {
      if (a.heartRate > 100) alerts.push({ id: "a-hr-" + a.id, animalId: a.id, type: "heart_rate", message: a.name + " (" + a.id + ") heart rate critically high at " + a.heartRate + " bpm", severity: "critical", timestamp: a.lastUpdated });
      if (a.temperature > 40) alerts.push({ id: "a-t-" + a.id, animalId: a.id, type: "temperature", message: a.name + " (" + a.id + ") temperature critically elevated at " + a.temperature + "\u00B0C", severity: "critical", timestamp: a.lastUpdated });
      if (a.spo2 < 90) alerts.push({ id: "a-s-" + a.id, animalId: a.id, type: "spo2", message: a.name + " (" + a.id + ") SpO2 dangerously low at " + a.spo2 + "%", severity: "critical", timestamp: a.lastUpdated });
    } else if (a.healthStatus === "Warning") {
      if (a.heartRate > 85) alerts.push({ id: "a-hr-" + a.id, animalId: a.id, type: "heart_rate", message: a.name + " (" + a.id + ") heart rate elevated at " + a.heartRate + " bpm", severity: "warning", timestamp: a.lastUpdated });
      if (a.temperature > 39.5) alerts.push({ id: "a-t-" + a.id, animalId: a.id, type: "temperature", message: a.name + " (" + a.id + ") mild fever detected at " + a.temperature + "\u00B0C", severity: "warning", timestamp: a.lastUpdated });
    }
  });
  alerts.sort(function (a, b) { return a.severity === "critical" ? -1 : 1; });
  return alerts;
}

// ---- Weekly Data ----
var WEEKLY = {
  heartRate: [
    { time: "Mon", value: 72 },{ time: "Tue", value: 74 },{ time: "Wed", value: 70 },
    { time: "Thu", value: 76 },{ time: "Fri", value: 73 },{ time: "Sat", value: 68 },{ time: "Sun", value: 71 },
  ],
  temperature: [
    { time: "Mon", value: 38.6 },{ time: "Tue", value: 38.8 },{ time: "Wed", value: 38.5 },
    { time: "Thu", value: 39.1 },{ time: "Fri", value: 38.7 },{ time: "Sat", value: 38.4 },{ time: "Sun", value: 38.6 },
  ],
  spo2: [
    { time: "Mon", value: 96 },{ time: "Tue", value: 97 },{ time: "Wed", value: 95 },
    { time: "Thu", value: 97 },{ time: "Fri", value: 96 },{ time: "Sat", value: 98 },{ time: "Sun", value: 97 },
  ],
  activity: [
    { time: "Mon", value: 65 },{ time: "Tue", value: 72 },{ time: "Wed", value: 58 },
    { time: "Thu", value: 80 },{ time: "Fri", value: 69 },{ time: "Sat", value: 55 },{ time: "Sun", value: 45 },
  ],
};

// ---- State ----
var animals = generateAnimals(15);
var alerts = generateAlerts(animals);
var dailyData = {
  heartRate: generateTrend(72, 8, 55, 110),
  temperature: generateTrend(38.5, 0.3, 37.5, 41.0),
  spo2: generateTrend(97, 2, 85, 100),
  activity: generateTrend(60, 15, 10, 95),
};
var currentTab = "daily";
var chartInstances = {};

// ---- DOM Helpers ----
function $(sel) { return document.querySelector(sel); }
function $$(sel) { return document.querySelectorAll(sel); }

// ---- Render Functions ----
function renderNavbar() {
  var alertCount = alerts.length;
  $("#navbar-bell-badge").textContent = alertCount;
  if (alertCount === 0) {
    $("#navbar-bell-badge").style.display = "none";
  }
}

function renderStats() {
  var total = animals.length;
  var healthy = animals.filter(function (a) { return a.healthStatus === "Healthy"; }).length;
  var atRisk = animals.filter(function (a) { return a.healthStatus === "Warning" || a.healthStatus === "Critical"; }).length;
  var heat = animals.filter(function (a) { return a.heatCycleDetected; }).length;

  $("#stat-total").textContent = total;
  $("#stat-risk").textContent = atRisk;
  $("#stat-healthy").textContent = healthy;
  $("#stat-heat").textContent = heat;
}

function makeChartOptions(color, unit, minY, maxY) {
  return {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "#fff",
        titleColor: "hsl(200,10%,45%)",
        bodyColor: "hsl(200,25%,14%)",
        borderColor: "hsl(200,18%,89%)",
        borderWidth: 1,
        padding: 10,
        displayColors: false,
        callbacks: {
          label: function (ctx) { return ctx.parsed.y + unit; },
        },
      },
    },
    scales: {
      x: {
        grid: { color: "hsl(200,18%,89%)", drawBorder: false },
        ticks: { color: "hsl(200,10%,45%)", font: { size: 11 } },
      },
      y: {
        min: minY, max: maxY,
        grid: { color: "hsl(200,18%,89%)", drawBorder: false },
        ticks: { color: "hsl(200,10%,45%)", font: { size: 11 } },
      },
    },
    elements: {
      point: { radius: 3, hoverRadius: 5 },
      line: { tension: 0.35, borderWidth: 2.5 },
    },
  };
}

function createLineChart(canvasId, data, color, unit, minY, maxY) {
  var ctx = document.getElementById(canvasId).getContext("2d");
  if (chartInstances[canvasId]) chartInstances[canvasId].destroy();
  chartInstances[canvasId] = new Chart(ctx, {
    type: "line",
    data: {
      labels: data.map(function (d) { return d.time; }),
      datasets: [{
        data: data.map(function (d) { return d.value; }),
        borderColor: color,
        backgroundColor: color,
        pointBackgroundColor: color,
        fill: false,
      }],
    },
    options: makeChartOptions(color, unit, minY, maxY),
  });
}

function createAreaChart(canvasId, data, color, unit, minY, maxY) {
  var ctx = document.getElementById(canvasId).getContext("2d");
  if (chartInstances[canvasId]) chartInstances[canvasId].destroy();

  // Gradient fill
  var gradient = ctx.createLinearGradient(0, 0, 0, 192);
  gradient.addColorStop(0, color.replace(")", ", 0.3)").replace("hsl(", "hsla("));
  gradient.addColorStop(1, color.replace(")", ", 0)").replace("hsl(", "hsla("));

  chartInstances[canvasId] = new Chart(ctx, {
    type: "line",
    data: {
      labels: data.map(function (d) { return d.time; }),
      datasets: [{
        data: data.map(function (d) { return d.value; }),
        borderColor: color,
        backgroundColor: gradient,
        pointBackgroundColor: color,
        fill: true,
      }],
    },
    options: makeChartOptions(color, unit, minY, maxY),
  });
}

function renderCharts() {
  var src = currentTab === "daily" ? dailyData : WEEKLY;
  createLineChart("chart-hr", src.heartRate, "hsl(0,72%,55%)", " bpm", undefined, undefined);
  createLineChart("chart-temp", src.temperature, "hsl(38,92%,50%)", "\u00B0C", 37, 42);
  createAreaChart("chart-spo2", src.spo2, "hsl(199,80%,46%)", "%", 80, 100);
  createAreaChart("chart-activity", src.activity, "hsl(152,60%,36%)", "%", undefined, undefined);
}

function setActiveTab(tab) {
  currentTab = tab;
  $$(".tab-btn").forEach(function (btn) {
    btn.classList.toggle("active", btn.dataset.tab === tab);
  });
  // Update chart subtitles
  var suffix = tab === "daily" ? "" : " - Weekly Avg";
  $("#chart-hr-title").textContent = "Heart Rate" + suffix + " (bpm)";
  $("#chart-temp-title").textContent = "Body Temperature" + suffix + " (\u00B0C)";
  $("#chart-spo2-title").textContent = "SpO2" + suffix + " (%)";
  $("#chart-activity-title").textContent = "Activity / Movement" + suffix;
  renderCharts();
}

function renderTable(filteredAnimals) {
  var tbody = $("#animal-tbody");
  if (filteredAnimals.length === 0) {
    tbody.innerHTML = '<tr class="empty-row"><td colspan="7">No animals found matching your search.</td></tr>';
    return;
  }
  tbody.innerHTML = filteredAnimals.map(function (a) {
    var hrClass = a.heartRate > 95 ? "val-critical" : a.heartRate > 80 ? "val-warning" : "val-normal";
    var tempClass = a.temperature > 40 ? "val-critical" : a.temperature > 39.2 ? "val-warning" : "val-normal";
    var spo2Class = a.spo2 < 90 ? "val-critical" : a.spo2 < 95 ? "val-warning" : "val-normal";
    var badgeClass = "badge--" + a.healthStatus.toLowerCase();
    return '<tr>' +
      '<td class="cell-id">' + a.id + '</td>' +
      '<td class="cell-name">' + a.name + '</td>' +
      '<td class="text-center"><span class="' + hrClass + '">' + a.heartRate + '</span></td>' +
      '<td class="text-center"><span class="' + tempClass + '">' + a.temperature + '</span></td>' +
      '<td class="text-center"><span class="' + spo2Class + '">' + a.spo2 + '</span></td>' +
      '<td class="text-center"><span class="val-muted">' + a.activityStatus + '</span></td>' +
      '<td class="text-center"><span class="badge ' + badgeClass + '"><span class="badge-dot"></span>' + a.healthStatus + '</span></td>' +
      '</tr>';
  }).join("");
}

function filterAnimals() {
  var query = ($("#search-input").value || "").toLowerCase();
  var status = $("#status-filter").value;
  var filtered = animals.filter(function (a) {
    var matchSearch = a.id.toLowerCase().indexOf(query) !== -1 || a.name.toLowerCase().indexOf(query) !== -1;
    var matchStatus = status === "all" || a.healthStatus === status;
    return matchSearch && matchStatus;
  });
  renderTable(filtered);
}

function renderAlerts() {
  var body = $("#alerts-body");
  var countEl = $("#alerts-count");

  if (alerts.length === 0) {
    if (countEl) countEl.style.display = "none";
    body.innerHTML =
      '<div class="alerts-empty">' +
        '<div class="alerts-empty-icon">' + ICONS.alertCircle + '</div>' +
        '<p class="alerts-empty-title">All Clear</p>' +
        '<p class="alerts-empty-sub">No abnormal readings detected</p>' +
      '</div>';
    return;
  }

  countEl.textContent = alerts.length;
  countEl.style.display = "flex";

  var typeIconMap = { heart_rate: "heart", temperature: "thermometer", spo2: "wind", activity: "activity" };

  body.innerHTML = alerts.map(function (al) {
    var cls = al.severity === "critical" ? "alert-item--critical" : "alert-item--warning";
    var icon = ICONS[typeIconMap[al.type]] || ICONS.alertTriangle;
    var timeStr = new Date(al.timestamp).toLocaleTimeString();
    return '<div class="alert-item ' + cls + '">' +
      '<div class="alert-icon-box">' + icon + '</div>' +
      '<div class="alert-body">' +
        '<div><span class="alert-severity">' + al.severity + '</span><span class="alert-animal-id">' + al.animalId + '</span></div>' +
        '<p class="alert-message">' + al.message + '</p>' +
        '<p class="alert-time">' + timeStr + '</p>' +
      '</div>' +
    '</div>';
  }).join("");
}

// ---- Init ----
document.addEventListener("DOMContentLoaded", function () {
  renderNavbar();
  renderStats();
  renderCharts();
  renderTable(animals);
  renderAlerts();

  // Tab switching
  $$(".tab-btn").forEach(function (btn) {
    btn.addEventListener("click", function () {
      setActiveTab(btn.dataset.tab);
    });
  });

  // Search & filter
  $("#search-input").addEventListener("input", filterAnimals);
  $("#status-filter").addEventListener("change", filterAnimals);
});
