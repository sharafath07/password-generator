// ====== ELEMENTS ======
const passwordText = document.querySelector("#password-text");
const copyBtn = document.querySelector(".copy");
const slider = document.querySelector('input[type="range"]');
const lengthText = document.querySelector(".length");
const checkboxes = document.querySelectorAll('.options input[type="checkbox"]');
const historyList = document.querySelector(".history");
const clearBtn = document.querySelector(".clear");
const generateBtn = document.querySelector(".generate");
const note = document.querySelector(".note");
const shortcutBtn = document.querySelector(".shortcut");
const closeBtn = document.querySelector(".close");
const shortcutBox = document.querySelector(".outerbox");

const entropyText = document.querySelector("#entropy");
const crackTimeText = document.querySelector("#crack-time");
const securityLevelText = document.querySelector("#security-level");
const strengthFill = document.querySelector(".strength-fill");

const modeRadios = document.querySelectorAll('input[name="mode"]');
const phraseBox = document.querySelector(".phrase-box");
const characterBox = document.querySelector(".character-method");
const phraseBtn = document.querySelector("#phraseBtn");
const userPhraseInput = document.querySelector("#userPhrase");

// ====== CHARACTER SETS ======
const upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const lower = "abcdefghijklmnopqrstuvwxyz";
const numbers = "0123456789";
const symbols = "!@#$%^&*()_+-={}[]<>?/";

// ====== WORD LIST FOR PASSPHRASE ======
const wordList = [
    "correct","horse","battery","staple",
    "cloud","dragon","shadow","matrix",
    "crypto","falcon","galaxy","storm",
    "quantum","pixel","tiger","neon"
];

// ====== UPDATE LENGTH ======
lengthText.textContent = slider.value;
slider.addEventListener("input", () => {
    lengthText.textContent = slider.value;
});

// ====== CHARACTER PASSWORD ======
function generatePassword() {
    let chars = "";
    let password = "";

    if (checkboxes[0].checked) chars += upper;
    if (checkboxes[1].checked) chars += lower;
    if (checkboxes[2].checked) chars += numbers;
    if (checkboxes[3].checked) chars += symbols;

    if (chars === "") {
        passwordText.textContent = "Select options";
        return;
    }

    for (let i = 0; i < slider.value; i++) {
        password += chars[Math.floor(Math.random() * chars.length)];
    }

    setPassword(password);
}

// ====== PASSPHRASE MODE ======
function generatePassphrase(wordCount = 4) {
    let phrase = [];

    for (let i = 0; i < wordCount; i++) {
        const randomWord = wordList[Math.floor(Math.random() * wordList.length)];
        phrase.push(randomWord);
    }

    const finalPhrase = phrase.join("-");
    setPassword(finalPhrase);
}

// ====== CUSTOM PHRASE → STRONG PASSWORD ======
function generateFromUserPhrase() {
    const input = userPhraseInput.value.trim();
    if (!input) return;

    let password = input
        .split(" ")
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join("");

    password = password
        .replace(/a/gi, "@")
        .replace(/o/gi, "0")
        .replace(/i/gi, "1")
        .replace(/e/gi, "3")
        .replace(/s/gi, "$")
        .replace(/l/gi, "1")
        .replace(/g/gi, "9")
        .replace(/z/gi, "2")
        .replace(/m/gi, "M")
        .replace(/c/gi, "C")
        .replace(/d/gi, "D");

    const randomNum = Math.floor(Math.random() * 100);
    const randomSymbol = symbols[Math.floor(Math.random() * symbols.length)];

    password += randomSymbol + randomNum;

    setPassword(password);
}

// ====== COMMON PASSWORD SETTER ======
function setPassword(password) {
    passwordText.textContent = password;
    calculateStrength(password);
    saveToHistory(password);
    loadHistory();
}

// ====== ENTROPY CALCULATION ======
function calculateStrength(password) {
    if (!password) return;

    let poolSize = 0;

    if (/[A-Z]/.test(password)) poolSize += 26;
    if (/[a-z]/.test(password)) poolSize += 26;
    if (/[0-9]/.test(password)) poolSize += 10;
    if (/[^A-Za-z0-9]/.test(password)) poolSize += 32;

    if (poolSize === 0) return;

    const entropy = password.length * Math.log2(poolSize);
    entropyText.textContent = entropy.toFixed(2);

    const guessesPerSecond = 1e12;
    const totalGuesses = Math.pow(2, entropy);
    const seconds = totalGuesses / guessesPerSecond;

    crackTimeText.textContent = formatTime(seconds);
    updateSecurityLevel(entropy);
}

// ====== SECURITY LEVEL ======
function updateSecurityLevel(entropy) {
    let level = "";
    let color = "";
    let width = "";

    if (entropy < 28) {
        level = "Very Weak";
        color = "red";
        width = "20%";
    } else if (entropy < 36) {
        level = "Weak";
        color = "orange";
        width = "40%";
    } else if (entropy < 60) {
        level = "Medium";
        color = "yellow";
        width = "60%";
    } else if (entropy < 128) {
        level = "Strong";
        color = "#00fff0";
        width = "80%";
    } else {
        level = "Very Strong";
        color = "lime";
        width = "100%";
    }

    securityLevelText.textContent = level;
    securityLevelText.style.color = color;

    strengthFill.style.width = width;
    strengthFill.style.background = color;
}

// ====== TIME FORMATTER ======
function formatTime(seconds) {
    if (seconds < 60) return seconds.toFixed(2) + " seconds";
    if (seconds < 3600) return (seconds / 60).toFixed(2) + " minutes";
    if (seconds < 86400) return (seconds / 3600).toFixed(2) + " hours";
    if (seconds < 31536000) return (seconds / 86400).toFixed(2) + " days";
    if (seconds < 31536000000) return (seconds / 31536000).toFixed(2) + " years";
    return "Millions of years";
}

function modeChange(){
    const selected = document.querySelector('input[name="mode"]:checked').value;
    phraseBox.style.display = selected === "passphrase" ? "flex" : "none";
    characterBox.style.display = selected === "password" ? "block" : "none";
}
// ====== MODE SWITCH ======
modeRadios.forEach(radio => {
    radio.addEventListener("change", modeChange);
});

// ====== GENERATE BUTTON ======
generateBtn.addEventListener("click", () => {
    const selectedMode = document.querySelector('input[name="mode"]:checked').value;

    if (selectedMode === "password") {
        generatePassword();
    } else {
        generatePassphrase();
    }
});

// ====== PHRASE BUTTON ======
phraseBtn.addEventListener("click", generateFromUserPhrase);

// ====== COPY PASSWORD ======
copyBtn.addEventListener("click", () => {
    const password = passwordText.textContent;
    if (!password) return;

    navigator.clipboard.writeText(password);
    note.classList.add("active");
    setTimeout(() => note.classList.remove("active"), 2000);
});

// ====== HISTORY STORAGE ======
function saveToHistory(password) {
    let history = JSON.parse(localStorage.getItem("passwordHistory")) || [];
    history.unshift(password);
    if (history.length > 10) history.pop();
    localStorage.setItem("passwordHistory", JSON.stringify(history));
}

function loadHistory() {
    historyList.innerHTML = "";
    let history = JSON.parse(localStorage.getItem("passwordHistory")) || [];

    history.forEach(item => {
        const li = document.createElement("li");
        li.textContent = item;

        const icon = document.createElement("span");
        icon.className = "copy-icon fa-regular fa-copy";
        icon.addEventListener("click", () => {
            navigator.clipboard.writeText(item);
            note.classList.add("active");
            setTimeout(() => note.classList.remove("active"), 2000);
        });

        li.appendChild(icon);
        historyList.appendChild(li);
    });
}

clearBtn.addEventListener("click", () => {
    localStorage.removeItem("passwordHistory");
    loadHistory();
});

// ====== SHortCUTS ======
document.addEventListener("keydown", (e) => {

    if (e.key === "Enter") {
        generatePassword();
    } else if (e.ctrlKey && (e.key === "c" || e.key === "C")) {
        const password = passwordText.textContent;
        if (!password || password === "Select options") return;

        navigator.clipboard.writeText(password);
        note.classList.add("active");
        setTimeout(() => note.classList.remove("active"), 2000);

    } else if (e.ctrlKey && (e.key === "X" || e.key === "x")) {
        localStorage.removeItem("passwordHistory");
        loadHistory();
    } else if (e.key === "ArrowUp" || e.key === "ArrowRight") {
        let newValue = Math.min(parseInt(slider.value) + 1, slider.max);
        slider.value = newValue;
        lengthText.textContent = newValue;
    } else if (e.ctrlKey(e.key === "ArrowDown" || e.key === "ArrowLeft")) {
        let newValue = Math.max(parseInt(slider.value) - 1, slider.min);
        slider.value = newValue;
        lengthText.textContent = newValue;
    } else if (e.ctrlKey && (e.key === "g" || e.key === "G")) {
        generatePassword();
    } else if (e.ctrlKey && (e.key === "u" || e.key === "U")) {
        checkboxes[0].checked = !checkboxes[0].checked;
    } else if (e.ctrlKey && (e.key === "l" || e.key === "L")) {
        checkboxes[1].checked = !checkboxes[1].checked;
    } else if (e.ctrlKey && (e.key === "n" || e.key === "N")) {
        checkboxes[2].checked = !checkboxes[2].checked;
    } else if (e.ctrlKey && (e.key === "s" || e.key === "S")) {
        checkboxes[3].checked = !checkboxes[3].checked;
    } else if (e.ctrlKey && (e.key === "r" || e.key === "R")) {
        window.location.reload();
    }

});

shortcutBtn.addEventListener("click", () => { 
    shortcutBox.classList.add("active");
});
closeBtn.addEventListener("click", () => {
    shortcutBox.classList.remove("active");
});

loadHistory();
modeChange(); 
