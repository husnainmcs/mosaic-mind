'use client';

import {useEffect, useState} from 'react';
import {useRouter} from 'next/navigation';
import {calculateScores} from '../../lib/scoring';
import { UserResponse, MosaicProfile } from '../../lib/types';
import {SocialShare} from '../../lib/social-share';

export default function ResultsPage() {
 const router = useRouter();
 const [profile, setProfile] = useState<MosaicProfile | null>(null);
 const [loading, setLoading] = useState(true);
  const [aiInsightsExpanded, setAiInsightsExpanded] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

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
    <div className="text-center mt-12 space-x-4 space-y-4">
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
    {/* Social Sharing Section */}
    <div className="bg-white rounded-2xl shadow-xl p-8 mt-8">
     <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
      Share Your Results
     </h2>

     <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
      {/* Twitter Share */}
      <button
       onClick={async () => {
        setIsSharing(true);
        await SocialShare.shareToTwitter(profile);
        setIsSharing(false);
       }}
       disabled={isSharing}
       className="flex flex-col items-center justify-center p-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
      >
       <svg className="w-8 h-8 mb-2" fill="currentColor" viewBox="0 0 24 24">
        <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
       </svg>
       <span className="text-sm font-medium">Twitter</span>
      </button>

      {/* Instagram Share */}
      <button
       onClick={async () => {
        setIsSharing(true);
        await SocialShare.shareToInstagram(profile);
        setIsSharing(false);
       }}
       disabled={isSharing}
       className="flex flex-col items-center justify-center p-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:opacity-90 transition-colors disabled:opacity-50"
      >
       <svg className="w-8 h-8 mb-2" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
       </svg>
       <span className="text-sm font-medium">Instagram</span>
      </button>

      {/* LinkedIn Share */}
      <button
       onClick={async () => {
        setIsSharing(true);
        await SocialShare.shareToLinkedIn(profile);
        setIsSharing(false);
       }}
       disabled={isSharing}
       className="flex flex-col items-center justify-center p-4 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition-colors disabled:opacity-50"
      >
       <svg className="w-8 h-8 mb-2" fill="currentColor" viewBox="0 0 24 24">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
       </svg>
       <span className="text-sm font-medium">LinkedIn</span>
      </button>

      {/* Copy Link */}
      <button
       onClick={async () => {
        setIsSharing(true);
        const success = await SocialShare.copyShareableLink();
        setCopySuccess(success);
        setIsSharing(false);
        setTimeout(() => setCopySuccess(false), 3000);
       }}
       disabled={isSharing}
       className="flex flex-col items-center justify-center p-4 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50"
      >
       {copySuccess ? (
        <>
         <svg
          className="w-8 h-8 mb-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
         >
          <path
           strokeLinecap="round"
           strokeLinejoin="round"
           strokeWidth={2}
           d="M5 13l4 4L19 7"
          />
         </svg>
         <span className="text-sm font-medium">Copied!</span>
        </>
       ) : (
        <>
         <svg
          className="w-8 h-8 mb-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
         >
          <path
           strokeLinecap="round"
           strokeLinejoin="round"
           strokeWidth={2}
           d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
          />
         </svg>
         <span className="text-sm font-medium">Copy Link</span>
        </>
       )}
      </button>
     </div>

     {isSharing && (
      <div className="text-center mt-4">
       <div className="inline-flex items-center text-sm text-gray-600">
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-indigo-600 mr-2"></div>
        Preparing share...
       </div>
      </div>
     )}

     <div className="mt-6 text-center text-sm text-gray-500">
      <p>Share your unique personality mosaic with your network!</p>
      <p className="mt-1">#MosaicMind #PersonalityAssessment #SelfDiscovery</p>
     </div>
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
      
      // Determine text anchor based on angle - use proper TypeScript types
      let textAnchor: "start" | "middle" | "end" = "middle";
      
      if (Math.abs(angle) < Math.PI/6 || Math.abs(angle) > 5*Math.PI/6) {
        textAnchor = "middle";
      } else if (angle > 0 && angle < Math.PI) {
        textAnchor = "start";
      } else {
        textAnchor = "end";
      }

      // Use valid dominantBaseline values
      const dominantBaseline: "auto" | "middle" | "central" = "middle";

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
