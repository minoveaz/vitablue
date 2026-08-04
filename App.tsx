import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation, Link } from 'react-router-dom';
import ProtectedRoute from '@/components/organisms/ProtectedRoute';
import PublicLayout from '@/components/layouts/PublicLayout';
import PrivateLayout from '@/components/layouts/PrivateLayout';
import { dynamicRoutes, privateRoutes } from '@/config/routes';

// Import new page views (Phase 3 & 4)
const Home = lazy(() => import('@/pages/public/Home'));
const Styleguide = lazy(() => import('@/pages/dev/Styleguide'));
const Wizard = lazy(() => import('@/pages/funnel/Wizard'));
const Results = lazy(() => import('@/pages/funnel/Results'));
const StudentInsurance = lazy(() => import('@/pages/public/StudentInsurance'));
const SanitasMasSalud = lazy(() => import('@/pages/public/SanitasMasSalud'));
const SanitasMascotas = lazy(() => import('@/pages/public/SanitasMascotas'));
const AsistenciaFamiliar = lazy(() => import('@/pages/public/AsistenciaFamiliar'));
const HealthInsurance = lazy(() => import('@/pages/public/HealthInsurance'));
const ExpatInsurance = lazy(() => import('@/pages/public/ExpatInsurance'));
const NomadInsurance = lazy(() => import('@/pages/public/NomadInsurance'));
const ForeignerInsurance = lazy(() => import('@/pages/public/ForeignerInsurance'));
const TravelInsurance = lazy(() => import('@/pages/public/TravelInsurance'));
const LifeInsurance = lazy(() => import('@/pages/public/LifeInsurance'));
const SanitasInsurances = lazy(() => import('@/pages/public/SanitasInsurances'));
const Privacy = lazy(() => import('@/pages/public/Privacy'));
const CookiesPolicy = lazy(() => import('@/pages/public/CookiesPolicy'));
const LegalNotice = lazy(() => import('@/pages/public/AvisoLegal'));
const BlogList = lazy(() => import('@/pages/public/BlogList'));
const BlogPost = lazy(() => import('@/pages/public/BlogPost'));
const MarketingStudio = lazy(() => import('@/marketing-studio/MarketingStudio'));
const MarketingLogin = lazy(() => import('@/pages/backoffice/MarketingLogin'));
const BackofficeHome = lazy(() => import('@/pages/backoffice/BackofficeHome'));
const ProductCatalog = lazy(() => import('@/pages/backoffice/ProductCatalog'));

const generatedBackofficeRoutes = [...privateRoutes, ...dynamicRoutes]
  .filter((route) => route.path.startsWith('/backoffice'))
  .map((route) => {
    const View = route.path === '/backoffice' ? BackofficeHome : route.path === '/backoffice/catalogo' ? ProductCatalog : MarketingStudio;
    return { path: route.path, element: <ProtectedRoute><View /></ProtectedRoute> };
  });

// Scroll to top on route change
const ScrollToTop = () => {
  const { pathname } = useLocation();
  React.useEffect(() => {
    window.scrollTo(0, 0);

    const isLocalOnlyPath = pathname === '/styleguide'
      || pathname.startsWith('/styleguide/')
      || pathname === '/login'
      || pathname.startsWith('/backoffice')
      || pathname === '/backoffice/marketing-studio'
      || pathname.startsWith('/backoffice/marketing-studio/');

    const analyticsWindow = window as unknown as Window & Record<string, boolean>;
    analyticsWindow['ga-disable-G-DCGH16NP2Q'] = isLocalOnlyPath;
    analyticsWindow['ga-disable-AW-515585712'] = isLocalOnlyPath;
  }, [pathname]);
  return null;
};

// Styleguide/Playground view for visual auditing
// App Views Setup

const AppLayout: React.FC = () => {
  const { pathname } = useLocation();
  const isPrivateArea = pathname === '/login'
    || pathname.startsWith('/backoffice')
    || pathname.startsWith('/backoffice/marketing-studio');

  const Shell = isPrivateArea ? PrivateLayout : PublicLayout;

  return (
    <Shell>
      <main className="flex-grow">
        <Suspense fallback={<div className="min-h-screen bg-background-light"></div>}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/en" element={<Home />} />
            {import.meta.env.DEV && <Route path="/styleguide" element={<Styleguide />} />}
            <Route path="/login" element={<MarketingLogin />} />
            <Route path="/marketing-studio/login" element={<Navigate to="/login" replace />} />
            <Route path="/marketing-studio/*" element={<Navigate to="/backoffice/marketing-studio" replace />} />
            {generatedBackofficeRoutes.map(({ path, element }) => <Route key={path} path={path} element={element} />)}
            {/* Seguros de Salud - Nueva Estructura Jerárquica */}
            <Route path="/productos/seguros-salud" element={<HealthInsurance />} />
            <Route path="/productos/seguros-salud/seguro-medico-estudiantes" element={<StudentInsurance />} />
            <Route path="/en/health-insurance-student-visa-spain" element={<StudentInsurance />} />
            <Route path="/productos/seguros-salud/seguro-expatriados" element={<ExpatInsurance />} />
            <Route path="/en/health-insurance-expatriates-spain" element={<ExpatInsurance />} />
            <Route path="/productos/seguros-salud/seguro-nomadas-digitales" element={<NomadInsurance />} />
            <Route path="/en/digital-nomad-insurance-spain" element={<NomadInsurance />} />
            <Route path="/productos/seguros-salud/seguro-salud-extranjeros" element={<ForeignerInsurance />} />
            
            {/* Sub-silo: Seguros de Salud de Sanitas */}
            <Route path="/productos/seguros-salud/seguros-sanitas" element={<SanitasInsurances />} />
            <Route path="/productos/seguros-salud/seguros-sanitas/sanitas-mas-salud" element={<SanitasMasSalud />} />
            <Route path="/productos/seguros-salud/seguros-sanitas/international-students" element={<StudentInsurance />} />
            <Route path="/productos/seguros-salud/seguros-sanitas/sanitas-mas-salud.html" element={<SanitasMasSalud />} />
            <Route path="/productos/seguros-salud/seguros-sanitas/sanitas-mascotas.html" element={<SanitasMascotas />} />
            <Route path="/productos/seguros-salud/seguros-sanitas/asistencia-familiar-iplus.html" element={<AsistenciaFamiliar />} />
            <Route path="/productos/seguros-salud/seguros-sanitas/seguro-medico-estudiantes-extranjeros-espana.html" element={<StudentInsurance />} />

            {/* Seguro de Mascotas (Silo Independiente) */}
            <Route path="/productos/seguro-mascotas/sanitas-mascotas" element={<SanitasMascotas />} />

            {/* Seguro de Decesos (Silo Independiente) */}
            <Route path="/productos/seguro-para-decesos/asistencia-familiar" element={<AsistenciaFamiliar />} />

            {/* Seguro de Viaje (Silo Independiente) */}
            <Route path="/productos/seguro-viaje" element={<TravelInsurance />} />

            {/* Seguro de Vida (Silo Independiente) */}
            <Route path="/productos/seguro-vida" element={<LifeInsurance />} />

            {/* Redirecciones y URLs de Compatibilidad (Legacy) */}
            <Route path="/productos/seguros-salud/sanitas-mas-salud" element={<SanitasMasSalud />} />
            <Route path="/productos/seguro-medico-estudiantes-extranjeros-espana.html" element={<StudentInsurance />} />
            <Route path="/productos/international-students.html" element={<StudentInsurance />} />
            <Route path="/seguros-salud" element={<HealthInsurance />} />
            <Route path="/productos/seguro-de-salud.html" element={<HealthInsurance />} />
            <Route path="/seguro-expatriados" element={<ExpatInsurance />} />
            <Route path="/productos/seguro-medico-expatriados.html" element={<ExpatInsurance />} />
            <Route path="/seguro-nomadas" element={<NomadInsurance />} />
            <Route path="/productos/seguro-nomadas-digitales.html" element={<NomadInsurance />} />
            <Route path="/productos/sanitas-mas-salud.html" element={<SanitasMasSalud />} />
            <Route path="/productos/sanitas-mascotas.html" element={<SanitasMascotas />} />
            <Route path="/productos/asistencia-familiar-iplus.html" element={<AsistenciaFamiliar />} />
            <Route path="/politica-privacidad" element={<Privacy />} />
            <Route path="/politica-cookies" element={<CookiesPolicy />} />
            <Route path="/privacidad.html" element={<Privacy />} />
            <Route path="/politica-cookies.html" element={<CookiesPolicy />} />
            <Route path="/cotizador.html" element={<Wizard />} />
            <Route path="/cookies" element={<CookiesPolicy />} />
            <Route path="/privacidad" element={<Privacy />} />
            <Route path="/aviso-legal" element={<LegalNotice />} />
            <Route path="/wizard" element={<Wizard />} />
            <Route path="/resultados" element={<Results />} />
            
            {/* Blog */}
            <Route path="/blog" element={<BlogList />} />
            <Route path="/blog/:slug" element={<BlogPost />} />
            <Route path="/en/blog" element={<BlogList />} />
            <Route path="/en/blog/:slug" element={<BlogPost />} />
            
            {/* Fallbacks */}
            <Route path="*" element={
              <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
                <h2 className="text-2xl font-bold mb-2">Página no encontrada</h2>
                <Link to="/" className="text-primary font-bold hover:underline">Volver a inicio</Link>
              </div>
            } />
          </Routes>
        </Suspense>
      </main>
    </Shell>
  );
};

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <AppLayout />
    </BrowserRouter>
  );
};

export default App;
