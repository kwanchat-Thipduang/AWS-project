document.addEventListener("DOMContentLoaded", async () => {
  const user = JSON.parse(localStorage.getItem("userProfile") || "{}");
  const tbody = document.querySelector("tbody");
  const summary = document.querySelector(".summary span");

  if (!user.UserID) {
    tbody.innerHTML = "<tr><td colspan='6'>❌ กรุณาเข้าสู่ระบบใหม่</td></tr>";
    return;
  }

  const url = `https://nb3xn23gbkoo5ij6arnjc4k64m0qcfkh.lambda-url.us-east-1.on.aws/?UserID=${user.UserID}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    const approvedActivities = (data.data || []).filter(a => a.Status === "Approved");

    let totalHours = 0;
    tbody.innerHTML = "";

    approvedActivities.forEach(a => {
      totalHours += a.Hours || 0;
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${a.ActivityName}</td>
        <td>${a.Date}</td>
        <td>${a.Department}</td>
        <td>${a.Hardskill}</td>
        <td>${a.Softskill}</td>
        <td>${a.Hours}</td>
      `;
      tbody.appendChild(row);
    });

    summary.textContent = totalHours;

  } catch (err) {
    console.error("โหลดกิจกรรม approved ล้มเหลว:", err);
    tbody.innerHTML = "<tr><td colspan='6'>❌ โหลดข้อมูลไม่สำเร็จ</td></tr>";
  }
});