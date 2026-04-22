function switchTab(tab) {
  const isLogin = tab === "login";

  document.getElementById("tab-login").classList.toggle("active", isLogin);
  document.getElementById("tab-reg").classList.toggle("active", !isLogin);
  document.getElementById("panel-login").classList.toggle("active", isLogin);
  document.getElementById("panel-register").classList.toggle("active", !isLogin);
  document.getElementById("error-login").classList.remove("show");
  document.getElementById("error-reg").classList.remove("show");
}

function getUsers() {
  return JSON.parse(localStorage.getItem("nf_users") || "[]");
}

function saveUsers(users) {
  localStorage.setItem("nf_users", JSON.stringify(users));
}

function normalizeGoal(goal) {
  const normalizedGoal = (goal || "").toString().trim().toLowerCase();

  if (normalizedGoal === "aumentar" || normalizedGoal === "aumentar masa muscular" || normalizedGoal === "ganar" || normalizedGoal === "ganar masa" || normalizedGoal === "masa muscular") {
    return "ganar";
  }

  if (normalizedGoal === "bajar" || normalizedGoal === "bajar de peso" || normalizedGoal === "perder peso") {
    return "bajar";
  }

  if (normalizedGoal === "mantener" || normalizedGoal === "mantener peso" || normalizedGoal === "mantener mi peso") {
    return "mantener";
  }

  return "";
}

document.getElementById("form-login").addEventListener("submit", (e) => {
  e.preventDefault();

  const email = document.getElementById("login-email").value.trim();
  const pass = document.getElementById("login-pass").value;
  const errBox = document.getElementById("error-login");
  const errText = document.getElementById("error-login-text");

  if (!email || !pass) {
    errText.textContent = "Por favor completa todos los campos.";
    errBox.classList.add("show");
    return;
  }

  if (!/\S+@\S+\.\S+/.test(email)) {
    errText.textContent = "Ingresa un correo electronico valido.";
    errBox.classList.add("show");
    return;
  }

  const users = getUsers();
  const user = users.find((item) => item.email === email && item.pass === pass);

  if (!user) {
    errText.textContent = "Correo o contrasena incorrectos. Verifica tus datos.";
    errBox.classList.add("show");
    return;
  }

  errBox.classList.remove("show");
  localStorage.setItem("nf_session", JSON.stringify(user));
  window.location.href = "pages/dashboard.html";
});

document.getElementById("form-register").addEventListener("submit", (e) => {
  e.preventDefault();

  const nombre = document.getElementById("reg-nombre").value.trim();
  const email = document.getElementById("reg-email").value.trim();
  const peso = document.getElementById("reg-peso").value;
  const talla = document.getElementById("reg-talla").value;
  const objetivo = normalizeGoal(document.getElementById("reg-objetivo").value);
  const pass = document.getElementById("reg-pass").value;
  const errBox = document.getElementById("error-reg");
  const errText = document.getElementById("error-reg-text");

  if (!nombre || !email || !pass) {
    errText.textContent = "Por favor completa los campos obligatorios.";
    errBox.classList.add("show");
    return;
  }

  if (!/\S+@\S+\.\S+/.test(email)) {
    errText.textContent = "Ingresa un correo electronico valido.";
    errBox.classList.add("show");
    return;
  }

  if (pass.length < 6) {
    errText.textContent = "La contrasena debe tener al menos 6 caracteres.";
    errBox.classList.add("show");
    return;
  }

  if (!objetivo) {
    errText.textContent = "Selecciona uno de los 3 objetivos: bajar, mantener o aumentar masa muscular.";
    errBox.classList.add("show");
    return;
  }

  const users = getUsers();

  if (users.find((item) => item.email === email)) {
    errText.textContent = "Ya existe una cuenta con ese correo. Inicia sesion.";
    errBox.classList.add("show");
    return;
  }

  const newUser = { nombre, email, pass, peso, talla, objetivo };
  users.push(newUser);
  saveUsers(users);
  localStorage.setItem("nf_session", JSON.stringify(newUser));

  errBox.classList.remove("show");
  window.location.href = "pages/dashboard.html";
});
