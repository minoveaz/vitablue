/**
 * Template: Official Health Insurance Checklist for Spain Student Visa (English Edition)
 * 2 Pages A4, 100% white background, clear typography, structured boxes.
 */
const { VITABLUE_FULL_LOGO_SVG, VITABLUE_ISOTYPE_SVG } = require('../baseTemplate.cjs');

function getStudentVisaChecklistEnHtml() {
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
            Official Guide 2026/2027 • Student Visas
          </span>
        </div>
      </header>

      <!-- Main Title Block -->
      <div style="margin-bottom: 16px;">
        <h1 style="font-size: 23px; font-weight: 800; color: #001219; letter-spacing: -0.02em; margin-bottom: 6px; line-height: 1.25;">
          DEFINITIVE CHECKLIST: HEALTH INSURANCE FOR <span style="color: #005F73;">SPAIN STUDENT VISA</span>
        </h1>
        <p style="font-size: 12px; color: #4A5568; font-weight: 500; line-height: 1.4;">
          Point-by-point verification according to <strong>Spanish Immigration Law (Organic Law 4/2000)</strong> and official Spanish Consulate guidelines worldwide.
        </p>
      </div>

      <!-- Critical Alert Callout -->
      <div style="background-color: #FFF9E6; border-left: 4px solid #EE9B00; padding: 12px 14px; border-radius: 8px; margin-bottom: 20px;">
        <div style="display: flex; align-items: center; gap: 10px;">
          <span style="font-size: 18px;">⚠️</span>
          <p style="font-size: 11px; color: #7A4F00; font-weight: 600; line-height: 1.4;">
            <strong>Consular Warning:</strong> Over 35% of visa delays and rejections for international students are caused by policies containing copayments, waiting periods, or travel assistance plans not accepted in Spain.
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
              <h3 style="font-size: 14px; font-weight: 700; color: #001219;">1. 100% Zero Copayments (Sin Copagos)</h3>
              <span style="font-size: 10px; background: #EBF7F4; color: #005F73; font-weight: 700; padding: 3px 8px; border-radius: 4px;">NON-NEGOTIABLE</span>
            </div>
            <p style="font-size: 11px; color: #334155; line-height: 1.45;">
              Zero copay for GP visits, specialists, diagnostic tests, hospitalizations, and emergencies. The certificate must explicitly state in Spanish: <em>"Póliza sin copago"</em> (Copay: 0 €).
            </p>
          </div>
        </div>

        <!-- Check 2 -->
        <div style="background: #F8FAFC; border: 1.5px solid #E2E8F0; border-radius: 10px; padding: 13px 16px; display: flex; gap: 14px; align-items: flex-start;">
          <div class="interactive-check"></div>
          <div style="flex: 1;">
            <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 4px;">
              <h3 style="font-size: 14px; font-weight: 700; color: #001219;">2. No Waiting Periods (Sin Carencias)</h3>
              <span style="font-size: 10px; background: #EBF7F4; color: #005F73; font-weight: 700; padding: 3px 8px; border-radius: 4px;">FROM DAY 1</span>
            </div>
            <p style="font-size: 11px; color: #334155; line-height: 1.45;">
              Immediate, unrestricted access to all medical, surgical, and hospital treatments from the very first effective date. Policies with 6 to 10 months waiting times are immediately disqualified.
            </p>
          </div>
        </div>

        <!-- Check 3 -->
        <div style="background: #F8FAFC; border: 1.5px solid #E2E8F0; border-radius: 10px; padding: 13px 16px; display: flex; gap: 14px; align-items: flex-start;">
          <div class="interactive-check"></div>
          <div style="flex: 1;">
            <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 4px;">
              <h3 style="font-size: 14px; font-weight: 700; color: #001219;">3. Full Coverage Equivalent to the Spanish NHS</h3>
              <span style="font-size: 10px; background: #EBF7F4; color: #005F73; font-weight: 700; padding: 3px 8px; border-radius: 4px;">NO SPENDING CAP</span>
            </div>
            <p style="font-size: 11px; color: #334155; line-height: 1.45;">
              Must provide medical coverage identical to the Spanish Public Health System (SNS): primary care, medical specialties, clinical analyses, oncology, surgeries, and 100% inpatient hospital stays.
            </p>
          </div>
        </div>

        <!-- Check 4 -->
        <div style="background: #F8FAFC; border: 1.5px solid #E2E8F0; border-radius: 10px; padding: 13px 16px; display: flex; gap: 14px; align-items: flex-start;">
          <div class="interactive-check"></div>
          <div style="flex: 1;">
            <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 4px;">
              <h3 style="font-size: 14px; font-weight: 700; color: #001219;">4. Medical Repatriation & Remains Transport</h3>
              <span style="font-size: 10px; background: #EBF7F4; color: #005F73; font-weight: 700; padding: 3px 8px; border-radius: 4px;">MANDATORY</span>
            </div>
            <p style="font-size: 11px; color: #334155; line-height: 1.45;">
              Emergency medical evacuation and full repatriation of remains to your home country in the event of serious accident or decease without arbitrary low sub-limits.
            </p>
          </div>
        </div>

        <!-- Check 5 -->
        <div style="background: #F8FAFC; border: 1.5px solid #E2E8F0; border-radius: 10px; padding: 13px 16px; display: flex; gap: 14px; align-items: flex-start;">
          <div class="interactive-check"></div>
          <div style="flex: 1;">
            <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 4px;">
              <h3 style="font-size: 14px; font-weight: 700; color: #001219;">5. Insurer Licensed to Operate in Spain</h3>
              <span style="font-size: 10px; background: #EBF7F4; color: #005F73; font-weight: 700; padding: 3px 8px; border-radius: 4px;">DGSFP REGISTERED</span>
            </div>
            <p style="font-size: 11px; color: #334155; line-height: 1.45;">
              The insurance entity must be registered and regulated by Spain's Directorate General of Insurance (DGSFP) (e.g., ASISA, Sanitas, Adeslas). <strong>Travel insurance or reimbursement plans are NOT valid.</strong>
            </p>
          </div>
        </div>

      </div>
    </div>

    <!-- Footer Page 1 -->
    <footer class="pdf-footer">
      <div>
        <strong>VitaBlue.es</strong> • Official Health Insurance Comparator for International Students & Expats
      </div>
      <div>
        Page 1 of 2
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
              CONSULAR PRACTICAL GUIDE • SPAIN STUDENT VISA
            </div>
          </div>
        </div>
        <div>
          <span style="font-size: 10.5px; color: #005F73; font-weight: 700; background: #EBF7F4; padding: 5px 12px; border-radius: 20px;">
            Advisory: +34 613 82 90 26
          </span>
        </div>
      </header>

      <!-- Section A: 3 Documents to Submit -->
      <div style="margin-bottom: 20px;">
        <h2 style="font-size: 14.5px; font-weight: 700; color: #005F73; margin-bottom: 10px; text-transform: uppercase; letter-spacing: 0.02em;">
          A. MANDATORY DOCUMENTS TO PRESENT AT YOUR CONSULAR APPOINTMENT
        </h2>
        <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 12px;">
          
          <div style="background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 8px; padding: 12px 12px;">
            <div style="font-size: 20px; margin-bottom: 4px;">📄</div>
            <h4 style="font-size: 12px; font-weight: 700; color: #001219; margin-bottom: 4px;">1. Spanish Certificate</h4>
            <p style="font-size: 10px; color: #4A5568; line-height: 1.4;">
              Official visa certificate issued in Spanish with digital signature, verifying zero copay, zero waiting periods, and repatriation.
            </p>
          </div>

          <div style="background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 8px; padding: 12px 12px;">
            <div style="font-size: 20px; margin-bottom: 4px;">📋</div>
            <h4 style="font-size: 12px; font-weight: 700; color: #001219; margin-bottom: 4px;">2. Policy Conditions</h4>
            <p style="font-size: 10px; color: #4A5568; line-height: 1.4;">
              General and particular terms detailing network hospitals across Spain and un-capped medical care access.
            </p>
          </div>

          <div style="background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 8px; padding: 12px 12px;">
            <div style="font-size: 20px; margin-bottom: 4px;">💳</div>
            <h4 style="font-size: 12px; font-weight: 700; color: #001219; margin-bottom: 4px;">3. Annual Paid Receipt</h4>
            <p style="font-size: 10px; color: #4A5568; line-height: 1.4;">
              Bank receipt or payment confirmation showing the full annual premium paid upfront (monthly instalments are not accepted).
            </p>
          </div>

        </div>
      </div>

      <!-- Section B: 3 Frequent Mistakes -->
      <div style="margin-bottom: 20px;">
        <h2 style="font-size: 14px; font-weight: 700; color: #991B1B; margin-bottom: 8px; text-transform: uppercase; letter-spacing: 0.02em;">
          B. THE 3 MOST COMMON MISTAKES CAUSING VISA DENIAL
        </h2>
        <div style="background: #FFF1F2; border: 1px solid #FECDD3; border-radius: 8px; padding: 12px 16px; display: flex; flex-direction: column; gap: 8px;">
          <div style="font-size: 10.5px; color: #9F1239; line-height: 1.4;">
            <strong>❌ Mistake 1: Submitting Travel Assistance / Reimbursement Insurance:</strong> Travel plans have €30,000 to €50,000 caps and require paying upfront. Immigration law strictly demands direct medical coverage in Spain without limits.
          </div>
          <div style="font-size: 10.5px; color: #9F1239; line-height: 1.4;">
            <strong>❌ Mistake 2: Policies with Small Copayments:</strong> Policies charging even €5 or €10 per doctor visit are automatically rejected by consular officers.
          </div>
          <div style="font-size: 10.5px; color: #9F1239; line-height: 1.4;">
            <strong>❌ Mistake 3: Paying in Monthly Installments:</strong> Consulates demand proof of full coverage for the entire study duration; monthly payments trigger formal 10-day cure notices.
          </div>
        </div>
      </div>

      <!-- Section C: Guarantee VitaBlue -->
      <div style="margin-bottom: 20px; background: #EBF7F4; border: 1.5px solid #94D2BD; border-radius: 10px; padding: 13px 18px;">
        <div style="display: flex; gap: 14px; align-items: center;">
          <div style="font-size: 26px;">🛡️</div>
          <div>
            <h3 style="font-size: 12.5px; font-weight: 700; color: #005F73; margin-bottom: 3px;">
              VitaBlue 100% Money-Back Guarantee for Visa Refusal
            </h3>
            <p style="font-size: 10px; color: #1E293B; line-height: 1.45;">
              If your student visa application is refused by the Spanish Consulate or Immigration Office for reasons beyond your control, we refund <strong>100% of the insurance premium paid</strong> upon presenting the official refusal letter. Zero cancellation fees.
            </p>
          </div>
        </div>
      </div>

      <!-- Section D: WhatsApp Advisory Box -->
      <div style="background: #001219; color: #FFFFFF; border-radius: 10px; padding: 16px 20px; display: flex; justify-content: space-between; align-items: center; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);">
        <div style="max-width: 390px;">
          <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px;">
            <span style="background: #087443; color: #FFFFFF; font-size: 9.5px; font-weight: 800; padding: 2px 7px; border-radius: 4px; text-transform: uppercase;">
              Free Guidance
            </span>
            <span style="font-size: 12px; font-weight: 700; color: #94D2BD;">Questions about your specific consulate?</span>
          </div>
          <p style="font-size: 10px; color: #E2E8F0; line-height: 1.4; margin-bottom: 6px;">
            Consulates (London, New York, San Francisco, New Delhi, etc.) have specific wording expectations. Our bilingual advisors review your case for free and quote fully compliant policies (from €38/month).
          </p>
          <div style="font-size: 11px; font-weight: 600; color: #EE9B00;">
            💬 WhatsApp Direct Advisor: +34 613 82 90 26
          </div>
        </div>

        <div style="text-align: center; background: #FFFFFF; padding: 10px 14px; border-radius: 8px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
          <div style="font-size: 10.5px; font-weight: 700; color: #001219; margin-bottom: 5px;">
            Chat with an Advisor
          </div>
          <a href="https://wa.me/34613829026?text=%5BCHECKLIST-ESTUDIANTE-EN%5D%20Hello,%20I%20have%20the%20checklist%20and%20I%20would%20like%20to%20quote%20a%20compliant%20health%20insurance%20for%20my%20Spanish%20student%20visa" 
             style="background: #087443; color: #FFFFFF; padding: 7px 12px; border-radius: 6px; font-size: 10px; font-weight: 700; display: inline-block;">
            Open WhatsApp
          </a>
          <div style="font-size: 8.5px; color: #64748B; margin-top: 4px;">
            Reply &lt; 15 minutes
          </div>
        </div>
      </div>

    </div>

    <!-- Footer Page 2 -->
    <footer class="pdf-footer">
      <div>
        <strong>VitaBlue</strong> • Health Insurance Brokerage • info@vitablue.es • WhatsApp: +34 613 82 90 26
      </div>
      <div>
        Page 2 of 2
      </div>
    </footer>
  </section>
  `;

  return page1 + page2;
}

module.exports = {
  getStudentVisaChecklistEnHtml,
};
