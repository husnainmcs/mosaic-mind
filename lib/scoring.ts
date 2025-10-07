import { UserResponse, PersonalityScore, MosaicProfile, PersonalityCategory } from './types';
import {
 generateAIPersonalityInsights,
 generateAITraitsAndDescription,
} from './openai';
import { questions } from './questions';

export async function calculateScores(
 responses: UserResponse[]
): Promise<MosaicProfile> {
 const categoryScores: {[key: string]: number[]} = {};
 const categoryDimensions: {[key: string]: {[dimension: string]: number[]}} =
  {};

 // Initialize categories
 questions.forEach((q) => {
  if (!categoryScores[q.category]) {
   categoryScores[q.category] = [];
   categoryDimensions[q.category] = {};
  }
  if (!categoryDimensions[q.category][q.dimension]) {
   categoryDimensions[q.category][q.dimension] = [];
  }
 });

 // Calculate scores for each response
 responses.forEach((response) => {
  const question = questions.find((q) => q.id === response.questionId);
  if (question) {
   let score = response.score;
   if (question.reverseScored) {
    score = 8 - score; // Reverse 1-7 scale
   }
   categoryScores[question.category].push(score);
   categoryDimensions[question.category][question.dimension].push(score);
  }
 });

 // Calculate average scores per category (0-100 scale)
 const personalityScores: PersonalityScore[] = await Promise.all(
  Object.entries(categoryScores).map(async ([category, scores]) => {
   const avgScore =
    scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : 0;
   const normalizedScore = ((avgScore - 1) / 6) * 100; // Convert 1-7 to 0-100

   // Calculate dimension scores for AI analysis
   const dimensionScores: {[key: string]: number} = {};
   Object.entries(categoryDimensions[category]).forEach(
    ([dimension, dimScores]) => {
     const dimAvg = dimScores.reduce((a, b) => a + b, 0) / dimScores.length;
     dimensionScores[dimension] = Math.round(((dimAvg - 1) / 6) * 100);
    }
   );

   // Generate AI-powered traits and description
   const aiAnalysis = await generateAITraitsAndDescription(
    category,
    normalizedScore,
    dimensionScores
   );

   return {
    category: category as PersonalityCategory,
    score: Math.round(normalizedScore),
    traits: aiAnalysis.traits,
    description: aiAnalysis.description,
    dimensions: dimensionScores,
   };
  })
 );

 // Generate overall AI insights
 const aiInsights = await generateAIPersonalityInsights(
  personalityScores,
  responses
 );

 return {
  scores: personalityScores,
  visualization: generateVisualization(personalityScores),
  aiInsights: aiInsights,
  generatedAt: new Date().toISOString(),
 };
}

function generateVisualization(scores: PersonalityScore[]): any {
 // Enhanced visualization with dimension data
 return {
  type: 'radial',
  data: scores.map((score) => ({
   category: score.category,
   score: score.score,
   fullMark: 100,
   dimensions: score.dimensions || {},
  })),
  complexity: calculatePatternComplexity(scores),
 };
}

function calculatePatternComplexity(scores: PersonalityScore[]): number {
 // Calculate how complex/variegated the mosaic pattern is
 const variance =
  scores.reduce((acc, score, _, arr) => {
   const mean = arr.reduce((sum, s) => sum + s.score, 0) / arr.length;
   return acc + Math.pow(score.score - mean, 2);
  }, 0) / scores.length;

 return Math.min(100, Math.round(variance * 10));
}