import { describe, expect, it } from "vitest";
import {
  splitSurnames,
  buildSurnames,
  formatFieldsForProfile,
} from "./exportProfiles";
import type { IdentityDocumentFields } from "./types";

describe("exportProfiles", () => {
  describe("splitSurnames", () => {
    it("splits standard two surnames correctly", () => {
      expect(splitSurnames("MEDINA ZAMORA")).toEqual({
        firstSurname: "MEDINA",
        secondSurname: "ZAMORA",
      });
    });

    it("handles single surname gracefully", () => {
      expect(splitSurnames("SMITH")).toEqual({
        firstSurname: "SMITH",
        secondSurname: null,
      });
    });

    it("handles compound Spanish surnames like DE LA ROSA", () => {
      const result = splitSurnames("DE LA ROSA GOMEZ");
      expect(result.firstSurname).toBe("DE LA ROSA");
      expect(result.secondSurname).toBe("GOMEZ");
    });

    it("handles null or empty input", () => {
      expect(splitSurnames(null)).toEqual({ firstSurname: null, secondSurname: null });
      expect(splitSurnames("   ")).toEqual({ firstSurname: null, secondSurname: null });
    });
  });

  describe("buildSurnames", () => {
    it("combines both surnames into one string", () => {
      expect(buildSurnames("MEDINA", "ZAMORA")).toBe("MEDINA ZAMORA");
    });

    it("returns only first surname if second is empty or null", () => {
      expect(buildSurnames("MEDINA", null)).toBe("MEDINA");
      expect(buildSurnames("MEDINA", "")).toBe("MEDINA");
    });
  });

  describe("formatFieldsForProfile", () => {
    const sampleFields: IdentityDocumentFields = {
      documentType: "passport",
      issuingCountry: "ESP",
      fullName: "MARIA SAMPLE",
      givenNames: "MARIA",
      surnames: "SAMPLE GARCIA",
      firstSurname: "SAMPLE",
      secondSurname: "GARCIA",
      documentNumber: "P00000000",
      birthDate: "12/04/1988",
      nationality: "ESPAÑOLA",
      sex: "F",
      issueDate: "11/04/2020",
      expiryDate: "11/04/2030",
      birthplace: "MADRID",
      mrz: "P<ESPSAMPLE<<MARIA<<<<<<<<<<<<<<<<<<<<<<<<<<<",
    };

    it("formats with Aseguradora 1 (separate surnames by default)", () => {
      const formatted = formatFieldsForProfile(sampleFields, "aseguradora-1");
      expect(formatted).toContain("Primer Apellido: SAMPLE");
      expect(formatted).toContain("Segundo Apellido: GARCIA");
      expect(formatted).toContain("Nombre(s): MARIA");
      expect(formatted).toContain("Fecha de Nacimiento: 12/04/1988");
    });

    it("formats with Aseguradora 2 (grouped surnames)", () => {
      const formatted = formatFieldsForProfile(sampleFields, "aseguradora-2");
      expect(formatted).toContain("Nombre(s): MARIA");
      expect(formatted).toContain("Apellidos: SAMPLE GARCIA");
      expect(formatted).not.toContain("Primer Apellido:");
    });

    it("formats with ICAO International", () => {
      const formatted = formatFieldsForProfile(sampleFields, "icao-internacional");
      expect(formatted).toContain("Surnames: SAMPLE GARCIA");
      expect(formatted).toContain("Given Names: MARIA");
      expect(formatted).toContain("MRZ: P<ESPSAMPLE<<MARIA<<<<<<<<<<<<<<<<<<<<<<<<<<<");
    });
  });
});
