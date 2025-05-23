document.addEventListener("DOMContentLoaded", async () => {
  const user = JSON.parse(localStorage.getItem("userProfile") || "{}");
  const tbody = document.querySelector("tbody");

  if (!user.UserID) {
    tbody.innerHTML = "<tr><td colspan='7'>❌ กรุณาเข้าสู่ระบบใหม่</td></tr>";
    return;
  }

  const url = `https://nb3xn23gbkoo5ij6arnjc4k64m0qcfkh.lambda-url.us-east-1.on.aws/?UserID=${user.UserID}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    const myActivities = data.data || [];

    tbody.innerHTML = "";

    if (myActivities.length === 0) {
      tbody.innerHTML = "<tr><td colspan='7'>ไม่พบกิจกรรมที่คุณส่งไว้</td></tr>";
      return;
    }

    myActivities.forEach(a => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${a.ActivityName}</td>
        <td>${a.Date}</td>
        <td>${a.Department}</td>
        <td>${a.Hardskill}</td>
        <td>${a.Softskill}</td>
        <td>${a.Hours}</td>
        <td class="status">${mapStatus(a.Status)}</td>
      `;
      tbody.appendChild(row);
    });

  } catch (err) {
    console.error("โหลดกิจกรรมล้มเหลว:", err);
    tbody.innerHTML = "<tr><td colspan='7'>❌ โหลดข้อมูลล้มเหลว</td></tr>";
  }

  function mapStatus(status) {
    if (status === "Waiting") return "⏳ รอตรวจสอบ";
    if (status === "Approved") return "✅ อนุมัติแล้ว";
    if (status === "Rejected") return "❌ ไม่อนุมัติ";
    return "-";
  }
});
