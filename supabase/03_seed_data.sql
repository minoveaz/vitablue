-- 1. SEED DEFAULT SOCIAL PROFILES
INSERT INTO public.social_profiles (platform, url, username)
VALUES 
('facebook', 'https://www.facebook.com/share/1FwKPbX8N7/?mibextid=wwXIfr', 'Página VitaBlue'),
('instagram', 'https://www.instagram.com/vitablue_seguros/', '@vitablue_seguros'),
('tiktok', 'https://www.tiktok.com/@vitablueseguros', '@vitablueseguros'),
('youtube', 'https://www.youtube.com/@VitaBlue-seguros', '@VitaBlue-seguros'),
('linkedin', 'https://www.linkedin.com/company/vitablue-seguros/', '/company/vitablue-seguros'),
('x', 'https://x.com/vitablueseguros', '@vitablueseguros')
ON CONFLICT (platform) DO UPDATE 
SET url = EXCLUDED.url, username = EXCLUDED.username;

-- 2. SEED DEFAULT STARTING CAMPAIGN
INSERT INTO public.marketing_campaigns (id, name, objective, status, start_date, platforms, copies, assets)
VALUES (
  'lanzamiento-marca',
  'Lanzamiento Oficial VitaBlue',
  'Anunciar la llegada de VitaBlue Seguros a España como el comparador independiente de seguros de salud 100% gratuito y sin spam.',
  'active',
  '2026-08-15',
  ARRAY['instagram', 'x', 'linkedin', 'facebook'],
  '{
    "instagram": "¡Lanzamos VitaBlue! 🩺 Tu salud merece claridad. Compara seguros médicos gratis, sin spam y sin trampas. Link en bio. #VitaBlueSeguros #SaludEspaña",
    "x": "Ya está aquí VitaBlue: el comparador independiente de seguros de salud 100% gratuito en España. Compara sin llamadas comerciales pesadas. 📲 vitablue.es #VitaBlue #SegurosSalud",
    "linkedin": "Hoy iniciamos oficialmente el camino de VitaBlue Seguros en España. Nuestro objetivo es digitalizar y humanizar la contratación de pólizas de salud, ofreciendo asesoramiento neutral y gratuito. Únete a la protección inteligente. #Insurtech #Salud",
    "facebook": "Le damos la bienvenida a VitaBlue, el comparador neutral de seguros médicos en España. Te ayudamos a elegir el mejor seguro para tu visado de estudios o nómada digital gratis y en 2 minutos. 🛡️"
  }'::jsonb,
  '[
    {
      "id": "banner-lanzamiento-1",
      "name": "Post Lanzamiento (1x1)",
      "type": "post",
      "dimensions": { "width": 1080, "height": 1080 },
      "theme": "gradient",
      "customTitle": "VitaBlue Seguros",
      "customTagline": "El Comparador de Salud Gratuito y Libre de Spam"
    },
    {
      "id": "banner-lanzamiento-2",
      "name": "Story Lanzamiento (9x16)",
      "type": "story",
      "dimensions": { "width": 1080, "height": 1920 },
      "theme": "dark",
      "customTitle": "VitaBlue Seguros",
      "customTagline": "Compara tu Seguro de Salud de Forma Inteligente"
    }
  ]'::jsonb
)
ON CONFLICT (id) DO NOTHING;
