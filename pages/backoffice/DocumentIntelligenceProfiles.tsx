import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import BackofficeShell from '@/components/layouts/BackofficeShell';
import { ProfilesConfigPanel } from '@/features/document-intelligence/components/ProfilesConfigPanel';
import { DEFAULT_EXPORT_PROFILE_ID } from '@/features/document-intelligence/exportProfiles';

const DocumentIntelligenceProfiles: React.FC = () => {
  const [activeProfileId, setActiveProfileId] = useState(
    () => localStorage.getItem('vitablue.export-profile') || DEFAULT_EXPORT_PROFILE_ID,
  );

  const handleSelectProfile = (profileId: string) => {
    setActiveProfileId(profileId);
    localStorage.setItem('vitablue.export-profile', profileId);
  };

  return (
    <>
      <Helmet>
        <title>Perfiles de aseguradora | Document Intelligence</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <BackofficeShell
        title="Perfiles de aseguradora"
        eyebrow="Document Intelligence"
        breadcrumbs={['Document Intelligence', 'Perfiles de aseguradora']}
        actionsSlot={
          <Link
            to="/backoffice/tools/document-intelligence"
            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-600 transition-colors hover:border-primary/30 hover:text-primary"
          >
            <ArrowLeft className="size-4" /> Volver al hub
          </Link>
        }
      >
        <ProfilesConfigPanel activeProfileId={activeProfileId} onSelectProfile={handleSelectProfile} />
      </BackofficeShell>
    </>
  );
};

export default DocumentIntelligenceProfiles;
