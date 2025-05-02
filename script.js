const activityTableBody = document.querySelector("#activityTable tbody");
const activityForm = document.getElementById('activityForm');

// กิจกรรมตัวอย่างเริ่มต้น
let activities = [
  {
    name: "ค่ายอาสาพัฒนา",
    date: "2025-03-10",
    organizer: "ชมรมอาสา",
    skills: "Teamwork, Leadership",
    hours: 12
  },
  {
    name: "อบรม Python เบื้องต้น",
    date: "2025-02-25",
    organizer: "คณะวิทย์",
    skills: "Coding, Problem Solving",
    hours: 6
  }
];

function renderActivities() {
  activityTableBody.innerHTML = '';
  activities.forEach(activity => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${activity.name}</td>
      <td>${activity.date}</td>
      <td>${activity.organizer}</td>
      <td>${activity.skills}</td>
      <td>${activity.hours}</td>
    `;
    activityTableBody.appendChild(row);
  });
}

activityForm.addEventListener('submit', function(e) {
  e.preventDefault();

  const newActivity = {
    name: document.getElementById('activityName').value.trim(),
    date: document.getElementById('activityDate').value,
    organizer: document.getElementById('organizer').value.trim(),
    skills: document.getElementById('skillsGained').value.trim(),
    hours: document.getElementById('hours').value
  };

  activities.push(newActivity);
  renderActivities();
  activityForm.reset();
  alert('เพิ่มกิจกรรมใหม่สำเร็จ!');
});

// เรียกใช้ตอนโหลดหน้า
renderActivities();
