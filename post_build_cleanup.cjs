const fs = require('fs');
const path = require('path');

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
  const stylesheetRegex = /<link rel="stylesheet"[^>]*href="\/assets\/[^>]*\.css"[^>]*>/g;
  const match = content.match(stylesheetRegex);

  if (match && match.length > 0) {
    const stylesheetTag = match[0];
    content = content.replace(stylesheetTag, '');
    
    // Insert immediately after <head> to prioritize CSS download over JS preloads
    const headIndex = content.indexOf('<head>');
    if (headIndex !== -1) {
      const insertPos = headIndex + 6;
      content = content.slice(0, insertPos) + '\n    ' + stylesheetTag + content.slice(insertPos);
      fs.writeFileSync(filePath, content, 'utf8');
    }
  }
}

console.log('\n⚡ Optimizando orden de carga crítica de CSS en cabeceras...');
optimizeHtmlHeadTagsRecursive(distDir);
console.log('✅ Cabeceras optimizadas con éxito para FCP ultra rápido.');

console.log('\n=== LIMPIEZA POST-BUILD COMPLETADA CON ÉXITO ===');
