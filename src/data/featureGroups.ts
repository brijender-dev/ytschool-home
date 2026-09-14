export type FeatureIcon =
  | 'compass'
  | 'target'
  | 'layers'
  | 'mic'
  | 'sparkles'
  | 'file'
  | 'users'
  | 'calendar'
  | 'bookmark'
  | 'headphones'
  | 'play'
  | 'pin';

export type FeatureGroup = {
  id: string;
  eyebrow: string;
  title: string;
  subtitle: string;
  features: {
    icon: FeatureIcon;
    label: string;
    description: string;
    mockTitle: string;
    mockLines: string[];
  }[];
  ctaLabel: string;
  tint: 'plain' | 'tint' | 'tint-2';
  reverse?: boolean;
};

export const FEATURE_GROUPS: FeatureGroup[] = [
  {
    id: 'features-paths',
    eyebrow: 'Discover & structure',
    title: 'Curated paths that respect your time',
    subtitle:
      'Skip the YouTube rabbit hole. Start from a goal, follow a hand-picked playlist, and always know what to learn next.',
    features: [
      {
        icon: 'compass',
        label: 'Curated playlists',
        description:
          'Hand-picked videos organized by experts so you stop hunting and start learning.',
        mockTitle: 'Explore catalog',
        mockLines: ['System Design Track', 'Frontend Foundations', 'AI Literacy Path'],
      },
      {
        icon: 'target',
        label: 'Learning Goals & Paths',
        description: 'Goal-oriented checklists that bundle videos, practice, and quick bytes.',
        mockTitle: 'Learning Goals',
        mockLines: ['Goal: Crack system design', '12 topics · 4 practice sets', 'Next: CAP theorem'],
      },
      {
        icon: 'layers',
        label: 'Verticals & Domains',
        description:
          'Browse by what you want to become — engineering, design, AI, leadership and more.',
        mockTitle: 'Domains',
        mockLines: ['Software Engineering', 'Product Design', 'Data & AI'],
      },
    ],
    ctaLabel: 'Explore the catalog',
    tint: 'plain',
  },
  {
    id: 'features-topic',
    eyebrow: 'On every topic',
    title: 'Go deep on every video',
    subtitle:
      'Each topic is a complete study workspace — listen, summarize, test yourself, and capture notes anchored to the exact second.',
    features: [
      {
        icon: 'mic',
        label: 'Audio Overview',
        description: 'AI-narrated summary in your language. Perfect before or after watching.',
        mockTitle: 'Audio Overview',
        mockLines: ['English · Hindi · Spanish', '12 min summary', 'Resume from 03:42'],
      },
      {
        icon: 'sparkles',
        label: 'Quick Bytes',
        description: 'Summary, mind map, flashcards and quiz — auto-generated from the video.',
        mockTitle: 'Quick Bytes',
        mockLines: ['Summary ready', '24 flashcards', 'Quiz · 8 questions'],
      },
      {
        icon: 'file',
        label: 'Timestamped notes',
        description: 'Capture insights inline and jump back to the exact second with one click.',
        mockTitle: 'Notes',
        mockLines: [
          '02:14 — Key definition',
          '08:51 — Example walkthrough',
          '15:02 — Common pitfalls',
        ],
      },
    ],
    ctaLabel: 'See a topic in action',
    tint: 'tint',
    reverse: true,
  },
  {
    id: 'features-live',
    eyebrow: 'Together',
    title: 'Learn live, stay accountable',
    subtitle:
      'Join scheduled cohorts with instructors and peers. Miss a session? Catch the recording and keep your streak.',
    features: [
      {
        icon: 'users',
        label: 'Live cohorts',
        description: 'Real instructors, real peers, real deadlines — even if registration is still open.',
        mockTitle: 'Cohorts',
        mockLines: ['DSA Sprint · Week 3', '12 seats left', 'Starts Monday 7pm IST'],
      },
      {
        icon: 'calendar',
        label: 'Calendar & recordings',
        description: 'Your week of sessions in one view. Watch back any session you missed.',
        mockTitle: 'Calendar',
        mockLines: ['Tue · Live office hours', 'Thu · Cohort workshop', 'Sat · Recording ready'],
      },
      {
        icon: 'bookmark',
        label: 'Save & organize',
        description: 'Bookmark, mark important, or drop topics into your custom learning lists.',
        mockTitle: 'My lists',
        mockLines: ['Interview prep', 'Weekend watchlist', 'Pinned for later'],
      },
    ],
    ctaLabel: 'See upcoming cohorts',
    tint: 'plain',
  },
  {
    id: 'features-mobile',
    eyebrow: 'On the go',
    title: 'Take your learning anywhere',
    subtitle:
      'Turn long videos into background-friendly podcasts and keep learning while you commute, walk, or work out.',
    features: [
      {
        icon: 'headphones',
        label: 'My podcasts',
        description:
          'Every pinned audio overview, in one queue — built like the podcast app you already love.',
        mockTitle: 'Podcasts',
        mockLines: ['Now playing · CAP theorem', 'Queue · 6 episodes', 'Speed · 1.5x'],
      },
      {
        icon: 'play',
        label: 'Distraction-free player',
        description: 'Full-screen player with variable speed, resume, and offline-friendly playback.',
        mockTitle: 'Player',
        mockLines: ['Resume playback', 'Speed controls', 'Chapter markers'],
      },
      {
        icon: 'pin',
        label: 'One-click pin from Quick Bytes',
        description:
          'Pin a topic’s audio overview to your podcasts in one tap — and unpin just as easily.',
        mockTitle: 'Pin audio',
        mockLines: ['Pinned to My podcasts', 'Available offline soon', 'Share with cohort'],
      },
    ],
    ctaLabel: 'Try it free',
    tint: 'tint-2',
    reverse: true,
  },
];
