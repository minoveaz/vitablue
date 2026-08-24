# Track: Google Ads API & Marketing Analytics Integration (Backoffice)

> **Contexto & Objetivo**: Conectar la plataforma VitaBlue con la API de Google Ads y GA4 para monitorizar en tiempo real el rendimiento de las campañas de pago (ad spend, impresiones, CTR, conversiones de WhatsApp y CPA) directamente en el Backoffice / Marketing Studio.

---

## 📌 Metas del Track

1. **Dashboard de Ad Spend & Conversiones**:
   - Visualizar métricas clave de Google Ads en el panel de administración de VitaBlue.
2. **Atribución de Leads de WhatsApp**:
   - Cruzar los clics de campañas con las conversaciones iniciadas en WhatsApp (`[GADS-EST]`).
3. **Automatizaciones & Alertas de Presupuesto**:
   - Notificaciones si el CPA supera el umbral deseado o si se agota el presupuesto diario.

---

## 🗺️ Fases de Ejecución (Futuras)

### Fase 1: Arquitectura & Credenciales
- [ ] Configurar Google Ads Manager Account (MCC) y solicitar Developer Token de acceso básico.
- [ ] Crear Service Account / OAuth 2.0 en Google Cloud Platform (GCP).
- [ ] Definir variables de entorno seguras en el backend (`GOOGLE_ADS_CLIENT_ID`, `DEVELOPER_TOKEN`, `CUSTOMER_ID`).

### Fase 2: Conectores de Datos (Edge Functions / Supabase)
- [ ] Crear Supabase Edge Function para consultar métricas diarias vía Google Ads API / GA4 Data API.
- [ ] Almacenar snapshots diarios de rendimiento en la base de datos para análisis histórico.

### Fase 3: Interfaz en Backoffice (Marketing Studio)
- [ ] Componente visual de métricas de rendimiento publicitario en el Backoffice de VitaBlue.
- [ ] Gráficas de evolución de gasto publicitario vs pólizas cerradas.

---

## 📈 Estado del Track
- **Estado**: 🟡 *Planificado / Backlog para futuras iteraciones*.
- **Fecha de creación**: 2026-08-24.
