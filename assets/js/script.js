// Numero base del negocio: 88045356. WhatsApp necesita codigo de pais para abrir correctamente.
const WHATSAPP_NUMBER = "50488045356";
const GENERAL_MESSAGE = "Hola, quiero más información sobre el catálogo de maquillaje JOYERIAJRV.";
const OFFER_MESSAGE = "Hola, quiero reclamar el 10% de descuento en mi primera compra del catalogo JOYERIAJRV.";
const WHOLESALE_MESSAGE = "Hola, quiero abrir codigo mayorista. Tengo L 2,000 en producto variado.";
const AFFILIATE_MESSAGE = "Hola, me interesa unirme al Programa de Afiliadas Beauty de JOYERIAJRV. ¿Me pueden compartir el catálogo disponible?";
const WHOLESALE_THRESHOLD = 2000;
const MODAL_IMAGE_PLACEHOLDER = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==";
const FEATURED_CODES = ["LQBL-PT", "DBJ-SET", "KC245123", "KC230005"];
const SOLD_OUT_CODES = [];
const PROMO_STORAGE_KEY = "jrvPromoShownDate";

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
  brand: "Todas",
  status: "all",
  sort: "featured"
};

const cart = new Map();

const categoryLabels = {
  Pestanas: "Pestañas"
};

const productGrid = document.querySelector("#productGrid");
const featuredGrid = document.querySelector("#featuredGrid");
const searchInput = document.querySelector("#searchInput");
const brandFilter = document.querySelector("#brandFilter");
const statusFilter = document.querySelector("#statusFilter");
const sortFilter = document.querySelector("#sortFilter");
const categoryFilters = document.querySelector("#categoryFilters");
const resultSummary = document.querySelector("#resultSummary");
const emptyState = document.querySelector("#emptyState");
const clearFilters = document.querySelector("#clearFilters");
const imageModal = document.querySelector("#imageModal");
const modalImage = document.querySelector("#modalImage");
const modalTitle = document.querySelector("#modalTitle");
const modalWhatsapp = document.querySelector("#modalWhatsapp");
const modalShare = document.querySelector("#modalShare");
const closeImageModal = document.querySelector("#closeImageModal");
const promoPopup = document.querySelector("#promoPopup");
const closePromoPopup = document.querySelector("#closePromoPopup");
const countdownDisplays = document.querySelectorAll("[data-countdown]");
const cartBar = document.querySelector("#cartBar");
const cartSummary = document.querySelector("#cartSummary");
const openCart = document.querySelector("#openCart");
const closeCart = document.querySelector("#closeCart");
const cartDrawer = document.querySelector("#cartDrawer");
const cartItems = document.querySelector("#cartItems");
const cartQuickWhatsapp = document.querySelector("#cartQuickWhatsapp");
const cartDrawerWhatsapp = document.querySelector("#cartDrawerWhatsapp");
const cartTotalLabel = document.querySelector("#cartTotalLabel");
const cartRetailTotal = document.querySelector("#cartRetailTotal");
const cartPricingNote = document.querySelector("#cartPricingNote");
const clearCart = document.querySelector("#clearCart");
const advisorForm = document.querySelector("#advisorForm");
const backToTop = document.querySelector("#backToTop");
const shareFeedback = document.querySelector("#shareFeedback");

const normalize = (value) =>
  value
    .toString()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

const HTML_ENTITIES = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;"
};

const escapeHtml = (value) =>
  value.toString().replace(/[&<>"']/g, (char) => HTML_ENTITIES[char]);

const displayCategory = (category) => categoryLabels[category] || category;

function debounce(fn, wait) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), wait);
  };
}

const whatsappLink = (message) =>
  `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

const productWhatsappLink = (productName) =>
  whatsappLink(`Hola, quiero más información sobre este producto: ${productName}`);

const getProductByCode = (code) => products.find((product) => product.code === code);

const getOptimizedProductImage = (product) => `assets/optimized/productos/${product.code}.webp`;

const getProductAnchorId = (product) => `producto-${normalize(product.code).replace(/[^a-z0-9]+/g, "-")}`;

function getProductShareUrl(product) {
  const url = new URL(globalThis.location.href);
  url.search = "";
  url.hash = getProductAnchorId(product);
  return url.toString();
}

function getProductFromHash() {
  const hash = globalThis.location.hash.replace("#", "");
  if (!hash) return null;
  return products.find((product) => getProductAnchorId(product) === hash) || null;
}

const isProductHot = (product) => product.hot === true || FEATURED_CODES.includes(product.code);

const isProductSoldOut = (product) => product.status === "soldout" || SOLD_OUT_CODES.includes(product.code);

const getProductStatus = (product) => {
  if (isProductSoldOut(product)) {
    return {
      key: "soldout",
      label: "Agotado",
      className: "status-soldout"
    };
  }

  return {
    key: "available",
    label: "Disponible",
    className: "status-available"
  };
};

const parsePrice = (price) => Number(price.replace(/[^\d.]/g, "")) || 0;

const formatLempiras = (value) =>
  `L ${value.toLocaleString("es-HN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })}`;

const getFeaturedRank = (product) => {
  const rank = FEATURED_CODES.indexOf(product.code);
  return rank === -1 ? Number.MAX_SAFE_INTEGER : rank;
};

const getCartQuantity = (code) => cart.get(code) || 0;

const getCartEntries = () =>
  [...cart.entries()]
    .map(([code, quantity]) => ({ product: getProductByCode(code), quantity }))
    .filter((entry) => entry.product && entry.quantity > 0);

const getCartUnits = () => getCartEntries().reduce((total, entry) => total + entry.quantity, 0);

const getCartRetailTotal = () =>
  getCartEntries().reduce((total, entry) => total + parsePrice(entry.product.price) * entry.quantity, 0);

const getCartWholesaleTotal = () =>
  getCartEntries().reduce((total, entry) => total + parsePrice(entry.product.wholesale) * entry.quantity, 0);

const isCartWholesaleEligible = () => getCartRetailTotal() >= WHOLESALE_THRESHOLD;

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

  document.querySelectorAll("[data-whatsapp-affiliate]").forEach((link) => {
    link.href = whatsappLink(AFFILIATE_MESSAGE);
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

function startCountdown() {
  if (!countdownDisplays.length) return;

  const deadlineMs = getOfferDeadline().getTime();

  function updateCountdown() {
    const remaining = deadlineMs - Date.now();
    const formatted = formatCountdown(remaining);
    countdownDisplays.forEach((display) => {
      display.textContent = formatted;
    });
  }

  updateCountdown();
  globalThis.setInterval(updateCountdown, 1000);
}

function todayKey() {
  const today = new Date();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return `${today.getFullYear()}-${month}-${day}`;
}

function shouldShowPromoPopup() {
  try {
    return localStorage.getItem(PROMO_STORAGE_KEY) !== todayKey();
  } catch (error) {
    return true;
  }
}

function markPromoShown() {
  try {
    localStorage.setItem(PROMO_STORAGE_KEY, todayKey());
  } catch (error) {
    // El popup sigue funcionando aunque el navegador bloquee localStorage.
  }
}

function syncBodyScrollLock() {
  const locked = [imageModal, promoPopup, cartDrawer].some(
    (element) => element && !element.classList.contains("hidden")
  );

  document.body.style.overflow = locked ? "hidden" : "";
}

function resetDialogState(dialogElement) {
  if (!dialogElement) return;

  dialogElement.classList.add("hidden");
  dialogElement.classList.remove("flex");
  syncBodyScrollLock();
}

function openDialog(dialogElement, focusTarget) {
  if (!dialogElement) return;

  dialogElement.classList.remove("hidden");
  dialogElement.classList.add("flex");

  if (typeof dialogElement.showModal === "function" && !dialogElement.open) {
    dialogElement.showModal();
  }

  syncBodyScrollLock();
  focusTarget?.focus();
}

function closeDialog(dialogElement) {
  if (!dialogElement) return;

  if (typeof dialogElement.close === "function" && dialogElement.open) {
    dialogElement.close();
    return;
  }

  resetDialogState(dialogElement);
}

function openPromoPopup() {
  if (!promoPopup) return;

  markPromoShown();
  openDialog(promoPopup, closePromoPopup);
}

function closePromo() {
  closeDialog(promoPopup);
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

function sortProducts(productList) {
  return [...productList].sort((a, b) => {
    if (state.sort === "price-asc") {
      return parsePrice(a.price) - parsePrice(b.price);
    }

    if (state.sort === "price-desc") {
      return parsePrice(b.price) - parsePrice(a.price);
    }

    if (state.sort === "name-asc") {
      return a.name.localeCompare(b.name, "es");
    }

    const rankDiff = getFeaturedRank(a) - getFeaturedRank(b);
    return rankDiff || a.name.localeCompare(b.name, "es");
  });
}

function getFilteredProducts() {
  const query = normalize(state.search);

  return sortProducts(products.filter((product) => {
    const searchable = normalize(
      `${product.name} ${product.brand} ${product.category} ${product.code} ${product.description}`
    );
    const matchesSearch = !query || searchable.includes(query);
    const matchesCategory = state.category === "Todos" || product.category === state.category;
    const matchesBrand = state.brand === "Todas" || product.brand === state.brand;
    const matchesStatus =
      state.status === "all" ||
      (state.status === "hot" && isProductHot(product)) ||
      (state.status === "available" && !isProductSoldOut(product)) ||
      (state.status === "soldout" && isProductSoldOut(product));

    return matchesSearch && matchesCategory && matchesBrand && matchesStatus;
  }));
}

function renderProductCard(product, options = {}) {
  const quantity = getCartQuantity(product.code);
  const isHot = isProductHot(product);
  const isSoldOut = isProductSoldOut(product);
  const productStatus = getProductStatus(product);
  const imageSrc = getOptimizedProductImage(product);
  const imageLoading = options.eager ? "eager" : "lazy";
  const imagePriority = options.eager ? ' fetchpriority="high"' : "";
  const productAnchorId = getProductAnchorId(product);
  const cardId = options.compact ? "" : ` id="${escapeHtml(productAnchorId)}" tabindex="-1"`;

  return `
    <article class="product-card ${options.compact ? "product-card-compact" : ""}"${cardId}>
      <button
        class="product-media"
        type="button"
        data-product-code="${escapeHtml(product.code)}"
        data-image="${escapeHtml(imageSrc)}"
        data-fallback-image="${escapeHtml(product.image)}"
        data-title="${escapeHtml(product.name)}"
        aria-label="Ampliar imagen de ${escapeHtml(product.name)}"
      >
        <span class="status-badge ${productStatus.className}">${productStatus.label}</span>
        ${isHot ? '<span class="product-badge hot-badge">Venta HOT</span>' : ""}
        <img
          src="${escapeHtml(imageSrc)}"
          data-fallback-image="${escapeHtml(product.image)}"
          alt="${escapeHtml(product.name)}"
          loading="${imageLoading}"
          decoding="async"${imagePriority}
        />
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
        <div class="product-actions">
          <button
            class="cart-product-button ${quantity ? "is-added" : ""}"
            type="button"
            data-cart-add="${escapeHtml(product.code)}"
            aria-label="Agregar ${escapeHtml(product.name)} al pedido"
            aria-pressed="${quantity ? "true" : "false"}"
            ${isSoldOut ? "disabled" : ""}
          >
            ${isSoldOut ? "Agotado" : quantity ? `Agregado (${quantity})` : "Agregar al pedido"}
          </button>
          <a
            class="product-whatsapp"
            href="${productWhatsappLink(product.name)}"
            target="_blank"
            rel="noreferrer"
            aria-label="Pedir ${escapeHtml(product.name)} por WhatsApp"
            title="Pedir por WhatsApp"
          >
            <span class="whatsapp-glyph" aria-hidden="true"></span>
          </a>
          <button
            class="product-share-button"
            type="button"
            data-share-product="${escapeHtml(product.code)}"
            aria-label="Compartir ${escapeHtml(product.name)}"
            title="Compartir producto"
          >
            <svg class="button-icon" aria-hidden="true"><use href="#icon-share"></use></svg>
          </button>
        </div>
      </div>
    </article>
  `;
}

function renderFeaturedProducts() {
  if (!featuredGrid) return;

  const featuredProducts = FEATURED_CODES.map(getProductByCode).filter(Boolean);

  featuredGrid.innerHTML = featuredProducts
    .map((product, index) => renderProductCard(product, { compact: true, eager: index < 2 }))
    .join("");
}

function renderProducts() {
  const filteredProducts = getFilteredProducts();

  productGrid.innerHTML = filteredProducts
    .map((product) => renderProductCard(product))
    .join("");

  const plural = filteredProducts.length === 1 ? "producto" : "productos";
  resultSummary.textContent = `${filteredProducts.length} ${plural} encontrados`;
  emptyState.hidden = filteredProducts.length > 0;

  categoryFilters.querySelectorAll("[data-category]").forEach((button) => {
    button.classList.toggle("is-active", button.dataset.category === state.category);
  });
}

function resetFilters() {
  resetCatalogFilters();
  renderProducts();
}

function openImageModal({ image, title, fallbackImage, productCode }) {
  if (!imageModal || !modalImage || !modalTitle || !modalWhatsapp || !closeImageModal) return;

  modalImage.src = image;
  modalImage.alt = title;
  modalImage.dataset.fallbackImage = fallbackImage || "";
  modalTitle.textContent = title;
  modalWhatsapp.href = productWhatsappLink(title);
  if (modalShare) {
    modalShare.dataset.shareProduct = productCode || "";
  }
  openDialog(imageModal, closeImageModal);
}

function closeModal() {
  if (!imageModal || !modalImage) return;

  modalImage.src = MODAL_IMAGE_PLACEHOLDER;
  closeDialog(imageModal);
}

function buildCartMessage() {
  const entries = getCartEntries();

  if (!entries.length) {
    return GENERAL_MESSAGE;
  }

  const wholesaleApplies = isCartWholesaleEligible();
  const lines = entries
    .map(
      ({ product, quantity }) => {
        const unitPrice = wholesaleApplies ? product.wholesale : product.price;
        const priceLabel = wholesaleApplies ? "mayoreo" : "detalle";
        return `- ${quantity} x ${product.code} ${product.name} (${unitPrice} ${priceLabel})`;
      }
    )
    .join("\n");

  if (wholesaleApplies) {
    return [
      `Hola, quiero hacer este pedido:`,
      lines,
      "",
      `Mayoreo aplicado automáticamente por pedido desde L 2,000 en producto variado.`,
      `Total mayoreo aproximado: ${formatLempiras(getCartWholesaleTotal())}`,
      `Total detalle referencial: ${formatLempiras(getCartRetailTotal())}`,
      "Quiero confirmar disponibilidad."
    ].join("\n");
  }

  return [
    `Hola, quiero hacer este pedido:`,
    lines,
    "",
    `Total detalle aproximado: ${formatLempiras(getCartRetailTotal())}`,
    `Mayoreo automático disponible desde ${formatLempiras(WHOLESALE_THRESHOLD)} en producto variado.`,
    "Quiero confirmar disponibilidad."
  ].join("\n");
}

function buildAdvisorMessage(form) {
  const data = new FormData(form);
  const name = data.get("customerName")?.toString().trim();
  const purchaseType = data.get("purchaseType") || "Compra al detalle";
  const budgetRange = data.get("budgetRange") || "Aún no definido";
  const message = data.get("advisorMessage")?.toString().trim();

  return [
    `Hola, quiero asesoría para ${purchaseType}.`,
    name ? `Mi nombre es ${name}.` : "",
    `Presupuesto aproximado: ${budgetRange}.`,
    message ? `Estoy buscando: ${message}.` : "",
    "Me gustaría confirmar opciones disponibles en Honduras."
  ]
    .filter(Boolean)
    .join("\n");
}

function submitAdvisorForm(event) {
  event.preventDefault();
  const form = event.currentTarget;
  const message = buildAdvisorMessage(form);
  globalThis.open(whatsappLink(message), "_blank", "noopener");

  const feedback = document.querySelector("#advisorFeedback");
  if (feedback) {
    feedback.textContent = "WhatsApp abierto con tu consulta. Nos contactaremos pronto.";
    feedback.hidden = false;
    setTimeout(() => { feedback.hidden = true; }, 5000);
  }
}

function refreshProductSelections() {
  renderFeaturedProducts();
  renderProducts();
}

function renderCart() {
  const entries = getCartEntries();
  const units = getCartUnits();
  const retailTotal = getCartRetailTotal();
  const wholesaleTotal = getCartWholesaleTotal();
  const wholesaleApplies = units > 0 && retailTotal >= WHOLESALE_THRESHOLD;
  const total = wholesaleApplies ? wholesaleTotal : retailTotal;
  const messageUrl = whatsappLink(buildCartMessage());
  const plural = units === 1 ? "producto" : "productos";

  if (cartBar) {
    cartBar.classList.toggle("hidden", units === 0);
  }

  if (cartSummary) {
    cartSummary.textContent = wholesaleApplies
      ? `${units} ${plural} en pedido · Mayoreo aplicado`
      : `${units} ${plural} en pedido`;
  }

  if (cartQuickWhatsapp) {
    cartQuickWhatsapp.href = messageUrl;
  }

  if (cartDrawerWhatsapp) {
    cartDrawerWhatsapp.href = messageUrl;
  }

  if (cartTotalLabel) {
    cartTotalLabel.textContent = wholesaleApplies
      ? `Total mayoreo aplicado`
      : `${units} ${plural} seleccionados`;
  }

  if (cartRetailTotal) {
    cartRetailTotal.textContent = formatLempiras(total);
  }

  if (cartPricingNote) {
    cartPricingNote.hidden = units === 0;
    cartPricingNote.textContent = wholesaleApplies
      ? `Mayoreo aplicado automáticamente por pedido desde ${formatLempiras(WHOLESALE_THRESHOLD)} en producto variado. Total detalle referencial: ${formatLempiras(retailTotal)}.`
      : `Mayoreo automático disponible desde ${formatLempiras(WHOLESALE_THRESHOLD)} en producto variado.`;
  }

  if (!cartItems) return;

  cartItems.innerHTML = entries.length
    ? entries
        .map(
          ({ product, quantity }) => {
            const unitPrice = wholesaleApplies ? product.wholesale : product.price;
            const priceLabel = wholesaleApplies ? "mayoreo" : "detalle";
            return `
              <article class="cart-item">
                <img src="${escapeHtml(product.image)}" alt="${escapeHtml(product.name)}" loading="lazy" decoding="async" />
                <div>
                  <strong>${escapeHtml(product.name)}</strong>
                  <span>${escapeHtml(product.code)} · ${escapeHtml(unitPrice)} ${priceLabel}</span>
                  <div class="cart-item-actions">
                    <button type="button" data-cart-decrease="${escapeHtml(product.code)}" aria-label="Restar ${escapeHtml(product.name)}">−</button>
                    <span>${quantity}</span>
                    <button type="button" data-cart-increase="${escapeHtml(product.code)}" aria-label="Sumar ${escapeHtml(product.name)}">+</button>
                    <button type="button" data-cart-remove="${escapeHtml(product.code)}">Quitar</button>
                  </div>
                </div>
              </article>
            `;
          }
        )
        .join("")
    : `<p class="cart-empty">Tu pedido está vacío.</p>`;
}

function addToCart(code) {
  const product = getProductByCode(code);
  if (!product || isProductSoldOut(product)) return;

  cart.set(code, getCartQuantity(code) + 1);
  refreshProductSelections();
  renderCart();
}

function updateCartQuantity(code, delta) {
  const nextQuantity = getCartQuantity(code) + delta;

  if (nextQuantity <= 0) {
    cart.delete(code);
  } else {
    cart.set(code, nextQuantity);
  }

  refreshProductSelections();
  renderCart();
}

function removeFromCart(code) {
  cart.delete(code);
  refreshProductSelections();
  renderCart();
}

function clearCartItems() {
  cart.clear();
  refreshProductSelections();
  renderCart();
}

function openCartDrawer() {
  if (!cartDrawer) return;

  openDialog(cartDrawer, closeCart);
}

function closeCartDrawer() {
  closeDialog(cartDrawer);
}

function toggleBackToTop() {
  if (!backToTop) return;

  backToTop.classList.toggle("hidden", globalThis.scrollY < 520);
}

function scrollToPageTop() {
  globalThis.scrollTo({
    top: 0,
    behavior: "smooth"
  });
}

function showShareFeedback(message) {
  if (!shareFeedback) return;

  shareFeedback.textContent = message;
  shareFeedback.classList.remove("hidden");
  globalThis.setTimeout(() => {
    shareFeedback.classList.add("hidden");
  }, 3600);
}

async function shareProduct(code) {
  const product = getProductByCode(code);
  if (!product) return;

  const url = getProductShareUrl(product);
  const shareData = {
    title: `${product.name} | JOYERIA JRV`,
    text: `Mira este producto del catálogo JOYERIA JRV: ${product.name}`,
    url
  };

  try {
    if (globalThis.navigator?.share) {
      await globalThis.navigator.share(shareData);
      return;
    }

    if (globalThis.navigator?.clipboard?.writeText) {
      await globalThis.navigator.clipboard.writeText(url);
      showShareFeedback("Link del producto copiado.");
      return;
    }

    showShareFeedback(`Link del producto: ${url}`);
  } catch (error) {
    if (error?.name !== "AbortError") {
      showShareFeedback(`Link del producto: ${url}`);
    }
  }
}

function resetCatalogFilters() {
  state.search = "";
  state.category = "Todos";
  state.brand = "Todas";
  state.status = "all";
  state.sort = "featured";
  searchInput.value = "";
  brandFilter.value = "Todas";
  if (statusFilter) statusFilter.value = "all";
  if (sortFilter) sortFilter.value = "featured";
}

function revealProductFromHash() {
  const product = getProductFromHash();
  if (!product) return;

  resetCatalogFilters();
  renderProducts();

  const target = document.getElementById(getProductAnchorId(product));
  if (!target) return;

  target.scrollIntoView({
    behavior: "smooth",
    block: "center"
  });
  target.focus({ preventScroll: true });
  target.classList.add("is-shared-target");
  globalThis.setTimeout(() => {
    target.classList.remove("is-shared-target");
  }, 2600);
}

function handleProductClick(event) {
  const shareButton = event.target.closest("[data-share-product]");
  if (shareButton) {
    shareProduct(shareButton.dataset.shareProduct);
    return;
  }

  const cartButton = event.target.closest("[data-cart-add]");
  if (cartButton) {
    addToCart(cartButton.dataset.cartAdd);
    return;
  }

  const mediaButton = event.target.closest(".product-media");
  if (!mediaButton) return;

  openImageModal({
    image: mediaButton.dataset.image,
    fallbackImage: mediaButton.dataset.fallbackImage,
    title: mediaButton.dataset.title,
    productCode: mediaButton.dataset.productCode
  });
}

searchInput.addEventListener(
  "input",
  debounce((event) => {
    state.search = event.target.value;
    renderProducts();
  }, 300)
);

brandFilter.addEventListener("change", (event) => {
  state.brand = event.target.value;
  renderProducts();
});

if (statusFilter) {
  statusFilter.addEventListener("change", (event) => {
    state.status = event.target.value;
    renderProducts();
  });
}

if (sortFilter) {
  sortFilter.addEventListener("change", (event) => {
    state.sort = event.target.value;
    renderProducts();
  });
}

categoryFilters.addEventListener("click", (event) => {
  const button = event.target.closest("[data-category]");
  if (!button) return;
  state.category = button.dataset.category;
  renderProducts();
});

productGrid.addEventListener("click", handleProductClick);

if (featuredGrid) {
  featuredGrid.addEventListener("click", handleProductClick);
}

if (cartItems) {
  cartItems.addEventListener("click", (event) => {
    const increase = event.target.closest("[data-cart-increase]");
    const decrease = event.target.closest("[data-cart-decrease]");
    const remove = event.target.closest("[data-cart-remove]");

    if (increase) {
      updateCartQuantity(increase.dataset.cartIncrease, 1);
    } else if (decrease) {
      updateCartQuantity(decrease.dataset.cartDecrease, -1);
    } else if (remove) {
      removeFromCart(remove.dataset.cartRemove);
    }
  });
}

if (openCart) {
  openCart.addEventListener("click", openCartDrawer);
}

if (closeCart) {
  closeCart.addEventListener("click", closeCartDrawer);
}

if (cartDrawer) {
  cartDrawer.addEventListener("close", () => {
    resetDialogState(cartDrawer);
  });

  cartDrawer.addEventListener("click", (event) => {
    if (event.target === cartDrawer) {
      closeCartDrawer();
    }
  });
}

if (clearCart) {
  clearCart.addEventListener("click", clearCartItems);
}

if (advisorForm) {
  advisorForm.addEventListener("submit", submitAdvisorForm);
}

if (backToTop) {
  backToTop.addEventListener("click", scrollToPageTop);
  globalThis.addEventListener("scroll", toggleBackToTop, { passive: true });
}

if (modalShare) {
  modalShare.addEventListener("click", () => {
    shareProduct(modalShare.dataset.shareProduct);
  });
}

globalThis.addEventListener("hashchange", revealProductFromHash);

if (closeImageModal) {
  closeImageModal.addEventListener("click", closeModal);
}

if (imageModal) {
  imageModal.addEventListener("close", () => {
    if (modalImage) modalImage.src = MODAL_IMAGE_PLACEHOLDER;
    resetDialogState(imageModal);
  });

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
  promoPopup.addEventListener("close", () => {
    resetDialogState(promoPopup);
  });

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

  if (cartDrawer && !cartDrawer.classList.contains("hidden")) {
    closeCartDrawer();
  }
});

document.addEventListener(
  "error",
  (event) => {
    const image = event.target;
    if (!(image instanceof HTMLImageElement) || !image.dataset.fallbackImage) return;

    image.src = image.dataset.fallbackImage;
    image.removeAttribute("data-fallback-image");
  },
  true
);

if (clearFilters) {
  clearFilters.addEventListener("click", resetFilters);
}

document.querySelector("#currentYear").textContent = new Date().getFullYear();
setGeneralWhatsappLinks();
startCountdown();
buildFilters();
renderFeaturedProducts();
renderProducts();
renderCart();
toggleBackToTop();
revealProductFromHash();
globalThis.setTimeout(() => {
  if (shouldShowPromoPopup()) {
    openPromoPopup();
  }
}, 900);
