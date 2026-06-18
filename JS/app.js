// ================= REGISTER =================

const registerForm = document.getElementById("registerForm");

if(registerForm){

  registerForm.addEventListener("submit", async (e)=>{

    e.preventDefault();

    const username =
    document.getElementById("username").value;

    const email =
    document.getElementById("email").value;

    const password =
    document.getElementById("password").value;
    const section =
    document.getElementById("section").value;

    const hobbies =
    document.getElementById("hobbies").value;
    try{

      const res = await fetch(
        "http://localhost:3000/api/register",
        {
          method:"POST",
          headers:{
            "Content-Type":"application/json"
          },
          body:JSON.stringify({
            username,
            email,
            password,
            section,
            hobbies
          })
        }
      );

      const data = await res.json();

      showToast(data.message);

      if(data.userId){

        registerForm.reset();

        setTimeout(()=>{
          window.location.href = "login.html";
        },1000);

      }

    }catch(err){

      console.error(err);
      showToast("Server Error ❌");

    }

  });

}
// ================= LOGIN =================

const loginForm =
document.getElementById("loginForm");

if(loginForm){

  loginForm.addEventListener("submit", async (e)=>{

    e.preventDefault();

    const email =
    document.getElementById("loginEmail").value;

    const password =
    document.getElementById("loginPassword").value;

    try{

      const res = await fetch(
        "http://localhost:3000/api/login",
        {
          method:"POST",
          headers:{
            "Content-Type":"application/json"
          },
          body:JSON.stringify({
            email,
            password
          })
        }
      );

      const data = await res.json();

      if(data.user){

        localStorage.setItem(
          "loggedInUser",
          JSON.stringify(data.user)
        );

        localStorage.setItem(
          "isAdmin",
          data.user.role === "admin"
          ? "true"
          : "false"
        );

        showToast("Login Successful 🚀");

        setTimeout(()=>{

          if(data.user.role === "admin"){

            window.location.href =
            "dashboard.html";

          }else{

            window.location.href =
            "home.html";

          }

        },1000);

      }else{

        showToast(data.message);

      }

    }catch(err){

      console.log(err);
      showToast("Server Error ❌");

    }

  });

}
// ================= NAVBAR CONTROL =================
const navLinks = document.querySelector(".nav-links");

const loggedInUser =
JSON.parse(localStorage.getItem("loggedInUser"));

const isAdmin =
loggedInUser?.role === "admin";

if(navLinks){

  if(!loggedInUser){

    navLinks.innerHTML = `
      <li><a href="home.html">Home</a></li>
      <li><a href="events.html">Events</a></li>
      <li><a href="join.html">Join</a></li>
      <li><a href="login.html">Login</a></li>
    `;

  }else if(isAdmin){

    navLinks.innerHTML = `
      <li><a href="home.html">Home</a></li>
      <li><a href="events.html">Events</a></li>
      <li><a href="dashboard.html">Dashboard</a></li>
      <li><a href="#" onclick="logout()">Logout</a></li>
    `;

  }else{

    navLinks.innerHTML = `
      <li><a href="home.html">Home</a></li>
      <li><a href="events.html">Events</a></li>
      <li><a href="#" onclick="logout()">Logout</a></li>
    `;

  }

}
//================= PAGE PROTECTION =================
const currentPage =
window.location.pathname.split("/").pop();

const user =
JSON.parse(localStorage.getItem("loggedInUser"));

if(currentPage === "dashboard.html"){

  if(!user){

    window.location.href = "login.html";

  }

  if(user.role !== "admin"){

    window.location.href = "home.html";

  }

}


// ================= LOGOUT =================

function logout(){

  localStorage.removeItem("loggedInUser");

  showToast("Logged out 👋");

  setTimeout(()=>{

    window.location.href = "login.html";

  },500);

}

// ================= EVENTS ADMIN =================

const eventForm =
document.getElementById("eventForm");

if(eventForm){

  eventForm.addEventListener("submit", async (e)=>{

    e.preventDefault();

    const title =
    document.getElementById("eventTitle").value;

    const description =
    document.getElementById("eventDescription").value;

    const category =
    document.getElementById("eventCategory").value;

    const location =
    document.getElementById("eventLocation").value;

    const date =
    document.getElementById("eventDate").value;

    const image =
    document.getElementById("eventImage").value;

    const time = "";

    const res = await fetch(
      "http://localhost:3000/api/events",
      {
        method:"POST",
        headers:{
          "Content-Type":"application/json"
        },
        body:JSON.stringify({
          title,
          description,
          category,
          location,
          date,
          time,
          image
        })
      }
    );

    const data =
    await res.json();

    showToast(data.message);

    loadEvents();

    eventForm.reset();

  });

}

// ================= LOAD EVENTS =================

async function loadEvents(){

  const eventsList =
  document.getElementById("eventsList");

  if(!eventsList) return;

  const res =
  await fetch(
    "http://localhost:3000/api/events"
  );

  const events =
  await res.json();

  let output = "";

  events.forEach(event=>{

    output += `

    <div class="member-card">

      <img
      src="${event.image}"
      style="
      width:100%;
      height:180px;
      object-fit:cover;
      border-radius:12px;
      margin-bottom:15px;
      ">

      <h3>${event.title}</h3>

      <p>${event.category}</p>

      <p>${event.location}</p>

      <p>${event.date}</p>

      <button
      onclick="deleteEvent(${event.id})"
      class="delete-btn">
      Delete
      </button>

    </div>

    `;

  });

  eventsList.innerHTML = output;

}

loadEvents();

// ================= DELETE EVENT =================

async function deleteEvent(id){

  const res =
  await fetch(
    `http://localhost:3000/api/events/${id}`,
    {
      method:"DELETE"
    }
  );

  const data =
  await res.json();

  showToast(data.message);

  loadEvents();

}

// ================= PUBLIC EVENTS =================

async function loadPublicEvents(){

  const publicEvents =
  document.getElementById("publicEvents");

  if(!publicEvents) return;

  const res =
  await fetch(
    "http://localhost:3000/api/events"
  );

  const events =
  await res.json();

  let output = "";

  events.forEach(event=>{

    output += `

    <div
    class="event-card-pro reveal"
    data-category="${event.category}">

      <div class="event-image">

        <img
        src="${event.image}"
        alt="${event.title}">

        <span class="event-category">
          ${event.category}
        </span>

      </div>

      <div class="event-content">

        <h3>${event.title}</h3>

        <p>${event.description}</p>

        <div class="event-meta">

          <span>
          <i class="fa-solid fa-location-dot"></i>
          ${event.location}
          </span>

          <span>
          <i class="fa-regular fa-calendar"></i>
          ${event.date}
          </span>

        </div>

      </div>

    </div>

    `;

  });

  publicEvents.innerHTML = output;

}

loadPublicEvents();
//================= LOAD USERS =================
function loadUsers(){

  const usersList =
  document.getElementById("usersList");

  if(!usersList) return;

  fetch("http://localhost:3000/api/users")

  .then(res => res.json())

  .then(users => {

    const membersCount =
    document.getElementById("membersCount");

    if(membersCount){
      membersCount.innerHTML = users.length;
    }

    let output = "";

    users.forEach(user => {

      output += `

      <div class="member-card">

        <h3>${user.username}</h3>

        <p>Email : ${user.email}</p>

        <p>Section : ${user.section || "-"}</p>

        <p>Hobbies : ${user.hobbies || "-"}</p>

        <button
        class="delete-btn"
        onclick="deleteUser(${user.id})">
        Delete
        </button>

      </div>

      `;

    });

    usersList.innerHTML = output;

  })

  .catch(err => console.log(err));

}

loadUsers();
//================= DELETE USER =================
function deleteUser(id){

  if(!confirm("Delete this user ?")) return;

  fetch(`http://localhost:3000/api/users/${id}`,{
    method:"DELETE"
  })

  .then(res => res.json())

  .then(data => {

    showToast(data.message);

    loadUsers();

  })

  .catch(err => console.log(err));

}
// ================= REVEAL ANIMATION =================

const reveals = document.querySelectorAll(".reveal");

function revealOnScroll() {
  reveals.forEach(el => {
    const windowHeight = window.innerHeight;
    const elementTop = el.getBoundingClientRect().top;

    if (elementTop < windowHeight - 100) {
      el.classList.add("active");
    }
  });
}

window.addEventListener("scroll", revealOnScroll);
revealOnScroll();