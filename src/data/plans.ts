export type Cadence = 'monthly' | 'yearly';
export type PlanId = 'viewer' | 'mastery';

export type PlanFeature = {
  id: string;
  label: string;
};

export const PLAN_FEATURES: PlanFeature[] = [
  { id: 'yt-player', label: 'YouTube video embedded player' },
  { id: 'course-pages', label: 'Course & Project Pages' },
  { id: 'vertical-pages', label: 'Vertical Pages' },
  { id: 'roadmap-pages', label: 'Roadmap Pages' },
  { id: 'overview', label: 'Overview / Summary' },
  { id: 'audio-overview', label: 'Audio Overview (multiple languages)' },
  { id: 'diagrams', label: 'Visual Diagrams / Infographics' },
  { id: 'resources', label: 'Resources, Additional Readings' },
  { id: 'timestamped-lessons', label: 'Timestamped Lessons and Explanations' },
  { id: 'qna', label: 'Q&A section' },
  { id: 'quiz', label: 'Assessments / Quiz' },
  { id: 'flashcards', label: 'Flashcards' },
  { id: 'mind-maps', label: 'Mind maps' },
  { id: 'notes', label: 'Notes making' },
  { id: 'tasks', label: 'Tasks' },
  { id: 'ai-assistant', label: 'AI Assistant' },
];

export const PLAN_FEATURE_INCLUSION: Record<PlanId, Set<string>> = {
  viewer: new Set(['yt-player', 'course-pages', 'vertical-pages', 'roadmap-pages']),
  mastery: new Set(PLAN_FEATURES.map((f) => f.id)),
};

export const MASTERY_PRICING = {
  monthly: 499,
  yearly: 1999,
  currency: 'INR',
  currencySymbol: '₹',
};

export function getYearlySavings(pricing: typeof MASTERY_PRICING) {
  const monthlyTotal = pricing.monthly * 12;
  const saved = monthlyTotal - pricing.yearly;
  return {
    monthlyTotal,
    saved,
    percent: Math.round((saved / monthlyTotal) * 100),
  };
}
