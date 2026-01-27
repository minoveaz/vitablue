// Docs accordion (executes immediately after parse since script is deferred at end)
(function(){
  const mq = window.matchMedia('(max-width:640px)');
  const triggers = document.querySelectorAll('#docs-contratacion [data-doc-trigger]');
  if(!triggers.length) return;
  function applyState() {
    if (mq.matches) {
      triggers.forEach(btn => {
        btn.setAttribute('aria-expanded','false');
        const panel = document.getElementById(btn.getAttribute('aria-controls'));
        if (panel) panel.hidden = true;
      });
    } else {
      triggers.forEach(btn => {
        btn.setAttribute('aria-expanded','true');
        const panel = document.getElementById(btn.getAttribute('aria-controls'));
        if (panel) panel.hidden = false;
      });
    }
  }
  triggers.forEach(btn => {
    btn.addEventListener('click', () => {
      if (!mq.matches) return; // no toggle en desktop
      const expanded = btn.getAttribute('aria-expanded') === 'true';
      triggers.forEach(b => {
        if (b !== btn) {
          b.setAttribute('aria-expanded','false');
          const other = document.getElementById(b.getAttribute('aria-controls'));
          if (other) other.hidden = true;
        }
      });
      btn.setAttribute('aria-expanded', String(!expanded));
      const panel = document.getElementById(btn.getAttribute('aria-controls'));
      if (panel) panel.hidden = expanded;
    });
    btn.addEventListener('keydown', e => {
      if(e.key==='Enter' || e.key===' '){ e.preventDefault(); btn.click(); }
    });
  });
  applyState();
  if (mq.addEventListener) mq.addEventListener('change', applyState); else if (mq.addListener) mq.addListener(applyState);
})();

// Main interactive behaviors (DOMContentLoaded wrapper preserved)
document.addEventListener('DOMContentLoaded', function(){
  const menuToggle = document.querySelector('.menu-toggle');
  const navLinks = document.querySelector('.nav-links');
  const scrollLinks = document.querySelectorAll('a[data-scroll="true"]');
  const quoteForm = document.getElementById('quote-form');
  const quoteResult = document.getElementById('quote-result');
  // Usar clases BEM para acordeón
  const accordionButtons = document.querySelectorAll('.accordion__button');
  const newsletterForm = document.getElementById('newsletter-form');

  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', function(){
      const isOpen = navLinks.getAttribute('data-open') === 'true';
      navLinks.setAttribute('data-open', String(!isOpen));
      menuToggle.setAttribute('aria-expanded', String(!isOpen));
    });
  }

  scrollLinks.forEach(link => {
    link.addEventListener('click', function(e){
      const targetId = link.getAttribute('href');
      if (targetId && targetId.startsWith('#')) {
        const destination = document.querySelector(targetId);
        if (destination) {
          e.preventDefault();
          destination.scrollIntoView({behavior:'smooth'});
          if (navLinks && navLinks.getAttribute('data-open') === 'true') {
            navLinks.setAttribute('data-open','false');
            if (menuToggle) menuToggle.setAttribute('aria-expanded','false');
          }
        }
      }
    });
  });

  const priceBands = [
    { min:14, max:15, monthly:31.57 },
    { min:16, max:19, monthly:33.58 },
    { min:20, max:24, monthly:39.88 },
    { min:25, max:30, monthly:41.28 },
    { min:31, max:35, monthly:46.18 }
  ];
  function calculateAge(birthDate){
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
    return age;
  }
  function resolveMonthlyPrice(age){
    return priceBands.find(b => age >= b.min && age <= b.max);
  }
  if (quoteForm && quoteResult){
    quoteForm.addEventListener('submit', function(e){
      e.preventDefault();
      if (!quoteForm.checkValidity()) { quoteForm.reportValidity(); return; }
      const fd = new FormData(quoteForm);
      // WhatsApp mapping
      const nombre = fd.get('nombre') || '';
      const email = fd.get('email') || '';
      const telefono = fd.get('telefono') || '';
      const nacionalidad = fd.get('nacionalidad') || '';
      const ciudad = fd.get('ciudad') || '';
      const fechaInicio = fd.get('fecha-inicio') || '';
      const fechaNacimiento = fd.get('fecha-nacimiento') || '';
      const idioma = fd.get('idioma') || '';
      const consentimiento = fd.get('consentimiento') ? 'Sí' : 'No';

      // GTM event push
      if (window.dataLayer) {
        window.dataLayer.push({
          event: 'form_submit',
          form_name: 'cotizacion_international_students',
          nombre,
          email,
          telefono,
          nacionalidad,
          ciudad,
          fechaInicio,
          fechaNacimiento,
          idioma
        });
      }

      // Mensaje estructurado
      let mensaje = '¡Hola! Solicito cotización para Sanitas International Students:%0A';
      mensaje += '- Nombre: ' + encodeURIComponent(nombre) + '%0A';
      mensaje += '- Email: ' + encodeURIComponent(email) + '%0A';
      mensaje += '- Teléfono: ' + encodeURIComponent(telefono) + '%0A';
      mensaje += '- Nacionalidad: ' + encodeURIComponent(nacionalidad) + '%0A';
      mensaje += '- Ciudad de estudios: ' + encodeURIComponent(ciudad) + '%0A';
      mensaje += '- Fecha inicio cobertura: ' + encodeURIComponent(fechaInicio) + '%0A';
      mensaje += '- Fecha de nacimiento: ' + encodeURIComponent(fechaNacimiento) + '%0A';
      mensaje += '- Idioma preferido: ' + encodeURIComponent(idioma) + '%0A';
      mensaje += '- Consentimiento: ' + encodeURIComponent(consentimiento);

      // Número de WhatsApp destino (reemplazar por el real)
      const numero = '34600000000'; // Ejemplo: 34 + número español sin espacios
      const url = 'https://wa.me/' + numero + '?text=' + mensaje;
      window.open(url, '_blank');
    });
  }

  accordionButtons.forEach(button => {
    button.addEventListener('click', function(){
      const expanded = button.getAttribute('aria-expanded') === 'true';
      const controls = button.getAttribute('aria-controls');
      const panel = controls ? document.getElementById(controls) : null;
      const icon = button.querySelector('.accordion__icon');
      const faqItem = button.closest('.faq-item');
      if (panel && faqItem) {
        panel.hidden = expanded;
        button.setAttribute('aria-expanded', String(!expanded));
        if (!expanded) {
          faqItem.classList.add('accordion--open');
        } else {
          faqItem.classList.remove('accordion--open');
        }
        if (icon){
          icon.textContent = expanded ? '+' : '−';
          icon.style.transform = expanded ? 'rotate(0deg)' : 'rotate(180deg)';
        }
      }
    });
    button.addEventListener('keydown', function(event){
      if (event.key === 'Enter' || event.key === ' '){ event.preventDefault(); button.click(); }
    });
  });

  if (newsletterForm){
    newsletterForm.addEventListener('submit', function(e){
      e.preventDefault();
      const emailInput = newsletterForm.querySelector('input[type="email"]');
      if (emailInput && emailInput.value){
        emailInput.value='';
        alert('Gracias por suscribirte. Pronto recibirás novedades de Sanitas International Students.');
      }
    });
  }

  (function setupAlsoFilters(){
    const container = document.getElementById('tambien-para');
    if(!container) return;
    const badges = container.querySelectorAll('.also-badge');
    const cards = container.querySelectorAll('.also-for-card');
    let active = null;
    function applyFilter(filter){
      cards.forEach(card => {
        const category = card.getAttribute('data-category') || '';
        const match = !filter || category === filter;
        card.setAttribute('data-hidden', match ? 'false' : 'true');
        if(match){ card.removeAttribute('data-hidden'); }
      });
    }
    function setActive(badge){
      badges.forEach(b => { b.classList.remove('is-active'); b.setAttribute('aria-pressed','false'); });
      if(badge){ badge.classList.add('is-active'); badge.setAttribute('aria-pressed','true'); }
    }
    badges.forEach(badge => {
      const filter = badge.getAttribute('data-filter');
      function handle(){
        if(active === filter){ active = null; setActive(null); applyFilter(null); }
        else { active = filter; setActive(badge); applyFilter(filter); }
      }
      badge.addEventListener('click', handle);
      badge.addEventListener('keydown', e => { if(e.key==='Enter' || e.key===' '){ e.preventDefault(); handle(); }});
    });
  })();

  const stickyCta = document.getElementById('sticky-cta');
  const formularioSection = document.getElementById('formulario') || document.getElementById('contacto');
  if (stickyCta && formularioSection && window.innerWidth < 640){
    const showCtaThreshold = 800;
    window.addEventListener('scroll', function(){
      const currentScroll = window.pageYOffset;
      const formularioTop = formularioSection.offsetTop;
      const formularioBottom = formularioTop + formularioSection.offsetHeight;
      if (currentScroll > showCtaThreshold && (currentScroll < formularioTop - 100 || currentScroll > formularioBottom + 100)){
        stickyCta.classList.add('show');
        stickyCta.setAttribute('aria-hidden','false');
        document.body.classList.add('has-sticky-cta');
      } else {
        stickyCta.classList.remove('show');
        stickyCta.setAttribute('aria-hidden','true');
        document.body.classList.remove('has-sticky-cta');
      }
    });
  }

  const scrollToTopBtn = document.getElementById('scrollToTop');
  if (scrollToTopBtn){
    window.addEventListener('scroll', function(){
      const currentScroll = window.pageYOffset;
      if (currentScroll > 500) scrollToTopBtn.classList.add('show');
      else scrollToTopBtn.classList.remove('show');
    });
    scrollToTopBtn.addEventListener('click', function(){
      window.scrollTo({ top:0, behavior:'smooth' });
    });
  }

  // Fragment loader reutilizable para cualquier [data-fragment]
  // Eliminada la carga dinámica de fragmentos HTML. Todo el contenido debe estar en el HTML estático.
  // --- Scroll Tracking 50% y 75% ---
  (function setupScrollTracking(){
    let sent50 = false;
    let sent75 = false;
    function checkScroll(){
      const scrollTop = window.scrollY || window.pageYOffset;
      const winHeight = window.innerHeight || document.documentElement.clientHeight;
      const docHeight = Math.max(
        document.body.scrollHeight,
        document.documentElement.scrollHeight,
        document.body.offsetHeight,
        document.documentElement.offsetHeight,
        document.body.clientHeight,
        document.documentElement.clientHeight
      );
      const percent = ((scrollTop + winHeight) / docHeight) * 100;
      if (!sent50 && percent >= 50) {
        sent50 = true;
        if (window.dataLayer) window.dataLayer.push({event: 'scroll_50'});
      }
      if (!sent75 && percent >= 75) {
        sent75 = true;
        if (window.dataLayer) window.dataLayer.push({event: 'scroll_75'});
      }
      if (sent50 && sent75) window.removeEventListener('scroll', checkScroll);
    }
    window.addEventListener('scroll', checkScroll, {passive:true});
  })();

});
