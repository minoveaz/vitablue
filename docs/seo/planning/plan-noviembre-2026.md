# Plan SEO y calendario editorial — noviembre de 2026

**Estado:** en ejecución desde el lunes 2 de noviembre de 2026
**Periodo:** 2–30 de noviembre de 2026
**Responsables por función:** SEO/editorial, contenido bilingüe, desarrollo y revisión de negocio
**Objetivo operativo:** mejorar páginas con visibilidad pero bajo rendimiento y completar cuatro entregas editoriales bilingües: dos parejas nuevas y dos actualizaciones de contenido existente.

> Este documento concreta el trabajo de noviembre a partir de Search Console, el inventario actual del blog y el flujo de publicación programada. Ajusta la propuesta de noviembre del plan de marketing 2026–2027: la guía de reagrupación familiar ya se publicó en octubre y no debe repetirse como artículo nuevo.

## 1. Resumen ejecutivo

Noviembre se organiza en dos líneas paralelas:

1. **Mejoras SEO en páginas existentes**, priorizando intención de búsqueda, contenido, snippets, enlazado y conversión móvil.
2. **Cuatro entregas editoriales bilingües**, empezando hoy, lunes 2 de noviembre: dos parejas nuevas y dos actualizaciones ES/EN. La pareja familiar se publica hoy mediante una ejecución manual; las siguientes entregas mantienen la cadencia semanal.

El workflow `.github/workflows/scheduled-publish.yml` se ejecuta los lunes a las 08:00 UTC (09:00 en España peninsular durante noviembre). La ejecución automática de hoy ya pasó; la pareja familiar requiere integración en `main` y publicación manual. Para las siguientes semanas, ambas versiones deben estar terminadas, revisadas y fusionadas en `main` antes del lunes correspondiente.

## 2. Línea base y criterios de lectura

### Search Console

Últimos 90 días con datos disponibles al 1 de noviembre: **1 de agosto–30 de octubre de 2026**.

| Indicador | Línea base |
|---|---:|
| Clics orgánicos | 181 |
| Impresiones | 52.774 |
| CTR | 0,34 % |
| País con más visibilidad | España: 42.278 impresiones, 61 clics, CTR 0,14 % |

La posición media global de 35,8 que imprime el script local es una media no ponderada de las posiciones diarias; no se usará como objetivo contractual. Para priorizar, se utilizarán los datos de cada URL y consulta, y se compararán ventanas equivalentes.

### Estado técnico observado en producción

- Home, blog, `robots.txt` y `sitemap.xml` responden con HTTP 200.
- El sitemap público contiene **81 URLs**; 38 corresponden a rutas del blog.
- El sitemap permite rastrear las rutas públicas y excluye las áreas de wizard/resultados.
- La API de sitemaps de Search Console muestra última descarga/envío el **26 de octubre**, 0 errores, 0 advertencias, 77 URLs enviadas y 0 indexadas. Ese último dato no representa el total indexado del sitio: las inspecciones URL individuales realizadas el 1 de noviembre devolvieron páginas `PASS / Submitted and indexed`. Mantener la diferencia 81/77 como verificación pendiente, no como prueba de desindexación.
- Lighthouse móvil de laboratorio (1 de noviembre): home **74** de rendimiento, blog **70**; accesibilidad, buenas prácticas y SEO **100** en ambas. LCP: home **4,0 s**, blog **4,6 s**; CLS **0**, TBT **0 ms**. No son datos de campo CrUX.
- En el blog, Lighthouse estima ahorros de 73 KB en imágenes, 78 KB en JavaScript no utilizado y 16 KB en CSS no utilizado. Medir antes de cambiar código y evitar regresiones visuales.

### Rendimiento SEO de páginas prioritarias

Datos de Search Console para la misma ventana de 90 días:

| Prioridad | Página o grupo | Impresiones | Clics | CTR | Posición | Lectura |
|---|---|---:|---:|---:|---:|---|
| P0 | Landing EN de seguros para expatriados | 3.854 | 1 | 0,03 % | 47,4 | Alta visibilidad, ajuste de intención y contenido antes de retocar solo el snippet. |
| P0 | Landing EN de nómadas digitales | 986 | 2 | 0,20 % | 37,3 | Revisar correspondencia entre consultas, hero, pruebas de cobertura y CTA. |
| P1 | Guía ES de requisitos de seguro para visado de estudiante | 1.065 | 3 | 0,28 % | 25,3 | Mejorar respuesta inicial, title/description y enlaces al precio y certificado. |
| P1 | Guía EN de requisitos de seguro para visado de estudiante | 2.073 | 13 | 0,63 % | 19,7 | Mantener el enfoque verificable y mejorar snippet/enlazado. |
| P1 | Comparativa ES de aseguradoras | 1.268 | 10 | 0,79 % | 26,4 | Clarificar alcance, método y fecha de comparación. |
| P1 | Artículo ES sobre nómadas digitales | 846 | 5 | 0,59 % | 8,8 | Buena posición relativa; trabajar CTR sin deshacer la relevancia conseguida. |
| P1 | Guía ES sobre copagos | 1.229 | 1 | 0,08 % | 31,0 | Revisar intención y diferenciación frente a las páginas de producto. |
| P2 | Artículo EN sobre aseguradoras para visado de estudiante | 744 | 12 | 1,61 % | 5,6 | Proteger la página que ya obtiene clics y reforzar enlaces al siguiente paso. |
| P2 | Comparativa EN de aseguradoras | 234 | 5 | 2,14 % | 19,9 | Sigue indexada, pero GSC indicó último rastreo el 28 de agosto; verificar el recrawl tras su actualización. |

La URL histórica `/productos/seguro-medico-estudiantes-extranjeros-espana.html` registra 4.657 impresiones y 2 clics, pero redirige en un salto a la landing canónica de estudiantes. **No optimizar el title de la URL redirigida**: verificar métricas de la URL de destino, actualizar enlaces internos que apunten al alias y conservar la redirección.

## 3. Acciones SEO en páginas existentes

| Ventana | Prioridad | Acciones | Criterio de aceptación |
|---|---|---|---|
| 2–6 nov | P0 | Revisar la landing EN de expatriados contra sus consultas: intención, H1/hero, cobertura, límites y exclusiones, prueba de confianza, CTA y enlaces al contenido explicativo. Verificar cada precio o afirmación comercial con documentación vigente. | La página responde primero a la intención principal; información verificable y CTA visible en móvil; title/description fieles a la oferta. |
| 2–13 nov | P0 | Revisar la landing EN de nómadas digitales: separar requisitos generales de los dependientes del caso; enlazar a la guía UGE y al contenido de documentación solo cuando sea pertinente. | Mensajes legales matizados; no prometer aceptación universal; CTA y enlaces funcionan. |
| 2–13 nov | P1 | Optimizar juntas las guías ES/EN de requisitos para visado de estudiante. Revisar la primera respuesta, title/description, fuentes consulares oficiales, enlaces a precios/certificados y alternates recíprocos. | Las dos versiones conservan el mismo alcance, fecha editorial coherente y enlaces ES↔EN correctos. |
| 9–20 nov | P1 | Revisar la guía de copagos: definir el concepto sin claims absolutos, explicar ejemplos solo con tarifas actuales y enlazar a comparativas/productos sin duplicar la página transaccional. | Contenido útil y diferenciado; snippets alineados con consultas; tablas con fecha y fuente cuando se usen. |
| 9–20 nov | P1 | Revisar artículo y landing de nómadas digitales como un único clúster. La guía resuelve dudas informativas; la landing convierte. Añadir enlaces contextuales en ambos sentidos. | Intención diferenciada, sin dos páginas compitiendo por el mismo title/H1; enlaces internos válidos. |
| 16–27 nov | P1 | Revisar la comparativa ES/EN: metodología, alcance de planes y fecha de consulta; corregir diferencias de canonical/hreflang y solicitar un nuevo rastreo manual para la EN si sigue con rastreo antiguo. | Hechos basados en documentos vigentes; las dos URLs canónicas coinciden con los alternates publicados. |
| 2–30 nov | P1 | Ejecutar mejoras de rendimiento en home y blog priorizando imágenes responsivas y carga diferida segura; revisar CSS/JS no utilizado antes de eliminar código. | Volver a medir Lighthouse móvil; no empeora accesibilidad, CLS ni funcionalidad. |
| 2–30 nov | P2 | Auditar el destino de la URL antigua de estudiantes: inspección GSC, canonical, enlaces internos y presencia única del destino en sitemap. | Redirección de un salto conservada; sitemap y enlaces internos usan solo la canonical. |
| 23–30 nov | P2 | Revisar el estado de sitemap en Search Console y contrastar el conjunto enviado con las 81 rutas públicas actuales. Inspeccionar URLs representativas y registrar qué devuelve GSC. | Sin errores de sitemap; diferencia 81/77 explicada o escalada con evidencias. No interpretar `0 indexadas` del resumen como estado global. |

### Orden de trabajo para cada página

1. Exportar de GSC consultas y páginas de la URL (ventana de 90 días y, cuando haya datos, últimos 28 días frente a los 28 anteriores).
2. Confirmar la intención con consultas, URL canónica e inspección de indexación; separar URLs antiguas/redirigidas de las canónicas.
3. Decidir si hace falta mejorar contenido, title/description, enlaces o conversión. No cambiar todos los elementos a la vez sin registrar el experimento.
4. Registrar fecha, cambio y baseline en `docs/seo/experiments/seo-experiments-log.md`.
5. Revisar a los 14 días como señal temprana y a los 28 días para una primera comparación; no atribuir causalidad a cambios pequeños con pocas impresiones.

## 4. Calendario editorial bilingüe

Las ideas siguientes son briefs de trabajo, no permiso para afirmar coberturas o precios no comprobados. Antes de redactar o actualizar, validar consultas específicas en GSC y revisar los resultados actuales para confirmar que no aparece una página competidora nueva. El análisis temático del periodo 1 de agosto–30 de octubre encontró 2.693 impresiones en 83 consultas visibles que coinciden con términos de familia y 902 impresiones en 141 consultas visibles relacionadas con seguro de viaje; son coincidencias amplias de consultas devueltas por GSC, no volúmenes de búsqueda exactos ni estimaciones de mercado. Las coincidencias de consultas relacionadas con “80/ochenta” y “padres/parents” registraron 105 y 100 impresiones visibles respectivamente; son grupos potencialmente solapados. Las coincidencias de repatriación registraron 6 impresiones en 2 filas. Ninguna de estas filas coincidentes registró clics.

| Publicación | Tema ES / EN | Intención y evidencia | Diferenciación y enlaces del clúster |
|---|---|---|---|
| **Lun 2 nov — nuevo, publicación manual pendiente de integración** | **ES:** Seguro médico familiar en España: comparar precios y coberturas. **EN:** Family Health Insurance in Spain: Compare Costs and Cover. | Intención comercial de comparación/precio. GSC muestra una señal temática amplia (2.693 impresiones en consultas visibles relacionadas con familia durante agosto–octubre), con visibilidad pero sin clics en esas coincidencias. | Comparar el coste y las condiciones para las mismas personas; explicar copagos, cuadro médico y términos individuales sin publicar tarifas ni prometer descuentos. Diferenciar de reagrupación familiar y enlazar a la guía existente y a la comparativa general. Fuentes oficiales de ASISA y Sanitas consultadas el 2 nov. |
| **Lun 9 nov — nuevo** | **ES:** Seguro de viaje o seguro médico privado para vivir en España: diferencias y cuándo revisar cada uno. **EN:** Travel insurance vs private health insurance for living in Spain. | GSC muestra 902 impresiones en consultas visibles relacionadas con seguros de viaje durante agosto–octubre; existe una oportunidad temática, pero hay que diferenciarla de las guías de visado que ya comparan ambos productos. | Dirigirlo a personas que se trasladan o viven en España: duración, red y forma de acceso a la asistencia, límites, exclusiones, renovación y uso previsto. No afirmar que todo seguro de viaje sea inválido ni convertir una instrucción consular particular en regla universal. Enlazar a expatriados y, como casos concretos, a estudiante, NIE/TIE y residencia no lucrativa. |
| **Lun 16 nov — actualizar** | Actualizar la pareja existente **ES:** Seguro Médico para Mayores de 65 Años en España / **EN:** Health Insurance in Spain for Expats & Seniors Over 65. | No crear una guía nueva para mayores de 80: el artículo ES ya muestra una opción “mayores de 80” y el EN trata límites senior, aunque la cobertura exacta de ambas versiones debe alinearse. Las coincidencias GSC de “80/ochenta” y “padres/parents” son de bajo volumen (105 y 100 impresiones visibles, respectivamente, sin clics). | Verificar edad máxima de alta, productos, primas, selección médica, limitaciones y disponibilidad con documentación vigente. Retirar rangos o promesas no confirmables; explicar que cumplir 80 años no garantiza elegibilidad y aclarar si >80 solo admite consulta individual. Enlazar a reagrupación familiar y a la nueva guía familiar. Conservar `date` y cualquier `publishDate` existente; registrar `updatedAt` en ES/EN si la revisión es sustantiva. |
| **Lun 23 nov — actualizar** | Actualizar la información ES/EN sobre repatriación en las guías existentes de visado de estudiante, nómada digital y residencia no lucrativa. | No publicar una guía general nueva por ahora: las consultas visibles coincidentes suman 6 impresiones en agosto–octubre y el concepto ya aparece en las guías actuales. La prioridad es precisión factual, no ampliar el número de URLs. | Distinguir traslado médico de restos mortales; precisar qué depende de la póliza y qué exige cada consulado o permiso. Citar fuentes oficiales aplicables y condiciones del producto; eliminar afirmaciones universales no sustentadas. Revisar ES/EN y enlaces entre las guías del clúster. Mantener fechas de publicación y actualizar `updatedAt` cuando corresponda. |

### Guardas anti-canibalización

- La pareja de **reagrupación familiar** ya tiene `publishDate: 2026-10-19`; el artículo familiar del 2 nov. se enfoca en comparación comercial, no repite la guía de trámite.
- Las guías de **residencia de larga duración** y **cambio de seguro sin carencias** también se publicaron en octubre; actualizar esas URLs si hay un problema de calidad, no crear duplicados en noviembre.
- El contenido de noviembre no debe competir con la landing de expatriados: artículos informativos responden dudas concretas y enlazan a la landing comercial.
- No crear un artículo separado para mayores de 80: actualizar la pareja senior existente para que la información ES/EN esté alineada y sustentada por evidencia actual.
- No crear por ahora una guía independiente de repatriación: revisar las afirmaciones que ya existen y comprobar si aparece demanda diferenciada en futuras consultas.
- El artículo de seguro de viaje debe tener una intención general de vida/traslado a España, claramente distinta de las respuestas específicas sobre visados.
- Las dos versiones de cada pareja se publican el mismo día, con `alternateSlug` recíproco y la misma `publishDate`.

## 5. Producción y publicación

### Semana de publicación y producción: 2–6 de noviembre

- **Lun 2 (hoy):** completar la revisión factual de la pareja familiar, integrar ambas versiones en `utils/blogData.ts`, sincronizar sitemap/rutas, validar el build y publicar manualmente tras integrar el cambio en `main`. Comprobar las URLs públicas, canonicals, alternates y sitemap.
- **Mar 3–mié 4:** reunir fuentes oficiales para el artículo sobre seguro de viaje y salud para vivir en España; fijar el alcance y empezar los borradores ES/EN.
- **Jue 5:** revisión factual/editorial del nuevo artículo de viaje; definir cambios concretos en la guía senior y las menciones de repatriación.
- **Vie 6:** cerrar la pareja de viaje, validar enlaces y correspondencia bilingüe, y dejarla lista en `main` para el workflow del lunes 9.

La ejecución automática del lunes 2 ya pasó; por eso la pareja familiar requiere integración y publicación manual hoy. Las siguientes entregas vuelven a la cadencia semanal del workflow.

### Cadencia semanal

| Fecha de publicación o actualización | Trabajo preparado a más tardar | Actividad de la semana |
|---|---|---|
| 2 nov (manual) | 2 nov | Publicar la nueva pareja de seguro familiar; comprobar deploy, sitemap, canonicals y alternates. La indexación no está garantizada. |
| 9 nov | Vie 6 nov | Publicar la nueva pareja sobre seguro de viaje vs. seguro de salud para vivir en España; comprobar deploy, sitemap, canonicals y alternates. |
| 16 nov | Vie 13 nov, fuera de `main` | Preparar la actualización de mayores de 65; conservar fechas originales, registrar `updatedAt` y verificar claims. Integrar y desplegar manualmente el día 16. |
| 23 nov | Vie 20 nov, fuera de `main` | Preparar las referencias de repatriación en guías existentes ES/EN. Integrar y desplegar manualmente el día 23. |

El workflow semanal compila desde `main`, aplica la visibilidad según `publishDate`, regenera el sitemap, ejecuta controles de calidad y build/prerender, y despliega. Las parejas nuevas pueden integrarse por adelantado con fecha futura. Las actualizaciones de artículos existentes no deben recibir un `publishDate` nuevo y no se pueden dejar en `main` antes de tiempo: conservar su fecha original, preparar los cambios fuera de `main` e integrarlos el día acordado; usar `updatedAt` solo cuando el cambio editorial lo justifique. La notificación automática del workflow no equivale a una solicitud de indexación URL por URL.

### Campos editoriales obligatorios para nuevas parejas

- `slug` distinto y estable para cada idioma, `lang` correcto y `alternateSlug` recíproco.
- `date` visible coherente en ambos idiomas y `publishDate` ISO idéntica en la pareja.
- `updatedAt` ISO cuando se actualice el contenido editorial.
- En una actualización, conservar `date`/`publishDate` originales; cambiar `updatedAt` únicamente si hubo una revisión sustantiva y real.
- Autoría solo con una persona real y atribución aprobada. No añadir `editorialReviewer` si no existe una revisión efectuada por alguien identificable.
- Fuentes oficiales enlazadas junto a las afirmaciones legales; documentos de aseguradoras para tarifas, edades, coberturas y exclusiones.
- Diferenciar requisitos generales de los específicos de consulado, permiso o situación individual.
- Enlaces internos contextuales al menos a una guía del clúster y a la página comercial pertinente; no forzar anchors repetitivos.

## 6. Checklist de calidad por release

Antes de fusionar cada lote:

- [ ] Pareja ES/EN revisada y con mismo alcance, publicación y alternates recíprocos.
- [ ] Título y descripción únicos, fieles al contenido y al idioma.
- [ ] Un solo H1 y contenido principal visible en prerender.
- [ ] Canonical correcta y alternates `hreflang` coherentes.
- [ ] Fuentes oficiales y condiciones comerciales verificadas; no hay garantías absolutas sin evidencia.
- [ ] Enlaces internos, CTA y enlaces a fuentes responden correctamente.
- [ ] Autor y revisor no están inventados.
- [ ] `npm run sync-blog` y `npm run build`.
- [ ] `npm run typecheck`, `npm run validate:ssg`, `npm run validate-static-seo`, `npm run validate-internal-links` y `git diff --check`.
- [ ] Revisar el sitemap generado; confirmar que añade solo rutas publicadas y que los alternates son recíprocos.
- [ ] Confirmar ejecución exitosa del workflow programado y disponibilidad de las URLs en producción.

Después del deploy:

- [ ] Comprobar HTTP 200, canonical, metadatos y HTML prerenderizado de las dos URLs.
- [ ] Verificar el sitemap público y su estado en Search Console.
- [ ] Inspeccionar ambas URLs con URL Inspection API de solo lectura.
- [ ] Si se necesita acelerar una URL concreta, usar la acción **Solicitar indexación** en la interfaz de inspección de Search Console; no prometer fecha ni resultado de indexación.

## 7. Seguimiento y medición

| Momento | Medición |
|---|---|
| Antes del cambio | Guardar impresiones, clics, CTR, posición por URL y consultas; anotar fecha de inspección y estado de canonical. |
| Cada lunes | Revisar workflow, publicación esperada y sitemap; registrar fallos y resolverlos antes de la siguiente ejecución. |
| 14 días después | Señal temprana: rastreo, estado de indexación, consultas nuevas y dirección del CTR. No declarar ganador/perdedor con muestras pequeñas. |
| 28 días después | Comparar ventana posterior con una ventana anterior equivalente por URL e idioma; decidir mantener, iterar o revertir el experimento. |
| 16 nov | Primera revisión técnica de las publicaciones del 2 y 9 nov.; comprobar rastreo, sitemap y metadatos sin interpretar aún el rendimiento como concluyente. |
| 7 dic | Primera comparación de rendimiento de las publicaciones del 2 y 9 nov. y de las actualizaciones del 16/23 nov. |

**Indicadores de éxito de noviembre:**

- Dos parejas bilingües nuevas y dos parejas existentes revisadas en ES/EN; si un brief no supera la revisión factual/anti-canibalización, ajustar el alcance y documentarlo antes de su fecha.
- Cero errores de prerender, sitemap, enlaces internos, canonical o hreflang atribuibles a los cambios.
- Las páginas prioritarias reciben cambios registrados y comparables; el CTR y los clics se analizan contra baseline por URL, no contra una media global no ponderada.
- Rendimiento móvil medido de nuevo después de optimizaciones, sin regresión de accesibilidad ni CLS.
- Las inspecciones de GSC se registran como estado de rastreo/indexación, no como garantía de inclusión en resultados.

## 8. Riesgos y decisiones de control

| Riesgo | Control |
|---|---|
| Contenido duplicado con el calendario de octubre o artículos existentes | Diferenciar la guía familiar de la de reagrupación; reutilizar la guía senior en vez de crear otra para mayores de 80; no abrir una URL de repatriación sin intención diferenciada. |
| Requisitos de seguro o visado tratados como universales | Citar la fuente aplicable y aclarar las diferencias por permiso, consulado, oficina y circunstancias personales. |
| Tarifas o edades de admisión desactualizadas | Validar contra condiciones vigentes del producto antes de redactar; si no hay evidencia, retirar precio/afirmación o aplazar ese brief. |
| Primera publicación no llega al workflow | La ejecución automática del 2 nov ya pasó; integrar la pareja familiar en `main` y realizar publicación manual. Verificar el despliegue antes de anunciarla como publicada. |
| Search Console reporta cifras de sitemap incoherentes | Conservar el sitemap de 81 URLs si pasa validadores; comparar URLs concretas y revisar estado en GSC. No volver a enviar en bucle ni concluir que el sitio no está indexado. |
| Resultados orgánicos tardan en reflejar cambios | Evaluar rastreo pronto, pero esperar ventanas comparables de 14–28 días para rendimiento; revisar las publicaciones del 2 y 9 nov. en diciembre. |

## 9. Estado y seguimiento al 2 de noviembre

- [x] Ritmo acordado: una pareja ES/EN por semana.
- [x] Alcance editorial revisado: dos parejas nuevas (familia y seguro de viaje vs. salud) y dos actualizaciones bilingües (senior 65+ y repatriación en guías existentes).
- [x] Carpeta documental: `docs/seo/`.
- [x] Inicio del trabajo fijado para el lunes 2 de noviembre; primera publicación familiar solicitada para hoy, mediante ejecución manual porque el cron ya pasó.
- [x] Línea histórica agregada GSC agosto–octubre y marco de métricas documentados.
- [x] Pareja familiar ES/EN añadida a `utils/blogData.ts` con fecha de publicación común `2026-11-02`.
- [x] Reconciliado el calendario previo: reagrupación familiar ES/EN ya publicada el 19 de octubre.
- [x] Pareja familiar redactada con enfoque comparativo, sin publicar tarifas ni prometer descuentos; fuentes oficiales de ASISA y Sanitas consultadas el 2 de noviembre.
- [x] Pareja sobre seguro de viaje frente a seguro de salud preparada ES/EN con `publishDate: 2026-11-09`, imagen propia y fuentes oficiales de proveedores.
- [ ] Asignar responsables editoriales reales.
- [ ] Completar baseline por URL, consulta e idioma para las páginas del primer lote.
- [ ] Integrar la pareja familiar en `main`, ejecutar la publicación manual y comprobar las dos URLs públicas.
