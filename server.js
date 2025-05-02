const express = require('express');
const app = express();
const port = 3000;

const path = require('path');

// Middleware
app.use(express.static('public')); // ให้เข้าถึงไฟล์ในโฟลเดอร์ public (HTML, CSS, JS)
app.use(express.json()); // รองรับ JSON
app.use(express.urlencoded({ extended: true })); // รองรับ form

// ตัวอย่าง API (จำลองฐานข้อมูลกิจกรรม pending)
let pendingActivities = [
  {
    id: 1,
    name: "กิจกรรมอาสาพัฒนาชนบท",
    date: "2025-03-20",
    organizer: "คณะสังคมศาสตร์",
    skill: "Leadership",
    hours: 4,
    status: "pending"
  },
  {
    id: 2,
    name: "Workshop AI",
    date: "2025-04-10",
    organizer: "ศูนย์เทคโนโลยี",
    skill: "Critical Thinking",
    hours: 3,
    status: "pending"
  }
];

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'HTML', 'student.html'));
  });
  

// API: อนุมัติหรือปฏิเสธกิจกรรม
app.post('/api/approve', (req, res) => {
  const { id, action } = req.body; // action = "approve" or "reject"
  const activity = pendingActivities.find(a => a.id === id);
  if (activity) {
    activity.status = action === "approve" ? "approved" : "rejected";
    return res.json({ success: true, updated: activity });
  } else {
    return res.status(404).json({ success: false, message: "ไม่พบกิจกรรม" });
  }
});

// API: ดึงกิจกรรมที่ยังรออนุมัติ
app.get('/api/pending', (req, res) => {
    const onlyPending = pendingActivities.filter(a => a.status === 'pending');
    res.json(onlyPending);
  });
  

// Start server
app.listen(port, () => {
  console.log(`🚀 Server is running at http://localhost:${port}`);
});
