export interface BlogSection {
  type: 'paragraph' | 'heading-2' | 'heading-3' | 'list' | 'callout' | 'table' | 'cta-wizard';
  text?: string;
  items?: string[];
  tableHeader?: string[];
  tableRows?: string[][];
  ctaTitle?: string;
  ctaDescription?: string;
  ctaButtonText?: string;
  ctaLink?: string;
  ctaBadge?: string;
}


export interface BlogPostData {
  slug: string;
  title: string;
  category: 'visados' | 'tramites' | 'salud';
  categoryLabel: string;
  readTime: string;
  date: string;
  author: {
    name: string;
    role: string;
    avatar: string;
    verified: boolean;
    linkedIn?: string;
  };
  excerpt: string;
  featuredImage: string;
  sections: BlogSection[];
  lang?: 'es' | 'en';
  alternateSlug?: string;
}

export const blogPosts: BlogPostData[] = [
  {
    slug: 'precios-seguro-medico-visado-estudiante-espana',
    title: 'Precios del Seguro Médico para Visado de Estudiante en España (Guía Oficial 2026)',
    category: 'visados',
    categoryLabel: 'Visados y NIE',
    readTime: '7 min de lectura',
    date: '24 Agosto 2026',
    author: {
      name: 'Lucía Delgado',
      role: 'Especialista en Seguros de Salud y Visados',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=150&auto=format&fit=crop',
      verified: true,
      linkedIn: 'https://linkedin.com'
    },
    excerpt: '¿Cuánto cuesta el seguro médico obligatorio para estudiar en España? Descubre las tarifas reales mensuales y anuales de pólizas homologadas sin copagos (Sanitas), factores que influyen en el coste y cómo evitar denegaciones consulares.',
    featuredImage: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=800&auto=format&fit=crop',
    lang: 'es',

    sections: [
      {
        type: 'paragraph',
        text: 'Una de las dudas más frecuentes al planificar una estancia académica en España para realizar un grado universitario, máster, doctorado o curso de idiomas es: <strong>¿cuánto cuesta realmente el seguro médico obligatorio para el visado de estudiante?</strong>'
      },
      {
        type: 'paragraph',
        text: 'El seguro de salud no es un simple trámite administrativo opcional; es un requisito legal ineludible estipulado en el <em>Real Decreto 557/2011</em> de la normativa de extranjería española. Para que el consulado o la oficina de Extranjería apruebe tu expediente, la póliza debe ser emitida por una compañía autorizada en España, no tener copagos, carecer de periodos de carencia e incluir repatriación ilimitada. La póliza de referencia que cumple el 100% de estas directrices es <a href="/productos/seguros-salud/seguro-medico-estudiantes" class="text-primary hover:underline font-bold">Sanitas International Students</a>.'
      },
      {
        type: 'heading-2',
        text: 'Rango de precios reales del seguro médico de estudiante en 2026'
      },
      {
        type: 'paragraph',
        text: 'El coste promedio de un seguro médico privado homologado para visado de estudiante en España oscila habitualmente entre <strong>35€ y 65€ al mes</strong> (equivalente a un rango anual de entre <strong>420€ y 780€ al año</strong>), dependiendo principalmente del tramo de edad del solicitante y de la duración exacta del curso académico.'
      },
      {
        type: 'table',
        tableHeader: ['Tramo de Edad', 'Precio Mensual Estimado', 'Coste Anual (12 Meses)', 'Copagos & Carencias', 'Repatriación'],
        tableRows: [
          ['18 a 24 años (Universitarios / Grado)', '35€ - 45€ / mes', '420€ - 540€ / año', '0€ (Sin copagos / Sin carencias)', 'Incluida ilimitada'],
          ['25 a 30 años (Máster / Posgrado)', '40€ - 52€ / mes', '480€ - 624€ / año', '0€ (Sin copagos / Sin carencias)', 'Incluida ilimitada'],
          ['31 a 40 años (Doctorado / Investigadores)', '50€ - 68€ / mes', '600€ - 816€ / año', '0€ (Sin copagos / Sin carencias)', 'Incluida ilimitada'],
          ['Mayores de 40 años (Cursos Especiales)', '65€ - 95€ / mes', '780€ - 1.140€ / año', '0€ (Sin copagos / Sin carencias)', 'Incluida ilimitada']
        ]
      },
      {
        type: 'cta-wizard',
        ctaBadge: 'Calculadora Oficial 2026',
        ctaTitle: '¿Quieres conocer el precio exacto para tu edad y estancia?',
        ctaDescription: 'Calcula tu presupuesto oficial de Sanitas International Students en 30 segundos. Sin registrar tu teléfono, sin spam comercial y con certificado consular en 24h.',
        ctaButtonText: 'Calcular mi precio de seguro',
        ctaLink: '/wizard'
      },
      {
        type: 'heading-2',
        text: 'Los 4 factores que determinan el precio final de tu póliza'
      },
      {
        type: 'paragraph',
        text: 'Aunque las aseguradoras manejan tarifas estandarizadas para estudiantes extranjeros, el precio final de tu contrato se calcula en función de cuatro elementos técnicos fundamentales:'
      },
      {
        type: 'list',
        items: [
          '<strong>Edad del estudiante</strong>: Como en cualquier seguro de salud privado en España, el riesgo médico aumenta con la edad. Los tramos jóvenes (18-30 años) disfrutan de las primas más económicas y accesibles.',
          '<strong>Duración exacta de la estancia</strong>: Si tu curso académico dura 9 o 10 meses, puedes contratar la póliza ajustada por ese periodo específico o contratar la anualidad completa de 12 meses si planeas quedarte durante las vacaciones de verano en España.',
          '<strong>Forma de pago exigida por el consulado</strong>: Si tramitas el visado desde tu país de origen (consulados de España en Colombia, México, EE. UU., Perú, Argentina, etc.), las autoridades exigen el justificante de <strong>pago anual único por adelantado</strong>. No se admiten pagos fraccionados mensuales para visados iniciales.',
          '<strong>Coberturas consulares obligatorias</strong>: La póliza debe incluir de serie la cobertura completa de repatriación sanitaria y de restos (traslado funerario hasta tu país de origen) sin límites económicos restrictivos.'
        ]
      },
      {
        type: 'heading-2',
        text: '¿Por qué contratar un seguro de viaje barato (15€/mes) sale muy caro?'
      },
      {
        type: 'paragraph',
        text: 'Muchos estudiantes caen en la trampa de contratar pólizas de asistencia en viaje genéricas (como IATI, Chapka, Assist Card o pólizas básicas de aerolíneas) atraídos por precios de 15€ o 20€ al mes. Sin embargo, <strong>estas pólizas son denegadas de forma sistemática por las oficinas de Extranjería y consulados</strong> por los siguientes motivos:'
      },
      {
        type: 'list',
        items: [
          '<strong>Operan por reembolso con topes muy bajos</strong>: Solo cubren gastos de urgencia hasta 30.000€ o 50.000€, mientras que Extranjería exige cobertura completa equivalente a la sanidad pública española sin límite de gasto.',
          '<strong>Aplican franquicias y copagos encubiertos</strong>: Para entender cómo funcionan estos cobros y por qué los consulados los prohíben, consulta nuestra guía sobre <a href="/blog/que-es-el-copago-seguro-salud" class="text-primary hover:underline font-bold">qué es el copago en seguros de salud</a>.',
          '<strong>Excluyen revisiones rutinarias y enfermedades comunes</strong>: No te permiten acudir a consultas de medicina general, ginecología, dermatología o traumatología si no se trata de un accidente puntual de viaje.'
        ]
      },
      {
        type: 'callout',
        text: '⚠️ <strong>Riesgo Económico Real</strong>: Una denegación de visado por seguro no conforme implica la pérdida de las tasas consulares (80€ a 120€), retrasos de meses en tu matrícula universitaria e incluso la pérdida de billetes de avión.'
      },
      {
        type: 'heading-2',
        text: 'Garantía de reembolso total: Protege tu dinero ante denegaciones'
      },
      {
        type: 'paragraph',
        text: 'Una de las mayores preocupaciones al pagar una póliza anual antes de tener el visado aprobado es el riesgo de perder el dinero si el consulado rechaza la solicitud. Con <a href="/productos/seguros-salud/seguro-medico-estudiantes" class="text-primary hover:underline font-bold">Sanitas International Students</a> contratado a través de VitaBlue, cuentas con una <strong>cláusula contractual de garantía de reembolso del 100%</strong>.'
      },
      {
        type: 'paragraph',
        text: 'Si por cualquier motivo oficial ajeno a tu control tu visado no es concedido, basta con presentar la carta formal de denegación consular antes de la fecha de inicio de vigencia de la póliza para recibir la devolución íntegra de la prima abonada.'
      },
      {
        type: 'heading-2',
        text: 'Preguntas Frecuentes sobre el Precio del Seguro (FAQ)'
      },
      {
        type: 'list',
        items: [
          '<strong>¿El precio del certificado oficial tiene algún costo extra?</strong>: No. El certificado oficial bilingüe con firma digital autorizada para el consulado se emite de forma 100% gratuita tras la confirmación de la póliza.',
          '<strong>¿VitaBlue cobra alguna comisión sobre el precio de Sanitas?</strong>: Ninguna. Nuestros precios son exactamente los oficiales de Sanitas (o con descuentos especiales por volumen). La asesoría personalizada y el soporte durante tu estancia son totalmente gratuitos.',
          '<strong>¿Qué incluye la cobertura dental?</strong>: Incluye el programa Sanitas Dental 21 básico con revisiones, limpiezas anuales, consultas de urgencia dental y extracciones simples sin coste adicional.',
          '<strong>¿Puedo renovar el seguro al mismo precio el segundo año de carrera?</strong>: Sí. Al renovar tu estancia o tramitar la prórroga de estancia por estudios (TIE), podrás renovar tu póliza manteniendo las condiciones de cobertura homologada.'
        ]
      }
    ]
  },
  {
    slug: 'requisitos-seguro-medico-visado-estudiante-espana',
    alternateSlug: 'student-visa-spain-health-insurance-requirements',

    title: 'Requisitos del Seguro Médico para Visado de Estudiante en España (Guía 2026)',
    category: 'visados',
    categoryLabel: 'Visados y NIE',
    readTime: '6 min de lectura',
    date: '02 Agosto 2026',
    author: {
      name: 'Lucía Delgado',
      role: 'Especialista en Seguros de Salud y Visados',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=150&auto=format&fit=crop',
      verified: true,
      linkedIn: 'https://linkedin.com'
    },
    excerpt: '¿Vas a estudiar en España? Descubre los requisitos obligatorios que debe cumplir tu seguro médico para que el consulado o Extranjería apruebe tu visado de estudiante sin contratiempos.',
    featuredImage: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=800&auto=format&fit=crop',
    sections: [
      {
        type: 'paragraph',
        text: 'Si estás planeando mudarte a España para realizar tus estudios universitarios, un máster, un doctorado o un intercambio de idiomas de larga duración (más de 90 días), debes saber que obtener el visado de estudiante es un trámite obligatorio según lo establecido por el <a href="https://www.exteriores.gob.es/" target="_blank" rel="noopener noreferrer" class="text-primary hover:underline font-bold">Ministerio de Asuntos Exteriores de España</a>. Entre la documentación requerida, el seguro de salud es uno de los elementos más rigurosamente fiscalizados por las oficinas de Extranjería y consulados locales.'
      },
      {
        type: 'paragraph',
        text: 'Para que tu solicitud no sea denegada por "falta de cobertura sanitaria adecuada", es obligatorio contratar un seguro que cumpla con los estándares específicos de la sanidad pública española. No sirve cualquier póliza de viaje ni los seguros de tu país de origen. La póliza líder del mercado homologada para este trámite es <a href="/productos/seguros-salud/seguro-medico-estudiantes" class="text-primary hover:underline font-bold">Sanitas International Students</a>, diseñada en estricta conformidad con las directrices consulares españolas.'
      },
      {
        type: 'heading-2',
        text: 'Las 4 condiciones obligatorias exigidas por Extranjería'
      },
      {
        type: 'paragraph',
        text: 'El certificado emitido por la aseguradora debe hacer mención explícita a que la póliza cumple con los siguientes cuatro criterios técnicos definidos por la legislación española de extranjería:'
      },
      {
        type: 'list',
        items: [
          '<strong>Totalmente sin copagos</strong>: No debes abonar ninguna cantidad adicional al acudir a una consulta médica, realizarte pruebas de diagnóstico o acudir a urgencias. Las pólizas con copago se deniegan sistemáticamente. Para entender por qué este concepto es tan importante en la normativa española, puedes leer nuestra guía sobre <a href="/blog/que-es-el-copago-seguro-salud" class="text-primary hover:underline font-bold">qué es el copago en un seguro de salud</a>.',
          '<strong>Sin periodos de carencia</strong>: Todas las prestaciones sanitarias, desde consultas básicas hasta cirugías y hospitalización por urgencia, deben estar activas y cubiertas desde el primer día de vigencia del seguro. Puedes conocer más detalles de funcionamiento en nuestra guía sobre <a href="/blog/periodos-de-carencia-seguro-medico" class="text-primary hover:underline font-bold">carencias en seguros de salud</a>.',
          '<strong>Cobertura completa equivalente a la sanidad pública</strong>: Debe cubrir medicina general, pediatría, especialidades médicas, pruebas diagnósticas (analíticas, radiografías, ecografías), hospitalización, cirugías y atención de urgencias las 24 horas del día.',
          '<strong>Repatriación de restos</strong>: Es un requisito ineludible en el 100% de los consulados. El seguro debe cubrir la repatriación sanitaria y el traslado del cuerpo en caso de fallecimiento hasta el país de origen, habitualmente respaldado por un capital mínimo de 30.000€.'
        ]
      },
      {
        type: 'callout',
        text: '⚠️ <strong>Directiva Oficial</strong>: Los seguros de viaje comunes (tipo IATI, Chapka, Allianz Travel) o las coberturas de asistencia médica incluidas en las tarjetas de crédito (Visa, Mastercard Premium) <strong>no son válidos</strong> para tramitar el visado en España porque operan bajo reembolsos con límites muy bajos y no cubren preexistencias ni tratamientos de larga duración.'
      },
      {
        type: 'heading-2',
        text: 'Tabla comparativa de coberturas exigidas vs. pólizas de VitaBlue'
      },
      {
        type: 'table',
        tableHeader: ['Criterio Consular', 'Seguro de Viaje Estándar', 'Sanitas International Students (VitaBlue)'],
        tableRows: [
          ['Límite de Cobertura', 'Limitado (ej. 30.000€ o 50.000€)', 'Ilimitado (Equivalente a sanidad pública)'],
          ['Copagos por consulta', 'Aplica franquicias y cobros puntuales', '0€ (Totalmente sin copagos)'],
          ['Periodos de carencia', 'Inmediato pero limitado a urgencias vitales', '0 días (Urgencias y coberturas activas)'],
          ['Repatriación de restos', 'Opcional / Limitado', 'Incluida (Sin límite de gastos)']
        ]
      },
      {
        type: 'heading-2',
        text: '¿Cómo y cuándo se genera el certificado oficial para el visado?'
      },
      {
        type: 'paragraph',
        text: 'Cuando contratas tu póliza de estudiantes a través de VitaBlue, puedes realizar el proceso utilizando nuestro <a href="/wizard" class="text-primary hover:underline font-bold">cotizador de seguros online</a>. Tras completar el alta, la aseguradora (Sanitas) emite el certificado oficial de cobertura en formato PDF de forma inmediata. Este documento está redactado tanto en español como en inglés, contiene la firma electrónica autorizada de la entidad y los sellos reglamentarios para ser presentado de manera directa ante el consulado español o a través de la plataforma MERCURIO de Extranjería.'
      },
      {
        type: 'paragraph',
        text: 'Además, en cumplimiento con el principio de honestidad exigido en la contratación de seguros (consulte nuestra guía de <a href="/blog/preexistencias-medicas-seguro-salud" class="text-primary hover:underline font-bold">preexistencias médicas</a>), si tu visado es denegado por causas oficiales ajenas a tu control, Sanitas te garantiza el reembolso del 100% de la prima pagada presentando la carta formal de denegación antes del inicio de vigencia de la póliza.'
      },
      {
        type: 'heading-3',
        text: 'Preguntas Frecuentes (FAQ)'
      },
      {
        type: 'list',
        items: [
          '<strong>¿Qué duración debe tener el seguro médico?</strong>: Debe cubrir toda la estancia escolar declarada. Si el curso es de 9 o 10 meses, la póliza debe emitirse por ese periodo exacto o de manera anual.',
          '<strong>¿Sirve el seguro de salud público de mi país si soy de la UE?</strong>: Sí, si eres ciudadano de la Unión Europea puedes presentar la Tarjeta Sanitaria Europea (TSE). Sin embargo, si deseas contratar servicios complementarios privados rápidos, es recomendable un plan específico.',
          '<strong>¿Puedo contratar un seguro con copago si quiero ahorrar dinero?</strong>: No. Los consulados revisan específicamente la cláusula "sin copago" en el certificado oficial. Si detectan que tienes que abonar dinero por las visitas, rechazarán tu expediente de inmediato.'
        ]
      }
    ]
  },
  {
    slug: 'seguro-medico-residencia-no-lucrativa-espana',
    alternateSlug: 'health-insurance-spain-non-lucrative-visa-requirements',
    title: 'Seguro Médico para Residencia No Lucrativa en España: Qué exige Extranjería',
    category: 'visados',
    categoryLabel: 'Visados y NIE',
    readTime: '5 min de lectura',
    date: '30 Julio 2026',
    author: {
      name: 'Lucía Delgado',
      role: 'Especialista en Seguros de Salud y Visados',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=150&auto=format&fit=crop',
      verified: true,
      linkedIn: 'https://linkedin.com'
    },
    excerpt: 'La visa de Residencia No Lucrativa (RNL) es una de las opciones más populares para retirarse o vivir en España. Te explicamos los criterios técnicos del seguro médico para evitar denegaciones.',
    featuredImage: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=800&auto=format&fit=crop',
    sections: [
      {
        type: 'paragraph',
        text: 'La autorización de Residencia No Lucrativa (establecida en el Real Decreto 557/2011 de la legislación española) está dirigida a ciudadanos no comunitarios que desean vivir en España sin realizar actividades laborales o lucrativas. Al no cotizar en el sistema de la Seguridad Social española, la ley de extranjería impone la obligación de demostrar que dispones de recursos económicos y que cuentas con un seguro público o un <a href="/productos/seguros-salud/seguro-expatriados" class="text-primary hover:underline font-bold">seguro médico para expatriados en España</a> concertado con una aseguradora autorizada.'
      },
      {
        type: 'paragraph',
        text: 'El objetivo de esta norma es evitar que los residentes extranjeros supongan una carga financiera para los recursos de la sanidad pública española. Por ello, el seguro médico privado requerido debe ofrecer una cobertura de salud análoga en coberturas y prestaciones a las que brinda el Sistema Nacional de Salud.'
      },
      {
        type: 'heading-2',
        text: 'Criterios clave del seguro médico para la visa RNL'
      },
      {
        type: 'paragraph',
        text: 'Las delegaciones de gobierno de España y los consulados de países como EE. UU., Reino Unido, México o Argentina vigilan rigurosamente que la póliza del seguro privado contratado cumpla con los siguientes criterios:'
      },
      {
        type: 'list',
        items: [
          '<strong>Entidad autorizada para operar en España</strong>: La aseguradora que emite el seguro debe estar registrada en la Dirección General de Seguros y Fondos de Pensiones (DGSFP) española (como Sanitas o Adeslas). Los seguros de viaje o pólizas extranjeras no registradas en España no son aceptadas.',
          '<strong>Modalidad sin copagos ni franquicias</strong>: Se exige que no tengas que pagar nada al acudir a visitas médicas. Para saber cómo funciona la facturación y los límites de estas modalidades, lee sobre <a href="/blog/que-es-el-copago-seguro-salud" class="text-primary hover:underline font-bold">qué es el copago en los seguros médicos</a>.',
          '<strong>Ausencia de periodos de carencia</strong>: Todo debe estar cubierto desde el día de tu llegada. Revisa nuestro artículo explicativo sobre los <a href="/blog/periodos-de-carencia-seguro-medico" class="text-primary hover:underline font-bold">periodos de carencia en el seguro médico en España</a>.',
          '<strong>Forma de pago de prima anual única</strong>: Es un requisito crítico. La gran mayoría de consulados deniegan el visado si el seguro se abona de manera fraccionada (mensual o trimestral); exigen el justificante de pago bancario que demuestre que la póliza está pagada por adelantado para todo el año de vigencia.'
        ]
      },
      {
        type: 'callout',
        text: '💡 <strong>Recomendación Premium</strong>: Para este trámite, el producto de referencia del mercado es el seguro <a href="/productos/seguros-salud/seguros-sanitas/sanitas-mas-salud" class="text-primary hover:underline font-bold">Sanitas Más Salud</a> sin copago en su versión de pago anual único. Este plan incluye medicina interna, hospitalización e intervenciones de forma ilimitada.'
      },
      {
        type: 'heading-2',
        text: '¿Es obligatoria la cobertura de repatriación en la Residencia No Lucrativa?'
      },
      {
        type: 'paragraph',
        text: 'A diferencia de los visados de estudiantes, donde la repatriación sanitaria y de restos es obligatoria por ley nacional, en la Residencia No Lucrativa existe cierta discrecionalidad según el consulado específico. Por ejemplo, el consulado de España en Londres o Nueva York suele exigir que la póliza incluya el traslado de restos, mientras que en otros consulados de Latinoamérica a veces no se menciona explícitamente. No obstante, para evitar retrasos administrativos o requerimientos de subsanación de errores, es altamente aconsejable contratar una póliza que la incorpore de serie. Si deseas información sobre coberturas de decesos, puedes revisar nuestro apartado de <a href="/productos/seguro-para-decesos/asistencia-familiar" class="text-primary hover:underline font-bold">asistencia familiar y decesos</a>.'
      },
      {
        type: 'heading-3',
        text: 'Preguntas Frecuentes (FAQ)'
      },
      {
        type: 'list',
        items: [
          '<strong>¿Qué pasa si tengo una enfermedad preexistente?</strong>: Deberás declararla en el cuestionario de salud. Es fundamental ser honesto en este paso legal para evitar que la compañía anule la póliza en el futuro (puedes informarte sobre esto en nuestra guía sobre <a href="/blog/preexistencias-medicas-seguro-salud" class="text-primary hover:underline font-bold">preexistencias médicas en seguros de salud</a>).',
          '<strong>¿Aceptan seguros de salud con copago bajo?</strong>: No. Aunque el copago sea simbólico (de 2€ o 3€), la póliza será rechazada. El certificado debe indicar explícitamente que la cobertura es del 100% sin aportaciones del asegurado.'
        ]
      }
    ]
  },
  {
    slug: 'seguro-de-salud-pareja-de-hecho-nie',
    title: 'Guía Completa del Seguro de Salud para Pareja de Hecho y NIE',
    category: 'tramites',
    categoryLabel: 'Trámites en España',
    readTime: '5 min de lectura',
    date: '28 Julio 2026',
    author: {
      name: 'Lucía Delgado',
      role: 'Especialista en Seguros de Salud y Visados',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=150&auto=format&fit=crop',
      verified: true,
      linkedIn: 'https://linkedin.com'
    },
    excerpt: '¿Vas a formalizar tu relación como Pareja de Hecho en España para obtener la tarjeta de familiar de comunitario? Te detallamos el tipo de seguro de salud que debes presentar.',
    featuredImage: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=800&auto=format&fit=crop',
    sections: [
      {
        type: 'paragraph',
        text: 'Inscribirse como Pareja de Hecho en España con un ciudadano español o de otro estado miembro de la Unión Europea es uno de los trámites legales de extranjería más habituales. Este registro permite al miembro extranjero solicitar la Tarjeta de Familiar de Ciudadano de la Unión (Tarjeta Comunitaria) para residir y trabajar legalmente en el país durante un periodo de 5 años. Sin embargo, para conseguir la aprobación del NIE, la oficina de extranjería exige acreditar de forma estricta la disponibilidad de un <a href="/productos/seguros-salud/seguro-salud-extranjeros" class="text-primary hover:underline font-bold">seguro de salud para extranjeros en España</a>.'
      },
      {
        type: 'paragraph',
        text: 'Esta exigencia viene regulada en el Real Decreto 240/2007, que obliga al ciudadano de la Unión a demostrar que dispone de recursos económicos suficientes para la unidad familiar y que cuenta con una póliza de seguro médico público o privado que ofrezca coberturas completas.'
      },
      {
        type: 'heading-2',
        text: 'Requisitos específicos del seguro para Tarjeta Comunitaria'
      },
      {
        type: 'paragraph',
        text: 'El seguro privado de enfermedad que presentes ante la delegación de Extranjería para obtener la tarjeta comunitaria de familiar de la Unión debe reunir los siguientes requisitos:'
      },
      {
        type: 'list',
        items: [
          '<strong>Totalmente sin copagos</strong>: No se admiten pólizas donde el asegurado tenga que pagar dinero extra por ir al médico o hacerse analíticas. Obtén más información técnica sobre esto en nuestra guía de <a href="/blog/que-es-el-copago-seguro-salud" class="text-primary hover:underline font-bold">qué es el copago en seguros</a>.',
          '<strong>Sin periodos de carencia</strong>: Debe cubrir hospitalizaciones y cirugías desde el primer día de vigencia. Puedes leer más sobre el tema en nuestro artículo sobre <a href="/blog/periodos-de-carencia-seguro-medico" class="text-primary hover:underline font-bold">los tiempos de carencia en seguros</a>.',
          '<strong>Entidad Aseguradora autorizada</strong>: El contrato debe formalizarse con una compañía establecida en España (como Sanitas). El plan estrella recomendado para este fin es <a href="/productos/seguros-salud/seguros-sanitas/sanitas-mas-salud" class="text-primary hover:underline font-bold">Sanitas Más Salud</a>.'
        ]
      },
      {
        type: 'heading-2',
        text: '¿Quién debe ser el Tomador y el Asegurado en la póliza?'
      },
      {
        type: 'paragraph',
        text: 'Una de las dudas más frecuentes ante extranjería es la titularidad del contrato. El tomador del seguro (quien firma la póliza y asume el cargo de los recibos bancarios) puede ser indistintamente el ciudadano de la Unión Europea o el familiar extranjero. Sin embargo, para que el trámite sea aprobado, es obligatorio que el familiar extracomunitario figure de forma explícita como **asegurado** en el certificado oficial emitido por la compañía de seguros.'
      },
      {
        type: 'heading-3',
        text: 'Preguntas Frecuentes (FAQ)'
      },
      {
        type: 'list',
        items: [
          '<strong>¿Puedo usar la Seguridad Social si mi pareja cotiza?</strong>: Sí, si tu pareja comunitaria está trabajando y dada de alta en la Seguridad Social española, puedes registrarte como beneficiario de su cartilla sanitaria y presentar ese documento. Sin embargo, si trabaja por cuenta propia o el trámite se demora, la opción del seguro de salud privado es la vía más rápida y segura para evitar que se venzan los plazos de resolución.',
          '<strong>¿Qué pasa si tengo enfermedades previas al contratar?</strong>: Deberás declararlas de forma sincera en el formulario médico de Sanitas. Si quieres saber cómo gestionan las aseguradoras estas dolencias anteriores, puedes consultar nuestra guía sobre <a href="/blog/preexistencias-medicas-seguro-salud" class="text-primary hover:underline font-bold">preexistencias médicas en el seguro</a>.'
        ]
      }
    ]
  },
  {
    slug: 'que-es-el-copago-seguro-salud',
    title: '¿Qué es el Copago en un Seguro de Salud? (Guía de Ahorro)',
    category: 'salud',
    categoryLabel: 'Consejos de Salud',
    readTime: '5 min de lectura',
    date: '01 Agosto 2026',
    author: {
      name: 'Lucía Delgado',
      role: 'Especialista en Seguros de Salud y Visados',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=150&auto=format&fit=crop',
      verified: true,
      linkedIn: 'https://linkedin.com'
    },
    excerpt: '¿Qué significa copago? Descubre cómo funciona esta modalidad de seguro de salud, en qué casos te permite ahorrar en tu cuota mensual y cuándo debes evitarla.',
    featuredImage: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=800&auto=format&fit=crop',
    sections: [
      {
        type: 'paragraph',
        text: 'Al buscar seguros de salud privados en España, te encontrarás de forma constante con los términos **"con copago"** y **"sin copago"**. Entender la diferencia exacta entre estas dos modalidades es clave para optimizar tu gasto mensual y evitar sorpresas desagradables al recibir los cargos en tu cuenta bancaria.'
      },
      {
        type: 'paragraph',
        text: 'El copago es una pequeña cantidad de dinero fijada de antemano que el asegurado abona a la compañía médica cada vez que hace uso de un servicio sanitario (como una consulta con un especialista, una analítica de laboratorio, una radiografía o una urgencia). A cambio de este copago puntual, la aseguradora te ofrece una **cuota mensual (prima) mucho más económica** que la de un seguro de tarifa plana tradicional.'
      },
      {
        type: 'heading-2',
        text: '¿Cómo funciona el copago en el día a día?'
      },
      {
        type: 'paragraph',
        text: 'Cuando contratas un seguro de salud con copago, la compañía no te cobrará nada en el centro médico al que acudas. Tú presentas tu tarjeta de asegurado (física o digital) y eres atendido de forma normal. Al final del mes, la aseguradora contabilizará todos los servicios que has utilizado y te pasará un cargo bancario acumulado por dichos conceptos. Por ejemplo, si has ido una vez al médico de cabecera y te has realizado un análisis de sangre, pagarás la mensualidad normal del seguro más los importes asociados a esos dos actos médicos.'
      },
      {
        type: 'heading-2',
        text: 'Diferencias clave entre seguro con y sin copago'
      },
      {
        type: 'list',
        items: [
          '<strong>Seguro Sin Copago</strong>: Pagas una prima mensual fija fija (tarifa plana). No importa cuántas veces vayas al médico o qué pruebas complejas necesites; nunca pagarás nada adicional. Es la opción ideal para familias con niños pequeños, personas mayores o aquellos que desean total tranquilidad financiera.',
          '<strong>Seguro Con Copago</strong>: Pagas una prima mensual reducida (a veces hasta un 40% más económica). Es la opción recomendada para personas jóvenes, deportistas sanos y aquellos que solo quieren el seguro como protección ante imprevistos graves o accidentes.'
        ]
      },
      {
        type: 'heading-2',
        text: 'Importes orientativos de copago por servicio médico'
      },
      {
        type: 'table',
        tableHeader: ['Servicio Médico Realizado', 'Importe del Copago Promedio (Sanitas/Adeslas)'],
        tableRows: [
          ['Consulta de Medicina General / Pediatría', '2€ - 5€'],
          ['Médico Especialista (Ginecología, Dermatología, etc.)', '5€ - 12€'],
          ['Pruebas diagnósticas básicas (Analíticas, Radiografías)', '4€ - 8€'],
          ['Pruebas de diagnóstico complejas (TAC, Resonancias)', '15€ - 30€'],
          ['Urgencias Médicas Hospitalarias', '8€ - 20€']
        ]
      },
      {
        type: 'heading-2',
        text: 'La red de seguridad: ¿Qué es el Límite Anual de Copagos?'
      },
      {
        type: 'paragraph',
        text: 'Una de las grandes preocupaciones al contratar un seguro con copago es qué ocurre si sufres una enfermedad grave que te obligue a acudir al médico decenas de veces en pocos meses. Para proteger al usuario, las aseguradoras premium comercializan pólizas que incluyen un **Límite Máximo Anual de Copagos** (por ejemplo, de 300€ o 400€ al año por asegurado).'
      },
      {
        type: 'paragraph',
        text: 'Esto significa que si la suma de tus copagos mensuales llega a los 300€ en un año, la aseguradora dejará de cobrarte por los actos médicos restantes. A partir de ese momento, tu seguro con copago se convierte en una póliza sin copago gratuita hasta la renovación de la anualidad.'
      },
      {
        type: 'callout',
        text: '⚠️ <strong>Importante para Trámites de Extranjería</strong>: Si vas a tramitar el <a href="/productos/seguros-salud/seguro-medico-estudiantes" class="text-primary hover:underline font-bold">Visado de Estudiante</a>, la <a href="/productos/seguros-salud/seguro-expatriados" class="text-primary hover:underline font-bold">Residencia No Lucrativa</a> o la tarjeta por <a href="/productos/seguros-salud/seguro-salud-extranjeros" class="text-primary hover:underline font-bold">Pareja de Hecho</a>, las delegaciones de Extranjería de España <strong>prohíben los seguros con copago</strong>. Debes contratar obligatoriamente una póliza sin copago de cobertura completa.'
      }
    ]
  },
  {
    slug: 'periodos-de-carencia-seguro-medico',
    title: '¿Qué son los Periodos de Carencia en un Seguro Médico?',
    category: 'salud',
    categoryLabel: 'Consejos de Salud',
    readTime: '5 min de lectura',
    date: '29 Julio 2026',
    author: {
      name: 'Lucía Delgado',
      role: 'Especialista en Seguros de Salud y Visados',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=150&auto=format&fit=crop',
      verified: true,
      linkedIn: 'https://linkedin.com'
    },
    excerpt: '¿Por qué tengo que esperar para usar ciertas coberturas complejas tras contratar un seguro? Te explicamos el funcionamiento de las carencias y cómo eliminarlas.',
    featuredImage: 'https://images.unsplash.com/photo-1508962914676-134849a727f0?q=80&w=800&auto=format&fit=crop',
    sections: [
      {
        type: 'paragraph',
        text: 'Al darte de alta en un seguro de salud privado, muchas personas asumen que pueden acceder de manera instantánea a todas las coberturas y tratamientos disponibles en el catálogo de la aseguradora. Sin embargo, en la inmensa mayoría de pólizas en España existen cláusulas llamadas **periodos de carencia**.'
      },
      {
        type: 'paragraph',
        text: 'La carencia es el **periodo de tiempo de espera obligatorio** (calculado en meses) que debe transcurrir desde que firmas el contrato y entra en vigor el seguro de salud hasta que puedes hacer uso de ciertos servicios complejos o costosos.'
      },
      {
        type: 'heading-2',
        text: '¿Por qué aplican carencias las compañías de seguros?'
      },
      {
        type: 'paragraph',
        text: 'Los periodos de carencia son un mecanismo de protección financiera para las aseguradoras. Evitan lo que técnicamente se conoce como "selección adversa oportunista": que un usuario contrate un seguro con el único propósito de someterse a una intervención quirúrgica de miles de euros o dar a luz de manera inmediata, y luego proceda a dar de baja el seguro médico.'
      },
      {
        type: 'heading-2',
        text: 'Plazos de carencia estándar en el mercado español'
      },
      {
        type: 'paragraph',
        text: 'Aunque cada compañía tiene libertad para fijar sus condiciones, por lo general, los plazos que aplica la mayoría de aseguradoras en España (como Sanitas o Adeslas) son los siguientes:'
      },
      {
        type: 'list',
        items: [
          '<strong>Medicina General y Especialidades en consulta</strong> (Cardiología, Ginecología, Dermatología): 0 días (Acceso inmediato desde el Día 1).',
          '<strong>Pruebas de diagnóstico sencillas</strong> (Análisis de sangre, radiografías de huesos): 0 días (Acceso inmediato).',
          '<strong>Pruebas diagnósticas de alta tecnología</strong> (Resonancia Magnética, TAC, Ecografías 3D, Endoscopias): 3 a 6 meses de carencia.',
          '<strong>Intervenciones quirúrgicas y hospitalización</strong> (cirugías de cualquier tipo en hospital): 6 a 8 meses de carencia.',
          '<strong>Asistencia al parto y cesárea</strong> (maternidad completa): 8 a 10 meses de carencia.',
          '<strong>Tratamientos de reproducción asistida</strong> (fecundación in vitro): 24 meses de carencia.'
        ]
      },
      {
        type: 'callout',
        text: '🚑 <strong>Urgencias Vitales</strong>: Todos los periodos de carencia quedan <strong>legalmente anulados de forma inmediata</strong> en caso de accidente o urgencia médica vital que ponga en riesgo la vida del asegurado. En estas situaciones de emergencia, la aseguradora está obligada a cubrirte de inmediato.'
      },
      {
        type: 'heading-2',
        text: '¿Cómo eliminar las carencias si ya tienes seguro médico?'
      },
      {
        type: 'paragraph',
        text: 'Si ya estás asegurado en otra compañía en España durante más de un año continuo y deseas cambiarte de aseguradora, tienes derecho a solicitar la **eliminación de carencias**. Las compañías de seguros premian tu fidelidad y antigüedad respetando tus tiempos de espera. Así, al contratar tu nueva póliza de salud, podrás saltarte todas las carencias (a excepción del parto y la reproducción asistida, que casi nunca se suprimen).'
      },
      {
        type: 'paragraph',
        text: 'Para hacerlo efectivo, debes aportar la copia de la póliza de tu anterior seguro médico y el justificante del último recibo pagado para certificar tu antigüedad ininterrumpida. Si tienes dudas sobre cómo gestionar el cambio, puedes hablar con nuestros asesores en el catálogo de <a href="/productos/seguros-salud" class="text-primary hover:underline font-bold">seguros de salud de VitaBlue</a>.'
      }
    ]
  },
  {
    slug: 'preexistencias-medicas-seguro-salud',
    title: 'Preexistencias Médicas en el Seguro de Salud: Guía de Honestidad',
    category: 'salud',
    categoryLabel: 'Consejos de Salud',
    readTime: '6 min de lectura',
    date: '27 Julio 2026',
    author: {
      name: 'Lucía Delgado',
      role: 'Especialista en Seguros de Salud y Visados',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=150&auto=format&fit=crop',
      verified: true,
      linkedIn: 'https://linkedin.com'
    },
    excerpt: '¿Me cubrirán si tengo una enfermedad previa al contratar un seguro médico? Te explicamos el papel de los cuestionarios de salud y cómo evitar exclusiones futuras.',
    featuredImage: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=800&auto=format&fit=crop',
    sections: [
      {
        type: 'paragraph',
        text: 'Una de las mayores inquietudes que asaltan a cualquier persona a la hora de contratar un seguro de salud privado es saber qué ocurrirá con sus **enfermedades previas o preexistencias**. En esta guía te explicamos el marco legal en España y el porqué de la importancia vital de rellenar de forma sincera el Cuestionario de Salud.'
      },
      {
        type: 'paragraph',
        text: 'Una preexistencia médica es cualquier patología, dolencia, enfermedad o secuela de lesión que el asegurado padezca o haya padecido **antes del momento formal de la contratación** de la póliza de seguro, independientemente de si está recibiendo tratamiento médico activo o no.'
      },
      {
        type: 'heading-2',
        text: 'El Cuestionario de Salud: Un documento legal vinculante'
      },
      {
        type: 'paragraph',
        text: 'De acuerdo con el **Artículo 10 de la Ley 50/1980 de Contrato de Seguro en España**, el tomador del seguro tiene el deber de declarar al asegurador, de acuerdo con el cuestionario que este le someta, todas las circunstancias por él conocidas que puedan influir en la valoración del riesgo sanitario.'
      },
      {
        type: 'paragraph',
        text: 'Este cuestionario suele consistir en una serie de preguntas cerradas de sí o no acerca de tus antecedentes médicos familiares, intervenciones quirúrgicas pasadas, hospitalizaciones y síntomas o diagnósticos de enfermedades crónicas o agudas. La valoración de este documento es la que determina el riesgo que asume la aseguradora.'
      },
      {
        type: 'heading-2',
        text: 'Las 3 respuestas de la aseguradora ante una preexistencia'
      },
      {
        type: 'paragraph',
        text: 'Una vez completado y estudiado el cuestionario por el equipo médico de la compañía aseguradora (como Sanitas), la entidad emitirá una de las siguientes resoluciones:'
      },
      {
        type: 'list',
        items: [
          '<strong>Aceptación sin condiciones</strong>: Si tus patologías previas son leves o están completamente resueltas sin secuelas (como una apendicitis o alergias leves), la compañía te dará el alta normal con cobertura de todo su catálogo.',
          '<strong>Exclusión de cobertura</strong>: La compañía aprueba tu alta pero establece una cláusula especial indicando que no se cubrirá ningún gasto médico, tratamiento o intervención quirúrgica relacionado directamente con la dolencia preexistente declarada (ej. asma crónico, lesiones deportivas crónicas). El resto de tu salud estará cubierto con normalidad.',
          '<strong>Rechazo del asegurado</strong>: Si la persona sufre patologías de alto riesgo o tratamientos oncológicos o cardiovasculares en curso, la aseguradora puede denegar la contratación de la póliza al considerar que el riesgo es demasiado elevado.'
        ]
      },
      {
        type: 'heading-2',
        text: 'Los riesgos de mentir o silenciar enfermedades previas'
      },
      {
        type: 'paragraph',
        text: 'Declarar datos falsos u ocultar enfermedades previas en el cuestionario de salud se considera **dolo o mala fe contractual**. En caso de que necesites un tratamiento para esa dolencia oculta, la aseguradora realizará un estudio de tu historial médico (mediante informes y fechas de diagnósticos) y, al detectar el engaño, aplicará las siguientes medidas legales:'
      },
      {
        type: 'list',
        items: [
          '<strong>Rescisión inmediata de la póliza</strong>: Tu contrato del seguro quedará anulado y sin vigencia de forma automática.',
          '<strong>Denegación de pagos</strong>: La compañía no asumirá los gastos médicos derivados del tratamiento y podrá reclamarte judicialmente el reembolso de cualquier coste abonado de manera previa.',
          '<strong>Pérdida de primas</strong>: La ley faculta a la aseguradora a quedarse con las primas ya cobradas en concepto de indemnización por riesgo ocultado.'
        ]
      },
      {
        type: 'callout',
        text: '💡 <strong>Consejo del Mediador</strong>: Cada aseguradora gestiona el riesgo de manera diferente. Una dolencia excluida en una compañía puede ser aceptada por otra tras una valoración médica personalizada. No dudes en consultarlo con nuestros especialistas al configurar tu póliza en el configurador de <a href="/wizard" class="text-primary hover:underline font-bold">presupuestos de VitaBlue</a>.'
      }
    ]
  },
  {
    slug: 'student-visa-spain-health-insurance-requirements',
    alternateSlug: 'requisitos-seguro-medico-visado-estudiante-espana',
    title: 'Health Insurance Requirements for Spain Student Visa (2026 Guide)',
    category: 'visados',
    categoryLabel: 'Visas & NIE',
    readTime: '6 min read',
    date: '03 August 2026',
    author: {
      name: 'Lucía Delgado',
      role: 'Health Insurance & Visa Specialist',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=150&auto=format&fit=crop',
      verified: true,
      linkedIn: 'https://linkedin.com'
    },
    excerpt: 'Moving to Spain for study? Discover the mandatory health insurance requirements to ensure your student visa application gets approved smoothly.',
    featuredImage: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=800&auto=format&fit=crop',
    lang: 'en',
    sections: [
      {
        type: 'paragraph',
        text: 'If you are planning to move to Spain for university, a master\'s degree, PhD, or a long-term language course (more than 90 days), obtaining a student visa is mandatory under the Spanish Ministry of Foreign Affairs. Among the required documentation, health insurance is one of the most strictly audited items by immigration offices and local consulates.'
      },
      {
        type: 'paragraph',
        text: 'To avoid rejection for "lack of adequate sanitary coverage," you must contract health insurance that strictly meets the specific standards of Spanish public healthcare. Travel insurance or policies from your home country are not accepted. The market-leading policy approved for this procedure is <a href="/en/health-insurance-student-visa-spain" class="text-primary hover:underline font-bold">Sanitas International Students</a>.'
      },
      {
        type: 'heading-2',
        text: 'The 4 Mandatory Conditions Required by Spanish Immigration'
      },
      {
        type: 'paragraph',
        text: 'The certificate issued by the insurer must explicitly state that the policy complies with the following four technical criteria defined by Spanish immigration law:'
      },
      {
        type: 'list',
        items: [
          '<strong>Completely without copays (sin copagos)</strong>: You must not pay any additional amount when attending a consultation, diagnostic test, or emergency room. Policies with copays are systematically rejected.',
          '<strong>No waiting periods (sin carencias)</strong>: All medical services, from basic consultations to surgery and emergency hospitalization, must be active and covered from day one.',
          '<strong>Full coverage equivalent to public healthcare</strong>: Must cover general medicine, specialties, diagnostic tests, hospitalization, surgeries, and 24-hour emergency care.',
          '<strong>Repatriation of remains</strong>: The insurance must cover medical transport and repatriation of remains to the country of origin in case of death, usually backed by a minimum capital of €30,000.'
        ]
      },
      {
        type: 'callout',
        text: '⚠️ <strong>Official Directive</strong>: Standard travel insurance policies or medical coverage included with credit cards are <strong>not valid</strong> for student visas because they work via reimbursement limits and exclude pre-existing conditions.'
      },
      {
        type: 'heading-2',
        text: 'Official Requirements vs. VitaBlue Policies'
      },
      {
        type: 'table',
        tableHeader: ['Consular Criterion', 'Standard Travel Insurance', 'Sanitas International Students (VitaBlue)'],
        tableRows: [
          ['Coverage Limit', 'Limited (e.g. €30,000 or €50,000)', 'Unlimited (Equiv. to public health)'],
          ['Copays per visit', 'Applies deductibles/fees', '€0 (No copays)'],
          ['Waiting periods', 'Immediate but limited to emergencies', '0 days (All active)'],
          ['Repatriation', 'Optional / Limited', 'Included (No limit)']
        ]
      },
      {
        type: 'heading-2',
        text: 'How and When Is the Official Visa Certificate Generated?'
      },
      {
        type: 'paragraph',
        text: 'When you contract your student policy through VitaBlue, you can complete the signup online. The insurer immediately issues the official certificate of coverage in PDF format. This document is written in both Spanish and English, containing the authorized signature and stamps for direct submission to the Spanish consulate.'
      }
    ]
  },
  {
    slug: 'health-insurance-spain-non-lucrative-visa-requirements',
    alternateSlug: 'seguro-medico-residencia-no-lucrativa-espana',
    title: 'Health Insurance for Spain Non-Lucrative Visa: What Immigration Demands',
    category: 'visados',
    categoryLabel: 'Visas & NIE',
    readTime: '5 min read',
    date: '03 August 2026',
    author: {
      name: 'Lucía Delgado',
      role: 'Health Insurance & Visa Specialist',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=150&auto=format&fit=crop',
      verified: true,
      linkedIn: 'https://linkedin.com'
    },
    excerpt: 'The Non-Lucrative Visa (NLV) is a popular option to live in Spain. Here are the exact health insurance criteria to avoid consular rejection.',
    featuredImage: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=800&auto=format&fit=crop',
    lang: 'en',
    sections: [
      {
        type: 'paragraph',
        text: 'The Non-Lucrative Visa is designed for non-EU citizens who wish to live in Spain without working. Since you do not contribute to the Spanish Social Security system, immigration law requires you to prove you have sufficient financial resources and a private <a href="/en/health-insurance-expatriates-spain" class="text-primary hover:underline font-bold">health insurance for expats in Spain</a> contracted with an authorized insurer.'
      },
      {
        type: 'paragraph',
        text: 'The objective is to avoid foreign residents becoming a financial burden on Spain\'s public healthcare. Therefore, your private health insurance must offer coverage equivalent to the Spanish National Health System.'
      },
      {
        type: 'heading-2',
        text: 'Key Health Insurance Criteria for NLV'
      },
      {
        type: 'list',
        items: [
          '<strong>Authorized insurer in Spain</strong>: The insurer must be registered with the Spanish DGSFP (like Sanitas or Adeslas). Travel insurance or policies not registered in Spain are not accepted.',
          '<strong>No copays or deductibles</strong>: You must not pay anything out-of-pocket for medical visits.',
          '<strong>No waiting periods</strong>: Everything must be active from day one.',
          '<strong>Annual single premium payment</strong>: Consulates require proof that the policy is fully paid upfront for the year of coverage.'
        ]
      },
      {
        type: 'callout',
        text: '💡 <strong>Recommendation</strong>: For this visa, the gold standard is <a href="/productos/seguros-salud/seguros-sanitas/sanitas-mas-salud" class="text-primary hover:underline font-bold">Sanitas Más Salud</a> with no copays, paid annually.'
      }
    ]
  }
];
