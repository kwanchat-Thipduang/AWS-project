function openPopup(e) {
  e.preventDefault();
  document.getElementById('profilePopup').style.display = 'flex';
}

function closePopup() {
  document.getElementById('profilePopup').style.display = 'none';
}

document.addEventListener('DOMContentLoaded', async () => {
  // ✅ โหลดข้อมูล userProfile จาก localStorage
  const user = JSON.parse(localStorage.getItem("userProfile") || "{}");
  if (user && user.UserName && document.getElementById("profileName")) {
    document.getElementById("profileName").textContent = user.UserName || "-";
    document.getElementById("profileFaculty").textContent = user.Faculty || "-";
    document.getElementById("profileBranch").textContent = user.Branch || "-";
    document.getElementById("profilePhone").textContent = user.PhoneNum || "-";
    document.getElementById("profileHours").textContent = user.Activity?.length || 0;
  }

  // ✅ form บันทึกกิจกรรม
  const form = document.getElementById('activityForm');
  if (form) {
    form.addEventListener('submit', async (e) => {
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
          form.reset();
        } else {
          alert("เกิดข้อผิดพลาด: " + result.message);
        }
      } catch (err) {
        console.error("Error submitting form", err);
        alert("ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้");
      }
    });
  }

  // ✅ โหลดกิจกรรมสำหรับ admin
  const tableBody = document.querySelector('tbody');
  if (tableBody) {
    try {
      const response = await fetch('https://xoaq62gd4nex7cylkldixeclly0cbzqx.lambda-url.us-east-1.on.aws/');
      const result = await response.json();
      const data = result.data || result;

      tableBody.innerHTML = '';
      data.forEach(activity => {
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
        tableBody.appendChild(row);
      });
    } catch (err) {
      console.error('ไม่สามารถโหลดข้อมูล:', err);
    }
  }
});

// ✅ ฟังก์ชัน global สำหรับอนุมัติ / ปฏิเสธ
async function approveActivity(activityId) {
  await updateStatus(activityId, 'approved');
}

async function rejectActivity(activityId) {
  await updateStatus(activityId, 'rejected');
}

async function updateStatus(activityId, status) {
  try {
    const response = await fetch('https://hc4tw3wom27ltjls6ojjn5xgvq0flonj.lambda-url.us-east-1.on.aws/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ActivityID: activityId,
        Status: status
      })
    });

    const text = await response.text();
    let result;
    try {
      result = JSON.parse(text);
    } catch (err) {
      throw new Error("เซิร์ฟเวอร์ไม่ได้ส่ง JSON กลับมา: " + text);
    }

    if (response.status === 200) {
      alert(result.message || "อัปเดตสถานะสำเร็จ");
      location.reload();
    } else {
      alert("เกิดข้อผิดพลาด: " + (result.message || result.error));
    }

  } catch (err) {
    console.error("อัปเดตสถานะล้มเหลว:", err);
    alert("ไม่สามารถอัปเดตสถานะได้: " + err.message);
  }
}

const container = document.getElementById("activityList");
const filterCheckboxes = document.querySelectorAll(".filter");
let allActivities = [];

if (container) {
  async function loadActivities() {
    try {
      const response = await fetch("https://tlwdwkmuc2drupku4hm2zurb7q0ygbvu.lambda-url.us-east-1.on.aws/");
      const parsed = await response.json();
      allActivities = parsed.data || [];
      renderFilteredActivities();
    } catch (err) {
      container.innerHTML = `<p style="color:red;">❌ โหลดกิจกรรมไม่สำเร็จ</p>`;
    }
  }

  function renderFilteredActivities() {
    const hard = document.querySelector("input[value='Hard Skill']").checked;
    const soft = document.querySelector("input[value='Soft Skill']").checked;

    const filtered = allActivities.filter(activity => {
      const hasHard = activity.Hardskill && activity.Hardskill !== "-";
      const hasSoft = activity.Softskill && activity.Softskill !== "-";

      if (hard && soft) return hasHard && hasSoft;
      if (hard) return hasHard;
      if (soft) return hasSoft;
      return true;
    });

    container.innerHTML = '';
    if (filtered.length === 0) {
      container.innerHTML = '<p>ไม่พบกิจกรรมตามตัวกรอง</p>';
      return;
    }

    filtered.forEach(activity => {
      const div = document.createElement("div");
      div.className = "activity-item";
      div.innerHTML = `
        <p><strong>ชื่อกิจกรรม:</strong> ${activity.ActivityName || '-'}</p>
        <p><strong>คำอธิบาย:</strong> ${activity.Description || '-'}</p>
        <p><strong>วันที่จัด:</strong> ${activity.Date || '-'}</p>
        <p><strong>หน่วยงาน:</strong> ${activity.Department || '-'}</p>
        <p><strong>Hard Skill:</strong> ${activity.Hardskill || '-'}</p>
        <p><strong>Soft Skill:</strong> ${activity.Softskill || '-'}</p>
        <p><strong>จำนวนชั่วโมง:</strong> ${activity.Hours || '-'} ชั่วโมง</p>
      `;
      div.onclick = () => {
        localStorage.setItem("selectedActivity", JSON.stringify(activity));
        window.location.href = "/HTML/Student_Form.html";
      };
      container.appendChild(div);
    });
  }

  filterCheckboxes.forEach(cb => cb.addEventListener("change", renderFilteredActivities));

  loadActivities();
}
