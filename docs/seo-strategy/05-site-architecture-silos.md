# 🌳 Paso 3: Arquitectura Web en Silos & Topic Clusters — VitaBlue 2026

> **Basado en el análisis de los CSVs de Google Keyword Planner y el Benchmark Competitivo.**  
> Esta estructura organiza las URLs de VitaBlue en **árboles temáticos (silos)** para evitar la canibalización de palabras clave y concentrar la máxima autoridad de dominio hacia las conversiones.

---

## 🏛️ Estructura de Silos / Topic Clusters de VitaBlue

```text
https://www.vitablue.es/
│
├── 🏢 SILO 1: SEGUROS PARA EXTRANJERÍA & VISADOS (Principal Motor de Tráfico)
│   ├── Hub: /productos/seguros-salud/seguro-salud-extranjeros/ (KW: seguro de salud para extranjeros en españa)
│   │
│   ├── Cluster 1: Estudiantes
│   │   ├── Landing Transaccional: /productos/seguros-salud/seguro-medico-estudiantes/ (KW: seguro medico visado estudiante españa)
│   │   ├── Artículo Satélite 1: /blog/requisitos-seguro-medico-visado-estudiante-espana/ (KW: requisitos seguro medico visado estudiante)
│   │   └── Artículo Satélite 2: /blog/seguro-medico-erasmus-master-espana/ (KW: seguro medico erasmus españa)
│   │
│   ├── Cluster 2: Nómadas Digitales & Teletrabajo
│   │   ├── Landing Transaccional: /productos/seguros-salud/seguro-nomadas-digitales/ (KW: seguro medico visa nomada digital españa)
│   │   └── Artículo Satélite: /blog/requisitos-seguro-visa-nomada-digital/ (KW: requisitos seguro teletrabajo internacional uge)
│   │
│   ├── Cluster 3: Trámites NIE / TIE & Residencia
│   │   ├── Landing Transaccional: /productos/seguros-salud/seguro-medico-para-el-nie/ (KW: seguro medico para el nie y residencia)
│   │   └── Landing Transaccional: /productos/seguros-salud/seguro-residencia-no-lucrativa/ (KW: seguro medico residencia no lucrativa)
│
├── 🛡️ SILO 2: SEGUROS DE SALUD PRIVADOS (Público Nacional y Familias)
│   ├── Hub: /productos/seguros-salud/ (KW: contratar seguro de salud privado)
│   ├── Landing: /productos/seguros-salud/seguros-de-salud-sin-copagos/ (KW: seguros de salud sin copagos)
│   ├── Landing: /productos/seguros-salud/seguros-sanitas/sanitas-mas-salud/ (KW: sanitas mas salud coberturas y precios)
│   └── Landing: /productos/seguros-salud/seguros-sanitas/sanitas-mascotas/ (KW: seguro de salud para mascotas sanitas)
│
└── 🧮 SILO 3: HERRAMIENTAS DE COTIZACIÓN (Filtro de Conversión)
    ├── /wizard/ (KW: cotizador seguro medico online)
    └── /comparador/ (KW: comparar precios seguros medicos)
```

---

## 🎯 Matriz de Keywords y Prevención de Canibalización

| URL Objetivo | Keyword Principal | Volumen Estimado (ES + LATAM) | Intención | Cobertura / Diferencial |
|---|---|---|---|---|
| `/productos/seguros-salud/seguro-medico-estudiantes/` | `seguro medico visado estudiante españa` | 5.000+ / mes | Transaccional | Sin copagos, sin carencias, repatriación, certificado 24h. |
| `/productos/seguros-salud/seguro-nomadas-digitales/` | `seguro visa nomada digital españa` | 2.500+ / mes | Transaccional | Ley de Startups / UGE, certificado para teletrabajo internacional. |
| `/productos/seguros-salud/seguro-salud-extranjeros/` | `seguro de salud para extranjeros en españa` | 5.000+ / mes | Transaccional / Hub | Hub multiperfil (estudiante, nómada, no lucrativa, reagrupación). |
| `/productos/seguros-salud/seguros-sanitas/sanitas-mas-salud/` | `sanitas seguro medico precio` | 5.000+ / mes | Transaccional / Marca | Cuadro médico completo Sanitas + Blua digital. |
| `/blog/requisitos-seguro-medico-visado-estudiante-espana/` | `requisitos seguro medico visado estudiante` | 1.500+ / mes | Informativa | Guía paso a paso de lo que exige el consulado (enlaza al cotizador). |

---

## 🔗 Estrategia de Enlazado Interno (Link Juice)
1. **Los artículos de blog** (`/blog/...`) resuelven dudas legales y colocan un banner/CTA apuntando siempre a la landing transaccional (`/seguro-medico-estudiantes/`).
2. **La landing transaccional** enlaza a WhatsApp y al `/wizard/` para cerrar la venta.
3. **El Footer y Navbar** conectan limpiamente los Hubs de cada Silo.
