const fs = require('fs');
const path = require('path');
const {
  buildAlternates,
  getPageForRoute,
  validateManifest,
} = require('./scripts/hreflang_manifest.cjs');

const distDir = path.resolve(__dirname, 'dist');

console.log('=== INICIANDO LIMPIEZA POST-BUILD PARA SEO ===\n');

function cleanHtmlFolders(dir) {
  if (!fs.existsSync(dir)) return;
  const items = fs.readdirSync(dir);

  items.forEach(item => {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      if (item.endsWith('.html')) {
        const indexHtmlPath = path.join(fullPath, 'index.html');
        const targetFilePath = fullPath; // Since it ends with .html, the path is already folder.html

        if (fs.existsSync(indexHtmlPath)) {
          // Copy index.html to target path (temporarily rename folder first to avoid conflict!)
          const tempPath = fullPath + '_temp';
          fs.renameSync(fullPath, tempPath);
          
          const tempIndexHtml = path.join(tempPath, 'index.html');
          fs.copyFileSync(tempIndexHtml, targetFilePath);
          
          // Remove temp folder and its contents
          fs.rmSync(tempPath, { recursive: true, force: true });
          console.log(`✅ Convertido folder a archivo plano: ${targetFilePath.replace(distDir, '')}`);
        }
      } else {
        // Recursive search in subdirectories
        cleanHtmlFolders(fullPath);
      }
    }
  });
}

cleanHtmlFolders(distDir);

function routeFromHtmlPath(filePath) {
  const relativePath = path.relative(distDir, filePath).replace(/\\/g, '/');
  if (relativePath === 'index.html') return '/';
  if (relativePath.endsWith('/index.html')) return `/${relativePath.slice(0, -'/index.html'.length)}`;
  if (relativePath.endsWith('.html')) return `/${relativePath.slice(0, -'.html'.length)}`;
  return undefined;
}

function readAttribute(tag, attributeName) {
  const attributePattern = new RegExp(`\\b${attributeName}\\s*=\\s*(['"])(.*?)\\1`, 'i');
  return tag.match(attributePattern)?.[2] ?? '';
}

function injectHreflangTags(html, pagePath) {
  const page = getPageForRoute(pagePath);
  if (!page) return html;

  const withoutExisting = html.replace(/<link\b[^>]*>/gi, (tag) => {
    const isAlternate = readAttribute(tag, 'rel').toLowerCase() === 'alternate';
    const hasHreflang = Boolean(readAttribute(tag, 'hreflang') || readAttribute(tag, 'hrefLang'));
    return isAlternate && hasHreflang ? '' : tag;
  });
  const tags = buildAlternates(page)
    .map(({ hreflang, href }) => `    <link rel="alternate" hreflang="${hreflang}" href="${href}" />`)
    .join('\n');
  const headClose = withoutExisting.search(/<\/head>/i);
  if (headClose === -1) throw new Error(`No se encontró </head> para hreflang en ${pagePath}`);
  return `${withoutExisting.slice(0, headClose)}${tags}\n${withoutExisting.slice(headClose)}`;
}

function injectHreflangRecursive(dir) {
  if (!fs.existsSync(dir)) return;
  for (const item of fs.readdirSync(dir)) {
    const fullPath = path.join(dir, item);
    if (fs.statSync(fullPath).isDirectory()) {
      injectHreflangRecursive(fullPath);
      continue;
    }
    if (!item.endsWith('.html')) continue;
    const pagePath = routeFromHtmlPath(fullPath);
    if (!pagePath || !getPageForRoute(pagePath)) continue;
    const content = fs.readFileSync(fullPath, 'utf8');
    fs.writeFileSync(fullPath, injectHreflangTags(content, pagePath), 'utf8');
  }
}

const manifestErrors = validateManifest();
if (manifestErrors.length > 0) {
  throw new Error(`Hreflang manifest inválido:\n${manifestErrors.map((error) => `- ${error}`).join('\n')}`);
}

injectHreflangRecursive(distDir);

// Ensure prerendered indexable pages expose their canonical URL in static HTML.
function injectCanonicalTags() {
  const sitemapPath = path.join(distDir, 'sitemap.xml');
  if (!fs.existsSync(sitemapPath)) return;
  const sitemap = fs.readFileSync(sitemapPath, 'utf8');
  const urls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
  urls.forEach((url) => {
    const pathname = new URL(url).pathname;
    const filePath = pathname === '/'
      ? path.join(distDir, 'index.html')
      : path.join(distDir, pathname.replace(/^\/|\/$/g, ''), 'index.html');
    if (!fs.existsSync(filePath)) return;
    let content = fs.readFileSync(filePath, 'utf8');
    if (content.includes('rel="canonical"')) {
      content = content.replace(/<link(?!\s+data-rh="true")\s+rel="canonical"/g, '<link data-rh="true" rel="canonical"');
      fs.writeFileSync(filePath, content, 'utf8');
      return;
    }
    content = content.replace('</head>', `    <link data-rh="true" rel="canonical" href="${url}" />\n</head>`);
    fs.writeFileSync(filePath, content, 'utf8');
  });
}

injectCanonicalTags();

// Ensure blog articles expose exact metadata and structured data in static HTML
function injectBlogMetadataAndSchemas() {
  const { blogPosts } = require('./utils/blogData.ts');
  const stripHtml = (html) => html.replace(/<[^>]*>?/gm, '');

  blogPosts.forEach((post) => {
    const isEnglish = post.lang === 'en';
    const blogPath = isEnglish ? '/en/blog' : '/blog';
    const filePath = path.join(distDir, (isEnglish ? 'en/blog' : 'blog'), post.slug, 'index.html');
    if (!fs.existsSync(filePath)) return;

    let content = fs.readFileSync(filePath, 'utf8');

    // 1. Update Title
    content = content.replace(/<title>[^<]*<\/title>/i, `<title>${post.title}</title>`);

    // 2. Update Meta Description
    content = content.replace(/<meta name="description" content="[^"]*"/i, `<meta name="description" content="${post.excerpt}"`);

    // 3. Update OG and Twitter
    const resolvedImageUrl = post.featuredImage.startsWith('http')
      ? post.featuredImage
      : `https://www.vitablue.es${post.featuredImage}`;
    const postCanonicalUrl = `https://www.vitablue.es${blogPath}/${post.slug}/`;

    content = content.replace(/<meta property="og:title" content="[^"]*"/i, `<meta property="og:title" content="${post.title}"`);
    content = content.replace(/<meta property="og:description" content="[^"]*"/i, `<meta property="og:description" content="${post.excerpt}"`);
    content = content.replace(/<meta property="og:type" content="[^"]*"/i, `<meta property="og:type" content="article"`);
    content = content.replace(/<meta property="og:url" content="[^"]*"/i, `<meta property="og:url" content="${postCanonicalUrl}"`);
    if (/property="og:image"/i.test(content)) {
      content = content.replace(/<meta property="og:image" content="[^"]*"/i, `<meta property="og:image" content="${resolvedImageUrl}"`);
    } else {
      content = content.replace(/<\/head>/i, `<meta property="og:image" content="${resolvedImageUrl}" />\n</head>`);
    }

    if (/name="twitter:card"/i.test(content)) {
      content = content.replace(/<meta name="twitter:card" content="[^"]*"/i, `<meta name="twitter:card" content="summary_large_image"`);
    } else {
      content = content.replace(/<\/head>/i, `<meta name="twitter:card" content="summary_large_image" />\n</head>`);
    }

    content = content.replace(/<meta name="twitter:title" content="[^"]*"/i, `<meta name="twitter:title" content="${post.title}"`);
    content = content.replace(/<meta name="twitter:description" content="[^"]*"/i, `<meta name="twitter:description" content="${post.excerpt}"`);
    if (/name="twitter:image"/i.test(content)) {
      content = content.replace(/<meta name="twitter:image" content="[^"]*"/i, `<meta name="twitter:image" content="${resolvedImageUrl}"`);
    } else {
      content = content.replace(/<\/head>/i, `<meta name="twitter:image" content="${resolvedImageUrl}" />\n</head>`);
    }

    // 4. Construct Schemas

    function parseDateToIso(dateStr) {
      if (!dateStr) return '2026-09-01';
      const monthMap = {
        enero: '01', january: '01',
        febrero: '02', february: '02',
        marzo: '03', march: '03',
        abril: '04', april: '04',
        mayo: '05', may: '05',
        junio: '06', june: '06',
        julio: '07', july: '07',
        agosto: '08', august: '08',
        septiembre: '09', september: '09',
        octubre: '10', october: '10',
        noviembre: '11', november: '11',
        diciembre: '12', december: '12',
      };
      const parts = dateStr.trim().split(/\s+/);
      if (parts.length === 3) {
        const day = parts[0].padStart(2, '0');
        const month = monthMap[parts[1].toLowerCase()] || '09';
        const year = parts[2];
        return `${year}-${month}-${day}`;
      }
      return dateStr;
    }

    const isoDate = parseDateToIso(post.date);

    const jsonLdArticle = {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: post.title,
      description: post.excerpt,
      image: resolvedImageUrl,
      datePublished: isoDate,
      dateModified: isoDate,
      inLanguage: isEnglish ? 'en-US' : 'es-ES',
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': `https://www.vitablue.es${blogPath}/${post.slug}/`,
      },
      author: {
        '@type': 'Person',
        name: post.author.name,
        jobTitle: post.author.role,
      },
      publisher: {
        '@type': 'Organization',
        name: 'VitaBlue',
        logo: {
          '@type': 'ImageObject',
          url: 'https://www.vitablue.es/favicon.svg',
        },
      },
    };

    const jsonLdBreadcrumb = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'VitaBlue',
          item: isEnglish ? 'https://www.vitablue.es/en/' : 'https://www.vitablue.es/',
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Blog',
          item: `https://www.vitablue.es${blogPath}/`,
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: post.title,
          item: `https://www.vitablue.es${blogPath}/${post.slug}/`,
        },
      ],
    };

    const faqSectionIndex = post.sections.findIndex(
      (s) => s.type === 'heading-2' && s.text && s.text.includes('FAQ')
    );
    const faqListSection =
      faqSectionIndex !== -1 && post.sections[faqSectionIndex + 1]?.type === 'list'
        ? post.sections[faqSectionIndex + 1]
        : null;

    const faqEntities = faqListSection?.items
      ?.map((item) => {
        const match = item.match(/<strong>(.*?)<\/strong>[:\s]*(.*)/s);
        if (match) {
          return {
            '@type': 'Question',
            name: stripHtml(match[1]).trim(),
            acceptedAnswer: {
              '@type': 'Answer',
              text: stripHtml(match[2]).trim(),
            },
          };
        }
        return null;
      })
      .filter(Boolean);

    const jsonLdFaq =
      faqEntities && faqEntities.length > 0
        ? {
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: faqEntities,
          }
        : null;

    const schemas = [jsonLdArticle, jsonLdBreadcrumb, jsonLdFaq].filter(Boolean);
    const schemaTags = schemas
      .map((s) => `    <script type="application/ld+json">${JSON.stringify(s)}</script>`)
      .join('\n');

    if (!content.includes('"@type":"BlogPosting"')) {
      content = content.replace('</head>', `${schemaTags}\n</head>`);
    }

    fs.writeFileSync(filePath, content, 'utf8');
  });
  console.log(`✅ Metadatos SEO y esquemas JSON-LD inyectados en ${blogPosts.length} artículos del blog.`);
}

injectBlogMetadataAndSchemas();

function injectLandingMetadataAndSchemas() {
  const mascotasFile = path.join(distDir, 'productos/seguro-mascotas/sanitas-mascotas/index.html');
  if (fs.existsSync(mascotasFile)) {
    let content = fs.readFileSync(mascotasFile, 'utf8');
    const title = 'Sanitas Mascotas desde 9,90€/mes | Seguro Perros y Gatos VitaBlue';
    const description = 'Seguro veterinario oficial Sanitas Mascotas desde 9,90€/mes. Consultas y vacuna de la rabia gratis, urgencias 24h, sin exclusión por raza y contratación online.';

    content = content.replace(/<title>[^<]*<\/title>/i, `<title>${title}</title>`);
    content = content.replace(/<meta name="description" content="[^"]*"/i, `<meta name="description" content="${description}"`);
    content = content.replace(/<meta property="og:title" content="[^"]*"/i, `<meta property="og:title" content="${title}"`);
    content = content.replace(/<meta property="og:description" content="[^"]*"/i, `<meta property="og:description" content="${description}"`);
    content = content.replace(/<meta name="twitter:title" content="[^"]*"/i, `<meta name="twitter:title" content="${title}"`);
    content = content.replace(/<meta name="twitter:description" content="[^"]*"/i, `<meta name="twitter:description" content="${description}"`);

    const faqs = [
      {
        q: '¿Qué límites de edad existen para asegurar a mi perro o gato?',
        a: 'Puedes dar de alta a tu perro o gato a partir de los 3 meses de edad y hasta que cumpla los 9 años. Una vez asegurado, la póliza se renueva anualmente de forma vitalicia sin exclusiones.'
      },
      {
        q: '¿Existen recargos en la cuota según la raza de la mascota?',
        a: 'No. Una de las grandes ventajas de Sanitas Mascotas es que la prima mensual es fija y uniforme. No se aplican recargos adicionales ni variaciones por la raza o tamaño de tu mascota.'
      },
      {
        q: '¿Cómo funciona la modalidad de Reembolso?',
        a: 'En la modalidad "Mascotas Reembolso", tienes la libertad de llevar a tu perro o gato a cualquier clínica veterinaria de España. Abonas la factura y nos la envías digitalmente a través de la app; Sanitas te reembolsará el 80% de los gastos elegibles en un plazo máximo de 10 días.'
      },
      {
        q: '¿Qué cubre la garantía de fallecimiento por accidente?',
        a: 'En caso de que la mascota fallezca debido a un accidente fortuito, la póliza indemniza al propietario con un capital de hasta 1.000€ (según condiciones de póliza) para mitigar los gastos sobrevenidos.'
      }
    ];

    const schemaMarkup = {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "InsuranceAgency",
          "@id": "https://www.vitablue.es/#organization",
          "name": "VitaBlue",
          "url": "https://www.vitablue.es/",
          "logo": "https://www.vitablue.es/assets/logo-vitablue.svg",
          "description": "Asesoramiento independiente en seguros de salud. Te ayudamos a encontrar y contratar los mejores seguros de salud de Sanitas, Adeslas, Asisa y más. Asesoramiento personalizado y contratación 100% online."
        },
        {
          "@type": "FinancialProduct",
          "@id": "https://www.vitablue.es/productos/seguro-mascotas/sanitas-mascotas/#producto",
          "name": "Sanitas Salud Mascotas",
          "description": "Sanitas Mascotas: seguro veterinario con consultas y vacuna de la rabia gratuitas, y reembolso de hasta 2.500 €/año.",
          "brand": {
            "@type": "Brand",
            "name": "Sanitas"
          },
          "provider": {
            "@id": "https://www.vitablue.es/#organization"
          },
          "offers": {
            "@type": "Offer",
            "price": "9.90",
            "priceCurrency": "EUR",
            "availability": "https://schema.org/InStock"
          }
        },
        {
          "@type": "BreadcrumbList",
          "itemListElement": [
            {
              "@type": "ListItem",
              "position": 1,
              "name": "Inicio",
              "item": "https://www.vitablue.es"
            },
            {
              "@type": "ListItem",
              "position": 2,
              "name": "Productos",
              "item": "https://www.vitablue.es/productos/seguros-salud/"
            },
            {
              "@type": "ListItem",
              "position": 3,
              "name": "Sanitas Mascotas",
              "item": "https://www.vitablue.es/productos/seguro-mascotas/sanitas-mascotas/"
            }
          ]
        },
        {
          "@type": "FAQPage",
          "@id": "https://www.vitablue.es/productos/seguro-mascotas/sanitas-mascotas/#faq",
          "mainEntity": faqs.map((faq) => ({
            "@type": "Question",
            "name": faq.q,
            "acceptedAnswer": {
              "@type": "Answer",
              "text": faq.a
            }
          }))
        }
      ]
    };

    if (!content.includes('"@type":"FAQPage"')) {
      content = content.replace('</head>', `    <script type="application/ld+json">${JSON.stringify(schemaMarkup)}</script>\n</head>`);
    }

    fs.writeFileSync(mascotasFile, content, 'utf8');
    console.log('✅ Metadatos SEO y FAQPage schema inyectados en landing Sanitas Mascotas.');
  }

  // Seguros Asisa Hub
  const asisaFile = path.join(distDir, 'productos/seguros-salud/seguros-asisa/index.html');
  if (fs.existsSync(asisaFile)) {
    let content = fs.readFileSync(asisaFile, 'utf8');
    const title = 'Gama Oficial de Seguros de Salud Asisa | Catálogo VitaBlue';
    const description = 'Explora y compara la gama oficial de seguros de salud de Asisa: ASISA Health Students, Residents, Completa +, Esencial y Mutualistas. Precio oficial sin comisiones.';

    content = content.replace(/<title>[^<]*<\/title>/i, `<title>${title}</title>`);
    content = content.replace(/<meta name="description" content="[^"]*"/i, `<meta name="description" content="${description}"`);
    content = content.replace(/<meta property="og:title" content="[^"]*"/i, `<meta property="og:title" content="${title}"`);
    content = content.replace(/<meta property="og:description" content="[^"]*"/i, `<meta property="og:description" content="${description}"`);
    content = content.replace(/<meta name="twitter:title" content="[^"]*"/i, `<meta name="twitter:title" content="${title}"`);
    content = content.replace(/<meta name="twitter:description" content="[^"]*"/i, `<meta name="twitter:description" content="${description}"`);

    const faqs = [
      {
        q: '¿Por qué contratar los seguros de Asisa a través de VitaBlue?',
        a: 'Contratas exactamente al precio oficial de Asisa con todas las promociones vigentes de la aseguradora, sin comisiones ni sobrecostes. Además, en VitaBlue cuentas con un asesor personal colegiado que te asiste en la emisión rápida de certificados para visados en 24h, gestión de autorizaciones médicas y resolución de trámites.'
      },
      {
        q: '¿Qué diferencia hay entre ASISA Completa +, Completa ++ y la modalidad sin copago?',
        a: 'ASISA Completa es la póliza de cobertura médica y quirúrgica total. En su versión Completa + disfrutas de una prima mensual reducida con copagos muy bajos por consulta médica. En Completa ++ la cuota mensual es aún más económica a cambio de copagos intermedios. Para trámites de visado o residencia en Extranjería, se exige contratar la modalidad Sin Copagos.'
      },
      {
        q: '¿Qué es el Grupo HLA y qué ventajas ofrece a los asegurados de Asisa?',
        a: 'El Grupo Hospitalario HLA es la red de clínicas y hospitales propios de Asisa, una de las mayores redes hospitalarias de España con 18 hospitales y 36 centros multiespecialidad. Como asegurado de Asisa accedes de forma preferente y directa a estos centros sin trámites adicionales.'
      }
    ];

    const asisaSchema = {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "InsuranceAgency",
          "@id": "https://www.vitablue.es/#organization",
          "name": "VitaBlue",
          "url": "https://www.vitablue.es/",
          "logo": "https://www.vitablue.es/assets/logo-vitablue.svg",
          "description": "Compara y contrata los mejores seguros de salud en España. Asesoramiento 100% independiente y gratuito para estudiantes, expatriados, nómadas y familias."
        },
        {
          "@type": "BreadcrumbList",
          "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Inicio", "item": "https://www.vitablue.es/" },
            { "@type": "ListItem", "position": 2, "name": "Seguros de Salud", "item": "https://www.vitablue.es/productos/seguros-salud/" },
            { "@type": "ListItem", "position": 3, "name": "Seguros Asisa", "item": "https://www.vitablue.es/productos/seguros-salud/seguros-asisa/" }
          ]
        },
        {
          "@type": "FAQPage",
          "@id": "https://www.vitablue.es/productos/seguros-salud/seguros-asisa/#faq",
          "mainEntity": faqs.map((faq) => ({
            "@type": "Question",
            "name": faq.q,
            "acceptedAnswer": { "@type": "Answer", "text": faq.a }
          }))
        }
      ]
    };

    if (!content.includes('"@type":"FAQPage"')) {
      content = content.replace('</head>', `    <script type="application/ld+json">${JSON.stringify(asisaSchema)}</script>\n</head>`);
    }

    fs.writeFileSync(asisaFile, content, 'utf8');
    console.log('✅ Metadatos SEO y FAQPage schema inyectados en hub Seguros Asisa.');
  }

  // Seguros Sanitas Hub
  const sanitasFile = path.join(distDir, 'productos/seguros-salud/seguros-sanitas/index.html');
  if (fs.existsSync(sanitasFile)) {
    let content = fs.readFileSync(sanitasFile, 'utf8');
    const title = 'Gama Oficial de Seguros de Salud Sanitas | Catálogo VitaBlue';
    const description = 'Explora y compara la gama oficial de seguros de salud de Sanitas. Coberturas esenciales, completas, familiares, premium y seguros para estudiantes o mascotas.';

    content = content.replace(/<title>[^<]*<\/title>/i, `<title>${title}</title>`);
    content = content.replace(/<meta name="description" content="[^"]*"/i, `<meta name="description" content="${description}"`);
    content = content.replace(/<meta property="og:title" content="[^"]*"/i, `<meta property="og:title" content="${title}"`);
    content = content.replace(/<meta property="og:description" content="[^"]*"/i, `<meta property="og:description" content="${description}"`);
    content = content.replace(/<meta name="twitter:title" content="[^"]*"/i, `<meta name="twitter:title" content="${title}"`);
    content = content.replace(/<meta name="twitter:description" content="[^"]*"/i, `<meta name="twitter:description" content="${description}"`);

    const faqs = [
      {
        q: '¿Qué ventajas tiene contratar a través de un Asesor Especialista de Sanitas?',
        a: 'Contratas directamente con el precio oficial de Sanitas y todas sus promociones vigentes. No pagas ningún tipo de comisión ni recargo. La gran ventaja es que obtienes soporte y asesoramiento continuo y humano de VitaBlue para autorizaciones, reembolsos o dudas de cobertura.'
      },
      {
        q: '¿Las pólizas de Sanitas tienen periodos de carencia?',
        a: 'Sí, la mayoría de seguros completos tienen carencias de entre 3 y 10 meses para coberturas complejas como hospitalizaciones o partos. No obstante, las consultas, urgencias y el seguro dental no tienen carencias. Si vienes de otra aseguradora con más de 1 año de antigüedad, Sanitas elimina la mayoría de las carencias.'
      },
      {
        q: '¿Qué es Blua y cómo funciona la telemedicina en Sanitas?',
        a: 'Blua es la plataforma de medicina digital líder de Sanitas. Permite hacer videoconsultas médicas de urgencia 24/7 y con especialistas, recibir recetas electrónicas oficiales válidas en farmacias de toda España, solicitar analíticas a domicilio y usar herramientas digitales de prevención de salud.'
      }
    ];

    const sanitasSchema = {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "InsuranceAgency",
          "@id": "https://www.vitablue.es/#organization",
          "name": "VitaBlue",
          "url": "https://www.vitablue.es/",
          "logo": "https://www.vitablue.es/assets/logo-vitablue.svg",
          "description": "Compara y contrata los mejores seguros de salud en España. Asesoramiento 100% independiente y gratuito para estudiantes, expatriados, nómadas y familias."
        },
        {
          "@type": "BreadcrumbList",
          "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Inicio", "item": "https://www.vitablue.es/" },
            { "@type": "ListItem", "position": 2, "name": "Seguros de Salud", "item": "https://www.vitablue.es/productos/seguros-salud/" },
            { "@type": "ListItem", "position": 3, "name": "Seguros Sanitas", "item": "https://www.vitablue.es/productos/seguros-salud/seguros-sanitas/" }
          ]
        },
        {
          "@type": "FAQPage",
          "@id": "https://www.vitablue.es/productos/seguros-salud/seguros-sanitas/#faq",
          "mainEntity": faqs.map((faq) => ({
            "@type": "Question",
            "name": faq.q,
            "acceptedAnswer": { "@type": "Answer", "text": faq.a }
          }))
        }
      ]
    };

    if (!content.includes('"@type":"FAQPage"')) {
      content = content.replace('</head>', `    <script type="application/ld+json">${JSON.stringify(sanitasSchema)}</script>\n</head>`);
    }

    fs.writeFileSync(sanitasFile, content, 'utf8');
    console.log('✅ Metadatos SEO y FAQPage schema inyectados en hub Seguros Sanitas.');
  }

  // Asisa Product Subpages
  const asisaProducts = [
    {
      file: path.join(distDir, 'productos/seguros-salud/seguros-asisa/asisa-health-students/index.html'),
      title: 'ASISA Health Students | Seguro Visado de Estudiante España | VitaBlue',
      description: 'Seguro médico oficial ASISA Health Students para visado de estudios y NIE en España. Sin copagos, sin carencias, repatriación médica incluida y certificado 24h.',
      canonical: 'https://www.vitablue.es/productos/seguros-salud/seguros-asisa/asisa-health-students/',
      productName: 'ASISA Health Students'
    },
    {
      file: path.join(distDir, 'productos/seguros-salud/seguros-asisa/asisa-health-residents/index.html'),
      title: 'ASISA Health Residents | Seguro Residencia y Nómadas Digitales | VitaBlue',
      description: 'Seguro médico oficial ASISA Health Residents para visado de residencia no lucrativa y nómadas digitales en España. Sin copagos, repatriación incluida y certificado 24h.',
      canonical: 'https://www.vitablue.es/productos/seguros-salud/seguros-asisa/asisa-health-residents/',
      productName: 'ASISA Health Residents'
    },
    {
      file: path.join(distDir, 'productos/seguros-salud/seguros-asisa/asisa-completa/index.html'),
      title: 'ASISA Completa + | Seguro Médico Integral con Hospitalización | VitaBlue',
      description: 'Descubre ASISA Completa + y ++: seguro de salud con hospitalización, 40.000 médicos, red hospitalaria Grupo HLA y telemedicina AsisaLIVE 24/7.',
      canonical: 'https://www.vitablue.es/productos/seguros-salud/seguros-asisa/asisa-completa/',
      productName: 'ASISA Completa +'
    },
    {
      file: path.join(distDir, 'productos/seguros-salud/seguros-asisa/asisa-esencial/index.html'),
      title: 'ASISA Esencial | Seguro Médico Sin Hospitalización | VitaBlue',
      description: 'Seguro de salud ambulatorio ASISA Esencial y Esencial +: especialistas, pruebas diagnósticas y telemedicina sin listas de espera desde 13,90€/mes.',
      canonical: 'https://www.vitablue.es/productos/seguros-salud/seguros-asisa/asisa-esencial/',
      productName: 'ASISA Esencial'
    }
  ];

  asisaProducts.forEach((prod) => {
    if (fs.existsSync(prod.file)) {
      let content = fs.readFileSync(prod.file, 'utf8');
      content = content.replace(/<title>[^<]*<\/title>/i, `<title>${prod.title}</title>`);
      content = content.replace(/<meta name="description" content="[^"]*"/i, `<meta name="description" content="${prod.description}"`);
      content = content.replace(/<meta property="og:title" content="[^"]*"/i, `<meta property="og:title" content="${prod.title}"`);
      content = content.replace(/<meta property="og:description" content="[^"]*"/i, `<meta property="og:description" content="${prod.description}"`);
      content = content.replace(/<meta property="og:url" content="[^"]*"/i, `<meta property="og:url" content="${prod.canonical}"`);
      content = content.replace(/<meta name="twitter:title" content="[^"]*"/i, `<meta name="twitter:title" content="${prod.title}"`);
      content = content.replace(/<meta name="twitter:description" content="[^"]*"/i, `<meta name="twitter:description" content="${prod.description}"`);
      fs.writeFileSync(prod.file, content, 'utf8');
    }
  });
  console.log('✅ Metadatos SEO inyectados en 4 páginas de producto Asisa.');

  // Additional Landing Pages with Title, Description, and JSON-LD Schemas
  const landingPages = [
    {
      file: path.join(distDir, 'productos/seguros-salud/seguro-medico-estudiantes/index.html'),
      title: 'Seguro Médico Visado Estudiante España desde 35€/mes | 0 Copagos VitaBlue',
      description: 'Seguro médico oficial para visado de estudiante en España desde 35€/mes. Cobertura 100% sin copagos, sin carencias, repatriación y certificado consular en 24h.',
      canonical: 'https://www.vitablue.es/productos/seguros-salud/seguro-medico-estudiantes/',
      schema: {
        "@context": "https://schema.org",
        "@graph": [
          {
            "@type": "InsuranceAgency",
            "@id": "https://www.vitablue.es/#organization",
            "name": "VitaBlue",
            "url": "https://www.vitablue.es/",
            "logo": "https://www.vitablue.es/assets/logo-vitablue.svg",
            "description": "Asesoramiento independiente en seguros de salud. Te ayudamos a encontrar y contratar los mejores seguros de salud de Sanitas, Adeslas, Asisa y más. Asesoramiento personalizado y contratación 100% online.",
            "contactPoint": {
              "@type": "ContactPoint",
              "contactType": "customer service",
              "telephone": "+34 694 58 34 52",
              "areaServed": "ES",
              "availableLanguage": ["es", "en"]
            }
          },
          {
            "@type": "FinancialProduct",
            "@id": "https://www.vitablue.es/productos/seguros-salud/seguro-medico-estudiantes/#producto",
            "name": "Sanitas International Students & ASISA Students",
            "description": "Seguro médico diseñado para estudiantes extranjeros en España válido para visado. Cobertura sin copagos y sin carencias.",
            "brand": {
              "@type": "Brand",
              "name": "VitaBlue"
            },
            "provider": {
              "@id": "https://www.vitablue.es/#organization"
            }
          },
          {
            "@type": "BreadcrumbList",
            "itemListElement": [
              {
                "@type": "ListItem",
                "position": 1,
                "name": "Inicio",
                "item": "https://www.vitablue.es/"
              },
              {
                "@type": "ListItem",
                "position": 2,
                "name": "Seguros de Salud",
                "item": "https://www.vitablue.es/productos/seguros-salud/"
              },
              {
                "@type": "ListItem",
                "position": 3,
                "name": "Seguro Médico Estudiantes",
                "item": "https://www.vitablue.es/productos/seguros-salud/seguro-medico-estudiantes/"
              }
            ]
          },
          {
            "@type": "FAQPage",
            "mainEntity": [
              {
                "@type": "Question",
                "name": "¿Qué requisitos debe tener el seguro médico para el visado de estudiante en España?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Para que el consulado o Extranjería apruebe tu visado de estudiante (o tarjeta TIE), tu seguro debe cumplir 4 requisitos: 1) Sin copagos ni franquicias, 2) Sin periodos de carencia (cobertura desde el primer día), 3) Cobertura sanitaria completa equivalente a la sanidad pública con hospitalización, y 4) Repatriación sanitaria y funeraria al país de origen incluida."
                }
              },
              {
                "@type": "Question",
                "name": "¿Sirve un seguro de viaje para solicitar el visado de estudios en España?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "No. Los consulados de España rechazan los seguros de viaje estándar porque solo cubren emergencias temporales limitadas. Extranjería exige un seguro médico de salud completo homologado con hospitalización ilimitada."
                }
              },
              {
                "@type": "Question",
                "name": "¿Cuál es el mejor seguro médico para estudiantes extranjeros en España en 2026?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "ASISA Salud Estudiantes es la opción #1 más recomendada en VitaBlue por su excelente precio (desde 38€/mes), cobertura nacional completa y la emisión más ágil de certificados consulares en menos de 24 horas."
                }
              }
            ]
          }
        ]
      }
    },
    {
      file: path.join(distDir, 'en/health-insurance-student-visa-spain/index.html'),
      title: 'Best Health Insurance for Student Visa in Spain from €35/mo | VitaBlue',
      description: 'Official student visa health insurance in Spain from €35/month. 0€ copays, zero waiting periods, repatriation & approved consular certificate in 24h.',
      canonical: 'https://www.vitablue.es/en/health-insurance-student-visa-spain/',
      schema: {
        "@context": "https://schema.org",
        "@graph": [
          {
            "@type": "InsuranceAgency",
            "@id": "https://www.vitablue.es/#organization",
            "name": "VitaBlue",
            "url": "https://www.vitablue.es/en/",
            "logo": "https://www.vitablue.es/assets/logo-vitablue.svg",
            "description": "Independent advice in health insurance in Spain for international students and expats.",
            "contactPoint": {
              "@type": "ContactPoint",
              "contactType": "customer service",
              "telephone": "+34 694 58 34 52",
              "areaServed": "ES",
              "availableLanguage": ["es", "en"]
            }
          },
          {
            "@type": "FinancialProduct",
            "@id": "https://www.vitablue.es/en/health-insurance-student-visa-spain/#producto",
            "name": "Student Visa Health Insurance Spain",
            "description": "Comprehensive health insurance policy for student visa in Spain with 0 copays and repatriation included.",
            "brand": {
              "@type": "Brand",
              "name": "VitaBlue"
            },
            "provider": {
              "@id": "https://www.vitablue.es/#organization"
            }
          },
          {
            "@type": "BreadcrumbList",
            "itemListElement": [
              {
                "@type": "ListItem",
                "position": 1,
                "name": "Home",
                "item": "https://www.vitablue.es/en/"
              },
              {
                "@type": "ListItem",
                "position": 2,
                "name": "Student Insurance",
                "item": "https://www.vitablue.es/en/health-insurance-student-visa-spain/"
              }
            ]
          },
          {
            "@type": "FAQPage",
            "mainEntity": [
              {
                "@type": "Question",
                "name": "What requirements must health insurance meet for a student visa in Spain?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "The policy must meet 4 mandatory conditions: 1) Zero copays or deductibles, 2) Zero wait times (carencias) for medical services, 3) Full coverage equivalent to the Spanish public healthcare system, and 4) Sanitary and funeral repatriation to the country of origin included."
                }
              }
            ]
          }
        ]
      }
    },
    {
      file: path.join(distDir, 'productos/seguros-salud/seguro-expatriados/index.html'),
      title: 'Seguro Médico para Expatriados y Residencia en España (0 Copagos) | VitaBlue',
      description: 'Seguro de salud oficial en España para expatriados, Residencia No Lucrativa y Golden Visa. Cobertura médica completa, 0€ copagos, repatriación y certificado en 24h.',
      canonical: 'https://www.vitablue.es/productos/seguros-salud/seguro-expatriados/',
      schema: {
        "@context": "https://schema.org",
        "@graph": [
          {
            "@type": "InsuranceAgency",
            "@id": "https://www.vitablue.es/#organization",
            "name": "VitaBlue",
            "url": "https://www.vitablue.es/",
            "logo": "https://www.vitablue.es/assets/logo-vitablue.svg",
            "description": "Compara y contrata los mejores seguros de salud en España. Asesoramiento 100% independiente y gratuito para estudiantes, expatriados, nómadas y familias.",
            "contactPoint": {
              "@type": "ContactPoint",
              "contactType": "customer service",
              "telephone": "+34 694 58 34 52",
              "areaServed": "ES",
              "availableLanguage": ["es", "en"]
            }
          },
          {
            "@type": "FinancialProduct",
            "@id": "https://www.vitablue.es/productos/seguros-salud/seguro-expatriados/#producto",
            "name": "Seguro Médico para Expatriados en España",
            "description": "Seguro de salud completo sin copagos y sin carencias para visados de residencia no lucrativa y Golden Visa en España.",
            "brand": {
              "@type": "Brand",
              "name": "VitaBlue"
            },
            "provider": {
              "@id": "https://www.vitablue.es/#organization"
            }
          },
          {
            "@type": "BreadcrumbList",
            "itemListElement": [
              {
                "@type": "ListItem",
                "position": 1,
                "name": "Inicio",
                "item": "https://www.vitablue.es/"
              },
              {
                "@type": "ListItem",
                "position": 2,
                "name": "Seguros de Salud",
                "item": "https://www.vitablue.es/productos/seguros-salud/"
              },
              {
                "@type": "ListItem",
                "position": 3,
                "name": "Expatriados",
                "item": "https://www.vitablue.es/productos/seguros-salud/seguro-expatriados/"
              }
            ]
          },
          {
            "@type": "FAQPage",
            "mainEntity": [
              {
                "@type": "Question",
                "name": "¿Qué requisitos debe cumplir el seguro para los visados de Residencia No Lucrativa o Golden Visa?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Debe ser un seguro de salud completo, sin copagos por consultas, sin periodos de carencia en coberturas (especialmente hospitalización) y con cobertura de repatriación en caso de fallecimiento."
                }
              }
            ]
          }
        ]
      }
    },
    {
      file: path.join(distDir, 'en/health-insurance-expatriates-spain/index.html'),
      title: 'Health Insurance for Expats & Non-Lucrative Visa in Spain | VitaBlue',
      description: 'Official health insurance in Spain for expats, Non-Lucrative Visa and Golden Visa. Comprehensive coverage, zero copays, repatriation & 24h certificate.',
      canonical: 'https://www.vitablue.es/en/health-insurance-expatriates-spain/',
      schema: {
        "@context": "https://schema.org",
        "@graph": [
          {
            "@type": "InsuranceAgency",
            "@id": "https://www.vitablue.es/#organization",
            "name": "VitaBlue",
            "url": "https://www.vitablue.es/en/",
            "logo": "https://www.vitablue.es/assets/logo-vitablue.svg",
            "description": "Official health insurance in Spain for expats, Non-Lucrative Visa and Golden Visa.",
            "contactPoint": {
              "@type": "ContactPoint",
              "contactType": "customer service",
              "telephone": "+34 694 58 34 52",
              "areaServed": "ES",
              "availableLanguage": ["es", "en"]
            }
          },
          {
            "@type": "FinancialProduct",
            "@id": "https://www.vitablue.es/en/health-insurance-expatriates-spain/#producto",
            "name": "Expat Health Insurance Spain",
            "description": "Full coverage health insurance for expats in Spain with zero copays and official certificate in 24h.",
            "brand": {
              "@type": "Brand",
              "name": "VitaBlue"
            },
            "provider": {
              "@id": "https://www.vitablue.es/#organization"
            }
          },
          {
            "@type": "BreadcrumbList",
            "itemListElement": [
              {
                "@type": "ListItem",
                "position": 1,
                "name": "Home",
                "item": "https://www.vitablue.es/en/"
              },
              {
                "@type": "ListItem",
                "position": 2,
                "name": "Expatriates",
                "item": "https://www.vitablue.es/en/health-insurance-expatriates-spain/"
              }
            ]
          },
          {
            "@type": "FAQPage",
            "mainEntity": [
              {
                "@type": "Question",
                "name": "Which insurance is mandatory for the Non-Lucrative Visa?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Immigration requires private health insurance contracted with a company authorized in Spain, providing full coverage (medical and hospital), without copays and without waiting periods."
                }
              }
            ]
          }
        ]
      }
    },
    {
      file: path.join(distDir, 'productos/seguros-salud/seguro-nomadas-digitales/index.html'),
      title: 'Seguro Médico para Visado Nómada Digital España (2026) | VitaBlue',
      description: 'Seguro médico oficial para el Visado de Nómada Digital en España. Cobertura completa homologada sin copagos, asistencia médica en viajes y certificado en 24h.',
      canonical: 'https://www.vitablue.es/productos/seguros-salud/seguro-nomadas-digitales/',
      schema: {
        "@context": "https://schema.org",
        "@graph": [
          {
            "@type": "InsuranceAgency",
            "@id": "https://www.vitablue.es/#organization",
            "name": "VitaBlue",
            "url": "https://www.vitablue.es/",
            "logo": "https://www.vitablue.es/assets/logo-vitablue.svg",
            "description": "Compara y contrata los mejores seguros de salud en España. Asesoramiento 100% independiente y gratuito para estudiantes, expatriados, nómadas y familias.",
            "contactPoint": {
              "@type": "ContactPoint",
              "contactType": "customer service",
              "telephone": "+34 694 58 34 52",
              "areaServed": "ES",
              "availableLanguage": ["es", "en"]
            }
          },
          {
            "@type": "FinancialProduct",
            "@id": "https://www.vitablue.es/productos/seguros-salud/seguro-nomadas-digitales/#producto",
            "name": "Seguro Médico para Nómadas Digitales en España",
            "description": "Seguro médico privado con cobertura nacional en España y asistencia médica internacional de urgencia para visado de nómada digital.",
            "brand": {
              "@type": "Brand",
              "name": "VitaBlue"
            },
            "provider": {
              "@id": "https://www.vitablue.es/#organization"
            }
          },
          {
            "@type": "BreadcrumbList",
            "itemListElement": [
              {
                "@type": "ListItem",
                "position": 1,
                "name": "Inicio",
                "item": "https://www.vitablue.es/"
              },
              {
                "@type": "ListItem",
                "position": 2,
                "name": "Seguros de Salud",
                "item": "https://www.vitablue.es/productos/seguros-salud/"
              },
              {
                "@type": "ListItem",
                "position": 3,
                "name": "Nómadas Digitales",
                "item": "https://www.vitablue.es/productos/seguros-salud/seguro-nomadas-digitales/"
              }
            ]
          },
          {
            "@type": "FAQPage",
            "mainEntity": [
              {
                "@type": "Question",
                "name": "¿Por qué el visado de Nómada Digital exige un seguro sin copagos?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "La Unidad de Grandes Empresas y Colectivos Estratégicos (UGE) exige acreditar cobertura médica completa en España equivalente al Sistema Nacional de Salud, sin copagos ni carencias."
                }
              }
            ]
          }
        ]
      }
    },
    {
      file: path.join(distDir, 'en/digital-nomad-insurance-spain/index.html'),
      title: 'Best Health Insurance for Digital Nomads in Spain (2026) | VitaBlue',
      description: 'Official health insurance for Spain Digital Nomad Visa. Full coverage, 0€ copays, international travel assistance and approved consular certificate in 24h.',
      canonical: 'https://www.vitablue.es/en/digital-nomad-insurance-spain/',
      schema: {
        "@context": "https://schema.org",
        "@graph": [
          {
            "@type": "InsuranceAgency",
            "@id": "https://www.vitablue.es/#organization",
            "name": "VitaBlue",
            "url": "https://www.vitablue.es/en/",
            "logo": "https://www.vitablue.es/assets/logo-vitablue.svg",
            "description": "Official health insurance for Spain Digital Nomad Visa.",
            "contactPoint": {
              "@type": "ContactPoint",
              "contactType": "customer service",
              "telephone": "+34 694 58 34 52",
              "areaServed": "ES",
              "availableLanguage": ["es", "en"]
            }
          },
          {
            "@type": "FinancialProduct",
            "@id": "https://www.vitablue.es/en/digital-nomad-insurance-spain/#producto",
            "name": "Digital Nomad Health Insurance Spain",
            "description": "Official health insurance policy for Spain Digital Nomad Visa with zero copays and international emergency coverage.",
            "brand": {
              "@type": "Brand",
              "name": "VitaBlue"
            },
            "provider": {
              "@id": "https://www.vitablue.es/#organization"
            }
          },
          {
            "@type": "BreadcrumbList",
            "itemListElement": [
              {
                "@type": "ListItem",
                "position": 1,
                "name": "Home",
                "item": "https://www.vitablue.es/en/"
              },
              {
                "@type": "ListItem",
                "position": 2,
                "name": "Digital Nomads",
                "item": "https://www.vitablue.es/en/digital-nomad-insurance-spain/"
              }
            ]
          }
        ]
      }
    },
    {
      file: path.join(distDir, 'productos/seguros-salud/seguro-salud-extranjeros/index.html'),
      title: 'Seguros Médicos para Extranjeros en España: Visado y NIE sin Copagos | VitaBlue',
      description: 'Seguros de salud homologados para extranjeros en España. Coberturas completas sin copagos para visado de estudiante, nómada digital y residencia con certificado en 24h.',
      canonical: 'https://www.vitablue.es/productos/seguros-salud/seguro-salud-extranjeros/',
      schema: {
        "@context": "https://schema.org",
        "@graph": [
          {
            "@type": "InsuranceAgency",
            "@id": "https://www.vitablue.es/#organization",
            "name": "VitaBlue",
            "url": "https://www.vitablue.es/",
            "logo": "https://www.vitablue.es/assets/logo-vitablue.svg",
            "description": "Seguros de salud homologados para extranjeros en España. Coberturas completas sin copagos para visado de estudiante, nómada digital y residencia.",
            "contactPoint": {
              "@type": "ContactPoint",
              "contactType": "customer service",
              "telephone": "+34 694 58 34 52",
              "areaServed": "ES",
              "availableLanguage": ["es", "en"]
            }
          },
          {
            "@type": "FinancialProduct",
            "@id": "https://www.vitablue.es/productos/seguros-salud/seguro-salud-extranjeros/#producto",
            "name": "Seguro Médico para Extranjeros en España",
            "description": "Seguro médico completo sin copagos y sin carencias homologado para visados de extranjería en España.",
            "brand": {
              "@type": "Brand",
              "name": "VitaBlue"
            },
            "provider": {
              "@id": "https://www.vitablue.es/#organization"
            }
          },
          {
            "@type": "BreadcrumbList",
            "itemListElement": [
              {
                "@type": "ListItem",
                "position": 1,
                "name": "Inicio",
                "item": "https://www.vitablue.es/"
              },
              {
                "@type": "ListItem",
                "position": 2,
                "name": "Seguros de Salud",
                "item": "https://www.vitablue.es/productos/seguros-salud/"
              },
              {
                "@type": "ListItem",
                "position": 3,
                "name": "Seguro para Extranjeros",
                "item": "https://www.vitablue.es/productos/seguros-salud/seguro-salud-extranjeros/"
              }
            ]
          },
          {
            "@type": "FAQPage",
            "mainEntity": [
              {
                "@type": "Question",
                "name": "¿Qué documentación exacta recibiré para mi cita de visado?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Una vez formalizada la póliza, te enviaremos por correo electrónico el Certificado Oficial de Cobertura en castellano, firmado digitalmente, indicando explícitamente que no tiene copagos ni carencias, y que incluye la repatriación."
                }
              }
            ]
          }
        ]
      }
    },
    {
      file: path.join(distDir, 'productos/seguros-salud/seguros-sanitas/sanitas-mas-salud/index.html'),
      title: 'Sanitas Más Salud: Precios y Coberturas 2026 (Plus y Óptima) | VitaBlue',
      description: 'Precios y coberturas oficiales de Sanitas Más Salud (Plus, Óptima y Sin Copago). Hospitalización completa, 50.000 médicos y app Blua digital gratis.',
      canonical: 'https://www.vitablue.es/productos/seguros-salud/seguros-sanitas/sanitas-mas-salud/',
      schema: {
        "@context": "https://schema.org",
        "@graph": [
          {
            "@type": "InsuranceAgency",
            "@id": "https://www.vitablue.es/#organization",
            "name": "VitaBlue",
            "url": "https://www.vitablue.es/",
            "logo": "https://www.vitablue.es/assets/logo-vitablue.svg",
            "description": "Asesoramiento independiente en seguros de salud. Te ayudamos a encontrar y contratar los mejores seguros de salud de Sanitas, Adeslas, Asisa y más.",
            "contactPoint": {
              "@type": "ContactPoint",
              "contactType": "customer service",
              "telephone": "+34 694 58 34 52",
              "areaServed": "ES",
              "availableLanguage": ["es", "en"]
            }
          },
          {
            "@type": "FinancialProduct",
            "@id": "https://www.vitablue.es/productos/seguros-salud/seguros-sanitas/sanitas-mas-salud/#producto",
            "name": "Sanitas Más Salud",
            "description": "Seguro médico privado con Hospitalización, urgencias 24/7, red propia de hospitales Sanitas y servicios digitales Blua.",
            "brand": {
              "@type": "Brand",
              "name": "Sanitas"
            },
            "provider": {
              "@id": "https://www.vitablue.es/#organization"
            }
          },
          {
            "@type": "BreadcrumbList",
            "itemListElement": [
              {
                "@type": "ListItem",
                "position": 1,
                "name": "Inicio",
                "item": "https://www.vitablue.es/"
              },
              {
                "@type": "ListItem",
                "position": 2,
                "name": "Seguros de Salud",
                "item": "https://www.vitablue.es/productos/seguros-salud/"
              },
              {
                "@type": "ListItem",
                "position": 3,
                "name": "Sanitas Más Salud",
                "item": "https://www.vitablue.es/productos/seguros-salud/seguros-sanitas/sanitas-mas-salud/"
              }
            ]
          }
        ]
      }
    },
    {
      file: path.join(distDir, 'productos/seguro-viaje/index.html'),
      title: 'Seguro de Viaje Internacional | Cobertura Médica | VitaBlue',
      description: 'Compara y contrata tu seguro de viaje internacional. Cobertura de gastos médicos, repatriación, pérdida de equipaje y anulación para tus viajes vacacionales o de larga estancia.',
      canonical: 'https://www.vitablue.es/productos/seguro-viaje/',
      schema: {
        "@context": "https://schema.org",
        "@graph": [
          {
            "@type": "InsuranceAgency",
            "@id": "https://www.vitablue.es/#organization",
            "name": "VitaBlue",
            "url": "https://www.vitablue.es/",
            "logo": "https://www.vitablue.es/assets/logo-vitablue.svg",
            "description": "Compara y contrata los mejores seguros de salud en España. Asesoramiento 100% independiente y gratuito.",
            "contactPoint": {
              "@type": "ContactPoint",
              "contactType": "customer service",
              "telephone": "+34 694 58 34 52",
              "areaServed": "ES",
              "availableLanguage": ["es", "en"]
            }
          },
          {
            "@type": "FinancialProduct",
            "@id": "https://www.vitablue.es/productos/seguro-viaje/#producto",
            "name": "Seguro de Viaje Internacional",
            "description": "Seguro de asistencia en viaje internacional con cobertura de gastos médicos, repatriación y anulación.",
            "brand": {
              "@type": "Brand",
              "name": "VitaBlue"
            },
            "provider": {
              "@id": "https://www.vitablue.es/#organization"
            }
          },
          {
            "@type": "BreadcrumbList",
            "itemListElement": [
              {
                "@type": "ListItem",
                "position": 1,
                "name": "Inicio",
                "item": "https://www.vitablue.es/"
              },
              {
                "@type": "ListItem",
                "position": 2,
                "name": "Seguros",
                "item": "https://www.vitablue.es/"
              },
              {
                "@type": "ListItem",
                "position": 3,
                "name": "Seguro de Viaje",
                "item": "https://www.vitablue.es/productos/seguro-viaje/"
              }
            ]
          },
          {
            "@type": "FAQPage",
            "mainEntity": [
              {
                "@type": "Question",
                "name": "¿Qué cubre la garantía de cancelación de viaje?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Te reembolsa los gastos de billetes y reservas de hotel no recuperables si tienes que suspender el viaje antes de su inicio por causas justificadas de fuerza mayor."
                }
              }
            ]
          }
        ]
      }
    },
    {
      file: path.join(distDir, 'productos/seguro-vida/index.html'),
      title: 'Seguro de Vida Familiar | Cobertura e Hipoteca | VitaBlue',
      description: 'Compara y contrata tu seguro de vida familiar. Protege la estabilidad de tu familia y asegura tu hipoteca con cuotas económicas sin revisiones médicas complejas.',
      canonical: 'https://www.vitablue.es/productos/seguro-vida/',
      schema: {
        "@context": "https://schema.org",
        "@graph": [
          {
            "@type": "InsuranceAgency",
            "@id": "https://www.vitablue.es/#organization",
            "name": "VitaBlue",
            "url": "https://www.vitablue.es/",
            "logo": "https://www.vitablue.es/assets/logo-vitablue.svg",
            "description": "Compara y contrata tu seguro de vida familiar. Protege la estabilidad de tu familia y asegura tu hipoteca.",
            "contactPoint": {
              "@type": "ContactPoint",
              "contactType": "customer service",
              "telephone": "+34 694 58 34 52",
              "areaServed": "ES",
              "availableLanguage": ["es", "en"]
            }
          },
          {
            "@type": "FinancialProduct",
            "@id": "https://www.vitablue.es/productos/seguro-vida/#producto",
            "name": "Seguro de Vida Familiar",
            "description": "Seguro de vida riesgo y protección familiar e hipotecaria con cobertura de fallecimiento e invalidez absoluta.",
            "brand": {
              "@type": "Brand",
              "name": "VitaBlue"
            },
            "provider": {
              "@id": "https://www.vitablue.es/#organization"
            }
          },
          {
            "@type": "BreadcrumbList",
            "itemListElement": [
              {
                "@type": "ListItem",
                "position": 1,
                "name": "Inicio",
                "item": "https://www.vitablue.es/"
              },
              {
                "@type": "ListItem",
                "position": 2,
                "name": "Seguros",
                "item": "https://www.vitablue.es/"
              },
              {
                "@type": "ListItem",
                "position": 3,
                "name": "Seguro de Vida",
                "item": "https://www.vitablue.es/productos/seguro-vida/"
              }
            ]
          },
          {
            "@type": "FAQPage",
            "mainEntity": [
              {
                "@type": "Question",
                "name": "¿Cómo puedo cambiar mi seguro de vida de la hipoteca a VitaBlue?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Es tu derecho legal. Puedes dar de baja el seguro de vida del banco avisando con 30 días de antelación al vencimiento y presentar la nueva póliza de VitaBlue."
                }
              }
            ]
          }
        ]
      }
    },
    {
      file: path.join(distDir, 'productos/seguro-para-decesos/asistencia-familiar/index.html'),
      title: 'Sanitas Asistencia Familiar iPlus | Seguro de Decesos y Traslado | VitaBlue',
      description: 'Contrata Sanitas Asistencia Familiar iPlus. Seguro de decesos integral con repatriación y traslado nacional e internacional, sepelio y asesoría jurídica familiar.',
      canonical: 'https://www.vitablue.es/productos/seguro-para-decesos/asistencia-familiar/',
      schema: {
        "@context": "https://schema.org",
        "@graph": [
          {
            "@type": "InsuranceAgency",
            "@id": "https://www.vitablue.es/#organization",
            "name": "VitaBlue",
            "url": "https://www.vitablue.es/",
            "logo": "https://www.vitablue.es/assets/logo-vitablue.svg",
            "description": "Asesoramiento independiente en seguros de salud. Te ayudamos a encontrar y contratar los mejores seguros de salud de Sanitas, Adeslas, Asisa y más.",
            "contactPoint": {
              "@type": "ContactPoint",
              "contactType": "customer service",
              "telephone": "+34 694 58 34 52",
              "areaServed": "ES",
              "availableLanguage": ["es", "en"]
            }
          },
          {
            "@type": "FinancialProduct",
            "@id": "https://www.vitablue.es/productos/seguro-para-decesos/asistencia-familiar/#producto",
            "name": "Asistencia Familiar iPlus Sanitas",
            "description": "Seguro de asistencia familiar y decesos: servicios funerarios completos, traslado mundial, apoyo emocional y gestión documental.",
            "brand": {
              "@type": "Brand",
              "name": "Sanitas"
            },
            "provider": {
              "@id": "https://www.vitablue.es/#organization"
            }
          },
          {
            "@type": "BreadcrumbList",
            "itemListElement": [
              {
                "@type": "ListItem",
                "position": 1,
                "name": "Inicio",
                "item": "https://www.vitablue.es/"
              },
              {
                "@type": "ListItem",
                "position": 2,
                "name": "Seguros",
                "item": "https://www.vitablue.es/"
              },
              {
                "@type": "ListItem",
                "position": 3,
                "name": "Asistencia Familiar iPlus",
                "item": "https://www.vitablue.es/productos/seguro-para-decesos/asistencia-familiar/"
              }
            ]
          },
          {
            "@type": "FAQPage",
            "mainEntity": [
              {
                "@type": "Question",
                "name": "¿Qué incluye el servicio funerario?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Organización, tanatorio, féretro, ceremonia y gestiones básicas."
                }
              }
            ]
          }
        ]
      }
    },
    {
      file: path.join(distDir, 'blog/index.html'),
      title: 'Hub de Guías y Visados | Blog VitaBlue',
      description: 'Guías de expertos sobre seguros de salud, requisitos consulares y extranjería en España. Artículos actualizados para tramitar visados y estancias.',
      canonical: 'https://www.vitablue.es/blog/',
      schema: null
    },
    {
      file: path.join(distDir, 'en/blog/index.html'),
      title: 'Guides & Consular Hub | VitaBlue Blog',
      description: 'Expert guides on health insurance, visa requirements and immigration compliance in Spain. Up-to-date articles for expats, nomads and students.',
      canonical: 'https://www.vitablue.es/en/blog/',
      schema: null
    },
    {
      file: path.join(distDir, 'contacto/index.html'),
      title: 'Contacto VitaBlue | Asesoría en seguros',
      description: 'Contacta con VitaBlue para comparar seguros de salud, expatriados, estudiantes, mascotas y otras coberturas en España. Asesoramiento 100% gratuito.',
      canonical: 'https://www.vitablue.es/contacto/',
      schema: null
    },
    {
      file: path.join(distDir, 'en/contact/index.html'),
      title: 'Contact VitaBlue | Insurance advice',
      description: 'Contact VitaBlue for help comparing health, expat, student, pet and other insurance options in Spain. Free and independent consultation.',
      canonical: 'https://www.vitablue.es/en/contact/',
      schema: null
    }
  ];

  landingPages.forEach((landing) => {
    if (fs.existsSync(landing.file)) {
      let content = fs.readFileSync(landing.file, 'utf8');
      content = content.replace(/<title>[^<]*<\/title>/i, `<title>${landing.title}</title>`);
      content = content.replace(/<meta name="description" content="[^"]*"/i, `<meta name="description" content="${landing.description}"`);
      content = content.replace(/<meta property="og:title" content="[^"]*"/i, `<meta property="og:title" content="${landing.title}"`);
      content = content.replace(/<meta property="og:description" content="[^"]*"/i, `<meta property="og:description" content="${landing.description}"`);
      content = content.replace(/<meta property="og:url" content="[^"]*"/i, `<meta property="og:url" content="${landing.canonical}"`);
      content = content.replace(/<meta name="twitter:title" content="[^"]*"/i, `<meta name="twitter:title" content="${landing.title}"`);
      content = content.replace(/<meta name="twitter:description" content="[^"]*"/i, `<meta name="twitter:description" content="${landing.description}"`);

      if (landing.schema && !content.includes('"@type":"FAQPage"') && !content.includes('"@type":"FinancialProduct"')) {
        content = content.replace('</head>', `    <script type="application/ld+json">${JSON.stringify(landing.schema)}</script>\n</head>`);
      }

      fs.writeFileSync(landing.file, content, 'utf8');
    }
  });
  console.log(`✅ Metadatos SEO y esquemas inyectados en ${landingPages.length} landing pages adicionales.`);

}

injectLandingMetadataAndSchemas();

function injectCorporateSchemas() {
  const { VITA_BLUE_ORGANIZATION_SCHEMA } = require('./utils/organizationSchema.ts');

  const targets = [
    {
      file: path.join(distDir, 'index.html'),
      pageSchema: {
        '@context': 'https://schema.org',
        '@graph': [
          VITA_BLUE_ORGANIZATION_SCHEMA,
          {
            '@type': 'WebSite',
            '@id': 'https://www.vitablue.es/#website',
            'url': 'https://www.vitablue.es/',
            'name': 'VitaBlue',
            'publisher': { '@id': 'https://www.vitablue.es/#organization' },
            'inLanguage': 'es-ES'
          }
        ]
      }
    },
    {
      file: path.join(distDir, 'en/index.html'),
      pageSchema: {
        '@context': 'https://schema.org',
        '@graph': [
          VITA_BLUE_ORGANIZATION_SCHEMA,
          {
            '@type': 'WebSite',
            '@id': 'https://www.vitablue.es/en/#website',
            'url': 'https://www.vitablue.es/en/',
            'name': 'VitaBlue',
            'publisher': { '@id': 'https://www.vitablue.es/#organization' },
            'inLanguage': 'en-US'
          }
        ]
      }
    },
    {
      file: path.join(distDir, 'sobre-nosotros/index.html'),
      pageSchema: {
        '@context': 'https://schema.org',
        '@graph': [
          {
            '@type': 'AboutPage',
            '@id': 'https://www.vitablue.es/sobre-nosotros/#webpage',
            'name': 'Sobre Nosotros | Comparador 100% Independiente | VitaBlue',
            'url': 'https://www.vitablue.es/sobre-nosotros/',
            'about': { '@id': 'https://www.vitablue.es/#organization' }
          },
          VITA_BLUE_ORGANIZATION_SCHEMA
        ]
      }
    },
    {
      file: path.join(distDir, 'en/about-us/index.html'),
      pageSchema: {
        '@context': 'https://schema.org',
        '@graph': [
          {
            '@type': 'AboutPage',
            '@id': 'https://www.vitablue.es/en/about-us/#webpage',
            'name': 'About VitaBlue | 100% Independent Insurance Comparator',
            'url': 'https://www.vitablue.es/en/about-us/',
            'about': { '@id': 'https://www.vitablue.es/#organization' }
          },
          VITA_BLUE_ORGANIZATION_SCHEMA
        ]
      }
    },
    {
      file: path.join(distDir, 'contacto/index.html'),
      pageSchema: {
        '@context': 'https://schema.org',
        '@graph': [
          {
            '@type': 'ContactPage',
            '@id': 'https://www.vitablue.es/contacto/#webpage',
            'name': 'Contacto VitaBlue | Asesoría en seguros',
            'url': 'https://www.vitablue.es/contacto/',
            'mainEntity': { '@id': 'https://www.vitablue.es/#organization' }
          },
          VITA_BLUE_ORGANIZATION_SCHEMA
        ]
      }
    },
    {
      file: path.join(distDir, 'en/contact/index.html'),
      pageSchema: {
        '@context': 'https://schema.org',
        '@graph': [
          {
            '@type': 'ContactPage',
            '@id': 'https://www.vitablue.es/en/contact/#webpage',
            'name': 'Contact VitaBlue | Insurance advice',
            'url': 'https://www.vitablue.es/en/contact/',
            'mainEntity': { '@id': 'https://www.vitablue.es/#organization' }
          },
          VITA_BLUE_ORGANIZATION_SCHEMA
        ]
      }
    }
  ];

  targets.forEach(({ file, pageSchema }) => {
    if (!fs.existsSync(file)) return;
    let content = fs.readFileSync(file, 'utf8');
    if (!content.includes('"https://www.vitablue.es/#organization"')) {
      content = content.replace('</head>', `    <script type="application/ld+json">${JSON.stringify(pageSchema)}</script>\n</head>`);
      fs.writeFileSync(file, content, 'utf8');
    }
  });

  console.log('✅ Esquemas InsuranceAgency y Organization inyectados en páginas corporativas.');
}

injectCorporateSchemas();

// === OPTIMIZACIÓN DE RENDERIZADO CRÍTICO (HEAD TAGS) ===

function optimizeHtmlHeadTagsRecursive(dir) {
  if (!fs.existsSync(dir)) return;
  const items = fs.readdirSync(dir);

  items.forEach(item => {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      optimizeHtmlHeadTagsRecursive(fullPath);
    } else if (item.endsWith('.html')) {
      optimizeHeadTags(fullPath);
    }
  });
}

function optimizeHeadTags(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');

  // 1. Ensure Google Fonts stylesheet remains non-blocking with media="print" onload="this.media='all'"
  content = content.replace(
    /<link rel="stylesheet" href="https:\/\/fonts\.googleapis\.com\/css2\?[^"]*" media="all" onload="this\.media='all'">/g,
    '<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Poppins:wght@600;700;800&display=swap" media="print" onload="this.media=\'all\'">'
  );

  // 2. Optimize CSS placement: after preconnects/viewport so network handshakes start immediately
  const stylesheetRegex = /<link rel="stylesheet"[^>]*href="\/assets\/[^>]*\.css"[^>]*>/g;
  const match = content.match(stylesheetRegex);

  if (match && match.length > 0) {
    const stylesheetTag = match[0];
    content = content.replace(stylesheetTag, '');
    
    const targetTag = content.indexOf('<!-- Google Fonts:');
    if (targetTag !== -1) {
      content = content.slice(0, targetTag) + stylesheetTag + '\n    ' + content.slice(targetTag);
    } else {
      const headIndex = content.indexOf('<head>');
      if (headIndex !== -1) {
        const insertPos = headIndex + 6;
        content = content.slice(0, insertPos) + '\n    ' + stylesheetTag + content.slice(insertPos);
      }
    }
  }

  fs.writeFileSync(filePath, content, 'utf8');
}

console.log('\n⚡ Optimizando orden de carga crítica de CSS en cabeceras...');
optimizeHtmlHeadTagsRecursive(distDir);
console.log('✅ Cabeceras optimizadas con éxito para FCP ultra rápido.');

console.log('\n=== LIMPIEZA POST-BUILD COMPLETADA CON ÉXITO ===');
