---
id: document-intelligence-poc
title: Document Intelligence POC for identity document extraction
status: active
created: 2026-08-14
updated: 2026-08-14
owner: vitablue
lead: null
branch: feature/document-intelligence-poc
phase: 0
pull_requests: []
issues: []
packages: []
release: not-required
areas: [backoffice, document-intelligence, ai, validation, migration]
dependencies: []
blocked_by: []
supersedes: []
---

## Outcome

Provide a focused backoffice POC that lets an operator upload one identity document, preview it, extract structured fields with Gemini, review and edit the result, validate local formats, and copy individual or all fields into an insurer management workflow.

The POC is deliberately provider-neutral at its application boundary and can later be mounted inside the canonical LoopDev shell and `SuiteCanvas`.

## Context

VitaBlue needs a practical document intake workflow before the larger editor and shell migrations continue. The first version should prove the operator experience and the extraction contract without introducing persistence, a parallel shell, or a claim of identity authenticity.

## Product boundary

This feature performs document classification, field extraction, operator review, and format validation. It does not verify document authenticity, liveness, ownership, fraud, or legal validity.

The initial operation handles one document at a time. Results are temporary by default and are cleared explicitly by the operator or when the session ends according to the selected runtime behavior.

## Scope

### Included

- Upload of JPG and PNG images.
- One-page PDF upload when the chosen preview/extraction path supports it.
- Document preview before and after extraction.
- Initial document classification for passport, Spanish DNI, Spanish NIE, and a generic Latin American national ID.
- Extraction of document type, issuing country, name, surnames/full name, document number, birth date, nationality, sex, issue date, expiry date, birthplace, and MRZ when available.
- Editable extracted values, including explicit empty or uncertain values.
- Local format validation with field-level feedback.
- Copy of an individual field and copy of all reviewed fields.
- Clear-session control and temporary document cleanup.
- Fixtures and deterministic test cases for supported document shapes.

### Excluded

- Identity authenticity or fraud verification.
- Face matching, liveness, OCR vendor benchmarking, and multi-document batch processing.
- Permanent storage, document history, or insurer-system write integration in the POC.
- API keys, Gemini SDK usage, or document bytes in the browser.
- Replacement of the current VitaBlue shell or early adoption of the unfinished official LoopDev shell.

## User flow

```text
Preparation -> Processing -> Contextual review -> Copy fields -> Clear session
```

The experience is intentionally split into two operator steps:

1. **Preparation**: the operator uploads one document, inspects the preview, and prepares the source before sending it for extraction.
2. **Review**: after processing completes, the operator reviews and edits the normalized result while keeping the source preview available.

The preparation view must support rotation, crop, replacement of the source file, and cleanup/reset. These transformations are temporary and apply only to the document submitted for extraction. The primary CTA is `Extraer y validar`; it is disabled until a usable document is ready and changes to a clear processing state while the request is in flight.

The processing state must communicate that extraction and local validation are running, prevent duplicate submissions, and preserve the prepared preview. A successful response transitions to review without discarding the source. Provider failures, unsupported files, timeouts, and incomplete results return to a recoverable preparation or review-with-warnings state with an actionable message.

In review, extracted fields are editable and retain explicit `null` values. The contextual validation panel on the right is shown only when an individual field is selected; it displays that field's value, confidence/uncertainty information, and local validation feedback. With no field selected, the review canvas remains unobstructed and shows the overall extraction status instead. The operator can correct values, copy one field or the complete reviewed payload, and clear the temporary session.

## Initial document coverage

| Type | Required behavior | Notes |
| --- | --- | --- |
| Passport | Extract identity fields and MRZ when present | MRZ is optional and must not be invented |
| Spanish DNI | Classify and extract available identity/date fields | Format validation only |
| Spanish NIE | Classify and extract available identity/date fields | Format validation only |
| Latin American national ID | Generic classification and best-effort extraction | Country-specific rules remain future work |

Absent, unreadable, or unsupported values must be represented as `null`. The extraction layer must never invent values to complete a field.

## Contract and architecture

Define a provider-independent `DocumentExtractionService` and stable request/result contracts before wiring the UI or Gemini. The contract should separate:

- Source metadata and temporary preview reference.
- Classification result and confidence/uncertainty metadata.
- Extracted fields, where absent values are `null`.
- Field-level validation results.
- Provider diagnostics safe to show to an operator without exposing document contents.

The service boundary must allow Gemini to be replaced or mocked without changing the UI contract. The insurer copy action initially produces a reviewed payload and clipboard output only; it must not imply that an external system write has occurred.

## Gemini integration boundary

Gemini must be called through a backend endpoint or server-side service. The browser must never receive the API key or call the provider directly. The endpoint should accept only the temporary document input required for extraction, return the normalized provider-independent contract, and avoid logging full document data, images, or raw provider prompts/responses.

Provider failures, unsupported formats, and low-confidence or incomplete extraction must be visible as recoverable review states rather than silently treated as valid data.

## Privacy and security

- Do not persist documents or extracted identity data by default.
- Delete temporary document material after extraction or session clear, subject to the runtime mechanism.
- Do not log full document data, images, API keys, or raw extraction payloads.
- Keep document previews and extracted data scoped to the active operator session.
- Make the distinction between extraction/format validation and authenticity verification visible in the product and technical contract.
- Define file type, size, and page-count limits before enabling the upload path.

## Validation rules

Validation is local and advisory for the POC. It should cover normalized date formats, document-number patterns where known, country/type consistency where deterministic, and required-field completeness for the selected document type. Validation must preserve the extracted value and allow operator correction; it must not convert a validation pass into an authenticity claim.

## Phases

### Phase 0: Contract and fixtures

- [x] Define provider-independent request/result types.
- [x] Define supported document types and nullable field model.
- [x] Add redacted fixtures and extraction/validation test cases.
- [ ] Define upload limits and temporary-data lifecycle.

### Phase 1: Lightweight UI

- [ ] Build the preparation state with upload, source preview, rotation, crop, replacement, and cleanup/reset controls.
- [ ] Add the `Extraer y validar` CTA with disabled, submitting, and processing/loading states.
- [ ] Build the review state with the source preview preserved, editable fields, explicit `null` values, and overall extraction status.
- [ ] Show the contextual validation panel only for the selected field; keep the review canvas unobstructed when no field is selected.
- [x] Model recoverable provider, unsupported-format, timeout, and incomplete-extraction states, including `review-with-warnings`.
- [ ] Keep the UI mounted in the existing VitaBlue backoffice surface through the local adapter.
- [ ] Make all extracted fields editable and preserve `null` values across preparation, processing, and review transitions.

### Phase 2: Gemini endpoint

- [x] Add the backend boundary for Gemini without exposing credentials to the browser.
- [ ] Normalize Gemini output into the provider-independent contract.
- [ ] Handle provider errors, unsupported documents, and incomplete results.
- [ ] Verify that sensitive payloads are absent from logs.

### Phase 3: Review, copy, and validation hardening

- [x] Add field-level format validation and clear operator feedback.
- [x] Define the transition from processing to review and preserve warnings when extraction is incomplete or low-confidence.
- [ ] Support copying one field and the complete reviewed payload.
- [ ] Add deterministic tests for preparation transformations, processing transitions, correction, missing fields, invalid formats, selected-field validation, warnings, and clear-session behavior.
- [ ] Confirm that the POC does not claim authenticity verification.

### Phase 4: LoopDev migration preparation

- [ ] Document the service and contract boundary for migration.
- [ ] Identify the canonical LoopDev shell and `SuiteCanvas` mounting point when the official shell is ready.
- [ ] Confirm that migration does not require a parallel shell or provider-specific UI contract.

## Definition of Done

- [ ] An operator can complete the preparation -> processing -> review -> copy flow for the initial document types.
- [ ] Preparation supports temporary rotation, crop, replacement, and cleanup/reset without persistence.
- [ ] `Extraer y validar` has a visible processing state and cannot be submitted twice.
- [ ] The source preview remains available during review.
- [ ] Every extracted field can be edited, copied, or left as `null`.
- [ ] The contextual validation panel appears only for the selected field and reports actionable field-level feedback.
- [ ] Incomplete, low-confidence, unsupported, and provider-error responses produce recoverable states, including `review-with-warnings` where applicable.
- [ ] Gemini credentials and raw sensitive payloads stay server-side and out of logs.
- [ ] Temporary documents and results are cleared according to the documented lifecycle.
- [ ] Tests cover the normalized contract, representative fixtures, and the main failure states.
- [ ] The provider-neutral boundary is documented for future LoopDev migration.
- [ ] `npm run typecheck`, `npm test`, and `git diff --check` pass for the delivered changes.

## Risks and pending decisions

- [ ] Select the backend endpoint/runtime available in VitaBlue without introducing a second application server unnecessarily.
- [ ] Confirm whether one-page PDF preview and Gemini input are supported by the selected implementation.
- [ ] Decide how confidence and uncertainty should be displayed without encouraging operators to treat extraction as proof of authenticity.
- [ ] Confirm the insurer management system's eventual import/copy contract; no external write is part of this POC.
- [ ] Confirm retention and deletion guarantees for the chosen temporary upload mechanism.
- [ ] Revisit the LoopDev mounting point after the official shell integration is complete.