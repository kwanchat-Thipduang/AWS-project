function openPopup(e) {
  e.preventDefault();
  document.getElementById('profilePopup').style.display = 'flex';
}

function closePopup() {
  document.getElementById('profilePopup').style.display = 'none';
}

document.addEventListener('DOMContentLoaded', async () => {
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

    const text = await response.text(); // 
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
