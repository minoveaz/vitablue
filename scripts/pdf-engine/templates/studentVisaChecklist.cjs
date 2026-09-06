/**
 * Template: Checklist Oficial de Requisitos Médicos para Visado de Estudiante en España
 * 2 Pages A4, 100% white background, clear typography, structured boxes.
 */
const { VITABLUE_FULL_LOGO_SVG, VITABLUE_ISOTYPE_SVG } = require('../baseTemplate.cjs');

function getStudentVisaChecklistHtml() {
  const page1 = `
  <section class="page">
    <div>
      <!-- Header -->
      <header class="pdf-header">
        <div>
          ${VITABLUE_FULL_LOGO_SVG}
        </div>
        <div>
          <span class="official-badge">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#005F73" stroke-width="3"><polyline points="20 6 9 17 4 12"></polyline></svg>
            Guía Oficial 2026/2027 • Visados
          </span>
        </div>
      </header>

      <!-- Main Title Block -->
      <div style="margin-bottom: 16px;">
        <h1 style="font-size: 23px; font-weight: 800; color: #001219; letter-spacing: -0.02em; margin-bottom: 6px; line-height: 1.25;">
          CHECKLIST DEFINITIVA: REQUISITOS MÉDICOS PARA <span style="color: #005F73;">VISADO DE ESTUDIANTE</span>
        </h1>
        <p style="font-size: 12px; color: #4A5568; font-weight: 500; line-height: 1.4;">
          Comprobación punto por punto según la <strong>Ley Orgánica 4/2000 (Reglamento de Extranjería)</strong> y directrices de Consulados y Embajadas de España.
        </p>
      </div>

      <!-- Critical Alert Callout -->
      <div style="background-color: #FFF9E6; border-left: 4px solid #EE9B00; padding: 12px 14px; border-radius: 8px; margin-bottom: 20px;">
        <div style="display: flex; align-items: center; gap: 10px;">
          <span style="font-size: 18px;">⚠️</span>
          <p style="font-size: 11px; color: #7A4F00; font-weight: 600; line-height: 1.4;">
            <strong>Advertencia Consular:</strong> Más del 35% de los requerimientos y denegaciones a estudiantes extranjeros se originan por presentar seguros con copagos, carencias o pólizas de viaje no admitidas en España.
          </p>
        </div>
      </div>

      <!-- 5 Mandatory Verification Checks -->
      <div style="display: flex; flex-direction: column; gap: 14px;">
        
        <!-- Check 1 -->
        <div style="background: #F8FAFC; border: 1.5px solid #E2E8F0; border-radius: 10px; padding: 13px 16px; display: flex; gap: 14px; align-items: flex-start;">
          <div class="interactive-check"></div>
          <div style="flex: 1;">
            <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 4px;">
              <h3 style="font-size: 14px; font-weight: 700; color: #001219;">1. Póliza 100% Sin Copagos</h3>
              <span style="font-size: 10px; background: #EBF7F4; color: #005F73; font-weight: 700; padding: 3px 8px; border-radius: 4px;">NO NEGOCIABLE</span>
            </div>
            <p style="font-size: 11px; color: #334155; line-height: 1.45;">
              Cero copago en consultas con médicos de cabecera, especialistas, pruebas diagnósticas, intervenciones y urgencias. El certificado debe indicar literalmente: <em>"Póliza sin copago"</em> o <em>"Copago: 0 €"</em>.
            </p>
          </div>
        </div>

        <!-- Check 2 -->
        <div style="background: #F8FAFC; border: 1.5px solid #E2E8F0; border-radius: 10px; padding: 13px 16px; display: flex; gap: 14px; align-items: flex-start;">
          <div class="interactive-check"></div>
          <div style="flex: 1;">
            <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 4px;">
              <h3 style="font-size: 14px; font-weight: 700; color: #001219;">2. Sin Periodos de Carencia</h3>
              <span style="font-size: 10px; background: #EBF7F4; color: #005F73; font-weight: 700; padding: 3px 8px; border-radius: 4px;">DESDE EL DÍA 1</span>
            </div>
            <p style="font-size: 11px; color: #334155; line-height: 1.45;">
              Acceso íntegro e inmediato a todas las coberturas hospitalarias y quirúrgicas desde la fecha de alta. No se admiten pólizas con 6 u 8 meses de espera para hospitalización o cirugías.
            </p>
          </div>
        </div>

        <!-- Check 3 -->
        <div style="background: #F8FAFC; border: 1.5px solid #E2E8F0; border-radius: 10px; padding: 13px 16px; display: flex; gap: 14px; align-items: flex-start;">
          <div class="interactive-check"></div>
          <div style="flex: 1;">
            <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 4px;">
              <h3 style="font-size: 14px; font-weight: 700; color: #001219;">3. Cobertura Completa Equivalente al SNS</h3>
              <span style="font-size: 10px; background: #EBF7F4; color: #005F73; font-weight: 700; padding: 3px 8px; border-radius: 4px;">SIN LÍMITE DE GASTO</span>
            </div>
            <p style="font-size: 11px; color: #334155; line-height: 1.45;">
              Debe proporcionar un nivel de cobertura idéntico al Sistema Nacional de Salud español: medicina primaria, especialidades, medios de diagnóstico avanzados, tratamientos oncológicos, cirugías e internamiento hospitalario al 100%.
            </p>
          </div>
        </div>

        <!-- Check 4 -->
        <div style="background: #F8FAFC; border: 1.5px solid #E2E8F0; border-radius: 10px; padding: 13px 16px; display: flex; gap: 14px; align-items: flex-start;">
          <div class="interactive-check"></div>
          <div style="flex: 1;">
            <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 4px;">
              <h3 style="font-size: 14px; font-weight: 700; color: #001219;">4. Repatriación Sanitaria y Funeraria Ilimitada</h3>
              <span style="font-size: 10px; background: #EBF7F4; color: #005F73; font-weight: 700; padding: 3px 8px; border-radius: 4px;">OBLIGATORIO</span>
            </div>
            <p style="font-size: 11px; color: #334155; line-height: 1.45;">
              Traslado médico de urgencia en caso de enfermedad sobrevenida o accidente grave, y repatriación del cuerpo o restos mortales hasta el país de origen sin límite económico fijado a la baja.
            </p>
          </div>
        </div>

        <!-- Check 5 -->
        <div style="background: #F8FAFC; border: 1.5px solid #E2E8F0; border-radius: 10px; padding: 13px 16px; display: flex; gap: 14px; align-items: flex-start;">
          <div class="interactive-check"></div>
          <div style="flex: 1;">
            <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 4px;">
              <h3 style="font-size: 14px; font-weight: 700; color: #001219;">5. Aseguradora Autorizada para Operar en España</h3>
              <span style="font-size: 10px; background: #EBF7F4; color: #005F73; font-weight: 700; padding: 3px 8px; border-radius: 4px;">DGSFP</span>
            </div>
            <p style="font-size: 11px; color: #334155; line-height: 1.45;">
              La compañía debe figurar en el Registro Oficial de la Dirección General de Seguros y Fondos de Pensiones de España (DGSFP) (ej. ASISA, Sanitas, Adeslas). <strong>Los seguros de viaje o asistencias al viajero NO son admitidos.</strong>
            </p>
          </div>
        </div>

      </div>
    </div>

    <!-- Footer Page 1 -->
    <footer class="pdf-footer">
      <div>
        <strong>VitaBlue.es</strong> • Comparador Oficial de Seguros para Estudiantes e Impatriados
      </div>
      <div>
        Página 1 de 2
      </div>
    </footer>
  </section>
  `;

  const page2 = `
  <section class="page">
    <div>
      <!-- Header Page 2 -->
      <header class="pdf-header">
        <div style="display: flex; align-items: center; gap: 10px;">
          ${VITABLUE_ISOTYPE_SVG}
          <div>
            <div style="font-family: 'Poppins', sans-serif; font-weight: 700; font-size: 15px; color: #001219;">
              vita<span style="color: #005F73;">blue</span>
            </div>
            <div style="font-size: 10px; color: #64748B; font-weight: 600;">
              GUÍA PRÁCTICA CONSULAR • VISADO ESPAÑA
            </div>
          </div>
        </div>
        <div>
          <span style="font-size: 10.5px; color: #005F73; font-weight: 700; background: #EBF7F4; padding: 5px 12px; border-radius: 20px;">
            Soporte Oficial: +34 613 82 90 26
          </span>
        </div>
      </header>

      <!-- Section A: 3 Documents to Submit -->
      <div style="margin-bottom: 20px;">
        <h2 style="font-size: 14.5px; font-weight: 700; color: #005F73; margin-bottom: 10px; text-transform: uppercase; letter-spacing: 0.02em;">
          A. DOCUMENTOS QUE DEBES PRESENTAR EN TU CITA CONSULAR
        </h2>
        <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 12px;">
          
          <div style="background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 8px; padding: 12px 12px;">
            <div style="font-size: 20px; margin-bottom: 4px;">📄</div>
            <h4 style="font-size: 12px; font-weight: 700; color: #001219; margin-bottom: 4px;">1. Certificado Consular</h4>
            <p style="font-size: 10px; color: #4A5568; line-height: 1.4;">
              Documento expedido en español por la aseguradora con firma digital oficial, acreditando sin copago, sin carencias y repatriación.
            </p>
          </div>

          <div style="background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 8px; padding: 12px 12px;">
            <div style="font-size: 20px; margin-bottom: 4px;">📋</div>
            <h4 style="font-size: 12px; font-weight: 700; color: #001219; margin-bottom: 4px;">2. Condiciones de Póliza</h4>
            <p style="font-size: 10px; color: #4A5568; line-height: 1.4;">
              Condiciones generales y particulares donde se detalla el cuadro médico en España y el acceso a hospitalización sin límites.
            </p>
          </div>

          <div style="background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 8px; padding: 12px 12px;">
            <div style="font-size: 20px; margin-bottom: 4px;">💳</div>
            <h4 style="font-size: 12px; font-weight: 700; color: #001219; margin-bottom: 4px;">3. Recibo Anual Pagado</h4>
            <p style="font-size: 10px; color: #4A5568; line-height: 1.4;">
              Justificante bancario que acredita el pago íntegro de la anualidad (el pago fraccionado mensual o trimestral no es admitido en cita).
            </p>
          </div>

        </div>
      </div>

      <!-- Section B: 3 Frequent Mistakes -->
      <div style="margin-bottom: 20px;">
        <h2 style="font-size: 14px; font-weight: 700; color: #991B1B; margin-bottom: 8px; text-transform: uppercase; letter-spacing: 0.02em;">
          B. LOS 3 ERRORES MÁS FRECUENTES QUE CAUSAN DENEGACIÓN
        </h2>
        <div style="background: #FFF1F2; border: 1px solid #FECDD3; border-radius: 8px; padding: 12px 16px; display: flex; flex-direction: column; gap: 8px;">
          <div style="font-size: 10.5px; color: #9F1239; line-height: 1.4;">
            <strong>❌ Error 1: Presentar un Seguro de Asistencia en Viaje:</strong> Los seguros de viaje tienen topes de 30.000 € y funcionan por reembolso. Extranjería exige seguro de salud español con cobertura médica directa ilimitada.
          </div>
          <div style="font-size: 10.5px; color: #9F1239; line-height: 1.4;">
            <strong>❌ Error 2: Pólizas con Copagos Simbólicos:</strong> Pólizas con copagos de 5€ o 10€ por consulta son sistemáticamente rechazadas en el consulado español.
          </div>
          <div style="font-size: 10.5px; color: #9F1239; line-height: 1.4;">
            <strong>❌ Error 3: Fraccionar el Pago:</strong> La normativa exige acreditar cobertura garantizada durante toda la estancia; pagar mes a mes suele derivar en requerimiento de subsanación de 10 días.
          </div>
        </div>
      </div>

      <!-- Section C: Guarantee VitaBlue -->
      <div style="margin-bottom: 20px; background: #EBF7F4; border: 1.5px solid #94D2BD; border-radius: 10px; padding: 13px 18px;">
        <div style="display: flex; gap: 14px; align-items: center;">
          <div style="font-size: 26px;">🛡️</div>
          <div>
            <h3 style="font-size: 12.5px; font-weight: 700; color: #005F73; margin-bottom: 3px;">
              Garantía de Devolución 100% de VitaBlue por Denegación de Visado
            </h3>
            <p style="font-size: 10px; color: #1E293B; line-height: 1.45;">
              Si por cualquier motivo ajeno tu visado de estudiante es denegado por el Consulado o la Oficina de Extranjería, te reembolsamos el <strong>100% del importe íntegro abonado</strong> de la prima presentando la resolución oficial consular. Sin penalizaciones ni comisiones de gestión.
            </p>
          </div>
        </div>
      </div>

      <!-- Section D: WhatsApp Advisory Box -->
      <div style="background: #001219; color: #FFFFFF; border-radius: 10px; padding: 16px 20px; display: flex; justify-content: space-between; align-items: center; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);">
        <div style="max-width: 390px;">
          <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px;">
            <span style="background: #087443; color: #FFFFFF; font-size: 9.5px; font-weight: 800; padding: 2px 7px; border-radius: 4px; text-transform: uppercase;">
              Asesoría Gratuita
            </span>
            <span style="font-size: 12px; font-weight: 700; color: #94D2BD;">¿Dudas con tu consulado específico?</span>
          </div>
          <p style="font-size: 10px; color: #E2E8F0; line-height: 1.4; margin-bottom: 6px;">
            Cada consulado (Bogotá, CDMX, Lima, Buenos Aires, etc.) tiene particularidades en sus certificados. Nuestros asesores revisan tu caso gratis y te cotizan la póliza oficial adecuada (desde 38€/mes).
          </p>
          <div style="font-size: 11px; font-weight: 600; color: #EE9B00;">
            💬 WhatsApp Directo Asesor: +34 613 82 90 26
          </div>
        </div>

        <div style="text-align: center; background: #FFFFFF; padding: 10px 14px; border-radius: 8px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
          <div style="font-size: 10.5px; font-weight: 700; color: #001219; margin-bottom: 5px;">
            Chatea con un Asesor
          </div>
          <a href="https://wa.me/34613829026?text=%5BCHECKLIST-PDF%5D%20Hola,%20tengo%20la%20checklist%20consular%20y%20quiero%20cotizar%20un%20seguro%20m%C3%A9dico%20aprobado%20para%20visado" 
             style="background: #087443; color: #FFFFFF; padding: 7px 12px; border-radius: 6px; font-size: 10px; font-weight: 700; display: inline-block;">
            Abrir WhatsApp
          </a>
          <div style="font-size: 8.5px; color: #64748B; margin-top: 4px;">
            Respuesta &lt; 15 minutos
          </div>
        </div>
      </div>

    </div>

    <!-- Footer Page 2 -->
    <footer class="pdf-footer">
      <div>
        <strong>VitaBlue</strong> • Asesoría Especializada en Seguros • info@vitablue.es • WhatsApp: +34 613 82 90 26
      </div>
      <div>
        Página 2 de 2
      </div>
    </footer>
  </section>
  `;

  return page1 + page2;
}

module.exports = {
  getStudentVisaChecklistHtml,
};
