const STORAGE_KEY = "einsatzdoku";

function getValue(el) {
  if (el.type === "checkbox") return el.checked;
  if (el.type === "radio") return el.checked ? el.value : null;
  return el.value;
}

function setValue(el, value) {
  if (el.type === "checkbox") {
    el.checked = !!value;
  } else if (el.type === "radio") {
    el.checked = value === el.value;
  } else {
    el.value = value ?? "";
  }
}

function getFormData() {
  const data = {};
  document.querySelectorAll("input, textarea, select").forEach((el) => {
    if (!el.name) return;

    if (el.type === "radio") {
      if (el.checked) data[el.name] = el.value;
    } else if (el.type === "checkbox") {
      if (!data[el.name]) data[el.name] = [];
      if (el.checked) data[el.name].push(el.value || true);
    } else {
      data[el.name] = el.value;
    }
  });
  return data;
}

function saveData() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(getFormData()));
}

function loadData() {
  const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");

  document.querySelectorAll("input, textarea, select").forEach((el) => {
    if (!el.name) return;
    const value = saved[el.name];

    if (el.type === "checkbox") {
      if (Array.isArray(value)) {
        el.checked = value.includes(el.value || true);
      } else {
        el.checked = !!value;
      }
    } else if (el.type === "radio") {
      el.checked = value === el.value;
    } else {
      if (value !== undefined) el.value = value;
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  loadData();

  document.querySelectorAll("input, textarea, select").forEach((el) => {
    el.addEventListener("input", saveData);
    el.addEventListener("change", saveData);
  });
});
