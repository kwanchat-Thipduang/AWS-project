document.addEventListener("DOMContentLoaded", async () => {
  const tableBody = document.getElementById("summaryTableBody");
  if (!tableBody) return;

  const summarySpan = document.querySelector(".summary span");

  const url = "https://dxska2ul7ube4qy7nrdebisvwa0nmcpu.lambda-url.us-east-1.on.aws/";

  try {
    const res = await fetch(url);
    const json = await res.json();
    const activities = json.data || [];

    // ✅ กรองเฉพาะกิจกรรมที่ Approved
    const approved = activities.filter(a => a.Status === "Approved");

    // ✅ สร้าง Map รวมตาม Username
    const userMap = new Map();

    approved.forEach(activity => {
      const username = activity.Username || "ไม่ระบุชื่อ";
      const hours = Number(activity.Hours) || 0;
      const hardskills = activity.Hardskill && activity.Hardskill !== "-" ? activity.Hardskill.split(",") : [];
      const softskills = activity.Softskill && activity.Softskill !== "-" ? activity.Softskill.split(",") : [];

      if (!userMap.has(username)) {
        userMap.set(username, {
          totalHours: 0,
          hardskillSet: new Set(),
          softskillSet: new Set()
        });
      }

      const userData = userMap.get(username);
      userData.totalHours += hours;
      hardskills.forEach(skill => userData.hardskillSet.add(skill.trim()));
      softskills.forEach(skill => userData.softskillSet.add(skill.trim()));
    });

    // ✅ แสดงผลรวม
    tableBody.innerHTML = "";
    let grandTotal = 0;

    for (const [username, data] of userMap.entries()) {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${username}</td>
        <td>${data.totalHours}</td>
        <td>${[...data.hardskillSet].join(", ") || "-"}</td>
        <td>${[...data.softskillSet].join(", ") || "-"}</td>
      `;
      tableBody.appendChild(row);
      grandTotal += data.totalHours;
    }

    // ✅ รวมทั้งหมด
    if (summarySpan) summarySpan.textContent = grandTotal;

  } catch (e) {
    console.error("โหลดข้อมูลล้มเหลว:", e);
    tableBody.innerHTML = `<tr><td colspan="4">❌ โหลดข้อมูลไม่สำเร็จ</td></tr>`;
  }
});
