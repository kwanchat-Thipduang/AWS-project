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
