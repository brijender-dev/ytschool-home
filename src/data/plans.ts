export type Cadence = 'monthly' | 'yearly';
export type PlanId = 'viewer' | 'mastery';

export type PlanFeature = {
  id: string;
  label: string;
};

export const PLAN_FEATURES: PlanFeature[] = [
  { id: 'yt-player', label: 'YouTube video embedded player' },
  { id: 'tasks', label: 'Objectives/Tasks' },
  { id: 'course-pages', label: 'Course & Project Pages' },
  { id: 'vertical-pages', label: 'Vertical Pages' },
  { id: 'overview', label: 'Overview / Summary' },
  { id: 'resources', label: 'Resources, Additional Readings' },
  { id: 'audio-overview', label: 'Audio Overview (multiple languages)' },
  { id: 'diagrams', label: 'Visual Diagrams / Infographics' },
  { id: 'timestamped-lessons', label: 'Lessons & Explanations - mapped to video timestamps' },
  { id: 'qna', label: 'Q&A section' },
  { id: 'quiz', label: 'Assessments / Quiz' },
  { id: 'flashcards', label: 'Flashcards' },
  { id: 'mind-maps', label: 'Mind maps' },
  { id: 'notes', label: 'Notes making' },
  { id: 'roadmap-pages', label: 'Curated Roadmaps' },
  { id: 'ai-assistant', label: 'AI Assistant' },
];

export const PLAN_FEATURE_INCLUSION: Record<PlanId, Set<string>> = {
  viewer: new Set([
    'yt-player',
    'tasks',
    'course-pages',
    'vertical-pages',
    'overview',
    'resources',
  ]),
  mastery: new Set(PLAN_FEATURES.map((f) => f.id)),
};

export type MasteryPricing = {
  monthly: number;
  yearly: number;
  currency: 'INR' | 'USD';
  currencySymbol: string;
};

export const MASTERY_PRICING_INR: MasteryPricing = {
  monthly: 150,
  yearly: 1200,
  currency: 'INR',
  currencySymbol: '₹',
};

export const MASTERY_PRICING_USD: MasteryPricing = {
  monthly: 5,
  yearly: 45,
  currency: 'USD',
  currencySymbol: '$',
};

/** @deprecated Prefer region-specific pricing helpers */
export const MASTERY_PRICING = MASTERY_PRICING_INR;

export function getMasteryPricingForRegion(isIndia: boolean): MasteryPricing {
  return isIndia ? MASTERY_PRICING_INR : MASTERY_PRICING_USD;
}

export function getYearlySavings(pricing: MasteryPricing) {
  const monthlyTotal = pricing.monthly * 12;
  const saved = monthlyTotal - pricing.yearly;
  return {
    monthlyTotal,
    saved,
    percent: Math.round((saved / monthlyTotal) * 100),
  };
}
