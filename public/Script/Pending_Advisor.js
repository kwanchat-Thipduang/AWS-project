document.addEventListener("DOMContentLoaded", () => {
  const activities = [
    {
      name: "กิจกรรมอาสาพัฒนาชุมชน",
      date: "3/20/2025",
      org: "คณะสังคมศาสตร์",
      hardskill: "-",
      softskill: "การทำงานร่วมกับเป็นทีม",
      hours: 4
    },
    {
      name: "Workshop AI",
      date: "10/4/2025",
      org: "ศูนย์เทคโนโลยี",
      hardskill: "การใช้ AI",
      softskill: "Critical Thinking",
      hours: 3
    },
    {
      name: "Hackathon แข่งขันเขียนโปรแกรม",
      date: "5/18/2025",
      org: "คณะวิศวกรรมศาสตร์",
      hardskill: "Fullstack Coding, DevOps Tools",
      softskill: "การทำงานเป็นทีม, การตัดสินใจ",
      hours: 12
    },
    {
      name: "เวิร์กชอปการบริหารเวลา",
      date: "5/18/2025",
      org: "ศูนย์ให้คำปรึกษา",
      hardskill: "-",
      softskill: "การวางแผน, การจัดลำดับความสำคัญ",
      hours: 3
    }
  ];

  const container = document.getElementById("cardContainer");
  container.innerHTML = ""; // ล้างก่อนเผื่อซ้ำ

  activities.forEach((activity) => {
    const card = document.createElement("div");
    card.className = "activity-card";
    card.innerHTML = `
      <p><strong>ชื่อกิจกรรม:</strong> ${activity.name}</p>
      <p><strong>วันที่:</strong> ${activity.date}</p>
      <p><strong>หน่วยงาน:</strong> ${activity.org}</p>
      <p><strong>Hardskill:</strong> ${activity.hardskill}</p>
      <p><strong>Softskill:</strong> ${activity.softskill}</p>
      <p><strong>ชั่วโมง:</strong> ${activity.hours}</p>
    `;
    card.onclick = () => {
      localStorage.setItem("selectedActivity", JSON.stringify(activity));
      window.location.href = "../HTML/form_advisor.html";
    };
    container.appendChild(card);
  });

  window.openPopup = function(e) {
    e.preventDefault();
    document.getElementById("profilePopup").style.display = "flex";
  }

  window.closePopup = function() {
    document.getElementById("profilePopup").style.display = "none";
  }
});
