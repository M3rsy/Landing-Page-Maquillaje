const { test, expect } = require("@playwright/test");

const mockProducts = [
  {
    id: 1,
    codigo: "MAY-001",
    titulo: "Producto Mayorista",
    descripcion: "Con precio mayorista",
    precio: 180,
    precio_mayorista: 120,
    categoria: "Rostro",
    marca: "Marca A",
    imagen: "assets/productos/MAY-001.png",
    disponible: 1,
  },
  {
    id: 2,
    codigo: "DET-001",
    titulo: "Producto Detalle",
    descripcion: "Sin precio mayorista",
    precio: 90,
    categoria: "Labios",
    marca: "Marca B",
    imagen: "assets/productos/DET-001.png",
    disponible: 1,
  },
];

async function mockProductsApi(page, { status = 200, body = { data: mockProducts, total: 2, page: 1, limit: 50, totalPages: 1 } } = {}) {
  // Match the paginated endpoint (with or without query params) but NOT /filters or /admin
  await page.route("**/api/v1/products?*", async (route) => {
    await route.fulfill({
      status,
      contentType: "application/json",
      body: JSON.stringify(body),
    });
  });
  // Also match bare path (no query string fallback)
  await page.route("**/api/v1/products", async (route) => {
    await route.fulfill({
      status,
      contentType: "application/json",
      body: JSON.stringify(body),
    });
  });
}

async function mockFiltersApi(page, { status = 200, body = { categories: ["Rostro", "Labios"], brands: ["Marca A", "Marca B"], featured: mockProducts } } = {}) {
  await page.route("**/api/v1/products/filters**", async (route) => {
    await route.fulfill({
      status,
      contentType: "application/json",
      body: JSON.stringify(body),
    });
  });
}

test.describe("public catalog smoke", () => {
  test("happy path: homepage renders product grid and summary", async ({ page }) => {
    await mockProductsApi(page);
    await mockFiltersApi(page);
    await page.goto("/");

    const catalog = page.locator("#catalogo");
    const productGrid = catalog.locator("#productGrid");
    const cards = productGrid.locator(".product-card");

    await expect(productGrid).toBeVisible();
    await expect(cards).toHaveCount(2);

    const summary = catalog.locator("#resultSummary");
    await expect(summary).toBeVisible();
    await expect(summary).toHaveText("2 productos encontrados");
  });

  test("API failure path: empty state appears without crashing", async ({ page }) => {
    await mockProductsApi(page, { status: 500, body: { error: "forced failure" } });
    await mockFiltersApi(page, { status: 500, body: { error: "forced failure" } });

    await page.goto("/");

    const catalog = page.locator("#catalogo");
    const productGrid = catalog.locator("#productGrid");
    const cards = productGrid.locator(".product-card");

    await expect(productGrid).toBeHidden();
    await expect(cards).toHaveCount(0);

    const emptyState = catalog.locator("#emptyState");
    await expect(emptyState).toBeVisible();
    await expect(emptyState).toContainText("No encontramos productos");

    const summary = catalog.locator("#resultSummary");
    await expect(summary).toHaveText(/0\s+productos\s+encontrados/i);
  });

  test("wholesale path: only product with wholesale price shows wholesale tag", async ({ page }) => {
    await mockProductsApi(page);
    await mockFiltersApi(page);

    await page.goto("/");

    const catalog = page.locator("#catalogo");
    const cards = catalog.locator("#productGrid .product-card");
    await expect(cards).toHaveCount(2);
    await expect(cards.locator(".wholesale")).toHaveCount(1);

    const withWholesale = cards.filter({ hasText: "Producto Mayorista" });
    const withoutWholesale = cards.filter({ hasText: "Producto Detalle" });

    await expect(withWholesale.locator(".wholesale")).toContainText("Mayoreo");
    await expect(withoutWholesale.locator(".wholesale")).toHaveCount(0);
  });
});
