// Centralized phone configuration and WhatsApp link hydration + JSON-LD sync
(function(){
  const PHONE = { digits: '34661498600', display: '+34 661 49 86 00' };
  window.VB_PHONE = PHONE;

  function hydratePhone() {
    // Visible number spans
    document.querySelectorAll('[data-phone-display]').forEach(function(el){
      el.textContent = PHONE.display;
    });
    // WhatsApp links composition
    document.querySelectorAll('[data-phone-wa]').forEach(function(a){
      const msg = a.getAttribute('data-message') || 'Hola, necesito información';
      a.href = 'https://wa.me/' + PHONE.digits + '?text=' + encodeURIComponent(msg);
      a.target = '_blank';
      a.rel = 'noopener';
    });
    // Sync JSON-LD telephone fields if present
    document.querySelectorAll('script[type="application/ld+json"]').forEach(function(script){
      try {
        const json = JSON.parse(script.textContent);
        const updateTelephone = function(node){
          if (!node || typeof node !== 'object') return;
          if (node.telephone) node.telephone = PHONE.display;
          if (node.contactPoint && typeof node.contactPoint === 'object') {
            if (Array.isArray(node.contactPoint)) {
              node.contactPoint.forEach(cp => { if (cp.telephone) cp.telephone = PHONE.display; });
            } else if (node.contactPoint.telephone) {
              node.contactPoint.telephone = PHONE.display;
            }
          }
          // Recurse nested objects/graphs
          Object.keys(node).forEach(k => updateTelephone(node[k]));
        };
        if (Array.isArray(json)) {
          json.forEach(updateTelephone);
        } else if (json && typeof json === 'object') {
          if (json['@graph'] && Array.isArray(json['@graph'])) {
            json['@graph'].forEach(updateTelephone);
          } else {
            updateTelephone(json);
          }
        }
        script.textContent = JSON.stringify(json);
      } catch (e) {
        // ignore invalid JSON-LD
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', hydratePhone);
  } else {
    hydratePhone();
  }
})();
