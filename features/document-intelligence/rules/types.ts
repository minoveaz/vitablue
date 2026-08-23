import type { IdentityDocumentFields } from '../types';

export type RuleCategory = 'core_integrity' | 'insurance_policy' | 'visa_residency';

export type RuleSeverity = 'error' | 'warning' | 'info';

export interface RuleDefinition {
  id: string;
  category: RuleCategory;
  name: string;
  description: string;
  defaultSeverity: RuleSeverity;
  defaultEnabled: boolean;
  configurableThreshold?: {
    key: string;
    label: string;
    unit: string;
    defaultValue: number;
    min: number;
    max: number;
    step?: number;
  };
}

export interface RuleConfigItem {
  enabled: boolean;
  severity: RuleSeverity;
  customThresholdValue?: number;
}

export type RulesConfiguration = Record<string, RuleConfigItem>;

export interface ValidationAlert {
  ruleId: string;
  ruleName: string;
  category: RuleCategory;
  severity: RuleSeverity;
  title: string;
  message: string;
  recommendation?: string;
  affectedFields?: Array<keyof IdentityDocumentFields>;
}

export interface RuleEvaluationContext {
  today?: Date;
  customParams?: Record<string, unknown>;
}
