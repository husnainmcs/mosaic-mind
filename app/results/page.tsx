'use client';

import {useEffect, useState} from 'react';
import {useRouter} from 'next/navigation';
import {calculateScores} from '../../lib/scoring';
import {UserResponse, MosaicProfile} from '../../lib/types';

export default function ResultsPage() {
 const router = useRouter();
 const [profile, setProfile] = useState<MosaicProfile | null>(null);
 const [loading, setLoading] = useState(true);
 const [aiInsightsExpanded, setAiInsightsExpanded] = useState(false);

 useEffect(() => {
  const generateResults = async () => {
   const storedResponses = localStorage.getItem('mosaicmind_responses');
   if (!storedResponses) {
    router.push('/');
    return;
   }

   try {
    const responses: UserResponse[] = JSON.parse(storedResponses);
    const calculatedProfile = await calculateScores(responses);
    setProfile(calculatedProfile);
   } catch (error) {
    console.error('Error generating results:', error);
   } finally {
    setLoading(false);
   }
  };

  generateResults();
 }, [router]);

 if (loading) {
  return (
   <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
    <div className="text-center">
     <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
     <div className="text-xl text-gray-600">
      <div>Generating your mosaic...</div>
      <div className="text-sm mt-2 text-gray-500">AI analysis in progress</div>
     </div>
    </div>
   </div>
  );
 }

 if (!profile) {
  return (
   <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
    <div className="text-xl text-gray-600">
     Error generating profile. Please try again.
    </div>
   </div>
  );
 }

 return (
  <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12">
   <div className="container mx-auto px-4 max-w-6xl">
    <div className="text-center mb-12">
     <h1 className="text-4xl font-bold text-gray-900 mb-4">
      Your MosaicMind Profile
     </h1>
     <p className="text-xl text-gray-600">
      The unique pattern of your personality
     </p>
     <div className="flex items-center justify-center mt-4 space-x-4 text-sm text-gray-500">
      <div className="flex items-center">
       <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
       AI-Powered Analysis
      </div>
      <div>•</div>
      <div>
       Generated: {new Date(profile.generatedAt!).toLocaleDateString()}
      </div>
     </div>
    </div>

    {/* AI Insights Section */}
    {profile.aiInsights && (
     <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
      <div className="flex items-center justify-between mb-6">
       <h2 className="text-2xl font-semibold text-gray-800 flex items-center">
        <span className="bg-gradient-to-r from-green-500 to-blue-500 text-white p-2 rounded-lg mr-3">
         AI
        </span>
        Personality Insights
       </h2>
       <button
        onClick={() => setAiInsightsExpanded(!aiInsightsExpanded)}
        className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
       >
        {aiInsightsExpanded ? 'Show Less' : 'Show More'}
       </button>
      </div>

      <div
       className={`prose max-w-none ${
        aiInsightsExpanded ? '' : 'line-clamp-6'
       }`}
      >
       {profile.aiInsights.split('\n').map((paragraph, index) => (
        <p key={index} className="text-gray-700 mb-4 leading-relaxed">
         {paragraph}
        </p>
       ))}
      </div>

      {!aiInsightsExpanded && (
       <div className="mt-4 text-center">
        <div className="text-sm text-gray-500">
         {Math.ceil(profile.aiInsights.split(' ').length / 200)} min read
        </div>
       </div>
      )}
     </div>
    )}

    {/* Visualization */}
    <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
     <div className="flex items-center justify-between mb-6">
      <h2 className="text-2xl font-semibold text-gray-800">
       Personality Mosaic
      </h2>
      {profile.visualization.complexity && (
       <div className="text-sm text-gray-600">
        Pattern Complexity: {profile.visualization.complexity}/100
       </div>
      )}
     </div>
     <div className="flex justify-center">
      <EnhancedRadialChart scores={profile.scores} />
     </div>
    </div>

    {/* Category Analysis */}
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
     {profile.scores.map((score) => (
      <CategoryCard key={score.category} score={score} />
     ))}
    </div>

    {/* Dimension Details */}
    <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
     <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
      Dimension Analysis
     </h2>
     <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {profile.scores.map((score) => (
       <DimensionDetails key={score.category} score={score} />
      ))}
     </div>
    </div>

    {/* Action Buttons */}
    <div className="text-center mt-12 space-x-4">
     <button
      onClick={() => router.push('/')}
      className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
     >
      Take Again
     </button>
     <button
      onClick={() => window.print()}
      className="bg-white text-indigo-600 border border-indigo-600 px-6 py-3 rounded-lg font-semibold hover:bg-indigo-50 transition-colors"
     >
      Save Results
     </button>
     <button
      onClick={() => {
       const data = {
        profile,
        generatedAt: new Date().toISOString(),
        version: 'MosaicMind AI v1.0',
       };
       const blob = new Blob([JSON.stringify(data, null, 2)], {
        type: 'application/json',
       });
       const url = URL.createObjectURL(blob);
       const a = document.createElement('a');
       a.href = url;
       a.download = `mosaicmind-profile-${new Date().getTime()}.json`;
       a.click();
      }}
      className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
     >
      Export Data
     </button>
    </div>
   </div>
  </div>
 );
}

// Enhanced Radial Chart Component
function EnhancedRadialChart({scores}: {scores: any[]}) {
 return (
  <div className="w-80 h-80 relative">
   <svg viewBox="0 0 120 120" className="w-full h-full">
    {/* Move everything to center of 120x120 viewBox */}
    <g transform="translate(60, 60)">
     
     {/* Grid circles */}
     <circle
      cx="0"
      cy="0"
      r="40"
      fill="none"
      stroke="#e5e7eb"
      strokeWidth="1"
     />
     <circle
      cx="0"
      cy="0"
      r="30"
      fill="none"
      stroke="#e5e7eb"
      strokeWidth="1"
     />
     <circle
      cx="0"
      cy="0"
      r="20"
      fill="none"
      stroke="#e5e7eb"
      strokeWidth="1"
     />
     <circle
      cx="0"
      cy="0"
      r="10"
      fill="none"
      stroke="#e5e7eb"
      strokeWidth="1"
     />

     <defs>
      <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
       <stop offset="0%" stopColor="#ef4444" />
       <stop offset="50%" stopColor="#3b82f6" />
       <stop offset="100%" stopColor="#10b981" />
      </linearGradient>
     </defs>

     {/* Connecting polygon */}
     <polygon
      points={scores
       .map((score, index) => {
        const angle = (index * 2 * Math.PI) / scores.length;
        const radius = 10 + (score.score / 100) * 30;
        const x = radius * Math.cos(angle);
        const y = radius * Math.sin(angle);
        return `${x},${y}`;
       })
       .join(' ')}
      fill="rgba(59, 130, 246, 0.1)"
      stroke="url(#gradient)"
      strokeWidth="2"
      className="transition-all duration-500"
     />

     {/* Data points */}
     {scores.map((score, index) => {
      const angle = (index * 2 * Math.PI) / scores.length;
      const radius = 10 + (score.score / 100) * 30;
      const x = radius * Math.cos(angle);
      const y = radius * Math.sin(angle);

      const color =
       score.score >= 70 ? '#10b981' : score.score >= 30 ? '#3b82f6' : '#ef4444';

      return (
       <circle
        key={score.category}
        cx={x}
        cy={y}
        r="4"
        fill={color}
        stroke="white"
        strokeWidth="1.5"
        className="transition-all duration-500"
       />
      );
     })}

     {/* Category labels with better positioning */}
     {scores.map((score, index) => {
      const angle = (index * 2 * Math.PI) / scores.length;
      const labelRadius = 46;
      const x = labelRadius * Math.cos(angle);
      const y = labelRadius * Math.sin(angle);
      
      // Determine text anchor and alignment based on angle
      let textAnchor = "middle";
      let dominantBaseline = "middle";
      
      if (Math.abs(angle) < Math.PI/6 || Math.abs(angle) > 5*Math.PI/6) {
        textAnchor = "middle";
      } else if (angle > 0 && angle < Math.PI) {
        textAnchor = "start";
      } else {
        textAnchor = "end";
      }

      if (angle > Math.PI/2 && angle < 3*Math.PI/2) {
        dominantBaseline = "text-before-edge";
      } else {
        dominantBaseline = "text-after-edge";
      }

      return (
       <text
        key={score.category}
        x={x}
        y={y}
        textAnchor={textAnchor}
        dominantBaseline={dominantBaseline}
        className="text-[7px] font-medium fill-gray-600 pointer-events-none"
        style={{
         textShadow: '0 0 3px white, 0 0 3px white, 0 0 3px white',
        }}
       >
        {score.category.toUpperCase()}
       </text>
      );
     })}

     {/* Center point */}
     <circle
      cx="0"
      cy="0"
      r="2"
      fill="#6b7280"
      className="opacity-50"
     />
    </g>
   </svg>
  </div>
 );
}

// Category Card Component
function CategoryCard({score}: {score: any}) {
 const getScoreColor = (score: number) => {
  if (score >= 70) return 'text-green-600';
  if (score >= 30) return 'text-blue-600';
  return 'text-red-600';
 };

 const getScoreBgColor = (score: number) => {
  if (score >= 70) return 'bg-green-600';
  if (score >= 30) return 'bg-blue-600';
  return 'bg-red-600';
 };

 return (
  <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
   <h3 className="text-xl font-semibold text-gray-800 mb-3">
    {score.category}
   </h3>

   {/* Score Bar */}
   <div className="mb-4">
    <div className="flex justify-between text-sm text-gray-600 mb-1">
     <span>AI-Assessed Score</span>
     <span className={`font-semibold ${getScoreColor(score.score)}`}>
      {score.score}/100
     </span>
    </div>
    <div className="w-full bg-gray-200 rounded-full h-3">
     <div
      className={`h-3 rounded-full transition-all duration-1000 ${getScoreBgColor(
       score.score
      )}`}
      style={{width: `${score.score}%`}}
     ></div>
    </div>
   </div>

   {/* Traits */}
   <div className="mb-4">
    <h4 className="font-medium text-gray-700 mb-2">Key Traits:</h4>
    <div className="flex flex-wrap gap-1">
     {score.traits.map((trait: string) => (
      <span
       key={trait}
       className="bg-indigo-100 text-indigo-800 px-2 py-1 rounded text-sm"
      >
       {trait}
      </span>
     ))}
    </div>
   </div>

   {/* AI Description */}
   <p className="text-gray-600 text-sm leading-relaxed border-t pt-3">
    {score.description}
   </p>
  </div>
 );
}

// Dimension Details Component
function DimensionDetails({score}: {score: any}) {
 if (!score.dimensions) return null;

 return (
  <div className="bg-gray-50 rounded-lg p-4">
   <h4 className="font-semibold text-gray-800 mb-3">
    {score.category} Dimensions
   </h4>
   <div className="space-y-2">
    {Object.entries(score.dimensions).map(([dimension, dimScore]) => (
     <div key={dimension} className="flex justify-between items-center">
      <span className="text-sm text-gray-600">{dimension}</span>
      <div className="flex items-center space-x-2">
       <div className="w-16 bg-gray-200 rounded-full h-2">
        <div
         className="bg-indigo-500 h-2 rounded-full"
         style={{width: `${dimScore}%`}}
        ></div>
       </div>
       <span className="text-xs text-gray-500 w-8">{`${dimScore}%`}</span>
      </div>
     </div>
    ))}
   </div>
  </div>
 );
}
