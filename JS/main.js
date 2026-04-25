// ================= SCROLL ANIMATION =================
window.addEventListener("scroll", () => {
  document.querySelectorAll(".reveal, .reveal-left, .reveal-right")
  .forEach(el => {
    let top = el.getBoundingClientRect().top;
    let height = window.innerHeight;

    if(top < height - 100){
      el.classList.add("active");
    }
  });
});


// ================= NAVBAR HIDE =================
let lastScroll = 0;
const nav = document.querySelector("nav");

window.addEventListener("scroll", () => {
  let current = window.scrollY;

  if(current > lastScroll){
    nav.classList.add("hide");
  } else{
    nav.classList.remove("hide");
  }

  lastScroll = current;
});


// ================= TOP BUTTON =================
const topBtn = document.getElementById("topBtn");

window.addEventListener("scroll", () => {
  topBtn.style.display = window.scrollY > 300 ? "block" : "none";
});

topBtn.onclick = () => {
  window.scrollTo({top:0, behavior:"smooth"});
};


// ================= DARK / LIGHT MODE =================
const themeBtn = document.getElementById("themeBtn");

/* تحميل الحالة */
if(localStorage.getItem("theme") === "light"){
  document.body.classList.add("light");
  themeBtn.textContent = "☀️";
}

themeBtn.onclick = () => {
  document.body.classList.toggle("light");

  if(document.body.classList.contains("light")){
    themeBtn.textContent = "☀️";
    localStorage.setItem("theme", "light");
  }else{
    themeBtn.textContent = "🌙";
    localStorage.setItem("theme", "dark");
  }
};