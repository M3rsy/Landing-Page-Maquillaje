// Verificar sesión
const token = localStorage.getItem("jrv_token");
if (!token) window.location.href = "index.html";

const usuario = localStorage.getItem("jrv_usuario") || "Admin";
document.getElementById("adminName").textContent = usuario;
document.getElementById("navAvatar").textContent = usuario.slice(0, 2).toUpperCase();
document.getElementById("logoutBtn").addEventListener("click", () => {
  localStorage.removeItem("jrv_token");
  localStorage.removeItem("jrv_usuario");
  window.location.href = "index.html";
});

// --- Estado global ---
let allProducts = [];
let editingId = null;

// --- Helpers ---
function authHeaders() {
  return { Authorization: `Bearer ${token}` };
}

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
async function loadProducts() {
  try {
    const res = await fetch("/api/products");
    if (!res.ok) throw new Error("Error cargando productos");
    allProducts = await res.json();
    renderTable(allProducts);
  } catch (err) {
    document.getElementById("productsBody").innerHTML =
      `<tr><td colspan="8" class="empty-row error-row">Error: ${err.message}</td></tr>`;
  }
}

// --- Renderizar tabla ---
function renderTable(products) {
  const tbody = document.getElementById("productsBody");
  document.getElementById("productCount").textContent = products.length;

  if (products.length === 0) {
    tbody.innerHTML = `<tr><td colspan="8" class="empty-row">No hay productos aún. ¡Agrega el primero!</td></tr>`;
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
      <td class="col-costo">${formatPrice(p.costo)}</td>
      <td>${p.disponible ? '<span class="badge-ok">Disponible</span>' : '<span class="badge-off">Agotado</span>'}</td>
      <td class="col-actions">
        <button class="btn-edit" onclick="startEdit(${p.id})">Editar</button>
        <button class="btn-delete" onclick="deleteProduct(${p.id}, '${p.titulo.replace(/'/g, "\\'")}')">Eliminar</button>
      </td>
    </tr>
  `).join("");
}

// --- Búsqueda ---
document.getElementById("searchInput").addEventListener("input", (e) => {
  const q = e.target.value.toLowerCase();
  const filtered = allProducts.filter(p =>
    p.titulo.toLowerCase().includes(q) || p.codigo.toLowerCase().includes(q)
  );
  renderTable(filtered);
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
    categoria: form.categoria.value,
    marca: form.marca.value.trim(),
    disponible: form.disponible.checked ? 1 : 0,
  };

  try {
    const url = editingId ? `/api/products/${editingId}` : "/api/products";
    const method = editingId ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { ...authHeaders(), "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Error al guardar");

    // Subir imagen si se seleccionó
    const imgFile = form.imagen.files[0];
    if (imgFile) {
      const fd = new FormData();
      fd.append("imagen", imgFile);
      const imgRes = await fetch(`/api/products/${data.id}/image`, {
        method: "POST",
        headers: authHeaders(),
        body: fd,
      });
      if (!imgRes.ok) {
        const imgErr = await imgRes.json();
        showFormMsg("error", `Producto guardado, pero error al subir imagen: ${imgErr.error}`);
      }
    }

    showFormMsg("success", editingId ? "Producto actualizado correctamente." : "Producto agregado correctamente.");
    cancelEdit();
    await loadProducts();
  } catch (err) {
    showFormMsg("error", err.message);
  } finally {
    btn.disabled = false;
  }
});

// --- Editar ---
function startEdit(id) {
  const p = allProducts.find(x => x.id === id);
  if (!p) return;

  editingId = id;
  document.getElementById("formTitle").textContent = "Editar Producto";
  document.getElementById("editId").value = id;
  document.getElementById("codigo").value = p.codigo;
  document.getElementById("titulo").value = p.titulo;
  document.getElementById("descripcion").value = p.descripcion || "";
  document.getElementById("precio").value = p.precio;
  document.getElementById("costo").value = p.costo;
  document.getElementById("categoria").value = p.categoria;
  document.getElementById("marca").value = p.marca || "";
  document.getElementById("disponible").checked = !!p.disponible;
  document.getElementById("submitBtn").textContent = "Actualizar producto";
  document.getElementById("cancelEditBtn").hidden = false;
  showFormMsg(null, null);

  document.querySelector(".form-section").scrollIntoView({ behavior: "smooth" });
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
    const res = await fetch(`/api/products/${id}`, {
      method: "DELETE",
      headers: authHeaders(),
    });
    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.error || "Error al eliminar");
    }
    await loadProducts();
  } catch (err) {
    alert(`Error: ${err.message}`);
  }
}

// Cargar al iniciar
loadProducts();
