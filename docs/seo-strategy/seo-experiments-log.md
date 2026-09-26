# VitaBlue - Registro Continuo de Experimentos SEO y AEO (Log)

> Basado en la metodología de optimización iterativa de 1 cambio a la vez por página dinero (*Killer Page*), con seguimiento estricto de Search Console (GSC) y conversión.

---

## 📌 Experimento #01: Optimización de Páginas Dinero (Colombia y Perú)

* **ID Experimento:** `EXP-2026-09-26-LATAM-KILLER-PAGES`
* **Fecha de Implementación:** 26 de septiembre de 2026
* **Fecha de Primera Revisión:** 10 de octubre de 2026 (14 días de maduración en Google)
* **Páginas Objetivo:**
  1. `https://www.vitablue.es/productos/seguros-salud/seguro-medico-estudiantes/colombia/`
  2. `https://www.vitablue.es/productos/seguros-salud/seguro-medico-estudiantes/peru/`
* **Página Fuente de Tráfico (Enlazado Interno):**
  - `https://www.vitablue.es/blog/rechazo-visado-espana-devolucion-seguro-medico/` (Posición 5.7 en Google, CTR 4.92%)

---

### 📊 Línea Base (Baseline al 26 de Septiembre de 2026)

Métricas oficiales extraídas vía Google Search Console API (ventana 28 días):

| Métrica | 🇨🇴 Colombia | 🇵🇪 Perú |
| :--- | :---: | :---: |
| **Impresiones (28d)** | 149 | 81 |
| **Clics (28d)** | 2 | 0 |
| **CTR Medio** | 1.34% | 0.00% |
| **Posición Media** | 33.1 | 22.7 |
| **Consultas Principales** | Visado estudiante España Bogotá, seguro Asisa visado | Seguro médico estudiantes que requieren visado, visado tipo D, larga estancia |
| **Estado Indexación** | 🟢 PASS (Submitted & Indexed) | 🟢 PASS (Submitted & Indexed) |

---

### 🛠️ Cambios Implementados

1. **Optimización de Títulos y Metadatos (Pase 1):**
   * **Colombia:**
     * *Title:* `Seguro Médico Visado España en Colombia desde 35€ (~150.000 COP) | VitaBlue`
     * *Description:* `Póliza 100% homologada para el Consulado de España en Bogotá y BLS Colombia. Sin copagos ni carencias, certificado oficial en 24h y 100% devolución si te deniegan el visado.`
   * **Perú:**
     * *Title:* `Seguro Médico Visado Estudiante España en Perú desde 35€ (~140 S/) | VitaBlue`
     * *Description:* `Seguro médico oficial para Visado Tipo D y estudios en el Consulado de España en Lima (BLS). Sin copagos, repatriación completa a Perú, certificado en 24h y garantía de reembolso.`

2. **Formato AEO (Answer Engine Optimization) (Pase 2):**
   * Rediseño de las FAQs consulares: Primera frase directa y concisa respondiendo a la duda de extranjería, seguida de la explicación técnica.
   * Inclusión explícita de consultas reales detectadas en GSC (*Visado Tipo D*, *visados de larga estancia*, *rechazo de seguros de viaje / Assist Card en BLS Miraflores y Bogotá*).

3. **Inyección en Build Estático (SSG Automation):**
   * Actualizado [post_build_cleanup.cjs](file:///Users/minoveaz/Documents/Proyectos/Estar%20Protegidos/vitablue-v2/post_build_cleanup.cjs) con `injectConsularLandingMetadataAndSchemas()` para garantizar que los archivos HTML pre-renderizados en producción contengan los títulos, descripciones y esquemas `GovernmentService`, `BreadcrumbList` y `FAQPage` sin depender de JavaScript en el cliente.

4. **Enlazado Interno desde el Artículo Ganador (Pase 4):**
   * En `/blog/rechazo-visado-espana-devolucion-seguro-medico/` (Posición Top 5 en Google), se integró una sección de enlaces regionales directos hacia las guías de Colombia, Perú, Argentina y México.

---

### 🎯 Objetivos y Criterio de Éxito (a 14 días: 10 de Octubre de 2026)

* **Perú:**
  * Pasar de 0 a $\ge$ 3 clics en 14 días.
  * Mejorar la posición media de 22.7 a $\le$ 18.0 (entrar en página 2 / rozar página 1).
  * CTR superior al 2.0% en búsquedas de visado de estudiante.
* **Colombia:**
  * Mantener el CTR $> 1.5\%$ y duplicar clics (de 2 a $\ge$ 5 clics).
  * Reducir la posición media de 33.1 a $\le$ 25.0.

---

### 📝 Resultados y Registro de Conclusiones (A completar el 10/10/2026)
* *Clics obtenidos:* [Pendiente]
* *Impresiones:* [Pendiente]
* *CTR final:* [Pendiente]
* *Posición final:* [Pendiente]
* *Veredicto:* [Acierto / Ajuste adicional]
