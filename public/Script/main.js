function openPopup(e) {
    e.preventDefault(); // ป้องกันไม่ให้ลิงก์ทำงาน
    document.getElementById('profilePopup').style.display = 'flex';
}

function closePopup() {
    document.getElementById('profilePopup').style.display = 'none';
}
document.addEventListener('DOMContentLoaded', () => {
  const searchInput = document.querySelector('.search-bar');
  const items = document.querySelectorAll('.recommend-item');

  searchInput.addEventListener('input', () => {
    const query = searchInput.value.toLowerCase();

    items.forEach(item => {
      const text = item.textContent.toLowerCase();
      if (text.includes(query)) {
        item.style.display = 'block';
      } else {
        item.style.display = 'none';
      }
    });
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("advisorForm");
  const activityName = document.getElementById("activityName");
  const activityDate = document.getElementById("activityDate");

  // ดึงข้อมูลกิจกรรมจาก localStorage และใส่ในฟอร์ม
  const activity = JSON.parse(localStorage.getItem("selectedActivity"));
  if (activity && activityName && activityDate) {
    activityName.value = activity.name;
    activityDate.value = activity.date;
  }

  // กดปุ่มส่ง
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();

      const status = document.querySelector("input[name='status']:checked");
      if (!status) {
        alert("กรุณาเลือกว่าจะอนุมัติหรือไม่");
        return;
      }

      const result = status.value === "approve"
        ? "✅ อนุมัติเรียบร้อยแล้ว"
        : "❌ ไม่อนุมัติ";

      alert(result);

      localStorage.removeItem("selectedActivity");
      window.location.href = "/HTML/Pending_Advisor.html";
    });
  }
});
