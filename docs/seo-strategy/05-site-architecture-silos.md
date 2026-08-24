# 🌳 Paso 3: Arquitectura Web en Silos & Topic Clusters — VitaBlue 2026

> **Actualizado con los 4 CSVs de Google Keyword Planner (3.145 Keywords Analizadas)**  
> Esta estructura organiza las URLs de VitaBlue en **árboles temáticos (silos)** para evitar la canibalización de palabras clave y concentrar la máxima autoridad de dominio hacia las conversiones.

---

## 📊 Datos Clave Extraídos de los CSVs de Google Keyword Planner

De las 3.145 palabras clave analizadas, los mayores volúmenes e intenciones de compra se concentran en:
* `seguros de salud` (50.000 búsquedas/mes | CPC: 4,02€ - 10,27€)
* `seguro medico privado` / `seguro salud` (5.000 búsquedas/mes | CPC: 3,27€ - 10,32€)
* `seguros de salud sin copagos` (5.000 búsquedas/mes | CPC: 4,51€ - 10,80€)
* `seguro medico visado españa` / `seguro para residencia en españa` (CPC: 2,50€ - 7,71€)
* `seguro medico para estudiantes extranjeros en españa` (CPC: 2,41€ - 6,45€)
* `seguro medico para extranjeros en españa` (500 búsquedas/mes | CPC: 2,30€ - 5,70€)
* `sanitas seguro medico` / `adeslas seguro medico` (5.000 búsquedas/mes cada una | CPC: 2,66€ - 6,56€)

---

## 🏛️ Estructura de Silos / Topic Clusters de VitaBlue

```text
https://www.vitablue.es/
│
├── 🏢 SILO 1: EXTRANJERÍA, VISADOS & RESIDENCIA (Foco Principal de Captación)
│   │
│   ├── [HUB PADRE] /productos/seguros-salud/seguro-salud-extranjeros/
│   │   └── KW Principal: "seguro de salud para extranjeros en españa" (500 búsquedas/mes | CPC 5,70€)
│   │   └── KW Secundarias: "seguro medico españa para extranjeros", "seguro medico residencia españa"
│   │
│   ├── [CLUSTER ESTUDIANTES] /productos/seguros-salud/seguro-medico-estudiantes/
│   │   ├── KW Principal: "seguro medico visado estudiante españa" (CPC 4,07€)
│   │   ├── KW Transaccionales: "seguro medico para estudiantes extranjeros en españa", "seguro para estudiantes extranjeros en españa baratos"
│   │   ├── [Blog Satélite 1]: /blog/requisitos-seguro-medico-visado-estudiante-espana/
│   │   └── [Blog Satélite 2]: /blog/seguro-medico-erasmus-master-espana/
│   │
│   ├── [CLUSTER NÓMADAS DIGITALES] /productos/seguros-salud/seguro-nomadas-digitales/
│   │   ├── KW Principal: "seguro visa nomada digital españa"
│   │   ├── KW Transaccionales: "seguro teletrabajo internacional españa uge", "seguro salud visa teletrabajo"
│   │   └── [Blog Satélite]: /blog/requisitos-seguro-visa-nomada-digital/
│   │
│   └── [CLUSTER TRÁMITES NIE / RESIDENCIA] /productos/seguros-salud/seguro-medico-para-el-nie/
│       ├── KW Principal: "seguro medico para residencia en españa" (CPC 4,65€)
│       └── KW Transaccionales: "seguro medico para el nie", "seguro medico renovacion nie", "seguro residencia no lucrativa"
│
├── 🛡️ SILO 2: SEGUROS DE SALUD PRIVADOS (Público General, Familias y Marcas)
│   │
│   ├── [HUB GENERAL] /productos/seguros-salud/
│   │   └── KW Principal: "seguros de salud" (50.000 búsquedas/mes | CPC 10,27€)
│   │   └── KW Secundarias: "seguro medico privado", "seguro de salud privado"
│   │
│   ├── [CLUSTER SIN COPAGOS] /productos/seguros-salud/seguros-de-salud-sin-copagos/
│   │   └── KW Principal: "seguros de salud sin copagos" (5.000 búsquedas/mes | CPC 10,80€)
│   │   └── KW Secundarias: "seguro medico sin copago", "seguro médico privado sin copago"
│   │
│   ├── [CLUSTER SANITAS] /productos/seguros-salud/seguros-sanitas/sanitas-mas-salud/
│   │   └── KW Principal: "sanitas seguro medico" / "sanitas precios" (5.000 búsquedas/mes)
│   │   └── KW Secundarias: "seguro salud sanitas", "sanitas mas salud coberturas y precios"
│   │
│   └── [CLUSTER MASCOTAS] /productos/seguros-salud/seguros-sanitas/sanitas-mascotas/
│       └── KW Principal: "seguro salud mascotas sanitas"
│
└── 🧮 SILO 3: HERRAMIENTAS & CONVERSIÓN RÁPIDA
    ├── /wizard/ ➔ "calcular seguro medico online", "cotizador seguro de salud"
    └── /sobre-nosotros/ ➔ "vitablue seguros opiniones", "correduria seguros extranjeros"
```

---

## 🎯 Matriz Definitiva de Asignación de Keywords (Anti-Canibalización)

| Página / URL Objetivo | KW Principal Exacta | KWs Secundarias Incluidas | Volumen / Competencia | CPC de Referencia |
|---|---|---|---|---|
| `/seguro-medico-estudiantes/` | `seguro medico visado estudiante españa` | `seguro para estudiantes extranjeros en españa`, `seguro medico estudiantes extranjeros precios baratos` | Alta (Estacional máx: Jul-Oct) | 2,41€ - 6,45€ |
| `/seguro-nomadas-digitales/` | `seguro visa nomada digital españa` | `seguro medico nomada digital ley startups`, `seguro medico visa teletrabajo` | Media / Crecimiento +900% | 1,50€ - 4,50€ |
| `/seguro-salud-extranjeros/` | `seguro de salud para extranjeros en españa` | `seguro medico para residencia en españa`, `seguro medico extranjeros sin copago` | 500 - 5.000 búsquedas/mes | 2,30€ - 7,71€ |
| `/seguros-de-salud-sin-copagos/` | `seguros de salud sin copagos` | `seguro medico sin copago`, `seguro privado de salud sin carencias` | 5.000 búsquedas/mes | 4,51€ - 10,80€ |
| `/seguros-sanitas/sanitas-mas-salud/` | `sanitas seguro medico` | `sanitas precios`, `seguro de salud sanitas`, `sanitas mas salud` | 5.000 búsquedas/mes | 2,66€ - 7,00€ |

---

## 🔗 Estrategia de Enlazado Interno (Link Juice Silo Flow)

1. **Top of Funnel (Artículos Informativos del Blog):**
   * Cada post del blog ataca dudas informativas y coloca enlaces contextuales directos con anchor text transaccional (`contratar seguro visado estudiante`, `calcular seguro médico`) apuntando a la landing del cluster.
2. **Middle of Funnel (Landing Pages Transaccionales):**
   * Resuelven las 4 objeciones clave (sin copagos, sin carencias, repatriación, certificado 24h) y canalizan el tráfico hacia WhatsApp y el Wizard.
3. **Bottom of Funnel (Wizard & WhatsApp):**
   * Cierre de venta inmediato.
