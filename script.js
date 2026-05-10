// Numero base del negocio: 88045356. WhatsApp necesita codigo de pais para abrir correctamente.
const WHATSAPP_NUMBER = "50488045356";
const GENERAL_MESSAGE = "Hola, quiero más información sobre el catálogo de maquillaje JOYERIAJRV.";
const OFFER_MESSAGE = "Hola, quiero reclamar el 10% de descuento en mi primera compra del catalogo JOYERIAJRV.";
const WHOLESALE_MESSAGE = "Hola, quiero abrir codigo mayorista. Tengo L 2,000 en producto variado.";

// Edita este array para agregar productos, cambiar precios o reemplazar imagenes.
const products = [
  {
    code: "LQBL-PT",
    name: "Liquid Blush Display",
    brand: "Beauty Creations",
    category: "Rubores",
    price: "L 320.00",
    wholesale: "L 220.00",
    image: "assets/productos/LQBL-PT.png",
    description: "Rubor liquido hidratante con Vitamina E. Color modulable y acabado natural. 8 tonos vibrantes. No pegajoso."
  },
  {
    code: "SS-RS-AS18",
    name: "Riding Solo Single Pressed Shadow",
    brand: "Beauty Creations",
    category: "Ojos",
    price: "L 205.00",
    wholesale: "L 145.00",
    image: "assets/productos/SS-RS-AS18.png",
    description: "Sombra individual prensada de alto brillo. Pigmento intenso, uso todo el dia. Compacta y facil de viajar. 18 tonos."
  },
  {
    code: "PAG-LBL",
    name: "Pout & Go Lip Balm Keychain - Lychee",
    brand: "Beauty Creations",
    category: "Labios",
    price: "L 140.00",
    wholesale: "L 95.00",
    image: "assets/productos/PAG-LBL.png",
    description: "Balsamo labial con llavero en forma de corazon. Aroma a lychee. Hidratante y portatil, perfecto para retoques rapidos."
  },
  {
    code: "DBJ-SET",
    name: "Don't Be Jelly - Cheek & Lip Stain",
    brand: "Beauty Creations",
    category: "Labios y mejillas",
    price: "L 385.00",
    wholesale: "L 265.00",
    image: "assets/productos/DBJ-SET.png",
    description: "Set de 3 tintes en barra para mejillas y labios con textura gelatinosa. Colores vibrantes y acabado fresco. Libre de crueldad."
  },
  {
    code: "TJ-BS1",
    name: "Dual End Powder and Cream Contour Brush",
    brand: "Beauty Creations",
    category: "Herramientas",
    price: "L 280.00",
    wholesale: "L 195.00",
    image: "assets/productos/TJ-BS1.png",
    description: "Brocha de contorno de doble extremo para polvo y crema. Cerdas suaves de alta calidad. Aplicacion profesional."
  },
  {
    code: "BHLBTLKM-PDQ",
    name: "Blush Hush Powder Blush Display",
    brand: "Beauty Creations",
    category: "Rubores",
    price: "L 225.00",
    wholesale: "L 155.00",
    image: "assets/productos/BHLBTLKM-PDQ.png",
    description: "Rubor en polvo con pigmento vibrante y textura sedosa. 8 tonos desde rosas suaves hasta berry intensos. Facil de difuminar."
  },
  {
    code: "TLT-ASS",
    name: "Lip Treatment & Tint Assorted",
    brand: "Beauty Creations",
    category: "Labios",
    price: "L 270.00",
    wholesale: "L 190.00",
    image: "assets/productos/TLT-ASS.png",
    description: "Tratamiento labial todo en uno con tinte de color. Hidrata, repara y nutre los labios. Infusionado con peptidos. Varios tonos."
  },
  {
    code: "FC-DL1-6",
    name: "Double Layer Lotion Assorted",
    brand: "Beauty Creations",
    category: "Cuidado corporal",
    price: "L 255.00",
    wholesale: "L 180.00",
    image: "assets/productos/FC-DL1-6.png",
    description: "Locion corporal de doble capa con aromas frutales. Hidratacion profunda y fragancia duradera. 6 aromas disponibles."
  },
  {
    code: "FC-BS1-6",
    name: "Sugar Body Scrub Assorted",
    brand: "Beauty Creations",
    category: "Cuidado corporal",
    price: "L 255.00",
    wholesale: "L 180.00",
    image: "assets/productos/FC-BS1-6.png",
    description: "Exfoliante corporal de azucar con aromas frutales. Exfolia, suaviza y da brillo a la piel. 4 aromas: melon, durazno, manzana y mango."
  },
  {
    code: "BSN02",
    name: "Flawless Stay Blending Sponge",
    brand: "Beauty Creations",
    category: "Herramientas",
    price: "L 145.00",
    wholesale: "L 100.00",
    image: "assets/productos/BSN02.png",
    description: "Esponja de maquillaje sin latex para difuminar base, corrector y polvo. Acabado impecable y sin marcas. 4 colores."
  },
  {
    code: "ELCTSET-PKRG",
    name: "Eyelash Curler & Tweezer",
    brand: "Beauty Creations",
    category: "Herramientas",
    price: "L 200.00",
    wholesale: "L 140.00",
    image: "assets/productos/ELCTSET-PKRG.png",
    description: "Set de rizador de pestanas y pinza en tono rose gold. Diseno ergonomico para un rizado perfecto. Libre de crueldad."
  },
  {
    code: "LOPHD",
    name: "All About You - PH Lips Oils",
    brand: "Beauty Creations",
    category: "Labios",
    price: "L 200.00",
    wholesale: "L 140.00",
    image: "assets/productos/LOPHD.png",
    description: "Aceites labiales que cambian a rosa con tu nivel de PH. Alto brillo, 6 aromas. Con aceite de jojoba. No pegajoso. Libre de crueldad."
  },
  {
    code: "ELTS09",
    name: "3D Soft Silk Lashes - Bahamas",
    brand: "Beauty Creations",
    category: "Pestanas",
    price: "L 90.00",
    wholesale: "L 65.00",
    image: "assets/productos/ELTS09.png",
    description: "Pestanas de seda suave 3D ultraligeras. Reutilizables hasta 3 veces. Suaves como la seda. Se necesita adhesivo. Libre de crueldad."
  },
  {
    code: "ELTS24",
    name: "3D Soft Silk Lashes - Los Angeles",
    brand: "Beauty Creations",
    category: "Pestanas",
    price: "L 90.00",
    wholesale: "L 65.00",
    image: "assets/productos/ELTS24.png",
    description: "Pestanas de seda suave 3D ultraligeras. Reutilizables hasta 3 veces. Estilo Los Angeles glamuroso. Libre de crueldad."
  },
  {
    code: "ELTS19",
    name: "3D Soft Silk Lashes - Milan",
    brand: "Beauty Creations",
    category: "Pestanas",
    price: "L 90.00",
    wholesale: "L 65.00",
    image: "assets/productos/ELTS19.png",
    description: "Pestanas de seda suave 3D ultraligeras. Reutilizables hasta 3 veces. Estilo Milan elegante y sofisticado. Libre de crueldad."
  },
  {
    code: "SK-CS2",
    name: "Skin Freshness Please - Cleansing Sponge",
    brand: "Beauty Creations",
    category: "Cuidado facial",
    price: "L 135.00",
    wholesale: "L 95.00",
    image: "assets/productos/SK-CS2.png",
    description: "Esponja limpiadora de 2 piezas en forma de corazon. Elimina impurezas para todo tipo de piel. Reemplazar cada 30 dias. Libre de crueldad."
  },
  {
    code: "NXLSDASS",
    name: "Nude X - Lipstick Assorted",
    brand: "Beauty Creations",
    category: "Labios",
    price: "L 270.00",
    wholesale: "L 185.00",
    image: "assets/productos/NXLSDASS.png",
    description: "Coleccion de labiales en tonos nude. 7 tonos desde Caramel hasta Coco Nude. Alta pigmentacion y acabado cremoso duradero."
  },
  {
    code: "SBD-PTD",
    name: "Blush Hush Display",
    brand: "Beauty Creations",
    category: "Rubores",
    price: "L 270.00",
    wholesale: "L 185.00",
    image: "assets/productos/SBD-PTD.png",
    description: "Display de rubor en polvo Blush Hush. Textura sedosa y colores vibrantes. Facil de difuminar para un acabado natural y luminoso."
  },
  {
    code: "KC245123",
    name: "You Are Gonna Make It! Blusher",
    brand: "Kevin & Coco",
    category: "Rubores",
    price: "L 335.00",
    wholesale: "L 230.00",
    image: "assets/productos/KC245123.png",
    description: "Paleta de 6 rubores con exterior de piel sintetica suave y mensaje motivador bordado. Pigmentos en forma de conejito. Alta pigmentacion y acabado impecable."
  },
  {
    code: "KC230005",
    name: "12 Colors Matte Lip Gloss",
    brand: "Kevin & Coco",
    category: "Labios",
    price: "L 355.00",
    wholesale: "L 245.00",
    image: "assets/productos/KC230005.png",
    description: "Set de 12 brillos mate de alta pigmentacion. Desde nudes suaves hasta rojos atrevidos. Acabado mate aterciopelado y duradero. Caja de regalo con cierre magnetico."
  },
  {
    code: "KC245130",
    name: "You Are Enough! Highlighter",
    brand: "Kevin & Coco",
    category: "Rostro",
    price: "L 335.00",
    wholesale: "L 230.00",
    image: "assets/productos/KC245130.png",
    description: "Iluminador con exterior de piel sintetica y mensaje motivador. Tonos luminosos para un brillo espectacular. Diseno adorable coleccionable."
  },
  {
    code: "KC1586",
    name: "4 Colors Lip Gloss Set",
    brand: "Kevin & Coco",
    category: "Labios",
    price: "L 235.00",
    wholesale: "L 160.00",
    image: "assets/productos/KC1586.png",
    description: "Set de 4 brillos de alto brillo en caja regalo con lazo de organza. Set A: rosas y corales frescos. Set B: nudes y tonos berry. No pegajoso e hidratante."
  },
  {
    code: "KC1347",
    name: "Daisy Garden Collection - Lip Gloss",
    brand: "Kevin & Coco",
    category: "Labios",
    price: "L 85.00",
    wholesale: "L 60.00",
    image: "assets/productos/KC1347.png",
    description: "Brillo labial con acabado ultrabrillante tipo espejo. Ligero y no pegajoso. 6 tonos desde rosas suaves hasta corales vibrantes. Hidratacion suave. 4.5 g."
  },
  {
    code: "KC1463",
    name: "Magic Girl - Lip Gloss",
    brand: "Kevin & Coco",
    category: "Labios",
    price: "L 115.00",
    wholesale: "L 80.00",
    image: "assets/productos/KC1463.png",
    description: "Brillo ultrahidratante con llavero rosa portatil. Nutre y repara labios. Desde tintes transparentes hasta cremas clasicas. 8 tonos. 3 g."
  },
  {
    code: "KC1352",
    name: "4 Colors Eyeshadow",
    brand: "Kevin & Coco",
    category: "Ojos",
    price: "L 140.00",
    wholesale: "L 100.00",
    image: "assets/productos/KC1352.png",
    description: "Paleta mini de 4 sombras coordinadas. Textura sedosa, alta pigmentacion. Acabados mate y satinados. Compacta y practica para viajar. 5.6 g."
  },
  {
    code: "KC1457",
    name: "Multi-Purpose Cream",
    brand: "Kevin & Coco",
    category: "Labios y mejillas",
    price: "L 115.00",
    wholesale: "L 80.00",
    image: "assets/productos/KC1457.png",
    description: "Crema multiusos 2 en 1 para labios y mejillas. Textura cremosa facil de difuminar. Acabado jugoso y no pegajoso. 6 tonos vibrantes. 4.5 g."
  },
  {
    code: "KC1428",
    name: "Love What You Drink - Eyeshadow Palette",
    brand: "Kevin & Coco",
    category: "Ojos",
    price: "L 155.00",
    wholesale: "L 110.00",
    image: "assets/productos/KC1428.png",
    description: "Paleta de 12 sombras inspirada en cocteles. Mates aterciopelados y metalicos brillantes. Alta pigmentacion y facil de difuminar. Estuche tematico."
  },
  {
    code: "KC1348",
    name: "Loose Powder",
    brand: "Kevin & Coco",
    category: "Rostro",
    price: "L 130.00",
    wholesale: "L 90.00",
    image: "assets/productos/KC1348.png",
    description: "Polvos sueltos con tecnologia difuminadora de poros. Control de grasa todo el dia. Borla de terciopelo incluida. 4 tonos: Sugar Cookie, Peach Pie, Cup Cake, Blondie. 10 g."
  },
  {
    code: "KC1205-B",
    name: "Fantastics Palette",
    brand: "Kevin & Coco",
    category: "Paletas",
    price: "L 155.00",
    wholesale: "L 110.00",
    image: "assets/productos/KC1205-B.png",
    description: "Paleta multifuncional con sombras, rubor e iluminador. Combinacion de mates y brillos. Estuche compacto rosa con espejo."
  },
  {
    code: "KC1313",
    name: "Fantastics Color Matching - Blush Cream",
    brand: "Kevin & Coco",
    category: "Rubores",
    price: "L 140.00",
    wholesale: "L 100.00",
    image: "assets/productos/KC1313.png",
    description: "Rubor en crema ultrapigmentado con diseno de lazo en relieve 3D. De crema a satinado, color modulable. Estuche con espejo. 4 tonos: Sakura, Peach, Lavender, Coral. 5.5 g."
  },
  {
    code: "KC1231",
    name: "Lip Liner",
    brand: "Kevin & Coco",
    category: "Labios",
    price: "L 75.00",
    wholesale: "L 45.00",
    image: "assets/productos/KC1231.png",
    description: "Set de 12 perfiladores de labios profesionales. Larga duracion y a prueba de manchas. Aplicacion cremosa y punta de precision. Acabado mate aterciopelado. Display 144 uds."
  },
  {
    code: "KC1503",
    name: "Lipliner & Lipstick & Lip Oil",
    brand: "Kevin & Coco",
    category: "Labios",
    price: "L 180.00",
    wholesale: "L 125.00",
    image: "assets/productos/KC1503.png",
    description: "Set 3 en 1: delineador, labial y gloss en formato lapiz giratorio. Tema Sweet Chocolate con aroma dulce. 3 tonos: Chocolate Cream, Hot Chocolate, Chocolate Chip. 7.8 g."
  },
  {
    code: "KC1068",
    name: "Cheese Avocado - 4 Colors Face Palette",
    brand: "Kevin & Coco",
    category: "Paletas",
    price: "L 245.00",
    wholesale: "L 170.00",
    image: "assets/productos/KC1068.png",
    description: "Paleta facial de 4 tonos con rubor e iluminador. 2 rubores (rosa nude + melocoton) y 2 iluminadores (perla + bronce dorado). Con vitamina E. Estuche magnetico con espejo. 6 g."
  },
  {
    code: "KC1490",
    name: "Lily Petals - Blusher",
    brand: "Kevin & Coco",
    category: "Rubores",
    price: "L 145.00",
    wholesale: "L 100.00",
    image: "assets/productos/KC1490.png",
    description: "Rubor suave inspirado en petalos de lirio. Textura ligera y facil de difuminar. Pigmentacion modulable. 3 tonos: Eternity, Dream, Fantasy. 9.3 g. Display 24 uds."
  },
  {
    code: "KC1164",
    name: "Pretty Girl - Lip Sleeping Mask",
    brand: "Kevin & Coco",
    category: "Labios",
    price: "L 140.00",
    wholesale: "L 95.00",
    image: "assets/productos/KC1164.png",
    description: "Mascarilla labial nocturna con acido hialuronico y manteca de karite. Hidrata, repara y rellena labios. Diseno adorable en forma de lazo. Efecto suavizante."
  },
  {
    code: "KC1163",
    name: "Bell - 3 Color Eyeshadow",
    brand: "Kevin & Coco",
    category: "Ojos",
    price: "L 140.00",
    wholesale: "L 95.00",
    image: "assets/productos/KC1163.png",
    description: "Paleta compacta de 3 sombras coordinadas Pretty Girl. Inspirada en borla de polvos y lazo de saten. Look rapido y armonioso. 4 combinaciones: Eternal, Sincere, Romance, Renatus. 6.5 g."
  },
  {
    code: "KC1361",
    name: "Bubble Berry Lip & Cheek Balm",
    brand: "Kevin & Coco",
    category: "Labios y mejillas",
    price: "L 195.00",
    wholesale: "L 135.00",
    image: "assets/productos/KC1361.png",
    description: "Balsamo 2 en 1 para labios y mejillas con esencia de bayas. Acabado luminoso y modulable. Con extractos de bayas, manteca de karite y vitamina E. Aroma Bubble Berry. 4 tonos. 3 g."
  },
  {
    code: "KC1282-C",
    name: "Facial Cleansing Wipes - Coconut",
    brand: "Kevin & Coco",
    category: "Cuidado facial",
    price: "L 75.00",
    wholesale: "L 50.00",
    image: "assets/productos/KC1282-C.png",
    description: "Toallitas limpiadoras faciales con extracto de coco. Limpieza profunda y suave. Formula delicada para todo tipo de piel. 25 toallitas. Display 12 uds."
  },
  {
    code: "KC1282-S",
    name: "Facial Cleansing Wipes - Strawberry",
    brand: "Kevin & Coco",
    category: "Cuidado facial",
    price: "L 75.00",
    wholesale: "L 50.00",
    image: "assets/productos/KC1282-S.png",
    description: "Toallitas limpiadoras faciales con extracto de fresa. Limpieza profunda y refrescante. Formula suave para uso diario. 25 toallitas."
  },
  {
    code: "CQT12",
    name: "Coquette Lashes - Stylish 12",
    brand: "Coquette",
    category: "Pestanas",
    price: "L 100.00",
    wholesale: "L 70.00",
    image: "assets/productos/CQT12.png",
    description: "Pestanas postizas Faux Mink estilo Coquette Stylish. Diseno elegante y voluminoso. Reutilizables. Se necesita adhesivo. Venta por 12 unidades."
  },
  {
    code: "TBR25-A15",
    name: "Essentials Cosmetic Bag",
    brand: "Totemica",
    category: "Accesorios",
    price: "L 410.00",
    wholesale: "L 285.00",
    image: "assets/productos/TBR25-A15.png",
    description: "Bolsa cosmetica esencial de alta calidad. Material resistente al agua. Amplio espacio para organizar productos de belleza. Diseno elegante y practico."
  },
  {
    code: "TBR24-F2ASS",
    name: "Gel Tinte Cheeks and Lips Assorted",
    brand: "Totemica",
    category: "Labios y mejillas",
    price: "L 340.00",
    wholesale: "L 235.00",
    image: "assets/productos/TBR24-F2ASS.png",
    description: "Gel tinte para mejillas y labios. Color natural y radiante. Hidrata y refresca al instante. Acabado impecable. 4 tonos. 7 g."
  },
  {
    code: "TBR24-F3ASS",
    name: "Contour Enigmatic Goddess Assorted",
    brand: "Totemica",
    category: "Rostro",
    price: "L 340.00",
    wholesale: "L 235.00",
    image: "assets/productos/TBR24-F3ASS.png",
    description: "Contorno en crema Enigmatic Goddess. Esculpe y define el rostro con precision. Textura cremosa y facil de difuminar. 4 tonos. 4.3 g."
  }
];

const state = {
  search: "",
  category: "Todos",
  brand: "Todas"
};

const categoryLabels = {
  Pestanas: "Pestañas"
};

const productGrid = document.querySelector("#productGrid");
const searchInput = document.querySelector("#searchInput");
const brandFilter = document.querySelector("#brandFilter");
const categoryFilters = document.querySelector("#categoryFilters");
const resultSummary = document.querySelector("#resultSummary");
const emptyState = document.querySelector("#emptyState");
const clearFilters = document.querySelector("#clearFilters");
const imageModal = document.querySelector("#imageModal");
const modalImage = document.querySelector("#modalImage");
const modalTitle = document.querySelector("#modalTitle");
const modalWhatsapp = document.querySelector("#modalWhatsapp");
const closeImageModal = document.querySelector("#closeImageModal");
const promoPopup = document.querySelector("#promoPopup");
const closePromoPopup = document.querySelector("#closePromoPopup");
const countdownDisplays = document.querySelectorAll("[data-countdown]");

const normalize = (value) =>
  value
    .toString()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

const escapeHtml = (value) =>
  value.toString().replace(/[&<>"']/g, (char) => {
    const entities = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    };
    return entities[char];
  });

const displayCategory = (category) => categoryLabels[category] || category;

const whatsappLink = (message) =>
  `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

const productWhatsappLink = (productName) =>
  whatsappLink(`Hola, quiero más información sobre este producto: ${productName}`);

function setGeneralWhatsappLinks() {
  document.querySelectorAll("[data-whatsapp-general]").forEach((link) => {
    link.href = whatsappLink(GENERAL_MESSAGE);
  });

  document.querySelectorAll("[data-whatsapp-offer]").forEach((link) => {
    link.href = whatsappLink(OFFER_MESSAGE);
  });

  document.querySelectorAll("[data-whatsapp-wholesale]").forEach((link) => {
    link.href = whatsappLink(WHOLESALE_MESSAGE);
  });
}

function getOfferDeadline() {
  const deadline = new Date();
  deadline.setHours(23, 59, 59, 999);
  return deadline;
}

function formatCountdown(milliseconds) {
  const totalSeconds = Math.max(0, Math.floor(milliseconds / 1000));
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return [hours, minutes, seconds].map((value) => value.toString().padStart(2, "0")).join(":");
}

function updateCountdown() {
  const remaining = getOfferDeadline().getTime() - Date.now();
  const formatted = formatCountdown(remaining);

  countdownDisplays.forEach((display) => {
    display.textContent = formatted;
  });
}

function startCountdown() {
  if (!countdownDisplays.length) return;

  updateCountdown();
  window.setInterval(updateCountdown, 1000);
}

function openPromoPopup() {
  if (!promoPopup) return;

  promoPopup.classList.remove("hidden");
  promoPopup.classList.add("flex");
  document.body.style.overflow = "hidden";
}

function closePromo() {
  if (!promoPopup) return;

  promoPopup.classList.add("hidden");
  promoPopup.classList.remove("flex");
  if (!imageModal || imageModal.classList.contains("hidden")) {
    document.body.style.overflow = "";
  }
}

function buildFilters() {
  const brands = ["Todas", ...new Set(products.map((product) => product.brand))];
  const categories = ["Todos", ...new Set(products.map((product) => product.category))];

  brandFilter.innerHTML = brands
    .map((brand) => `<option value="${escapeHtml(brand)}">${escapeHtml(brand)}</option>`)
    .join("");

  categoryFilters.innerHTML = categories
    .map(
      (category) => `
        <button class="filter-button" type="button" data-category="${escapeHtml(category)}">
          ${escapeHtml(displayCategory(category))}
        </button>
      `
    )
    .join("");
}

function getFilteredProducts() {
  const query = normalize(state.search);

  return products.filter((product) => {
    const searchable = normalize(
      `${product.name} ${product.brand} ${product.category} ${product.code} ${product.description}`
    );
    const matchesSearch = !query || searchable.includes(query);
    const matchesCategory = state.category === "Todos" || product.category === state.category;
    const matchesBrand = state.brand === "Todas" || product.brand === state.brand;

    return matchesSearch && matchesCategory && matchesBrand;
  });
}

function renderProducts() {
  const filteredProducts = getFilteredProducts();

  productGrid.innerHTML = filteredProducts
    .map(
      (product) => `
        <article class="product-card">
          <button
            class="product-media"
            type="button"
            data-image="${escapeHtml(product.image)}"
            data-title="${escapeHtml(product.name)}"
            aria-label="Ampliar imagen de ${escapeHtml(product.name)}"
          >
            <img src="${escapeHtml(product.image)}" alt="${escapeHtml(product.name)}" loading="lazy" />
          </button>
          <div class="product-info">
            <div class="product-meta">
              <span class="tag brand-tag">${escapeHtml(product.brand)}</span>
              <span class="tag">${escapeHtml(displayCategory(product.category))}</span>
              <span class="tag">${escapeHtml(product.code)}</span>
            </div>
            <h3 class="product-title">${escapeHtml(product.name)}</h3>
            <p class="product-description">${escapeHtml(product.description)}</p>
            <div class="price-row">
              <span class="price">${escapeHtml(product.price)}</span>
              <span class="wholesale">Mayoreo ${escapeHtml(product.wholesale)}</span>
            </div>
            <a class="product-whatsapp" href="${productWhatsappLink(product.name)}" target="_blank" rel="noreferrer">
              Pedir por WhatsApp
            </a>
          </div>
        </article>
      `
    )
    .join("");

  const plural = filteredProducts.length === 1 ? "producto" : "productos";
  resultSummary.textContent = `${filteredProducts.length} ${plural} encontrados`;
  emptyState.hidden = filteredProducts.length > 0;

  categoryFilters.querySelectorAll("[data-category]").forEach((button) => {
    button.classList.toggle("is-active", button.dataset.category === state.category);
  });
}

function resetFilters() {
  state.search = "";
  state.category = "Todos";
  state.brand = "Todas";
  searchInput.value = "";
  brandFilter.value = "Todas";
  renderProducts();
}

function openImageModal({ image, title }) {
  if (!imageModal || !modalImage || !modalTitle || !modalWhatsapp || !closeImageModal) return;

  modalImage.src = image;
  modalImage.alt = title;
  modalTitle.textContent = title;
  modalWhatsapp.href = productWhatsappLink(title);
  imageModal.classList.remove("hidden");
  imageModal.classList.add("flex");
  document.body.style.overflow = "hidden";
  closeImageModal.focus();
}

function closeModal() {
  if (!imageModal || !modalImage) return;

  imageModal.classList.add("hidden");
  imageModal.classList.remove("flex");
  modalImage.src = "";
  if (!promoPopup || promoPopup.classList.contains("hidden")) {
    document.body.style.overflow = "";
  }
}

searchInput.addEventListener("input", (event) => {
  state.search = event.target.value;
  renderProducts();
});

brandFilter.addEventListener("change", (event) => {
  state.brand = event.target.value;
  renderProducts();
});

categoryFilters.addEventListener("click", (event) => {
  const button = event.target.closest("[data-category]");
  if (!button) return;
  state.category = button.dataset.category;
  renderProducts();
});

productGrid.addEventListener("click", (event) => {
  const mediaButton = event.target.closest(".product-media");
  if (!mediaButton) return;

  openImageModal({
    image: mediaButton.dataset.image,
    title: mediaButton.dataset.title
  });
});

if (closeImageModal) {
  closeImageModal.addEventListener("click", closeModal);
}

if (imageModal) {
  imageModal.addEventListener("click", (event) => {
    if (event.target === imageModal) {
      closeModal();
    }
  });
}

if (closePromoPopup) {
  closePromoPopup.addEventListener("click", closePromo);
}

if (promoPopup) {
  promoPopup.addEventListener("click", (event) => {
    if (event.target === promoPopup) {
      closePromo();
    }
  });
}

document.addEventListener("keydown", (event) => {
  if (event.key !== "Escape") return;

  if (imageModal && !imageModal.classList.contains("hidden")) {
    closeModal();
  }

  if (promoPopup && !promoPopup.classList.contains("hidden")) {
    closePromo();
  }
});

if (clearFilters) {
  clearFilters.addEventListener("click", resetFilters);
}

document.querySelector("#currentYear").textContent = new Date().getFullYear();
setGeneralWhatsappLinks();
startCountdown();
buildFilters();
renderProducts();
window.setTimeout(openPromoPopup, 900);
