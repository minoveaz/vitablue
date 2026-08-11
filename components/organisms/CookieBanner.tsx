import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cookie, X, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '@/components/atoms/Button';
import { useConsent } from '@/context/ConsentContext';

export const CookieBanner: React.FC = () => {
  const { hasDecision, acceptAll, rejectOptional } = useConsent();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!hasDecision) {
      const timer = setTimeout(() => setIsVisible(true), 2500); // Show after 2.5 seconds
      return () => clearTimeout(timer);
    }
    setIsVisible(false);
  }, [hasDecision]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-6 left-4 right-4 md:left-auto md:right-8 md:max-w-md z-[300]"
        >
          <div className="bg-white rounded-[2rem] shadow-2xl border border-slate-200/50 p-6 md:p-8 relative overflow-hidden">
            {/* Decorative background glow using Option 3 colors */}
            <div className="absolute -top-10 -right-10 size-32 bg-primary/5 rounded-full blur-3xl"></div>
            
            <div className="relative z-10 flex flex-col gap-6">
              <div className="flex items-start justify-between">
                <div className="size-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                  <Cookie className="w-6 h-6" />
                </div>
                <button 
                  onClick={() => setIsVisible(false)}
                  className="p-2 text-text-secondary hover:text-text-main transition-colors"
                  aria-label="Cerrar aviso"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-2">
                <h3 className="text-h3 font-display font-extrabold text-text-main leading-tight">Tu privacidad importa</h3>
                <p className="text-sm text-text-secondary leading-relaxed font-medium">
                  Utilizamos cookies para optimizar tu experiencia y analizar el tráfico publicitario. Puedes aceptar todas o ver detalles en la <Link to="/cookies" className="text-primary-dark font-bold underline underline-offset-4">Política de Cookies</Link>.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <Button 
                  variant="primary" 
                  size="md" 
                  onClick={() => { acceptAll(); setIsVisible(false); }}
                  className="w-full sm:flex-1"
                >
                  Aceptar todas
                </Button>
                <Button 
                  variant="ghost" 
                  size="md" 
                  className="!text-text-main hover:!text-primary-dark w-full sm:flex-1"
                  onClick={() => { rejectOptional(); setIsVisible(false); }}
                >
                  Rechazar
                </Button>
              </div>

              <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-text-main">
                <Shield size={12} className="text-primary-dark" /> Navegación Segura & RGPD
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CookieBanner;
