// Handle logout with fetch (comment out e.preventDefault() to use native form POST instead)
const form = document.getElementById('logout-form');
form.addEventListener('submit', async (e) => {
  e.preventDefault();
  try {
    const res = await fetch('/logout', { method: 'POST', credentials: 'include' });
    if (res.ok) {
      window.location.href = '/login';
    } else {
      alert('Logout failed. Please try again.');
    }
  } catch (err) {
    alert('Network error.');
  }
});

// Footer year
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// Example button handlers (replace with real routes/modals)
document.getElementById('change-password')?.addEventListener('click', () => {
  window.location.href = '/settings/password';
});

document.getElementById('setup-2fa')?.addEventListener('click', () => {
  window.location.href = '/settings/2fa';
});

document.getElementById('edit-profile')?.addEventListener('click', () => {
  window.location.href = '/settings/profile';
});

document.getElementById('change-photo')?.addEventListener('click', () => {
  window.location.href = '/settings/avatar';
});
