// ====== ELEMENTS ======
const passwordText = document.querySelector("#password-text");
const copyBtn = document.querySelector(".copy");
const slider = document.querySelector('input[type="range"]');
const lengthText = document.querySelector(".length");
const checkboxes = document.querySelectorAll('.options input[type="checkbox"]');
const historyList = document.querySelector(".history");
const clearBtn = document.querySelector(".clear");
const generateBtn = document.querySelector(".generate");
const note = document.getElementById("note");

// ====== CHARACTER SETS ======
const upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const lower = "abcdefghijklmnopqrstuvwxyz";
const numbers = "0123456789";
const symbols = "!@#$%^&*()_+-={}[]<>?/";
const history = []

// ====== UPDATE LENGTH ======
lengthText.textContent = slider.value;

slider.addEventListener("input", () => {
    lengthText.textContent = slider.value;
});

// ====== GENERATE PASSWORD ======
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

    passwordText.textContent = password;
    saveToHistory(password);
    loadHistory();
}

// ====== COPY PASSWORD ======
copyBtn.addEventListener("click", () => {
    const password = passwordText.textContent;
    if (!password || password === "Select options") return;

    navigator.clipboard.writeText(password);
    
    note.classList.add("show");
    setTimeout(() => {
        note.classList.remove("show");
    }, 5000);
    
});

generateBtn.addEventListener("click", () => {
    generatePassword();
});

// ====== LOCAL STORAGE ======
function saveToHistory(password) {
    let history = JSON.parse(localStorage.getItem("passwordHistory")) || [];
    history.unshift(password);

    // limit history to 10
    if (history.length > 10) history.pop();

    localStorage.setItem("passwordHistory", JSON.stringify(history));
    loadHistory()
}

// ====== LOAD HISTORY ======
function loadHistory() {
    historyList.innerHTML = "";
    let history = JSON.parse(localStorage.getItem("passwordHistory")) || [];

    history.forEach(item => {
        const li = document.createElement("li");
        li.innerHTML = `
            ${item}
            <span class="copy-icon">📋</span>
        `;

        li.querySelector(".copy-icon").addEventListener("click", () => {
            navigator.clipboard.writeText(item);
        });

        historyList.appendChild(li);
    });
}

// ====== CLEAR HISTORY ======
clearBtn.addEventListener("click", () => {
    localStorage.removeItem("passwordHistory");
    loadHistory();
});

// ====== INITIAL LOAD ======
// generatePassword();
loadHistory();

