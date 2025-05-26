document.addEventListener("DOMContentLoaded", async () => {
  const container = document.getElementById("cardContainer");

  const url = "https://5kvo4jer3zf5lncydoygccomrm0gpdnx.lambda-url.us-east-1.on.aws/";

  try {
    const response = await fetch(url);
    const data = await response.json();
    const activities = data.data || [];

    const waitingList = activities.filter(a => a.Status === "Waiting");

    container.innerHTML = "";
    if (waitingList.length === 0) {
      container.innerHTML = "<p style='text-align:center'>ไม่มีกิจกรรมที่รออนุมัติ</p>";
      return;
    }

    waitingList.forEach(activity => {
  const row = document.createElement("tr");
  row.innerHTML = `
    <td>${activity.Username}</td>
    <td>${activity.ActivityName}</td>
    <td>${activity.Date}</td>
    <td>${activity.Hours}</td>
    <td>${activity.Hardskill || '-'}</td>
    <td>${activity.Softskill || '-'}</td>
    
    <td>
      <button onclick='viewActivity(${JSON.stringify(activity)})'>📄 ตรวจสอบ</button>
    </td>
  `;
  container.appendChild(row);
});
  } catch (err) {
    console.error("โหลดกิจกรรมล้มเหลว:", err);
    container.innerHTML = "<p style='color:red'>❌ โหลดข้อมูลไม่สำเร็จ</p>";
  }
});

function viewActivity(activity) {
  localStorage.setItem("selectedActivity", JSON.stringify(activity));
  window.location.href = "../HTML/form_advisor.html";
}
