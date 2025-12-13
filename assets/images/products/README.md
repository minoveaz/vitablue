# Product Images Directory

Este directorio contiene las imágenes para las tarjetas de productos en el home.

## Especificaciones de Imágenes

- **Dimensiones recomendadas:** 640x400px (ratio 16:10)
- **Formato:** JPG o WebP para mejor rendimiento
- **Tamaño de archivo:** < 100KB (optimizado)
- **Nombres de archivo:**
  - `students.jpg` - International Students
  - `professionals.jpg` - Working Professionals
  - `family.jpg` - Family Coverage
  - `seniors.jpg` - Senior Care
  - `nomad.jpg` - Digital Nomad
  - `premium.jpg` - Premium Plus

## Placeholders Temporales

Mientras no tengas las imágenes definitivas, puedes usar servicios como:

- https://placehold.co/640x400/00B2E3/FFFFFF?text=Students
- https://placehold.co/640x400/E31C79/FFFFFF?text=Professionals
- https://placehold.co/640x400/00548F/FFFFFF?text=Family

## Optimización

Para optimizar las imágenes antes de subirlas:

```bash
# Con ImageMagick
convert input.jpg -resize 640x400^ -gravity center -extent 640x400 -quality 85 output.jpg

# Con TinyPNG API o sitio web
https://tinypng.com/
```

## Generación con AI (opcional)

Puedes generar imágenes con DALL-E, Midjourney o Stable Diffusion usando prompts como:

```
"A diverse group of international students smiling in a modern university campus, 
professional photography, bright and welcoming atmosphere, Sanitas blue color palette"
```
