const activityTableBody = document.querySelector("#activityTable tbody");
const activityForm = document.getElementById('activityForm');

// ✅ โหลดกิจกรรมทั้งหมดจาก Lambda (เฉพาะ pending)
async function loadActivities() {
  try {
    const response = await fetch("https://xoaq62gd4nex7cylkldixeclly0cbzqx.lambda-url.us-east-1.on.aws/");
    const result = await response.json();
    const activities = result.data || [];

    activityTableBody.innerHTML = '';
    activities.forEach(activity => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${activity.ActivityName}</td>
        <td>${activity.Date}</td>
        <td>${activity.Department}</td>
        <td>${activity.Hardskill}</td>
        <td>${activity.Softskill}</td>
        <td>${activity.Hours}</td>
        <td>
          <button onclick="approveActivity('${activity.ActivityID}')" class="btn-approve">✅ อนุมัติ</button>
          <button onclick="rejectActivity('${activity.ActivityID}')" class="btn-reject">❌ ปฏิเสธ</button>
        </td>
      `;
      activityTableBody.appendChild(row);
    });
  } catch (err) {
    console.error("โหลดข้อมูลล้มเหลว:", err);
    alert("ไม่สามารถโหลดกิจกรรมได้");
  }
}

// ✅ โหลดเมื่อ DOM โหลดเสร็จ + จัดการฟอร์มเพิ่มกิจกรรม
document.addEventListener('DOMContentLoaded', () => {
  loadActivities();

  if (activityForm) {
    activityForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const data = {
        ActivityName: document.getElementById('ActivityName').value,
        Date: document.getElementById('Date').value,
        Department: document.getElementById('Department').value,
        Hardskill: document.getElementById('Hardskill').value || '-',
        Softskill: document.getElementById('Softskill').value || '-',
        Hours: parseInt(document.getElementById('Hours').value),
        Description: '-'
      };

      try {
        const response = await fetch('https://7xgg5y5fw4qzl6y6a6fzzxbnbe0advsv.lambda-url.us-east-1.on.aws/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });

        const result = await response.json();
        if (response.status === 201) {
          alert("เพิ่มกิจกรรมสำเร็จ!");
          activityForm.reset();
          await loadActivities();
        } else {
          alert("เกิดข้อผิดพลาด: " + result.message);
        }
      } catch (err) {
        console.error("Error submitting form", err);
        alert("ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้");
      }
    });
  }
});

// ✅ GLOBAL FUNCTIONS (อยู่ด้านนอกเพื่อให้ใช้ onclick และ console ได้)
async function approveActivity(activityId) {
  await updateStatus(activityId, 'approved');
}

async function rejectActivity(activityId) {
  await updateStatus(activityId, 'rejected');
}

async function updateStatus(activityId, status) {
  try {
    const response = await fetch("https://hc4tw3wom27ltjls6ojjn5xgvq0flonj.lambda-url.us-east-1.on.aws/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ActivityID: activityId,
        Status: status
      })
    });

    const result = await response.json();
    alert(result.message || "อัปเดตสถานะสำเร็จ");
    await loadActivities(); // โหลดใหม่หลังเปลี่ยนสถานะ
  } catch (err) {
    console.error("อัปเดตสถานะล้มเหลว:", err);
    alert("ไม่สามารถอัปเดตสถานะได้");
  }
}
