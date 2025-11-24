document.addEventListener("DOMContentLoaded", () => {
    pageLoaded();
});

// Global references
let txt1;
let txt2;
let btn;
let lblRes;

function pageLoaded() {
    txt1 = document.getElementById('txt1');
    txt2 = document.getElementById('txt2');
    btn = document.getElementById('btnCalc');
    lblRes = document.getElementById('lblRes');

    btn.addEventListener('click', () => {
        calculate();
    });
}

// ===========================
// PRINT with append support
// ===========================
function print(msg, append = false) {
    const ta = document.getElementById("output");

    if (!ta) {
        console.log(msg);
        return;
    }

    if (append && ta.value) {
        ta.value += "\n" + msg;
    } else {
        ta.value = msg;
    }
}

// ===========================
// VALIDATION FUNCTION
// ===========================
function validateNumber(inputElement) {
    const value = inputElement.value.trim();

    if (value === "" || isNaN(Number(value))) {
        inputElement.classList.remove("is-valid");
        inputElement.classList.add("is-invalid");
        return false;
    } else {
        inputElement.classList.remove("is-invalid");
        inputElement.classList.add("is-valid");
        return true;
    }
}

// ===========================
// CALCULATION + COLOR RESULT
// ===========================
function calculate() {

    const valid1 = validateNumber(txt1);
    const valid2 = validateNumber(txt2);

    if (!valid1 || !valid2) {
        lblRes.classList.remove("text-success");
        lblRes.classList.add("text-danger");
        lblRes.innerText = "Invalid input";
        print("ERROR: invalid input", true);
        return;
    }

    let num1 = parseFloat(txt1.value);
    let num2 = parseFloat(txt2.value);

    const op = document.getElementById("operator").value;

    let res = 0;

    if (op === "+") res = num1 + num2;
    else if (op === "-") res = num1 - num2;
    else if (op === "*") res = num1 * num2;
    else if (op === "/") res = num2 !== 0 ? num1 / num2 : "ERR";

    // SUCCESS RESULT COLOR
    lblRes.classList.remove("text-danger");
    lblRes.classList.add("text-success");
    lblRes.innerText = res;

    const logLine = `CALC:  ${num1}  ${op}  ${num2}  =  ${res}`;
    print(logLine, true);
}

// ===========================
// BUTTON 2 LOGGING
// ===========================
const btn2 = document.getElementById("btn2");
btn2.addEventListener("click", () => {
    print(`btn2 clicked: ${btn2.id} | ${btn2.innerText}`, true);
});

// ===========================
// DEMO NATIVE TYPES
// ===========================
function demoNative() {
    let out = "=== STEP 1: NATIVE TYPES ===\n";

    const s = "Hello World";
    out += "\n[String] s = " + s;
    out += "\nLength: " + s.length;
    out += "\nUpper: " + s.toUpperCase();

    const n = 42;
    out += "\n\n[Number] n = " + n;

    const b = true;
    out += "\n\n[Boolean] b = " + b;

    const d = new Date();
    out += "\n\n[Date] now = " + d.toISOString();

    const arr = [1, 2, 3, 4];
    out += "\n\n[Array] arr = [" + arr.join(", ") + "]";
    out += "\nPush 5 → " + (arr.push(5), arr.join(", "));
    out += "\nMap x2 → " + arr.map(x => x * 2).join(", ");

    const add = function (a, b) { return a + b; };
    out += "\n\n[Function] add(3,4) = " + add(3, 4);

    function calc(a, b, fn) {
        return fn(a, b);
    }
    const result = calc(10, 20, (x, y) => x + y);
    out += "\n[Callback] calc(10,20) = " + result;

    print(out, false);
}
