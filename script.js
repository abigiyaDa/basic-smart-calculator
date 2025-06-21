const inputField = document.getElementById('input');
const liveResult = document.getElementById('live-result');

const historyList = document.getElementById("history-list");

const themeToggle = document.getElementById("theme-toggle");
const themeIcon = document.getElementById("theme-icon");

let expression = '';

// evaluate the expression and update the live result
function updateLiveResult() {
  try {
    if (expression) {
      liveResult.textContent = "= " + eval(expression);
    } else {
      liveResult.textContent = "";
    }
  } catch {
    liveResult.textContent = "";
  }
}

// Button input
function append(char) {
  expression += char;
  inputField.value = expression;
  inputField.scrollLeft = inputField.scrollWidth;
  updateLiveResult();
}

// Clear input
function clearInput() {
  expression = "";
  inputField.value = "";
  updateLiveResult();
}

// Delete last character
function deleteLast() {
  expression = expression.slice(0, -1);
  inputField.value = expression;
  updateLiveResult();
}

// Final evaluation
function calculate() {
  try {
    const result = eval(expression);
    if (expression !== "") {
      saveToHistory(expression, result);
    }
    expression = result.toString();
    inputField.value = expression;
    updateLiveResult();
    loadHistory();
  } catch {
    inputField.value = "Error";
  }
}

// Save to localStorage
function saveToHistory(expr, result) {
  const history = JSON.parse(localStorage.getItem("calcHistory")) || [];
  history.push({ expr, result });

  if (history.length > 6) {
    // remove as many as needed so only the last 6 remain
    history.splice(0, history.length - 6);
  }

  localStorage.setItem("calcHistory", JSON.stringify(history));
}

// Load history on page load
function loadHistory() {
  const history = JSON.parse(localStorage.getItem("calcHistory")) || [];
  historyList.innerHTML = "";

  [...history].reverse().forEach(item => {
    const li = document.createElement("li");
    li.textContent = `${item.expr} = ${item.result}`;
    historyList.appendChild(li);
  });
}

// Clear history
function clearHistory() {
  localStorage.removeItem("calcHistory");
  loadHistory();
}

// Toggle dark/light mode
themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  const isDark = document.body.classList.contains("dark");
  themeIcon.src = isDark ? "assets/icon-sun.svg" : "assets/icon-moon.svg";
  localStorage.setItem("theme", isDark ? "dark" : "light");
});

function loadTheme() {
  const theme = localStorage.getItem("theme");
  const isDark = theme === "dark";

  document.body.classList.toggle("dark", isDark);
  themeIcon.src = isDark ? "assets/icon-sun.svg" : "assets/icon-moon.svg";
}

window.addEventListener("DOMContentLoaded", () => {
  loadTheme();
  loadHistory();
});
