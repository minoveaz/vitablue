# Track: Document Intelligence - Configuración Modular de Esquemas y Reglas de Negocio

**ID:** `document-intelligence-configurable-schemas-and-rules`  
**Fecha de Creación:** 2026-08-19  
**Estado:** En definición  
**Rama:** `feature/document-intelligence-schemas-and-rules`  
**Áreas:** `[backoffice, document-intelligence, idp, ai, validation, rules-engine, loopdev]`  

---

## 1. Objetivo & Visión

Evolucionar el módulo de **Document Intelligence** desde una herramienta con campos prefijados a una **Plataforma Extensible de Procesamiento Inteligente de Documentos (IDP - Intelligent Document Processing)** orientada a esquemas (*Schema-Driven*).

El sistema se divide en **dos submódulos de configuración independientes y desacoplados**:

```
                              DOCUMENT INTELLIGENCE
                                        │
        ┌───────────────────────────────┴───────────────────────────────┐
        ▼                                                               ▼
  SUBMÓDULO 1:                                                   SUBMÓDULO 2:
  Configuración de Extracción                                     Reglas de Negocio & Validación
  (Esquemas y Campos por Documento)                               (Deterministas + Semánticas)
        │                                                               │
        ├─ Catálogo de Documentos (Pasaporte, DNI, NIE...)              ├─ Catálogo Determinista (0ms, Costo $0)
        ├─ Definición de Campos (tipo, required, prompt hint)            │  (Módulo 23, ICAO, Fechas, Regex, Edades)
        └─ Generación Dinámica de Structured Outputs                    └─ Reglas Semánticas con LLM
                                                                           (Juicio contextual, firmas, coberturas)
```

---

## 2. Submódulo 1: Configuración de Extracción de Datos (Document Schemas)

Permite definir dinámicamente qué campos y estructuras de datos deben extraerse para cada tipo de documento, sin necesidad de modificar código TypeScript.

### 2.1 Catálogo Inicial de Documentos (Fase 1)
1. **Pasaporte Internacional (ICAO TD3):** Zona visual + MRZ de 44 caracteres (1 cara).
2. **DNI Español:** Número, letra, soporte IDESP, validez, domicilio (2 caras: anverso + reverso).
3. **NIE Español:** Número de extranjero (X/Y/Z), soporte, nacionalidad, validez (2 caras).

### 2.2 Extensibilidad a Futuros Documentos (Fase 2+)
* **Legal / Corporativo:** Acta de Constitución de Empresa (CIF, razón social, administradores, capital, objeto social, notario).
* **Médico / Salud:** Analítica de Sangre de Paciente (leucocitos, glucosa, colesterol, valores de referencia, diagnóstico).
* **Financiero / Seguros:** Pólizas previas, recibos bancarios, justificantes de empadronamiento.

### 2.3 Modelo de Datos del Esquema (`DocumentTypeSchema`)

```typescript
export interface DocumentFieldDefinition {
  key: string;                                    // ID técnico único (ej: 'documentNumber', 'leucocitos')
  label: string;                                  // Etiqueta visual (ej: 'Número de DNI', 'Leucocitos')
  dataType: 'string' | 'date' | 'number' | 'boolean' | 'select' | 'mrz' | 'table';
  required: boolean;                              // Si es obligatorio para dar por válida la extracción
  extractionHint?: string;                        // Pista para el LLM (ej: 'Busca el IDESP en el lateral derecho')
  validationRegex?: string;                       // Patrón regex opcional para validación inmediata
  aliases?: string[];                             // Nombres alternativos que el OCR/LLM podría detectar
  exportMappings?: Record<string, string>;        // Mapeo a perfiles de aseguradoras (Aseguradora 1, 2, ICAO)
}

export interface DocumentTypeSchema {
  id: string;                                     // 'passport', 'spanish_dni', 'spanish_nie', 'corporate_act'
  name: string;                                   // 'Pasaporte Internacional', 'DNI Español'
  category: 'identity' | 'legal' | 'medical' | 'financial';
  description: string;
  icon: string;                                   // '🪪', '📘', '📄', '🧪'
  supportedSides: 'single' | 'dual' | 'multipage_pdf';
  systemPromptContext: string;                    // Contexto especializado para el modelo de visión
  fields: DocumentFieldDefinition[];
  createdAt: string;
  updatedAt: string;
}
```

### 2.4 Generación Dinámica de Structured Outputs para Gemini
En tiempo de ejecución, el motor construye el JSON Schema a partir del `DocumentTypeSchema` activo, garantizando que el LLM devuelva exactamente los campos configurados con sus correspondientes *bounding boxes* (coordenadas 2D).

---

## 3. Submódulo 2: Reglas de Negocio & Validación (Motor Híbrido)

Combina la máxima velocidad y coste cero de los algoritmos matemáticos deterministas con la potencia contextual del razonamiento semántico de los LLMs.

### 3.1 Catálogo de Reglas Deterministas (0 ms, Costo $0, 100% Predecible)
Funciones de dominio puro sin dependencias de React ni del DOM:

| Código de Regla | Tipo / Algoritmo | Descripción | Parámetros Configurables |
|---|---|---|---|
| `MODULO_23_SPAIN` | Matemático | Validación de letra de DNI / NIE español (`TRWAGMYFPDXBNJZSQVHLCKE`). | N/A |
| `ICAO_9303_CHECKSUM` | Ponderación 7-3-1 | Verificación de dígitos de control de zona MRZ (Pasaporte / DNI). | N/A |
| `DATE_NOT_EXPIRED` | Fecha | Detección de documentos con fecha de caducidad pasada. | Margen de gracia (días) |
| `DATE_CHRONOLOGY` | Relación temporal | Verificación de coherencia: `expedición < caducidad`, `nacimiento < hoy`. | N/A |
| `ACTUARIAL_AGE_LIMITS` | Aritmética actuarial | Alerta de asegurabilidad si la edad supera el límite máximo. | Edad Máx. (ej: 65 años) |
| `UNDERAGE_POLICY_HOLDER` | Aritmética | Detección de menores de 18 años (requiere tomador legal). | Edad Mín. (18 años) |
| `VISA_MIN_VALIDITY` | Umbral de días | Alerta Schengen si el pasaporte caduca en menos de $X$ días. | Días mínimos (ej: 180 días) |
| `CROSS_FIELD_CONSISTENCY` | Comparación | Consistencia entre zona visual y datos leídos en MRZ. | N/A |

### 3.2 Motor de Reglas Semánticas (LLM Reasoning Rules)
Para juicios cualitativos y contextuales que no pueden resolverse mediante fórmulas:

* **Estructura de la Regla Semántica:**
  * `id`: Identificador único.
  * `name`: Nombre descriptivo de la regla.
  * `documentType`: Tipo de documento aplicable (`all` o específico).
  * `promptInstruction`: Instrucción en lenguaje natural para evaluar durante la extracción (ej: *"Verificar si el documento muestra señales de manipulación o fotocopia en baja resolución"* o *"Comprobar si el diagnóstico médico incluye patologías preexistentes excluidas"*).
  * `severity`: `error` (bloqueante), `warning` (revisión manual), `info` (nota informativa).
  * `recommendation`: Mensaje de acción correctiva para el operador.

---

## 4. Experiencia de Usuario & Sub-navegación por URL

En el Backoffice de VitaBlue se estructuran las 4 vistas con sincronización en la URL:

```text
/backoffice/tools/document-intelligence               --> ⚡ Workbench de Extracción (Operativa diaria)
/backoffice/tools/document-intelligence?tab=schemas   --> 📋 Configuración de Esquemas y Campos de Extracción
/backoffice/tools/document-intelligence?tab=rules     --> ⚙️ Configuración de Reglas (Deterministas + Semánticas)
/backoffice/tools/document-intelligence?tab=profiles  --> 🏢 Perfiles de Aseguradoras y Formatos de Salida
```

### Flujo Operativo en el Workbench:
1. El usuario sube el documento (1 cara, 2 caras o PDF).
2. El sistema detecta o permite seleccionar el **Esquema de Documento** (DNI, NIE, Pasaporte...).
3. Se ejecuta la extracción multimodal con Gemini.
4. El formulario de revisión (`ReviewView`) **se renderiza dinámicamente** basándose en la lista de campos del esquema.
5. El motor evalúa las reglas deterministas en el navegador (en 0 ms mientras se edita) y muestra la tarjeta interactiva de diagnósticos.

---

## 5. Portabilidad e Integración con Loopdev

* **Contratos Serializables en JSON:** Tanto los esquemas de extracción como las reglas se almacenan en estructuras JSON puras (`localStorage` y sincronizables con Supabase / base de datos).
* **Motor Desacoplado:** `rules/engine.ts`, `rules/algorithms.ts` y `schemas/schemaEngine.ts` no importan nada del DOM ni de React, permitiendo ejecutarlos como librerías Node.js, Deno o microservicios en **Loopdev**.

---

## 6. Fases de Implementación

- [ ] **Fase 1: Modelado de Tipos y Stores de Esquemas & Reglas**
  - Contratos TypeScript de `DocumentTypeSchema` y `FieldDefinition`.
  - Esquemas por defecto para **Pasaporte**, **DNI** y **NIE**.
  - Catálogo formal de reglas deterministas y esquema para reglas semánticas.
  - Store unificado con persistencia reactiva.
- [ ] **Fase 2: UI de Configuración de Esquemas (`?tab=schemas`)**
  - Panel visual de tipos de documentos (Selector, Crear nuevo, Editar).
  - Editor de campos (Añadir campo, tipo de dato, required, pista IA, orden).
- [ ] **Fase 3: UI de Configuración de Reglas Híbridas (`?tab=rules`)**
  - Gestión del catálogo determinista (switches, severidad, umbrales).
  - Creador / editor de reglas semánticas con prompts personalizados.
- [ ] **Fase 4: Renderizado Dinámico en el Workbench**
  - Adaptar `ReviewView` y `ExtractedField` para generar el formulario a partir del esquema activo.
  - Integración del validador híbrido en tiempo real en la tarjeta de diagnósticos.
- [ ] **Fase 5: Pruebas Automatizadas y Documentación**
  - Tests unitarios de compilación de esquemas, motor dinámico y evaluación de reglas.
  - Verificación de tipos TypeScript (`tsc --noEmit`) y suite completa de Vitest.
