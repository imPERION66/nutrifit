const customFoods = [];

function nfNormalizeGoal(goal) {
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

  return "mantener";
}

function nfGetUsers() {
  return JSON.parse(localStorage.getItem("nf_users") || "[]");
}

function nfSaveUsers(users) {
  localStorage.setItem("nf_users", JSON.stringify(users));
}

function nfUserGoalKey(email) {
  return `nf_user_goal_${email}`;
}

function nfGetUserGoal() {
  const session = nfGetSession();
  if (!session) {
    return "mantener";
  }

  const savedGoal = localStorage.getItem(nfUserGoalKey(session.email));
  const normalizedGoal = nfNormalizeGoal(savedGoal || session.objetivo);

  if (savedGoal !== normalizedGoal) {
    localStorage.setItem(nfUserGoalKey(session.email), normalizedGoal);
  }

  if (session.objetivo !== normalizedGoal) {
    session.objetivo = normalizedGoal;
    localStorage.setItem("nf_session", JSON.stringify(session));
  }

  return normalizedGoal;
}

function nfSaveUserGoal(goal) {
  const session = nfGetSession();
  if (!session) {
    return;
  }

  const normalizedGoal = nfNormalizeGoal(goal);

  localStorage.setItem(nfUserGoalKey(session.email), normalizedGoal);
  session.objetivo = normalizedGoal;
  localStorage.setItem("nf_session", JSON.stringify(session));

  const users = nfGetUsers();
  const userIndex = users.findIndex((user) => user.email === session.email);
  if (userIndex >= 0) {
    users[userIndex].objetivo = normalizedGoal;
    nfSaveUsers(users);
  }
}

function nfGoalLabel(goal) {
  const labels = {
    bajar: "Bajar peso",
    mantener: "Mantener peso",
    ganar: "Aumentar masa muscular"
  };
  return labels[nfNormalizeGoal(goal)] || "Mantener peso";
}

function nfInitProfilePage() {
  const session = nfInitApp("perfil");
  if (!session) {
    return;
  }

  const profileGoal = document.getElementById("profile-goal");
  const profileName = document.getElementById("profile-name");
  const profileEmail = document.getElementById("profile-email");
  const profileMessage = document.getElementById("profile-message");

  const currentGoal = nfGetUserGoal();
  profileGoal.value = currentGoal;
  profileName.textContent = session.nombre || "Usuario";
  profileEmail.textContent = session.email || "";
  profileMessage.textContent = `Objetivo actual: ${nfGoalLabel(currentGoal)}.`;

  document.getElementById("profile-save").addEventListener("click", () => {
    const selectedGoal = profileGoal.value;
    nfSaveUserGoal(selectedGoal);
    profileMessage.textContent = `Objetivo guardado: ${nfGoalLabel(selectedGoal)}.`;
    searchFood(document.getElementById("catalog-search")?.value || "");
  });
}

function nfInitCatalogPage() {
  nfInitApp("catalogo");

  const searchInput = document.getElementById("catalog-search");
  const clearButton = document.getElementById("catalog-search-clear");
  const addFoodButton = document.getElementById("btn-open-custom-dialog");
  const dialog = document.getElementById("custom-food-dialog");
  const customForm = document.getElementById("custom-food-form");

  if (searchInput) {
    searchInput.addEventListener("input", (event) => searchFood(event.target.value));
  }

  if (clearButton) {
    clearButton.addEventListener("click", () => {
      searchInput.value = "";
      searchFood("");
    });
  }

  if (addFoodButton) {
    addFoodButton.addEventListener("click", () => {
      dialog.showModal();
    });
  }

  if (customForm) {
    customForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const formData = new FormData(customForm);
      const name = formData.get("food-name").trim();
      const kcal = parseInt(formData.get("food-kcal"), 10) || 0;
      const goal = formData.get("food-goal");
      const category = formData.get("food-category").trim() || "Personalizado";
      const badgeClass = formData.get("badge-class") || "cereal";
      const description = formData.get("food-description").trim() || "Alimento agregado manualmente.";
      const image = formData.get("food-image").trim() || "../assets/img/aguacate.jpeg";

      customFoods.unshift({
        id: `custom-${Date.now()}`,
        name,
        kcal,
        proteina: 0,
        carbohidratos: 0,
        grasas: 0,
        goal,
        category,
        badgeClass,
        description,
        image
      });

      dialog.close();
      customForm.reset();
      searchFood(searchInput.value || "");
    });
  }

  searchFood("");
}

function searchFood(query = "") {
  const goal = nfGetUserGoal();
  const normalizedQuery = query.trim().toLowerCase();
  const allFoods = [...foodDatabase, ...customFoods];

  const filtered = allFoods
    .filter((food) => nfNormalizeGoal(food.goal) === goal)
    .filter((food) => food.name.toLowerCase().includes(normalizedQuery));

  renderCatalog(filtered, goal, query);
}

function getFoodMetricValue(item, key) {
  return item[key] !== undefined ? item[key] : "-";
}

function renderCatalog(foods, goal, query) {
  const gallery = document.getElementById("food-gallery");
  const message = document.getElementById("catalog-empty");
  const goalInfo = document.getElementById("catalog-goal-info");
  const resultCount = foods.length;

  if (goalInfo) {
    goalInfo.textContent = query
      ? `Objetivo: ${nfGoalLabel(goal)} · Busqueda: "${query}" · ${resultCount} resultado(s)`
      : `Objetivo actual: ${nfGoalLabel(goal)} · ${resultCount} alimento(s) disponibles`;
  }

  if (!gallery) {
    return;
  }

  if (!resultCount) {
    gallery.innerHTML = "";
    if (message) {
      message.textContent = `No se encontraron alimentos para el objetivo ${nfGoalLabel(goal)}. Usa Perfil para cambiar tu objetivo.`;
      message.style.display = "block";
    }
    return;
  }

  if (message) {
    message.style.display = "none";
  }

  gallery.innerHTML = foods
    .map((food) => {
      return `
        <article class="food-card">
          <div class="food-card__top">
            <div class="food-card__image"><img src="${food.image}" alt="${food.name}"></div>
            <div class="food-card__identity">
              <h3>${food.name}</h3>
              <p>${food.description}</p>
            </div>
            <span class="food-badge ${food.badgeClass}">${food.category}</span>
          </div>
          <div class="food-metrics">
            <div class="food-metric"><span>Calorías</span><strong>${food.kcal} kcal</strong></div>
            <div class="food-metric"><span>Proteínas</span><strong>${getFoodMetricValue(food, "proteina")} g</strong></div>
            <div class="food-metric"><span>Carbohidratos</span><strong>${getFoodMetricValue(food, "carbohidratos")} g</strong></div>
            <div class="food-metric"><span>Grasas</span><strong>${getFoodMetricValue(food, "grasas")} g</strong></div>
          </div>
          <div class="food-card__footer"><span><i class="fa-solid fa-heart"></i> Meta: ${nfGoalLabel(food.goal)}</span><span>${food.category}</span></div>
        </article>
      `;
    })
    .join("");
}
