 
const tabs = document.querySelectorAll(".convert p");
const convertLabel = document.querySelector(".convert-label");
const fromSelect = document.getElementById("fromUnit");
const toSelect = document.getElementById("toUnit");
const valueInput = document.getElementById("valueInput");
const resultText = document.getElementById("resultText");
const convertBtn = document.getElementById("convertBtn");
const resetBtn = document.getElementById("resetBtn");

//  UNIT OPTIONS 
const units = {
  length: ["millimeter", "centimeter", "meter", "kilometer", "inch", "foot", "yard", "mile"],
  weight: ["milligram", "gram", "kilogram", "ounce", "pound"],
  temperature: ["Celsius", "Fahrenheit", "Kelvin"],
};

//  ACTIVE TYPE 
let currentType = "length";


// Update label and dropdowns when tab is clicked
function updateType(type) {
  currentType = type;
  convertLabel.textContent = `Enter the ${type.charAt(0).toUpperCase() + type.slice(1)} to Convert`;

  // update dropdown options
  updateDropdownOptions(type);
}

// Populate dropdowns
function updateDropdownOptions(type) {
  const options = units[type]
    .map((unit) => `<option value="${unit}">${unit}</option>`)
    .join("");
  fromSelect.innerHTML = options;
  toSelect.innerHTML = options;
}

// Highlight active tab
tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    tabs.forEach((t) => t.classList.remove("color-blue"));
    tab.classList.add("color-blue");
    updateType(tab.dataset.type);
  });
});

// Convert button handler
convertBtn.addEventListener("click", () => {
  const value = parseFloat(valueInput.value);
  const fromUnit = fromSelect.value;
  const toUnit = toSelect.value;

  if (isNaN(value)) {
    resultText.textContent = "Please enter a valid number!";
    return;
  }

  // Send data to the server
  fetch("/", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      value,
      fromUnit,
      toUnit,
      type: currentType,
    }),
  })
    .then((res) => res.text())
    .then((data) => {
      resultText.innerHTML = data;
    })
    .catch(() => {
      resultText.textContent = "Error performing conversion.";
    });
});

// Reset form
resetBtn.addEventListener("click", () => {
  valueInput.value = "";
  resultText.textContent = "--";
});

// ====== INITIAL SETUP ======
updateDropdownOptions(currentType);
