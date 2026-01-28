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
const shortcut = document.querySelector("#short");
const shortcutList = document.querySelector(".shortbg");
const closeShortcut = document.querySelector(".close");

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

    note.style.display = 'inline';

    setTimeout(() => {
        note.style.display = 'none';
    }, 2000);
    
});

generateBtn.addEventListener("click", () => {
    generatePassword();
});

// ====== SAVE TO LOCAL STORAGE ======
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
            <span class="copy-icon fa-regular fa-copy"></span>
        `;

        li.querySelector(".copy-icon").addEventListener("click", () => {
            navigator.clipboard.writeText(item);
            note.style.display = 'inline';

            setTimeout(() => {
                note.style.display = 'none';
            }, 2000);
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
loadHistory();

// ====== KEYBOARD SHORTCUTS ======
shortcut.addEventListener("click", () => {
    shortcutList.style.display = "block";
})

closeShortcut.addEventListener("click", () => {
    shortcutList.style.display = "none";
})

document.querySelector("body").addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        generatePassword();
    } else if ((e.key === "c" || e.key === "C")) {
        const password = passwordText.textContent;
        if (!password || password === "Select options") return;

        navigator.clipboard.writeText(password);

        note.style.display = 'inline';

        setTimeout(() => {
            note.style.display = 'none';
        }, 2000);
    } else if (e.key === "X" || e.key === "x") {
        localStorage.removeItem("passwordHistory");
        loadHistory();
    } else if (e.key === "ArrowUp") {
        let newValue = Math.min(parseInt(slider.value) + 1, slider.max);
        slider.value = newValue;
        lengthText.textContent = newValue;
    } else if (e.key === "ArrowDown") {
        let newValue = Math.max(parseInt(slider.value) - 1, slider.min);
        slider.value = newValue;
        lengthText.textContent = newValue;
    } else if (e.key === "g" || e.key === "G") {
        generatePassword();
    } else if (e.key === "u" || e.key === "U") {
        checkboxes[0].checked = !checkboxes[0].checked;
    } else if (e.key === "l" || e.key === "L") {
        checkboxes[1].checked = !checkboxes[1].checked;
    } else if (e.key === "n" || e.key === "N") {
        checkboxes[2].checked = !checkboxes[2].checked;
    } else if (e.key === "s" || e.key === "S") {
        checkboxes[3].checked = !checkboxes[3].checked;
    } else if (e.key === "r" || e.key === "R") {
        window.location.reload();
    }
});