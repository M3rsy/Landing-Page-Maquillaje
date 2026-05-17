/**
 * Migración: importa los productos del catálogo estático a la base de datos.
 *
 * Uso:
 *   node backend/scripts/migrate-products.js
 *
 * - Usa INSERT OR IGNORE: no duplica productos que ya existan (por código).
 * - Agrega la columna 'marca' a la tabla si todavía no existe.
 */

const db = require("../database");

// Agregar columna 'marca' si no existe (SQLite no tiene IF NOT EXISTS en ALTER TABLE)
const columns = db.pragma("table_info(products)").map((c) => c.name);
if (!columns.includes("marca")) {
  db.exec("ALTER TABLE products ADD COLUMN marca TEXT DEFAULT ''");
  console.log("Columna 'marca' agregada a la tabla products.");
}

const parsePrice = (str) => parseFloat(str.replace("L ", "").trim()) || 0;

const products = [
  { code: "LQBL-PT",        name: "Liquid Blush Display",                        brand: "Beauty Creations", category: "Rubores",           price: "L 320.00", wholesale: "L 220.00", image: "assets/optimized/productos/LQBL-PT.webp",         description: "Rubor liquido hidratante con Vitamina E. Color modulable y acabado natural. 8 tonos vibrantes. No pegajoso." },
  { code: "SS-RS-AS18",     name: "Riding Solo Single Pressed Shadow",            brand: "Beauty Creations", category: "Ojos",              price: "L 205.00", wholesale: "L 145.00", image: "assets/optimized/productos/SS-RS-AS18.webp",      description: "Sombra individual prensada de alto brillo. Pigmento intenso, uso todo el dia. Compacta y facil de viajar. 18 tonos." },
  { code: "PAG-LBL",        name: "Pout & Go Lip Balm Keychain - Lychee",        brand: "Beauty Creations", category: "Labios",            price: "L 140.00", wholesale: "L 95.00",  image: "assets/optimized/productos/PAG-LBL.webp",        description: "Balsamo labial con llavero en forma de corazon. Aroma a lychee. Hidratante y portatil, perfecto para retoques rapidos." },
  { code: "DBJ-SET",        name: "Don't Be Jelly - Cheek & Lip Stain",          brand: "Beauty Creations", category: "Labios y mejillas", price: "L 385.00", wholesale: "L 265.00", image: "assets/optimized/productos/DBJ-SET.webp",        description: "Set de 3 tintes en barra para mejillas y labios con textura gelatinosa. Colores vibrantes y acabado fresco. Libre de crueldad." },
  { code: "TJ-BS1",         name: "Dual End Powder and Cream Contour Brush",     brand: "Beauty Creations", category: "Herramientas",      price: "L 280.00", wholesale: "L 195.00", image: "assets/optimized/productos/TJ-BS1.webp",         description: "Brocha de contorno de doble extremo para polvo y crema. Cerdas suaves de alta calidad. Aplicacion profesional." },
  { code: "BHLBTLKM-PDQ",  name: "Blush Hush Powder Blush Display",             brand: "Beauty Creations", category: "Rubores",           price: "L 225.00", wholesale: "L 155.00", image: "assets/optimized/productos/BHLBTLKM-PDQ.webp",   description: "Rubor en polvo con pigmento vibrante y textura sedosa. 8 tonos desde rosas suaves hasta berry intensos. Facil de difuminar." },
  { code: "TLT-ASS",        name: "Lip Treatment & Tint Assorted",               brand: "Beauty Creations", category: "Labios",            price: "L 270.00", wholesale: "L 190.00", image: "assets/optimized/productos/TLT-ASS.webp",        description: "Tratamiento labial todo en uno con tinte de color. Hidrata, repara y nutre los labios. Infusionado con peptidos. Varios tonos." },
  { code: "FC-DL1-6",       name: "Double Layer Lotion Assorted",                brand: "Beauty Creations", category: "Cuidado corporal",  price: "L 255.00", wholesale: "L 180.00", image: "assets/optimized/productos/FC-DL1-6.webp",       description: "Locion corporal de doble capa con aromas frutales. Hidratacion profunda y fragancia duradera. 6 aromas disponibles." },
  { code: "FC-BS1-6",       name: "Sugar Body Scrub Assorted",                   brand: "Beauty Creations", category: "Cuidado corporal",  price: "L 255.00", wholesale: "L 180.00", image: "assets/optimized/productos/FC-BS1-6.webp",       description: "Exfoliante corporal de azucar con aromas frutales. Exfolia, suaviza y da brillo a la piel. 4 aromas: melon, durazno, manzana y mango." },
  { code: "BSN02",           name: "Flawless Stay Blending Sponge",               brand: "Beauty Creations", category: "Herramientas",      price: "L 145.00", wholesale: "L 100.00", image: "assets/optimized/productos/BSN02.webp",          description: "Esponja de maquillaje sin latex para difuminar base, corrector y polvo. Acabado impecable y sin marcas. 4 colores." },
  { code: "ELCTSET-PKRG",   name: "Eyelash Curler & Tweezer",                    brand: "Beauty Creations", category: "Herramientas",      price: "L 200.00", wholesale: "L 140.00", image: "assets/optimized/productos/ELCTSET-PKRG.webp",   description: "Set de rizador de pestanas y pinza en tono rose gold. Diseno ergonomico para un rizado perfecto. Libre de crueldad." },
  { code: "LOPHD",           name: "All About You - PH Lips Oils",                brand: "Beauty Creations", category: "Labios",            price: "L 200.00", wholesale: "L 140.00", image: "assets/optimized/productos/LOPHD.webp",          description: "Aceites labiales que cambian a rosa con tu nivel de PH. Alto brillo, 6 aromas. Con aceite de jojoba. No pegajoso. Libre de crueldad." },
  { code: "ELTS09",          name: "3D Soft Silk Lashes - Bahamas",               brand: "Beauty Creations", category: "Pestanas",          price: "L 90.00",  wholesale: "L 65.00",  image: "assets/optimized/productos/ELTS09.webp",         description: "Pestanas de seda suave 3D ultraligeras. Reutilizables hasta 3 veces. Suaves como la seda. Se necesita adhesivo. Libre de crueldad." },
  { code: "ELTS24",          name: "3D Soft Silk Lashes - Los Angeles",           brand: "Beauty Creations", category: "Pestanas",          price: "L 90.00",  wholesale: "L 65.00",  image: "assets/optimized/productos/ELTS24.webp",         description: "Pestanas de seda suave 3D ultraligeras. Reutilizables hasta 3 veces. Estilo Los Angeles glamuroso. Libre de crueldad." },
  { code: "ELTS19",          name: "3D Soft Silk Lashes - Milan",                 brand: "Beauty Creations", category: "Pestanas",          price: "L 90.00",  wholesale: "L 65.00",  image: "assets/optimized/productos/ELTS19.webp",         description: "Pestanas de seda suave 3D ultraligeras. Reutilizables hasta 3 veces. Estilo Milan elegante y sofisticado. Libre de crueldad." },
  { code: "SK-CS2",          name: "Skin Freshness Please - Cleansing Sponge",    brand: "Beauty Creations", category: "Cuidado facial",    price: "L 135.00", wholesale: "L 95.00",  image: "assets/optimized/productos/SK-CS2.webp",         description: "Esponja limpiadora de 2 piezas en forma de corazon. Elimina impurezas para todo tipo de piel. Reemplazar cada 30 dias. Libre de crueldad." },
  { code: "NXLSDASS",        name: "Nude X - Lipstick Assorted",                  brand: "Beauty Creations", category: "Labios",            price: "L 270.00", wholesale: "L 185.00", image: "assets/optimized/productos/NXLSDASS.webp",       description: "Coleccion de labiales en tonos nude. 7 tonos desde Caramel hasta Coco Nude. Alta pigmentacion y acabado cremoso duradero." },
  { code: "SBD-PTD",         name: "Blush Hush Display",                          brand: "Beauty Creations", category: "Rubores",           price: "L 270.00", wholesale: "L 185.00", image: "assets/optimized/productos/SBD-PTD.webp",        description: "Display de rubor en polvo Blush Hush. Textura sedosa y colores vibrantes. Facil de difuminar para un acabado natural y luminoso." },
  { code: "KC245123",        name: "You Are Gonna Make It! Blusher",              brand: "Kevin & Coco",    category: "Rubores",           price: "L 335.00", wholesale: "L 230.00", image: "assets/optimized/productos/KC245123.webp",       description: "Paleta de 6 rubores con exterior de piel sintetica suave y mensaje motivador bordado. Pigmentos en forma de conejito. Alta pigmentacion y acabado impecable." },
  { code: "KC230005",        name: "12 Colors Matte Lip Gloss",                   brand: "Kevin & Coco",    category: "Labios",            price: "L 355.00", wholesale: "L 245.00", image: "assets/optimized/productos/KC230005.webp",       description: "Set de 12 brillos mate de alta pigmentacion. Desde nudes suaves hasta rojos atrevidos. Acabado mate aterciopelado y duradero. Caja de regalo con cierre magnetico." },
  { code: "KC245130",        name: "You Are Enough! Highlighter",                 brand: "Kevin & Coco",    category: "Rostro",            price: "L 335.00", wholesale: "L 230.00", image: "assets/optimized/productos/KC245130.webp",       description: "Iluminador con exterior de piel sintetica y mensaje motivador. Tonos luminosos para un brillo espectacular. Diseno adorable coleccionable." },
  { code: "KC1586",          name: "4 Colors Lip Gloss Set",                      brand: "Kevin & Coco",    category: "Labios",            price: "L 235.00", wholesale: "L 160.00", image: "assets/optimized/productos/KC1586.webp",         description: "Set de 4 brillos de alto brillo en caja regalo con lazo de organza. Set A: rosas y corales frescos. Set B: nudes y tonos berry. No pegajoso e hidratante." },
  { code: "KC1347",          name: "Daisy Garden Collection - Lip Gloss",         brand: "Kevin & Coco",    category: "Labios",            price: "L 85.00",  wholesale: "L 60.00",  image: "assets/optimized/productos/KC1347.webp",         description: "Brillo labial con acabado ultrabrillante tipo espejo. Ligero y no pegajoso. 6 tonos desde rosas suaves hasta corales vibrantes. Hidratacion suave. 4.5 g." },
  { code: "KC1463",          name: "Magic Girl - Lip Gloss",                      brand: "Kevin & Coco",    category: "Labios",            price: "L 115.00", wholesale: "L 80.00",  image: "assets/optimized/productos/KC1463.webp",         description: "Brillo ultrahidratante con llavero rosa portatil. Nutre y repara labios. Desde tintes transparentes hasta cremas clasicas. 8 tonos. 3 g." },
  { code: "KC1352",          name: "4 Colors Eyeshadow",                          brand: "Kevin & Coco",    category: "Ojos",              price: "L 140.00", wholesale: "L 100.00", image: "assets/optimized/productos/KC1352.webp",         description: "Paleta mini de 4 sombras coordinadas. Textura sedosa, alta pigmentacion. Acabados mate y satinados. Compacta y practica para viajar. 5.6 g." },
  { code: "KC1457",          name: "Multi-Purpose Cream",                         brand: "Kevin & Coco",    category: "Labios y mejillas", price: "L 115.00", wholesale: "L 80.00",  image: "assets/optimized/productos/KC1457.webp",         description: "Crema multiusos 2 en 1 para labios y mejillas. Textura cremosa facil de difuminar. Acabado jugoso y no pegajoso. 6 tonos vibrantes. 4.5 g." },
  { code: "KC1428",          name: "Love What You Drink - Eyeshadow Palette",     brand: "Kevin & Coco",    category: "Ojos",              price: "L 155.00", wholesale: "L 110.00", image: "assets/optimized/productos/KC1428.webp",         description: "Paleta de 12 sombras inspirada en cocteles. Mates aterciopelados y metalicos brillantes. Alta pigmentacion y facil de difuminar. Estuche tematico." },
  { code: "KC1348",          name: "Loose Powder",                                brand: "Kevin & Coco",    category: "Rostro",            price: "L 130.00", wholesale: "L 90.00",  image: "assets/optimized/productos/KC1348.webp",         description: "Polvos sueltos con tecnologia difuminadora de poros. Control de grasa todo el dia. Borla de terciopelo incluida. 4 tonos: Sugar Cookie, Peach Pie, Cup Cake, Blondie. 10 g." },
  { code: "KC1205-B",        name: "Fantastics Palette",                          brand: "Kevin & Coco",    category: "Paletas",           price: "L 155.00", wholesale: "L 110.00", image: "assets/optimized/productos/KC1205-B.webp",       description: "Paleta multifuncional con sombras, rubor e iluminador. Combinacion de mates y brillos. Estuche compacto rosa con espejo." },
  { code: "KC1313",          name: "Fantastics Color Matching - Blush Cream",     brand: "Kevin & Coco",    category: "Rubores",           price: "L 140.00", wholesale: "L 100.00", image: "assets/optimized/productos/KC1313.webp",         description: "Rubor en crema ultrapigmentado con diseno de lazo en relieve 3D. De crema a satinado, color modulable. Estuche con espejo. 4 tonos: Sakura, Peach, Lavender, Coral. 5.5 g." },
  { code: "KC1231",          name: "Lip Liner",                                   brand: "Kevin & Coco",    category: "Labios",            price: "L 75.00",  wholesale: "L 45.00",  image: "assets/optimized/productos/KC1231.webp",         description: "Set de 12 perfiladores de labios profesionales. Larga duracion y a prueba de manchas. Aplicacion cremosa y punta de precision. Acabado mate aterciopelado. Display 144 uds." },
  { code: "KC1503",          name: "Lipliner & Lipstick & Lip Oil",               brand: "Kevin & Coco",    category: "Labios",            price: "L 180.00", wholesale: "L 125.00", image: "assets/optimized/productos/KC1503.webp",         description: "Set 3 en 1: delineador, labial y gloss en formato lapiz giratorio. Tema Sweet Chocolate con aroma dulce. 3 tonos: Chocolate Cream, Hot Chocolate, Chocolate Chip. 7.8 g." },
  { code: "KC1068",          name: "Cheese Avocado - 4 Colors Face Palette",      brand: "Kevin & Coco",    category: "Paletas",           price: "L 245.00", wholesale: "L 170.00", image: "assets/optimized/productos/KC1068.webp",         description: "Paleta facial de 4 tonos con rubor e iluminador. 2 rubores (rosa nude + melocoton) y 2 iluminadores (perla + bronce dorado). Con vitamina E. Estuche magnetico con espejo. 6 g." },
  { code: "KC1490",          name: "Lily Petals - Blusher",                       brand: "Kevin & Coco",    category: "Rubores",           price: "L 145.00", wholesale: "L 100.00", image: "assets/optimized/productos/KC1490.webp",         description: "Rubor suave inspirado en petalos de lirio. Textura ligera y facil de difuminar. Pigmentacion modulable. 3 tonos: Eternity, Dream, Fantasy. 9.3 g. Display 24 uds." },
  { code: "KC1164",          name: "Pretty Girl - Lip Sleeping Mask",             brand: "Kevin & Coco",    category: "Labios",            price: "L 140.00", wholesale: "L 95.00",  image: "assets/optimized/productos/KC1164.webp",         description: "Mascarilla labial nocturna con acido hialuronico y manteca de karite. Hidrata, repara y rellena labios. Diseno adorable en forma de lazo. Efecto suavizante." },
  { code: "KC1163",          name: "Bell - 3 Color Eyeshadow",                    brand: "Kevin & Coco",    category: "Ojos",              price: "L 140.00", wholesale: "L 95.00",  image: "assets/optimized/productos/KC1163.webp",         description: "Paleta compacta de 3 sombras coordinadas Pretty Girl. Inspirada en borla de polvos y lazo de saten. Look rapido y armonioso. 4 combinaciones: Eternal, Sincere, Romance, Renatus. 6.5 g." },
  { code: "KC1361",          name: "Bubble Berry Lip & Cheek Balm",               brand: "Kevin & Coco",    category: "Labios y mejillas", price: "L 195.00", wholesale: "L 135.00", image: "assets/optimized/productos/KC1361.webp",         description: "Balsamo 2 en 1 para labios y mejillas con esencia de bayas. Acabado luminoso y modulable. Con extractos de bayas, manteca de karite y vitamina E. Aroma Bubble Berry. 4 tonos. 3 g." },
  { code: "KC1282-C",        name: "Facial Cleansing Wipes - Coconut",            brand: "Kevin & Coco",    category: "Cuidado facial",    price: "L 75.00",  wholesale: "L 50.00",  image: "assets/optimized/productos/KC1282-C.webp",       description: "Toallitas limpiadoras faciales con extracto de coco. Limpieza profunda y suave. Formula delicada para todo tipo de piel. 25 toallitas. Display 12 uds." },
  { code: "KC1282-S",        name: "Facial Cleansing Wipes - Strawberry",         brand: "Kevin & Coco",    category: "Cuidado facial",    price: "L 75.00",  wholesale: "L 50.00",  image: "assets/optimized/productos/KC1282-S.webp",       description: "Toallitas limpiadoras faciales con extracto de fresa. Limpieza profunda y refrescante. Formula suave para uso diario. 25 toallitas." },
  { code: "CQT12",           name: "Coquette Lashes - Stylish 12",                brand: "Coquette",        category: "Pestanas",          price: "L 100.00", wholesale: "L 70.00",  image: "assets/optimized/productos/CQT12.webp",          description: "Pestanas postizas Faux Mink estilo Coquette Stylish. Diseno elegante y voluminoso. Reutilizables. Se necesita adhesivo. Venta por 12 unidades." },
  { code: "TBR25-A15",       name: "Essentials Cosmetic Bag",                     brand: "Totemica",        category: "Accesorios",        price: "L 410.00", wholesale: "L 285.00", image: "assets/optimized/productos/TBR25-A15.webp",      description: "Bolsa cosmetica esencial de alta calidad. Material resistente al agua. Amplio espacio para organizar productos de belleza. Diseno elegante y practico." },
  { code: "TBR24-F2ASS",     name: "Gel Tinte Cheeks and Lips Assorted",          brand: "Totemica",        category: "Labios y mejillas", price: "L 340.00", wholesale: "L 235.00", image: "assets/optimized/productos/TBR24-F2ASS.webp",    description: "Gel tinte para mejillas y labios. Color natural y radiante. Hidrata y refresca al instante. Acabado impecable. 4 tonos. 7 g." },
  { code: "TBR24-F3ASS",     name: "Contour Enigmatic Goddess Assorted",          brand: "Totemica",        category: "Rostro",            price: "L 340.00", wholesale: "L 235.00", image: "assets/optimized/productos/TBR24-F3ASS.webp",    description: "Contorno en crema Enigmatic Goddess. Esculpe y define el rostro con precision. Textura cremosa y facil de difuminar. 4 tonos. 4.3 g." },
];

const stmt = db.prepare(`
  INSERT OR IGNORE INTO products (codigo, titulo, descripcion, precio, costo, categoria, marca, imagen, disponible)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1)
`);

const migrate = db.transaction(() => {
  let inserted = 0;
  let skipped = 0;
  for (const p of products) {
    const info = stmt.run(
      p.code,
      p.name,
      p.description,
      parsePrice(p.price),
      parsePrice(p.wholesale),
      p.category,
      p.brand,
      p.image
    );
    if (info.changes > 0) {
      inserted++;
    } else {
      skipped++;
    }
  }
  return { inserted, skipped };
});

const { inserted, skipped } = migrate();
console.log(`Migración completada: ${inserted} productos insertados, ${skipped} ya existían (omitidos).`);
process.exit(0);
