export type AiCopyObjective =
  | 'conversion'
  | 'awareness'
  | 'education'
  | 'trust'
  | 'retention';

export type AiCopyType = 'hook' | 'headline' | 'cta' | 'body' | 'script';
export type AiCopyTone = 'professional' | 'warm' | 'direct' | 'inspiring' | 'urgent';
export type AiCopyAudience = 'students' | 'families' | 'digital-nomads' | 'companies' | 'expats';
export type AiCopyFormat = 'short' | 'social' | 'story' | 'carousel' | 'email';

export interface AiCopyRequest {
  objective: AiCopyObjective;
  type: AiCopyType;
  tone: AiCopyTone;
  audience: AiCopyAudience;
  format: AiCopyFormat;
  quantity?: number;
}

export interface AiCopyProposal {
  id: string;
  text: string;
  title: string;
  rationale: string;
  request: AiCopyRequest;
  sourceText?: string;
  isMock?: boolean;
}

/**
 * Provider boundary for copy generation. Implementations must be side-effect
 * free from the editor's perspective and must not know about React or layers.
 */
export interface AiCopyProvider {
  readonly id: string;
  generate(request: AiCopyRequest): Promise<AiCopyProposal[]>;
  adapt(request: AiCopyRequest, sourceText: string): Promise<AiCopyProposal[]>;
}

/**
 * Transport boundary reserved for a future Gemini adapter. Keeping the
 * transport injectable means the editor never needs an API key or env access.
 */
export interface GeminiAiCopyTransport {
  generate(request: AiCopyRequest): Promise<AiCopyProposal[]>;
  adapt(request: AiCopyRequest, sourceText: string): Promise<AiCopyProposal[]>;
}
