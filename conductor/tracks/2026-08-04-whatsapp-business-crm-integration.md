# Track: Integración de WhatsApp Business inbound con el CRM

**Fecha:** 2026-08-04  
**Estado:** Planificado  
**Objetivo:** conectar el número español de VitaBlue con WhatsApp Business Platform para recibir y gestionar en el CRM las conversaciones iniciadas por clientes de España y Latinoamérica, especialmente desde anuncios de Meta, enlaces de referidos y otros puntos de entrada.

## Contexto y decisión principal

Sí es posible utilizar un número español para atender clientes con números de Latinoamérica. El país del número de VitaBlue no limita la recepción internacional; el cliente verá el número español como identidad del negocio.

El caso de uso no requiere iniciar campañas ni conversaciones comerciales desde VitaBlue. El cliente inicia el contacto y el equipo responde desde el CRM. La integración debe usar la **WhatsApp Business Platform / Cloud API de Meta**, no automatizaciones que imiten WhatsApp Web ni la aplicación móvil.

La decisión inicial es construir un canal **inbound-first**:

- anuncios de Meta con destino a WhatsApp;
- enlaces `wa.me` para referidos, QR y web;
- recepción de mensajes mediante webhook;
- creación o actualización automática del lead;
- bandeja de conversaciones para el equipo;
- asignación, seguimiento y cierre desde el CRM;
- respuestas de servicio dentro de la ventana permitida;
- plantillas aprobadas únicamente si en el futuro se necesita recontactar fuera de esa ventana.

## Arquitectura objetivo

```text
Cliente en España o Latinoamérica
        |
        | anuncio Click to WhatsApp, enlace referido, QR o perfil social
        v
WhatsApp Business Platform / Cloud API de Meta
        |
        | webhook de mensajes, estados, errores y referencias de campaña
        v
Supabase Edge Function: whatsapp-webhook
        |
        | validación, normalización, deduplicación y persistencia
        v
Supabase: contactos, conversaciones, mensajes, fuentes y asignaciones
        |
        +--> Backoffice CRM: bandeja, filtros, agentes y estados
        |
        +--> métricas: origen, país, tiempo de respuesta y conversión
        |
        `--> Cloud API: respuesta del agente o bot con token server-side
```

## Estado actual del proyecto

- La web pública ya utiliza botones, enlaces y eventos de WhatsApp (`Navbar`, `FloatingWhatsApp`, `AdvisorCard`, `ProductCard` y componentes relacionados).
- El tracking actual registra al menos el evento `click_whatsapp` en algunos puntos de la web, pero todavía no existe una conversación inbound persistida en el CRM.
- Existe Supabase como backend y cliente común en `marketing-studio/utils/supabaseClient.ts`.
- Existe autenticación, roles y protección del backoffice mediante `AuthContext` y `ProtectedRoute`.
- Existe una frontera server-side con Supabase Edge Functions para OAuth y secretos; debe reutilizarse para el token de Meta.
- Marketing Studio dispone de módulos de campañas y conexiones API, pero no de una bandeja de WhatsApp ni de un modelo de CRM conversacional.
- La aplicación contiene datos de contacto al final del wizard, que deberán poder asociarse a un lead de WhatsApp sin duplicar personas.
- No se deben colocar tokens, secretos de Meta ni credenciales de WhatsApp en variables `VITE_*` ni en el navegador.

## Alcance funcional

### Incluido

- Conexión de un número de VitaBlue a WhatsApp Cloud API.
- Verificación del webhook y recepción de mensajes entrantes.
- Persistencia de contactos, conversaciones y mensajes.
- Soporte para texto, imágenes, documentos, audio y ubicaciones como mínimo a nivel de registro; la UX puede evolucionar por fases.
- Estados de entrega, lectura y error.
- Detección de conversaciones nuevas y actualización de conversaciones existentes.
- Identificación de país a partir del número en formato E.164, sin inferir residencia ni nacionalidad.
- Captura de origen para anuncios Click to WhatsApp cuando Meta lo entregue en el webhook.
- Enlaces de referidos con texto prellenado o códigos de origen.
- Bandeja de entrada protegida para agentes autorizados.
- Asignación de conversaciones, etiquetas, estado del lead y notas internas.
- Respuesta manual desde el CRM durante la ventana de atención.
- Auditoría de acciones y métricas básicas de conversión.

### Fuera de la primera versión

- Campañas masivas iniciadas por VitaBlue.
- Scraping, automatización de WhatsApp Web o uso de librerías no oficiales.
- Llamadas de voz o vídeo desde el CRM.
- Sincronización completa de la aplicación móvil WhatsApp Business.
- IA autónoma que decida coberturas, precios o recomendaciones de seguros sin supervisión humana.
- Gestión de múltiples números o múltiples marcas, salvo que se convierta en requisito del modelo SaaS.

## Modelo de datos propuesto

El esquema definitivo debe validarse con el modelo CRM existente, pero como mínimo debe contemplar:

### `whatsapp_accounts`

- `id`, `business_id`, `waba_id`, `phone_number_id`;
- número y nombre visible no sensibles;
- país y zona horaria operativa;
- estado de conexión;
- referencia al secreto server-side, nunca el token;
- `created_at`, `updated_at`.

### `crm_contacts`

- `id`, `phone_e164`, `display_name`;
- país derivado del prefijo, si aplica;
- nombre, email y datos aportados voluntariamente;
- estado de consentimiento y fecha/fuente;
- enlace con respuestas del cotizador cuando exista;
- `created_at`, `updated_at`.

### `whatsapp_conversations`

- `id`, `contact_id`, `whatsapp_account_id`;
- `wa_user_id` o identificador equivalente que Meta entregue;
- estado: `open`, `pending`, `assigned`, `closed`;
- agente asignado;
- última actividad y vencimiento calculado de la ventana de atención;
- país, fuente inicial, campaña, referido y etiquetas;
- `created_at`, `updated_at`.

### `whatsapp_messages`

- `id`, `conversation_id`, `provider_message_id` único;
- dirección: `inbound` o `outbound`;
- tipo, texto normalizado y referencia de media;
- estado: `received`, `sent`, `delivered`, `read`, `failed`;
- respuesta al mensaje anterior cuando exista;
- timestamps del proveedor y del sistema;
- payload original minimizado o referencia segura para auditoría.

### `whatsapp_events` o `webhook_deliveries`

- identificador/hash de evento para idempotencia;
- tipo, recepción, procesamiento y resultado;
- error técnico sin guardar secretos;
- retención limitada y acceso restringido.

## Fases de implementación

### Fase 0 — Decisiones, cuentas y respaldo

- [ ] Confirmar quién será propietario del Meta Business Portfolio y de la cuenta WABA.
- [ ] Confirmar el número español, su titularidad y si está actualmente asociado a WhatsApp Business App o a otro proveedor.
- [ ] Decidir entre Cloud API directa y BSP oficial; documentar costes, soporte y dependencia.
- [ ] Confirmar si se atenderá solo VitaBlue o varias marcas/números en el futuro.
- [ ] Exportar o respaldar tablas de contactos, leads y campañas antes de crear relaciones nuevas.
- [ ] Definir roles que pueden leer, responder, asignar, exportar y borrar conversaciones.
- [ ] Confirmar política de privacidad, base legal, consentimiento y plazos de conservación con negocio/legal.

**Salida:** decisión de proveedor, propietario de cuentas, número confirmado, matriz de permisos y plan de recuperación.

### Fase 1 — Preparación de Meta y entorno seguro

- [ ] Crear o revisar la aplicación de Meta para WhatsApp Business Platform.
- [ ] Configurar la cuenta de negocio, WABA, número de teléfono y nombre visible.
- [ ] Configurar permisos mínimos para gestión y mensajería según el diseño final.
- [ ] Configurar un número o entorno de prueba separado del número de producción.
- [ ] Guardar access token, app secret y verify token únicamente como secretos de Supabase Edge Functions.
- [ ] Definir rotación y revocación de credenciales.
- [ ] Registrar la URL pública HTTPS del webhook y el token de verificación.
- [ ] Documentar el proceso de revisión de Meta y el procedimiento de cambio a producción.

**Criterio:** ningún secreto aparece en código cliente, `.env.example`, logs, respuestas HTTP o tablas públicas.

### Fase 2 — Webhook y persistencia inbound

- [ ] Crear `supabase/functions/whatsapp-webhook`.
- [ ] Implementar el `GET` de verificación exigido por Meta.
- [ ] Implementar el `POST` de recepción de mensajes y cambios de estado.
- [ ] Validar estructura, cuenta, número y firma cuando el flujo elegido la proporcione.
- [ ] Responder rápidamente al proveedor y procesar de forma segura sin bloquear la entrega.
- [ ] Hacer el procesamiento idempotente por `provider_message_id` y hash de evento.
- [ ] Normalizar teléfono, nombre, timestamps, tipo de mensaje y referencias de media.
- [ ] Resolver contacto existente por teléfono/identificador antes de crear uno nuevo.
- [ ] Crear o reabrir conversación según actividad y estado.
- [ ] Persistir la fuente de anuncio o referido cuando exista.
- [ ] Guardar errores operativos y reintentos sin almacenar tokens ni payloads innecesarios.
- [ ] Añadir pruebas con payloads reales anonimizados y payloads inválidos.

**Criterio:** un mismo evento recibido dos veces no duplica contacto, conversación ni mensaje.

### Fase 3 — Modelo CRM, permisos y bandeja

- [ ] Crear migraciones para tablas, índices, constraints y relaciones.
- [ ] Activar RLS en todas las tablas nuevas.
- [ ] Aplicar permisos por rol: lectura, respuesta, asignación, administración y exportación.
- [ ] Crear bandeja protegida dentro de `/backoffice`.
- [ ] Mostrar conversaciones nuevas, pendientes, asignadas y cerradas.
- [ ] Añadir búsqueda por teléfono/nombre y filtros por país, campaña, fuente, agente y estado.
- [ ] Mostrar indicador de ventana de atención y última actividad.
- [ ] Añadir notas internas y etiquetas sin mezclarlas con mensajes enviados al cliente.
- [ ] Añadir asignación manual y, si procede, reglas simples por país o producto.
- [ ] Mantener diseño mobile-first y sin anchos fijos en contenedores principales.

**Criterio:** un usuario sin rol no puede consultar ni modificar conversaciones mediante llamadas directas a Supabase.

### Fase 4 — Respuesta desde el CRM

- [ ] Crear una Edge Function server-side para enviar mensajes mediante Cloud API.
- [ ] Permitir respuestas de texto y, posteriormente, adjuntos soportados.
- [ ] Guardar el mensaje outbound antes y después de la respuesta del proveedor con estado transitorio.
- [ ] Procesar estados `sent`, `delivered`, `read` y `failed` desde el webhook.
- [ ] Bloquear o advertir cuando la ventana de atención de servicio haya vencido.
- [ ] No permitir mensajes comerciales fuera de ventana sin plantilla y consentimiento válidos.
- [ ] Preparar plantillas de utilidad solo si negocio solicita recordatorios o seguimiento posterior.
- [ ] Mantener una respuesta humana visible y el bot desactivado por defecto.

**Criterio:** el agente puede responder desde el CRM y el cliente recibe la respuesta sin exponer credenciales en el navegador.

### Fase 5 — Ads, referidos y atribución

- [ ] Configurar una campaña de prueba Click to WhatsApp en Meta.
- [ ] Confirmar que el mensaje inicial llega al webhook con la referencia de anuncio disponible.
- [ ] Guardar campaña, conjunto, anuncio o referencia equivalente sin depender solo del texto libre.
- [ ] Crear enlaces `wa.me` diferenciados para web, QR, colaboradores y referidos.
- [ ] Usar textos prellenados y códigos de origen legibles para detectar referidos.
- [ ] No tratar el texto prellenado como prueba definitiva de identidad del referido.
- [ ] Registrar `source`, `campaign`, `referrer_code` y fecha del primer contacto.
- [ ] Crear métricas de leads por país, campaña, referido, producto y estado de conversión.
- [ ] Conectar eventos de CRM con analítica respetando consentimiento y minimización de datos.

**Criterio:** se puede responder cuánto lead inbound generó cada canal y qué porcentaje avanzó a cotización o venta.

### Fase 6 — Operación, cumplimiento y producción

- [ ] Definir horario de atención, SLA y cola de conversaciones sin asignar.
- [ ] Configurar alertas de webhook caído, errores de envío y acumulación de pendientes.
- [ ] Documentar alta, baja, bloqueo y migración del número.
- [ ] Documentar exportación, acceso del titular, borrado y retención de conversaciones.
- [ ] Revisar datos especialmente sensibles que puedan aparecer en conversaciones de seguros.
- [ ] Probar con clientes de España y varios países latinoamericanos.
- [ ] Validar comportamiento en móvil, pérdida de conexión, reintentos y mensajes duplicados.
- [ ] Hacer despliegue gradual con el número de prueba antes del número de producción.
- [ ] Confirmar backups, logs, auditoría y plan de recuperación antes de activar anuncios.

## Reglas de negocio iniciales

- El cliente siempre inicia la relación en la primera versión.
- El número de teléfono se almacena en formato E.164 y se normaliza antes de buscar duplicados.
- El prefijo permite etiquetar un país probable, pero no debe usarse como nacionalidad o residencia.
- Las respuestas del equipo son mensajes de servicio mientras exista una ventana de atención válida.
- Después de la ventana, el CRM debe impedir el envío libre o exigir una plantilla aprobada y consentimiento registrado.
- El agente no debe prometer coberturas, precios o aceptación de una aseguradora sin validación del producto y condiciones aplicables.
- El historial de WhatsApp es información restringida y no debe aparecer en rutas públicas ni en el sitemap.

## Puerta de calidad y seguridad

El pipeline o checklist de release debe fallar si:

- un token o secreto de Meta aparece en el bundle, repositorio o logs;
- el webhook acepta peticiones no verificadas;
- un evento duplicado crea mensajes duplicados;
- un usuario sin autorización puede leer o enviar mensajes;
- una conversación se envía fuera de ventana sin plantilla y consentimiento;
- un mensaje contiene datos de otro contacto por un error de asociación;
- las tablas nuevas no tienen RLS, constraints e índices mínimos;
- el webhook no tiene trazabilidad suficiente para diagnosticar una entrega fallida.

## Criterios de aceptación finales

- Un cliente de España o Latinoamérica puede iniciar una conversación desde un anuncio de Meta o un enlace referido.
- El mensaje aparece una sola vez en la bandeja del CRM y se asocia al contacto correcto.
- El CRM conserva la fuente del lead y permite filtrar por país/campaña/referido.
- Un agente autorizado puede responder desde el CRM sin acceder directamente a la aplicación móvil.
- Los estados de entrega y lectura se reflejan en la conversación.
- La ventana de atención se muestra y se respeta técnicamente.
- Las credenciales permanecen server-side y las políticas RLS bloquean accesos indebidos.
- La integración funciona con el número español sin impedir clientes internacionales.
- El equipo dispone de instrucciones de operación, soporte y recuperación.

## Decisiones pendientes

- Confirmar si se usará Cloud API directa o un BSP oficial.
- Confirmar el número definitivo y su estado actual en WhatsApp Business App.
- Decidir si el CRM debe soportar un único número VitaBlue o multiempresa/multinúmero.
- Definir los agentes, roles y reglas de asignación.
- Definir campos obligatorios del lead y productos de seguro que deben capturarse en el primer contacto.
- Definir el tiempo de conservación de conversaciones y el procedimiento RGPD.
- Decidir si el seguimiento posterior quedará fuera del alcance inicial o requerirá plantillas de utilidad.
- Confirmar las campañas de Meta y nomenclatura de enlaces de referidos.
