import {Question} from './types';

export const questions: Question[] = [
 // Emotion Category
 {
  id: 'emotion_1',
  text: 'I often feel deeply moved by art, music, or nature',
  category: 'Emotion',
  dimension: 'Sensitivity',
 },
 {
  id: 'emotion_2',
  text: 'I find it easy to understand how others are feeling',
  category: 'Emotion',
  dimension: 'Empathy',
 },
 {
  id: 'emotion_3',
  text: 'I prefer to make decisions based on logic rather than feelings',
  category: 'Emotion',
  dimension: 'Rationality',
  reverseScored: true,
 },

 // Intellect Category
 {
  id: 'intellect_1',
  text: 'I enjoy exploring abstract ideas and concepts',
  category: 'Intellect',
  dimension: 'Abstract Thinking',
 },
 {
  id: 'intellect_2',
  text: 'I frequently question conventional wisdom',
  category: 'Intellect',
  dimension: 'Critical Thinking',
 },
 {
  id: 'intellect_3',
  text: 'I prefer practical solutions over theoretical ones',
  category: 'Intellect',
  dimension: 'Pragmatism',
  reverseScored: true,
 },

 // Social Category
 {
  id: 'social_1',
  text: 'I feel energized after social gatherings',
  category: 'Social',
  dimension: 'Extraversion',
 },
 {
  id: 'social_2',
  text: 'I adapt my communication style to different people',
  category: 'Social',
  dimension: 'Adaptability',
 },
 {
  id: 'social_3',
  text: 'I prefer deep conversations over small talk',
  category: 'Social',
  dimension: 'Depth',
 },

 // Drive Category
 {
  id: 'drive_1',
  text: 'I set ambitious goals for myself',
  category: 'Drive',
  dimension: 'Ambition',
 },
 {
  id: 'drive_2',
  text: 'I persist in tasks even when they become difficult',
  category: 'Drive',
  dimension: 'Persistence',
 },
 {
  id: 'drive_3',
  text: 'I prefer a predictable routine over constant change',
  category: 'Drive',
  dimension: 'Stability',
  reverseScored: true,
 },

 // Openness Category
 {
  id: 'openness_1',
  text: 'I enjoy trying new and unfamiliar activities',
  category: 'Openness',
  dimension: 'Novelty Seeking',
 },
 {
  id: 'openness_2',
  text: 'I appreciate diverse perspectives and cultures',
  category: 'Openness',
  dimension: 'Cultural Openness',
 },

 // Resilience Category
 {
  id: 'resilience_1',
  text: 'I recover quickly from setbacks and disappointments',
  category: 'Resilience',
  dimension: 'Recovery',
 },
 {
  id: 'resilience_2',
  text: 'I maintain calm under pressure',
  category: 'Resilience',
  dimension: 'Composure',
 },
];
