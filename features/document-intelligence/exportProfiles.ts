import type { IdentityDocumentFields } from "./types";

export interface ExportProfile {
  id: string;
  name: string;
  shortLabel: string;
  description: string;
  icon: string;
  format: (fields: IdentityDocumentFields) => string;
}

/**
 * Descompone una cadena de apellidos en primer y segundo apellido.
 * Maneja conectores compuestos habituales en español como 'DE', 'DEL', 'DE LA', 'DE LOS', etc.
 */
export const splitSurnames = (
  surnames: string | null | undefined,
): { firstSurname: string | null; secondSurname: string | null } => {
  if (!surnames || !surnames.trim()) {
    return { firstSurname: null, secondSurname: null };
  }

  const clean = surnames.trim().replace(/\s+/g, " ");
  const parts = clean.split(" ");

  if (parts.length === 1) {
    return { firstSurname: parts[0], secondSurname: null };
  }

  if (parts.length === 2) {
    return { firstSurname: parts[0], secondSurname: parts[1] };
  }

  // Si hay más de dos palabras, intentar detectar partículas compuestas como 'DE LA', 'DEL', 'SAN'
  const compoundPrefixes = ["DE LA", "DE LAS", "DE LOS", "SANTA", "SAN", "DEL", "DE"];
  const upper = clean.toUpperCase();

  for (const prefix of compoundPrefixes) {
    if (upper.startsWith(`${prefix} `)) {
      const rest = clean.slice(prefix.length).trim();
      const restParts = rest.split(" ");
      if (restParts.length >= 2) {
        const prefixOrig = clean.slice(0, prefix.length);
        const first = `${prefixOrig} ${restParts[0]}`;
        const second = restParts.slice(1).join(" ");
        return { firstSurname: first, secondSurname: second };
      }
    }
  }

  // Por defecto: la primera palabra es el primer apellido y el resto el segundo
  return {
    firstSurname: parts[0],
    secondSurname: parts.slice(1).join(" "),
  };
};

/**
 * Reconstruye el campo unificado de apellidos a partir del primer y segundo apellido.
 */
export const buildSurnames = (
  firstSurname: string | null | undefined,
  secondSurname: string | null | undefined,
): string | null => {
  const parts = [firstSurname?.trim(), secondSurname?.trim()].filter(Boolean);
  return parts.length > 0 ? parts.join(" ") : null;
};

/**
 * Garantiza que los campos `firstSurname` y `secondSurname` estén calculados y presentes.
 */
export const ensureAtomicSurnames = (fields: IdentityDocumentFields): IdentityDocumentFields => {
  if (fields.firstSurname !== undefined && fields.secondSurname !== undefined) {
    return fields;
  }
  const { firstSurname, secondSurname } = splitSurnames(fields.surnames);
  return {
    ...fields,
    firstSurname: fields.firstSurname ?? firstSurname,
    secondSurname: fields.secondSurname ?? secondSurname,
  };
};

/**
 * Catálogo de perfiles de exportación disponibles.
 */
export const EXPORT_PROFILES: ExportProfile[] = [
  {
    id: "aseguradora-1",
    name: "Aseguradora (Apellidos Separados)",
    shortLabel: "Aseguradora 1",
    description: "1º Apellido, 2º Apellido y Nombres en campos independientes",
    icon: "🏢",
    format: (fields: IdentityDocumentFields) => {
      const { firstSurname, secondSurname } = fields.firstSurname !== undefined
        ? { firstSurname: fields.firstSurname, secondSurname: fields.secondSurname ?? null }
        : splitSurnames(fields.surnames);

      return [
        `Primer Apellido: ${firstSurname ?? "—"}`,
        `Segundo Apellido: ${secondSurname ?? "—"}`,
        `Nombre(s): ${fields.givenNames ?? "—"}`,
        `Tipo de Documento: ${fields.documentType ?? "—"}`,
        `Número de Documento: ${fields.documentNumber ?? "—"}`,
        ...(fields.supportNumber ? [`Número de Soporte: ${fields.supportNumber}`] : []),
        `Fecha de Nacimiento: ${fields.birthDate ?? "—"}`,
        `Sexo: ${fields.sex ?? "—"}`,
        `Nacionalidad: ${fields.nationality ?? "—"}`,
        `Fecha de Caducidad: ${fields.expiryDate ?? "—"}`,
        ...(fields.address ? [`Domicilio: ${fields.address}`] : []),
      ].join("\n");
    },
  },
  {
    id: "aseguradora-2",
    name: "Aseguradora / CRM (Apellidos Juntos)",
    shortLabel: "Aseguradora 2",
    description: "Nombres agrupados y Apellidos completos agrupados",
    icon: "📑",
    format: (fields: IdentityDocumentFields) => {
      return [
        `Nombre(s): ${fields.givenNames ?? "—"}`,
        `Apellidos: ${fields.surnames ?? "—"}`,
        `Tipo de Documento: ${fields.documentType ?? "—"}`,
        `Número de Documento: ${fields.documentNumber ?? "—"}`,
        ...(fields.supportNumber ? [`Número de Soporte: ${fields.supportNumber}`] : []),
        `Fecha de Nacimiento: ${fields.birthDate ?? "—"}`,
        `Sexo: ${fields.sex ?? "—"}`,
        `Nacionalidad: ${fields.nationality ?? "—"}`,
        `Fecha de Caducidad: ${fields.expiryDate ?? "—"}`,
        ...(fields.address ? [`Domicilio: ${fields.address}`] : []),
      ].join("\n");
    },
  },
  {
    id: "icao-internacional",
    name: "ICAO / Internacional (Pasaporte)",
    shortLabel: "ICAO Oficial",
    description: "Formato internacional oficial con código MRZ y país emisor",
    icon: "🌐",
    format: (fields: IdentityDocumentFields) => {
      return [
        `Surnames: ${fields.surnames ?? "—"}`,
        `Given Names: ${fields.givenNames ?? "—"}`,
        `Document Number: ${fields.documentNumber ?? "—"}`,
        `Issuing Country: ${fields.issuingCountry ?? "—"}`,
        `Nationality: ${fields.nationality ?? "—"}`,
        `Date of Birth: ${fields.birthDate ?? "—"}`,
        `Sex: ${fields.sex ?? "—"}`,
        `Date of Expiry: ${fields.expiryDate ?? "—"}`,
        `MRZ: ${fields.mrz ?? "—"}`,
      ].join("\n");
    },
  },
];

export const DEFAULT_EXPORT_PROFILE_ID = "aseguradora-1";

/**
 * Formatea los datos de identidad según el perfil solicitado.
 */
export const formatFieldsForProfile = (
  fields: IdentityDocumentFields,
  profileId: string = DEFAULT_EXPORT_PROFILE_ID,
): string => {
  const profile = EXPORT_PROFILES.find((p) => p.id === profileId) ?? EXPORT_PROFILES[0];
  return profile.format(fields);
};
