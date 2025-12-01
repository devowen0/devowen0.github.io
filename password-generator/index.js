const characters = ["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z","a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9","~","`","!","@","#","$","%","^","&","*","(",")","_","-","+","=","{","[","}","]",",","|",":",";","<",">",".","?","/"]
const letters = characters.slice(0, 52);    // A-Z + a-z
const numbers = characters.slice(52, 62);  // 0-9
const symbols = characters.slice(62);      // special characters

let includeNumbers = true;        // controlled by first checkbox
let includeSymbols = true;        // controlled by second checkbox

let passwordEl = document.getElementById("password-el");
let passwordsEl = document.getElementById ("passwords-el")

let body = document.body;
let includeSpecialCharacters = true
let maxLoop = 8
let arrayLength = characters.length

const strengthFill = document.getElementById("strength-fill");

window.addEventListener("DOMContentLoaded", () => {
    assignPasswordsToButtons();  // generate password in the box
    updateStrengthBar();         // update the strength bar and text
});

function toggleNumbers() {
    includeNumbers = !includeNumbers;
    assignPasswordsToButtons();
    updateStrengthBar();     // <--- add this
}

const copyIcon = document.getElementById("copy-icon");
const copyTooltip = document.getElementById("copy-tooltip");
const mainContainer = document.querySelector(".main");

let tooltipTimeout;

copyIcon.addEventListener("mouseenter", () => {
    // Wait 1 second before showing tooltip
    tooltipTimeout = setTimeout(() => {
        const iconRect = copyIcon.getBoundingClientRect();
        const mainRect = mainContainer.getBoundingClientRect();

        // Position tooltip below the icon
        copyTooltip.style.left = iconRect.left - mainRect.left + iconRect.width / 2 + "px";
        copyTooltip.style.top = iconRect.bottom - mainRect.top + 2 + "px"; // closer to icon
        copyTooltip.style.opacity = "1";
    }, 1000); // 1000ms = 1 second
});

copyIcon.addEventListener("mouseleave", () => {
    // Cancel pending tooltip if user moves away before 1 second
    clearTimeout(tooltipTimeout);

    // Hide tooltip immediately
    copyTooltip.style.opacity = "0";
});

function toggleSymbols() {
    includeSymbols = !includeSymbols;
    assignPasswordsToButtons();
    updateStrengthBar();     // <--- add this
}

function toggleSpecial() {
    includeSpecialCharacters = !includeSpecialCharacters;
    assignPasswordsToButtons();
    updateStrengthBar();     // <--- add this
}

const slider = document.getElementById("number-range-el");

function updateSliderBackground(slider) {
    const value = (slider.value - slider.min) / (slider.max - slider.min) * 100;
    slider.style.background = `linear-gradient(to right, #10B981 0%, #10B981 ${value}%, #d1d5db ${value}%, #d1d5db 100%)`;
}

// Initialize on page load
updateSliderBackground(slider);

// Update on input
slider.addEventListener("input", () => updateSliderBackground(slider));


function updateStrengthBar() {
    const length = parseInt(document.getElementById("number-range-el").value, 10);

    // Determine the rule set
    let veryWeakMax, weakMax, strongMin, maxLen;

    if (includeNumbers && includeSymbols) {
        // ORIGINAL CASE
        veryWeakMax = 9;
        weakMax = 14;
        strongMin = 15;
        maxLen = 20;

    } else if (includeNumbers && !includeSymbols) {
        // NUMBERS ONLY
        veryWeakMax = 11;
        weakMax = 17;
        strongMin = 18;
        maxLen = 22;

    } else if (!includeNumbers && includeSymbols) {
        // SYMBOLS ONLY
        veryWeakMax = 10;
        weakMax = 16;
        strongMin = 17;
        maxLen = 22;

    } else {
        // LETTERS ONLY
        veryWeakMax = 15;
        weakMax = 18;
        strongMin = 19;
        maxLen = 25;
    }

    // --- BAR FILL SCALING ---
    const minFill = 5;     // ALWAYS start at 5%
    const maxFill = 100;

    // We make the "effective minimum" = 1 (or whatever your slider minimum is)
    const minLen = 4;

    let fillPercent;

    if (length <= minLen) {
        fillPercent = minFill;
    } else if (length >= maxLen) {
        fillPercent = maxFill;
    } else {
        fillPercent =
            ((length - minLen) / (maxLen - minLen)) * (maxFill - minFill) + minFill;
    }

    strengthFill.style.width = fillPercent + "%";

    // --- COLOR & LABEL LOGIC ---
    let strengthText = "";

    if (length >= strongMin) {
        strengthFill.style.backgroundColor = "#10B981"; // green
        strengthText = "Strong";

    } else if (length >= (veryWeakMax + 1)) {
        strengthFill.style.backgroundColor = "#F59E0B"; // orange
        strengthText = "Weak";

    } else {
        strengthFill.style.backgroundColor = "#EC4899"; // pink/red
        strengthText = "Very Weak";
    }

    document.getElementById("strength-text").textContent = strengthText;
}

function crossFadeBackgroundAndToggleTheme() {
  const body = document.body;

  const prevBackground = getComputedStyle(body).background;

  body.classList.toggle('dark-theme');

  const fader = document.createElement('div');
  fader.className = 'bg-fader';
  fader.style.background = prevBackground;

  document.body.appendChild(fader);

  fader.offsetHeight;

  fader.classList.add('fade-out');

  fader.addEventListener('transitionend', () => {
    fader.remove();
  }, { once: true });

  // Change icon
  const toggle = document.getElementById("theme-toggle");
  if (body.classList.contains("dark-theme")) {
      toggle.src = "light-mode.svg";
  } else {
      toggle.src = "dark-mode.svg";
  }
}


function generatePasswords() {
    const length = parseInt(document.getElementById("number-range-el").value, 10);

    // Always start with letters
    let pool = [...letters];  // copy array

    // Add numbers if checkbox is checked
    if (includeNumbers) pool = pool.concat(numbers);

    // Add symbols if checkbox is checked
    if (includeSymbols) pool = pool.concat(symbols);

    let password = "";
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * pool.length);
        password += pool[randomIndex];
    }

    return password;
}


function changeSpecialCharacters(){
    includeSpecialCharacters = !includeSpecialCharacters
    arrayLength = includeSpecialCharacters ? characters.length : 52; //the length of the array where special characters start
}

const numberSlider = document.getElementById("number-range-el");

// Whenever the slider moves, update the display AND generate new passwords
numberSlider.addEventListener("input", () => {
    updateCharacterNumber(numberSlider.value);
    assignPasswordsToButtons();
    updateStrengthBar(); // <--- add this
});

let passwordBox = document.getElementById("password-box");

function assignPasswordsToButtons() {
    let password = generatePasswords();

    // Optional: insert line breaks after 50 characters
    if (password.length > 50) {
        password = password.match(/.{1,50}/g).join("\n");
    }

    document.getElementById("password-text").textContent = password;
}

function copyPassword(elementId) {
    const textToCopy = document.getElementById(elementId).textContent;

    navigator.clipboard.writeText(textToCopy).then(() => {
        // Change tooltip text to 'Copied'
        copyTooltip.innerText = "Copied";
        copyTooltip.style.opacity = "1";  // Make sure tooltip is visible

        // After 1.5 seconds, revert back to 'Copy'
        setTimeout(() => {
            copyTooltip.innerText = "Copy";
            copyTooltip.style.opacity = "0"; // hide again
        }, 1500);
    }).catch(err => {
        console.error("Failed to copy: ", err);
    });
}


function updateCharacterNumber(value) {
    document.getElementById("number-display").textContent = value;
}

// Optional: if you were previously using selectNumberOfCharacters(), update it to get the value from the slider:
function selectNumberOfCharacters() {
    const number = document.getElementById("number-range-el").value;
    console.log("Number of characters selected:", number);
}
