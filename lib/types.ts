export type Question = {
 id: string;
 text: string;
 category: PersonalityCategory;
 dimension: string;
 reverseScored?: boolean;
};

export type PersonalityCategory =
 | 'Emotion'
 | 'Intellect'
 | 'Social'
 | 'Drive'
 | 'Openness'
 | 'Resilience';

export type UserResponse = {
 questionId: string;
 score: number; // 1-7 Likert scale
};

export type PersonalityScore = {
 category: PersonalityCategory;
 score: number; // 0-100
 traits: string[];
 description: string;
 dimensions?: {[key: string]: number};
};

export type MosaicProfile = {
 scores: PersonalityScore[];
 visualization: {
  type: 'grid' | 'radial' | 'shape';
  data: any;
  complexity?: number;
 };
 aiInsights?: string;
 generatedAt?: string;
};
