import React, { useMemo, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Clock3, ExternalLink, Filter, PackageCheck } from 'lucide-react';
import BackofficeShell from '@/components/layouts/BackofficeShell';
import { PRODUCT_INVENTORY } from '@/domain/products/inventory';

const ProductCatalog: React.FC = () => {
  const [status, setStatus] = useState<'all' | 'catalogued' | 'landing-only'>('all');
  const [category, setCategory] = useState('all');
  const products = useMemo(() => PRODUCT_INVENTORY.filter((product) => (
    (status === 'all' || product.status === status) && (category === 'all' || product.category === category)
  )), [status, category]);
  const catalogued = PRODUCT_INVENTORY.filter((product) => product.status === 'catalogued').length;

  return (
    <>
      <Helmet><title>Catálogo de productos | Backoffice VitaBlue</title><meta name="robots" content="noindex, nofollow" /></Helmet>
      <BackofficeShell title="Catálogo de productos" eyebrow="Área privada · Catálogo">
        <p className="text-body-lg max-w-3xl text-text-secondary">Inventario interno de productos y variantes. Los datos comerciales pendientes no se publican como cifras hasta recibir una fuente oficial.</p>

        <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-5"><p className="text-caption text-text-secondary">Total inventariado</p><p className="mt-2 text-3xl font-bold text-text-main">{PRODUCT_INVENTORY.length}</p></div>
          <div className="rounded-2xl border border-brand-cyan/40 bg-brand-cyan/10 p-5"><p className="text-caption text-text-secondary">Catalogados</p><p className="mt-2 text-3xl font-bold text-primary">{catalogued}</p></div>
          <div className="rounded-2xl border border-accent/30 bg-accent/10 p-5"><p className="text-caption text-text-secondary">Pendientes</p><p className="mt-2 text-3xl font-bold text-accent">{PRODUCT_INVENTORY.length - catalogued}</p></div>
        </section>

        <section className="flex flex-wrap items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4">
          <Filter className="size-5 text-primary" aria-hidden="true" />
          <select aria-label="Filtrar por estado" value={status} onChange={(event) => setStatus(event.target.value as typeof status)} className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm">
            <option value="all">Todos los estados</option><option value="catalogued">Catalogados</option><option value="landing-only">Pendientes</option>
          </select>
          <select aria-label="Filtrar por categoría" value={category} onChange={(event) => setCategory(event.target.value)} className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm">
            <option value="all">Todas las categorías</option><option value="health">Salud</option><option value="pet">Mascotas</option><option value="travel">Viaje</option><option value="life">Vida</option><option value="funeral">Decesos</option>
          </select>
          <span className="ml-auto text-caption text-text-secondary">{products.length} resultados</span>
        </section>

        <section className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <article key={product.id} className="flex flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-start justify-between gap-3"><div><p className="text-caption font-bold uppercase tracking-wide text-primary">{product.category}</p><h2 className="text-h3 mt-1 text-text-main">{product.name}</h2></div>{product.status === 'catalogued' ? <PackageCheck className="size-5 text-primary" aria-label="Catalogado" /> : <Clock3 className="size-5 text-accent" aria-label="Pendiente" />}</div>
              <p className="mt-3 text-sm text-text-secondary">{product.provider}</p>
              <div className="mt-4 rounded-xl bg-slate-50 p-3 text-sm"><p><strong>Estado:</strong> {product.status === 'catalogued' ? 'Catalogado' : 'Pendiente de datos oficiales'}</p><p className="mt-1"><strong>Fuente:</strong> {product.sourcePage}</p></div>
              <a className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-primary hover:underline" href={product.canonicalPath} target="_blank" rel="noreferrer">Abrir URL pública <ExternalLink className="size-4" /></a>
            </article>
          ))}
        </section>
      </BackofficeShell>
    </>
  );
};

export default ProductCatalog;
