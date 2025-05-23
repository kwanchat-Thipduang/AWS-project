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
      const card = document.createElement("div");
      card.className = "activity-card";
      card.innerHTML = `
        <h3>${activity.ActivityName}</h3>
        <p><strong>วันที่:</strong> ${activity.Date}</p>
        <p><strong>ชั่วโมง:</strong> ${activity.Hours}</p>
        <p><strong>นักศึกษา:</strong> ${activity.UserID}</p>
        <p><strong>Hard Skill:</strong> ${activity.Hardskill}</p>
        <p><strong>Soft Skill:</strong> ${activity.Softskill}</p>
        <button onclick='viewActivity(${JSON.stringify(activity)})'>📄 ตรวจสอบ</button>
      `;
      container.appendChild(card);
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
