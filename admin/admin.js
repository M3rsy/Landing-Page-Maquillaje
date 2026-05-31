function redirectToLogin() {
  window.location.href = "index.html";
}

async function apiFetch(url, options = {}) {
  const response = await fetch(url, {
    credentials: "same-origin",
    ...options,
  });

  if (response.status === 401) {
    redirectToLogin();
    throw new Error("Sesión expirada. Inicia sesión de nuevo.");
  }

  return response;
}

async function ensureSession() {
  try {
    const res = await apiFetch("/api/auth/me");
    if (!res.ok) {
      redirectToLogin();
      return null;
    }

    const data = await res.json();
    return data.usuario || "Admin";
  } catch {
    redirectToLogin();
    return null;
  }
}

// --- Estado global ---
let editingId = null;
let currentPage = 1;
const PAGE_LIMIT = 20;
let currentQuery = "";

// --- Helpers ---
function formatPrice(n) {
  return `L ${parseFloat(n).toFixed(2)}`;
}

function showFormMsg(type, msg) {
  const errEl = document.getElementById("formError");
  const okEl = document.getElementById("formSuccess");
  errEl.hidden = true;
  okEl.hidden = true;
  if (type === "error") { errEl.textContent = msg; errEl.hidden = false; }
  if (type === "success") { okEl.textContent = msg; okEl.hidden = false; }
}

// --- Cargar productos ---
let lastTotal = 0;
async function loadProducts(page = 1, limit = PAGE_LIMIT, q = "") {
  try {
    const url = `/api/products/admin/list?page=${page}&limit=${limit}&q=${encodeURIComponent(q)}`;
    const res = await apiFetch(url);
    if (!res.ok) throw new Error("Error cargando productos");
    const data = await res.json();
    currentPage = data.page;
    currentQuery = q;
    lastTotal = data.total;
    renderTable(data.data, data.total);
    renderPagination(data);
  } catch (err) {
    document.getElementById("productsBody").innerHTML =
      `<tr><td colspan="9" class="empty-row error-row">Error: ${err.message}</td></tr>`;
  }
}

// --- Renderizar tabla ---
function renderTable(products, total) {
  const tbody = document.getElementById("productsBody");
  document.getElementById("productCount").textContent = total != null ? total : products.length;

  if (products.length === 0) {
    tbody.innerHTML = `<tr><td colspan="9" class="empty-row">No hay productos aún. ¡Agrega el primero!</td></tr>`;
    return;
  }

  tbody.innerHTML = products.map(p => `
    <tr>
      <td class="col-img">
        ${p.imagen
          ? `<img src="${p.imagen}" alt="${p.titulo}" class="thumb" />`
          : `<span class="no-img">Sin imagen</span>`}
      </td>
      <td class="col-code"><code>${p.codigo}</code></td>
      <td>${p.titulo}</td>
      <td><span class="badge-cat">${p.categoria}</span></td>
      <td>${formatPrice(p.precio)}</td>
      <td>${p.precio_mayorista != null ? formatPrice(p.precio_mayorista) : '—'}</td>
      <td class="col-costo">${formatPrice(p.costo)}</td>
      <td>${p.disponible ? '<span class="badge-ok">Disponible</span>' : '<span class="badge-off">Agotado</span>'}</td>
      <td class="col-actions">
        <button class="btn-edit" onclick="startEdit(${p.id})">Editar</button>
        <button class="btn-delete" onclick="deleteProduct(${p.id}, '${p.titulo.replace(/'/g, "\\'")}')">Eliminar</button>
      </td>
    </tr>
  `).join("");
}

// --- Paginación ---
function renderPagination({ total, page, limit, totalPages }) {
  const container = document.getElementById("pagination");
  container.innerHTML = "";

  if (totalPages <= 1) return;

  const createBtn = (label, targetPage, disabled = false) => {
    const btn = document.createElement("button");
    btn.textContent = label;
    btn.disabled = disabled;
    if (!disabled) {
      btn.addEventListener("click", () => loadProducts(targetPage, limit, currentQuery));
    }
    return btn;
  };

  container.appendChild(createBtn("Anterior", page - 1, page <= 1));

  for (let i = 1; i <= totalPages; i++) {
    const btn = document.createElement("button");
    btn.textContent = i;
    if (i === page) btn.classList.add("active");
    btn.addEventListener("click", () => loadProducts(i, limit, currentQuery));
    container.appendChild(btn);
  }

  container.appendChild(createBtn("Siguiente", page + 1, page >= totalPages));
}

// --- Búsqueda (debounce) ---
let searchTimeout;
document.getElementById("searchInput").addEventListener("input", (e) => {
  const q = e.target.value.trim();
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    loadProducts(1, PAGE_LIMIT, q);
  }, 300);
});

// --- Formulario: guardar ---
document.getElementById("productForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const btn = document.getElementById("submitBtn");
  btn.disabled = true;
  showFormMsg(null, null);

  const form = e.target;
  const body = {
    codigo: form.codigo.value.trim().toUpperCase(),
    titulo: form.titulo.value.trim(),
    descripcion: form.descripcion.value.trim(),
    precio: form.precio.value,
    costo: form.costo.value,
    precio_mayorista: form.precio_mayorista.value === "" ? null : form.precio_mayorista.value,
    categoria: form.categoria.value,
    marca: form.marca.value.trim(),
    disponible: form.disponible.checked ? 1 : 0,
  };

  try {
    const url = editingId ? `/api/products/${editingId}` : "/api/products";
    const method = editingId ? "PUT" : "POST";

    const res = await fetch(url, {
      credentials: "same-origin",
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (res.status === 401) {
      redirectToLogin();
      return;
    }

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Error al guardar");

    // Subir imagen si se seleccionó
    const imgFile = form.imagen.files[0];
    if (imgFile) {
      const fd = new FormData();
      fd.append("imagen", imgFile);
      const imgRes = await apiFetch(`/api/products/${data.id}/image`, {
        method: "POST",
        body: fd,
      });
      if (!imgRes.ok) {
        const imgErr = await imgRes.json();
        showFormMsg("error", `Producto guardado, pero error al subir imagen: ${imgErr.error}`);
      }
    }

    let successMsg = editingId ? "Producto actualizado correctamente." : "Producto agregado correctamente.";
    if (data.warnings && data.warnings.length) {
      successMsg += " ⚠️ " + data.warnings.map(w => w.message || w).join(" ");
    }
    showFormMsg("success", successMsg);
    cancelEdit();
    await loadProducts(currentPage, PAGE_LIMIT, currentQuery);
  } catch (err) {
    showFormMsg("error", err.message);
  } finally {
    btn.disabled = false;
  }
});

// --- Editar ---
async function startEdit(id) {
  try {
    const res = await apiFetch(`/api/products/${id}`);
    if (!res.ok) throw new Error("Producto no encontrado");
    const p = await res.json();

    editingId = id;
    document.getElementById("formTitle").textContent = "Editar Producto";
    document.getElementById("editId").value = id;
    document.getElementById("codigo").value = p.codigo;
    document.getElementById("titulo").value = p.titulo;
    document.getElementById("descripcion").value = p.descripcion || "";
    document.getElementById("precio").value = p.precio;
    document.getElementById("costo").value = p.costo;
    document.getElementById("precio_mayorista").value = p.precio_mayorista ?? "";
    document.getElementById("categoria").value = p.categoria;
    document.getElementById("marca").value = p.marca || "";
    document.getElementById("disponible").checked = !!p.disponible;
    document.getElementById("submitBtn").textContent = "Actualizar producto";
    document.getElementById("cancelEditBtn").hidden = false;
    showFormMsg(null, null);

    document.querySelector(".form-section").scrollIntoView({ behavior: "smooth" });
  } catch (err) {
    alert(`Error: ${err.message}`);
  }
}

function cancelEdit() {
  editingId = null;
  document.getElementById("formTitle").textContent = "Agregar Producto";
  document.getElementById("productForm").reset();
  document.getElementById("submitBtn").textContent = "Guardar producto";
  document.getElementById("cancelEditBtn").hidden = true;
  showFormMsg(null, null);
}

document.getElementById("cancelEditBtn").addEventListener("click", cancelEdit);

// --- Eliminar ---
async function deleteProduct(id, nombre) {
  if (!confirm(`¿Eliminar "${nombre}"? Esta acción no se puede deshacer.`)) return;
  try {
    const res = await apiFetch(`/api/products/${id}`, {
      method: "DELETE",
    });
    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.error || "Error al eliminar");
    }
await loadProducts(currentPage, PAGE_LIMIT, currentQuery);
  } catch (err) {
    alert(`Error: ${err.message}`);
  }
}

document.getElementById("logoutBtn").addEventListener("click", async () => {
  try {
    await apiFetch("/api/auth/logout", { method: "POST" });
  } catch {
    // Si falla el logout en el backend, igual redirigimos para cortar sesión en UI.
  } finally {
    redirectToLogin();
  }
});

// --- Configuración: toggle card ---
document.getElementById("settingsBtn").addEventListener("click", () => {
  const card = document.getElementById("settingsCard");
  card.hidden = !card.hidden;
});

// --- Configuración: cambiar contraseña ---
document.getElementById("passwordForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const btn = document.getElementById("pwdSubmitBtn");
  btn.disabled = true;

  const errorEl = document.getElementById("pwdError");
  const successEl = document.getElementById("pwdSuccess");
  errorEl.hidden = true;
  successEl.hidden = true;

  const currentPassword = document.getElementById("currentPassword").value;
  const newPassword = document.getElementById("newPassword").value;
  const confirmPassword = document.getElementById("confirmPassword").value;

  if (!currentPassword || !newPassword || !confirmPassword) {
    errorEl.textContent = "Todos los campos son obligatorios";
    errorEl.hidden = false;
    btn.disabled = false;
    return;
  }

  if (newPassword.length < 8) {
    errorEl.textContent = "La contraseña nueva debe tener al menos 8 caracteres";
    errorEl.hidden = false;
    btn.disabled = false;
    return;
  }

  if (newPassword !== confirmPassword) {
    errorEl.textContent = "Las contraseñas nuevas no coinciden";
    errorEl.hidden = false;
    btn.disabled = false;
    return;
  }

  if (newPassword === currentPassword) {
    errorEl.textContent = "La contraseña nueva no puede ser igual a la actual";
    errorEl.hidden = false;
    btn.disabled = false;
    return;
  }

  try {
    const res = await apiFetch("/api/auth/password", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ currentPassword, newPassword }),
    });

    if (res.status === 401) {
      redirectToLogin();
      return;
    }

    if (res.status === 429) {
      errorEl.textContent = "Demasiados intentos. Intenta de nuevo en 15 minutos.";
      errorEl.hidden = false;
      btn.disabled = false;
      return;
    }

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Error al cambiar la contraseña");

    successEl.textContent = "Contraseña actualizada. Redirigiendo al login…";
    successEl.hidden = false;
    setTimeout(() => redirectToLogin(), 2000);
  } catch (err) {
    errorEl.textContent = err.message;
    errorEl.hidden = false;
    btn.disabled = false;
  }
});

// --- Eye toggles ---
document.querySelectorAll(".toggle-eye").forEach((btn) => {
  btn.addEventListener("click", () => {
    const targetId = btn.getAttribute("data-target");
    const input = document.getElementById(targetId);
    const eyeOpen = btn.querySelector(".eye-open");
    const eyeClosed = btn.querySelector(".eye-closed");

    const isHidden = input.type === "password";
    input.type = isHidden ? "text" : "password";
    eyeOpen.style.display = isHidden ? "none" : "";
    eyeClosed.style.display = isHidden ? "" : "none";
    btn.setAttribute("aria-label", isHidden ? "Ocultar contraseña" : "Mostrar contraseña");
  });
});

// Cargar al iniciar
(async () => {
  const usuario = await ensureSession();
  if (!usuario) return;
  document.getElementById("adminName").textContent = usuario;
  document.getElementById("navAvatar").textContent = usuario.slice(0, 2).toUpperCase();
  await loadProducts();
})();
