document.getElementById("tat-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const startDate = document.getElementById("start-date").value;
  const tatDays = Number(document.getElementById("tat-days").value);

  const res = await fetch("/api/tat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ startDate, tatDays })
  });

  // BUG (UI): no check on res.ok / no error message shown for a failed or invalid request
  const data = await res.json();

  // BUG (UI): renders the raw verbose JS Date string instead of a clean date
  document.getElementById("due-date").textContent = new Date(data.dueDate).toString();
  // BUG (UI): copy-paste slip - shows the due date instead of the business-days count
  document.getElementById("days-used").textContent = data.dueDate;

  // BUG (UI): status badge is never actually updated from the response - always "On Track"
  document.getElementById("overdue-badge").innerHTML =
    '<span class="badge badge-ontrack">On Track</span>';
});

// --- Tooling: reset button (utility only, not part of the app under test) ---
function showToast(msg) {
  let toast = document.getElementById("__toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "__toast";
    toast.style.cssText =
      "position:fixed;bottom:20px;right:20px;background:#333;color:#fff;padding:10px 16px;" +
      "border-radius:4px;font-family:sans-serif;z-index:9999;opacity:0;transition:opacity .2s;";
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.style.opacity = "1";
  clearTimeout(toast.__timer);
  toast.__timer = setTimeout(() => {
    toast.style.opacity = "0";
  }, 2000);
}

document.getElementById("reset-btn").addEventListener("click", async () => {
  await fetch("/api/reset", { method: "POST" });
  document.getElementById("tat-form").reset();
  document.getElementById("form-error").textContent = "";
  document.getElementById("due-date").textContent = "-";
  document.getElementById("days-used").textContent = "-";
  document.getElementById("overdue-badge").innerHTML =
    '<span class="badge badge-ontrack">On Track</span>';
  showToast("Data reset");
});
