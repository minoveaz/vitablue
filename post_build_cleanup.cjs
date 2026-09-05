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
    if (content.includes('rel="canonical"')) return;
    content = content.replace('</head>', `    <link rel="canonical" href="${url}" />\n</head>`);
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
    content = content.replace(/<meta property="og:title" content="[^"]*"/i, `<meta property="og:title" content="${post.title}"`);
    content = content.replace(/<meta property="og:description" content="[^"]*"/i, `<meta property="og:description" content="${post.excerpt}"`);
    content = content.replace(/<meta name="twitter:title" content="[^"]*"/i, `<meta name="twitter:title" content="${post.title}"`);
    content = content.replace(/<meta name="twitter:description" content="[^"]*"/i, `<meta name="twitter:description" content="${post.excerpt}"`);

    // 4. Construct Schemas
    const resolvedImageUrl = post.featuredImage.startsWith('http')
      ? post.featuredImage
      : `https://www.vitablue.es${post.featuredImage}`;

    const jsonLdArticle = {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: post.title,
      description: post.excerpt,
      image: resolvedImageUrl,
      datePublished: post.date,
      dateModified: post.date,
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
          item: isEnglish ? 'https://www.vitablue.es/en' : 'https://www.vitablue.es',
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
