const API = "http://localhost:3000";

// EVENTS HOME
async function loadEvents(){
  const res = await fetch(API + "/events");
  const data = await res.json();

  const container = document.getElementById("events");
  if(!container) return;

  container.innerHTML = "";

  data.forEach(e => {
    container.innerHTML += `
      <div class="event-card">
        <img src="https://images.unsplash.com/photo-1519389950473-47ba0277781c">
        <div class="event-overlay">
          <h3>${e.title}</h3>
          <p>${e.location}</p>
        </div>
      </div>
    `;
  });
}

// DASHBOARD EVENTS
async function loadDashboardEvents() {
  const res = await fetch('http://localhost:3000/events');
  const data = await res.json();

  const container = document.getElementById('eventsList');
  container.innerHTML = '';

  data.forEach(e => {
    container.innerHTML += `
      <div class="event-card">

        <div class="event-badge">${e.date}</div>

        <img src="https://images.unsplash.com/photo-1519389950473-47ba0277781c">

        <div class="event-overlay">
          <h3>${e.title}</h3>
          <p>${e.location}</p>

          <button class="btn-small" onclick="deleteEvent(${e.id})">
            🗑 Delete
          </button>

          <button class="btn-small" onclick="editEvent(${e.id}, '${e.title}', '${e.description}', '${e.date}', '${e.location}')">
            ✏️ Edit
          </button>

        </div>
      </div>
    `;
  });
}

// ✏️ EDIT
function editEvent(id, title, description, date, location) {
  document.getElementById('title').value = title;
  document.getElementById('description').value = description;
  document.getElementById('date').value = date;
  document.getElementById('location').value = location;

  window.editingId = id;
}

// ➕ ADD / UPDATE
async function addEvent() {
  const event = {
    title: document.getElementById('title').value,
    description: document.getElementById('description').value,
    date: document.getElementById('date').value,
    location: document.getElementById('location').value
  };

  if (window.editingId) {
    await fetch(`http://localhost:3000/events/${window.editingId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(event)
    });

    window.editingId = null;
  } else {
    await fetch('http://localhost:3000/events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(event)
    });
  }

  loadDashboardEvents();
}

// DELETE
async function deleteEvent(id) {
  if (!confirm("Delete this event?")) return;

  await fetch(`http://localhost:3000/events/${id}`, {
    method: 'DELETE'
  });

  loadDashboardEvents();
}

// REGISTER
function register(){
  const form = document.getElementById("registerForm");
  if(!form) return;

  form.addEventListener("submit", async (e)=>{
    e.preventDefault();

    const user = {
      full_name: document.getElementById("full_name").value,
      email: document.getElementById("email").value,
      password: document.getElementById("password").value
    };

    await fetch(API + "/register", {
      method:"POST",
      headers:{ "Content-Type":"application/json" },
      body: JSON.stringify(user)
    });

    document.getElementById("message").innerText = "🚀 Registered!";
  });
}

//LOGING 
function login(){
  const form = document.getElementById("loginForm");
  if(!form) return;

  form.addEventListener("submit", async (e)=>{
    e.preventDefault();

    const user = {
      email: document.getElementById("email").value,
      password: document.getElementById("password").value
    };

    const res = await fetch("http://localhost:3000/login", {
      method:"POST",
      headers:{ "Content-Type":"application/json" },
      body: JSON.stringify(user)
    });

    const data = await res.json();

    // ✅ هنا check admin
    if(data.role === 'admin'){
      document.getElementById("message").innerText = "👑 Admin login";
      window.location.href = "dashboard.html";
    } else if(data.message === 'Login success ✅'){
      document.getElementById("message").innerText = "✅ Login success";
    } else {
      document.getElementById("message").innerText = "❌ Login failed";
    }
  });
}
// INIT
document.addEventListener("DOMContentLoaded", ()=>{
  loadEvents();
  loadDashboardEvents();
  register();
  login();
});