import type React from 'react';

export interface VideoAdvisorProps {
  name?: string;
  role?: string;
  whatsAppText?: string;
}

export interface VideoBrandAdapter {
  AdvisorCard: React.ComponentType<VideoAdvisorProps>;
}