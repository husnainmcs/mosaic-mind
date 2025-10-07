import OpenAI from 'openai';

const openai = new OpenAI({
 dangerouslyAllowBrowser: true,
 apiKey: process.env.OPENAI_API_KEY,
});

export async function generateAIPersonalityInsights(
 scores: any[],
 responses: any[]
) {
 try {
  const prompt = createAnalysisPrompt(scores, responses);

  const completion = await openai.chat.completions.create({
   model: 'gpt-4',
   messages: [
    {
     role: 'system',
     content: `You are MosaicMind AI, a personality assessment expert. Provide insightful, nuanced, and personalized analysis of personality assessment results. Focus on strengths, growth opportunities, and practical insights. Be professional yet engaging.`,
    },
    {
     role: 'user',
     content: prompt,
    },
   ],
   temperature: 0.7,
   max_tokens: 1500,
  });

  return (
   completion.choices[0]?.message?.content ||
   'Unable to generate AI analysis at this time.'
  );
 } catch (error) {
  console.error('OpenAI API error:', error);
  return 'AI analysis temporarily unavailable. Please try again later.';
 }
}

export async function generateAITraitsAndDescription(
 category: string,
 score: number,
 dimensionScores: any
) {
 try {
  const prompt = createTraitPrompt(category, score, dimensionScores);

  const completion = await openai.chat.completions.create({
   model: 'gpt-3.5-turbo',
   messages: [
    {
     role: 'system',
     content: `You are a personality psychology expert. Generate 3-4 key traits and a concise description (1-2 sentences) for a personality category based on the score. Be specific and insightful.`,
    },
    {
     role: 'user',
     content: prompt,
    },
   ],
   temperature: 0.7,
   max_tokens: 300,
  });

  const response = completion.choices[0]?.message?.content || '';
  return parseTraitResponse(response);
 } catch (error) {
  console.error('OpenAI API error:', error);
  return getFallbackTraits(category, score);
 }
}

function createAnalysisPrompt(scores: any[], responses: any[]): string {
 return `
As a personality assessment expert, analyze this MosaicMind profile:

PERSONALITY SCORES:
${scores.map((score) => `- ${score.category}: ${score.score}/100`).join('\n')}

RESPONSE PATTERNS:
${responses
 .slice(0, 5)
 .map((r) => `- Question: ${r.questionId}, Score: ${r.score}/7`)
 .join('\n')}

Please provide:
1. OVERALL PATTERN ANALYSIS: Identify the dominant personality pattern and key strengths
2. DIMENSION INTERPLAY: How different traits might interact and complement each other
3. PRACTICAL INSIGHTS: Real-world implications for work, relationships, and personal growth
4. GROWTH OPPORTUNITIES: Areas for development based on the profile
5. UNIQUE MOSAIC: What makes this personality pattern distinctive

Keep the analysis professional, insightful, and actionable. Focus on the unique combination of scores rather than treating each category in isolation.
`;
}

function createTraitPrompt(
 category: string,
 score: number,
 dimensionScores: any
): string {
 return `
Generate personality traits and description for:
- Category: ${category}
- Score: ${score}/100
- Dimension Scores: ${JSON.stringify(dimensionScores)}

Score ranges:
- 70-100: High expression of category traits
- 30-69: Moderate/balanced expression  
- 0-29: Low expression

Provide response in this exact format:
TRAITS: trait1, trait2, trait3, trait4
DESCRIPTION: 1-2 sentence description focusing on behavioral patterns and tendencies.

Be specific to the ${category} domain and make it psychologically accurate.
`;
}

function parseTraitResponse(response: string): {
 traits: string[];
 description: string;
} {
 const traitsMatch = response.match(/TRAITS:\s*(.+)/i);
 const descMatch = response.match(/DESCRIPTION:\s*(.+)/i);

 const traits = traitsMatch
  ? traitsMatch[1]
     .split(',')
     .map((t) => t.trim())
     .filter((t) => t)
  : ['Analytical', 'Adaptable', 'Balanced'];

 const description = descMatch
  ? descMatch[1].trim()
  : 'Shows a balanced pattern in this personality dimension.';

 return {traits, description};
}

function getFallbackTraits(
 category: string,
 score: number
): {traits: string[]; description: string} {
 // Fallback to original implementation if AI fails
 const traits: {
  [key: string]: {high: string[]; medium: string[]; low: string[]};
 } = {
  Emotion: {
   high: ['Empathetic', 'Intuitive', 'Expressive', 'Compassionate'],
   medium: ['Balanced', 'Aware', 'Responsive', 'Moderate'],
   low: ['Analytical', 'Detached', 'Logical', 'Objective'],
  },
  Intellect: {
   high: ['Curious', 'Analytical', 'Philosophical', 'Innovative'],
   medium: ['Practical', 'Thoughtful', 'Reasonable', 'Balanced'],
   low: ['Concrete', 'Traditional', 'Direct', 'Pragmatic'],
  },
  Social: {
   high: ['Outgoing', 'Engaging', 'Energetic', 'Sociable'],
   medium: ['Adaptable', 'Selective', 'Balanced', 'Situational'],
   low: ['Reserved', 'Independent', 'Contemplative', 'Selective'],
  },
  Drive: {
   high: ['Ambitious', 'Persistent', 'Focused', 'Determined'],
   medium: ['Steady', 'Reliable', 'Purposeful', 'Consistent'],
   low: ['Flexible', 'Easygoing', 'Spontaneous', 'Adaptable'],
  },
  Openness: {
   high: ['Adventurous', 'Innovative', 'Cosmopolitan', 'Experimental'],
   medium: ['Open-minded', 'Flexible', 'Receptive', 'Balanced'],
   low: ['Traditional', 'Stable', 'Consistent', 'Grounding'],
  },
  Resilience: {
   high: ['Robust', 'Adaptable', 'Composed', 'Recovering'],
   medium: ['Stable', 'Recovering', 'Balanced', 'Managing'],
   low: ['Sensitive', 'Reactive', 'Expressive', 'Responsive'],
  },
 };

 let traitSet: string[];
 if (score >= 70) traitSet = traits[category].high;
 else if (score >= 30) traitSet = traits[category].medium;
 else traitSet = traits[category].low;

 const descriptions: {
  [key: string]: {high: string; medium: string; low: string};
 } = {
  Emotion: {
   high:
    'You have a rich emotional landscape and are highly attuned to feelings—both your own and others.',
   medium:
    'You maintain a healthy balance between emotional awareness and rational decision-making.',
   low: 'You tend to approach situations with logical analysis rather than emotional response.',
  },
  Intellect: {
   high:
    'You thrive on intellectual challenges and enjoy exploring complex, abstract concepts.',
   medium:
    'You value both practical solutions and thoughtful analysis in equal measure.',
   low: 'You prefer concrete, tangible information and hands-on approaches to problem-solving.',
  },
  Social: {
   high:
    'You draw energy from social interactions and feel comfortable in group settings.',
   medium:
    'You adapt your social engagement based on context and personal energy levels.',
   low: 'You value solitude and deep one-on-one connections over large social gatherings.',
  },
  Drive: {
   high:
    'You are highly motivated and persistent in pursuing your goals and ambitions.',
   medium:
    'You maintain steady progress toward objectives while allowing for flexibility.',
   low: 'You prefer a more spontaneous approach to life with less rigid goal structures.',
  },
  Openness: {
   high:
    'You actively seek new experiences and embrace diverse perspectives enthusiastically.',
   medium:
    'You are open to new ideas while maintaining connection to familiar foundations.',
   low: 'You value tradition, consistency, and well-established methods and approaches.',
  },
  Resilience: {
   high:
    'You demonstrate remarkable composure and adaptability in the face of challenges.',
   medium:
    'You generally handle stress well while acknowledging your emotional responses.',
   low: 'You experience emotions intensely and may be more sensitive to environmental stressors.',
  },
 };

 let description: string;
 if (score >= 70) description = descriptions[category].high;
 else if (score >= 30) description = descriptions[category].medium;
 else description = descriptions[category].low;

 return {traits: traitSet, description};
}
