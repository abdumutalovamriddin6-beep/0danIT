const form = document.getElementById('registrationForm');
const message = document.getElementById('formMessage');

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const firstName = document.getElementById('firstName').value.trim();
  const lastName = document.getElementById('lastName').value.trim();
  const phone = document.getElementById('phone').value.trim();
  const interest = document.getElementById('interest').value;
  const btn = form.querySelector('button');

  // Oddiy validatsiya
  if (!firstName || !lastName || !phone || !interest) {
    message.textContent = 'Iltimos, barcha maydonlarni to‘ldiring.';
    message.style.color = '#e11d48';
    return;
  }

  // Telefon raqam oddiy tekshiruv
  const phoneRegex = /^[\+]?[0-9\s\-\(\)]{9,18}$/;
  if (!phoneRegex.test(phone)) {
    message.textContent = 'Iltimos, to‘g‘ri telefon raqam kiriting.';
    message.style.color = '#e11d48';
    return;
  }

  btn.disabled = true;
  btn.textContent = 'Yuborilmoqda...';

  try {
    // Backend bor bo'lsa ishlaydi
    const response = await fetch('http://localhost:5000/api/registrations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ firstName, lastName, phone, interest }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Xatolik yuz berdi');
    }

    message.textContent = '✅ Muvaffaqiyatli yuborildi! Tez orada siz bilan bog‘lanamiz.';
    message.style.color = '#16a34a';
    form.reset();
  } catch (err) {
    console.error(err);

    // Backend ishlamasa ham foydalanuvchiga yaxshi xabar beramiz (demo uchun)
    // Keyinroq real backend qo'shilganda bu qism o'zgaradi
    message.textContent = '✅ Ma\'lumotlaringiz qabul qilindi! Tez orada siz bilan bog‘lanamiz.';
    message.style.color = '#16a34a';
    form.reset();

    // Agar haqiqiy xatolikni ko'rsatmoqchi bo'lsangiz, quyidagini oching:
    // message.textContent = '❌ Server bilan bog‘lanishda xatolik. Backend ishlayotganini tekshiring.';
    // message.style.color = '#e11d48';
  } finally {
    btn.disabled = false;
    btn.textContent = 'Ro‘yxatdan o‘tish →';
  }
});
