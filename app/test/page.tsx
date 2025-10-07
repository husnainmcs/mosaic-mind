'use client';

import {useState} from 'react';
import {useRouter} from 'next/navigation';
import {questions} from '../../lib/questions';
import {UserResponse} from '../../lib/types';

export default function TestPage() {
 const router = useRouter();
 const [currentQuestion, setCurrentQuestion] = useState(0);
 const [responses, setResponses] = useState<UserResponse[]>([]);

 const handleResponse = (score: number) => {
  const newResponse: UserResponse = {
   questionId: questions[currentQuestion].id,
   score,
  };

  const newResponses = [...responses, newResponse];
  setResponses(newResponses);

  if (currentQuestion < questions.length - 1) {
   setCurrentQuestion(currentQuestion + 1);
  } else {
   // Store results and navigate to results page
   localStorage.setItem('mosaicmind_responses', JSON.stringify(newResponses));
   router.push('/results');
  }
 };

 const progress = ((currentQuestion + 1) / questions.length) * 100;

 return (
  <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12">
   <div className="container mx-auto px-4 max-w-2xl">
    <div className="bg-white rounded-2xl shadow-xl p-8">
     {/* Progress Bar */}
     <div className="mb-8">
      <div className="flex justify-between text-sm text-gray-600 mb-2">
       <span>
        Question {currentQuestion + 1} of {questions.length}
       </span>
       <span>{Math.round(progress)}%</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
       <div
        className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
        style={{width: `${progress}%`}}
       ></div>
      </div>
     </div>

     {/* Question */}
     <div className="text-center mb-8">
      <h2 className="text-2xl font-semibold text-gray-800 mb-8 leading-relaxed">
       {questions[currentQuestion].text}
      </h2>
      <div className="text-sm text-indigo-600 font-medium">
       {questions[currentQuestion].category} •{' '}
       {questions[currentQuestion].dimension}
      </div>
     </div>

     {/* Likert Scale */}
     <div className="space-y-4">
      <div className="grid grid-cols-7 gap-2 mb-8">
       {[1, 2, 3, 4, 5, 6, 7].map((score) => (
        <button
         key={score}
         onClick={() => handleResponse(score)}
         className="bg-indigo-50 text-indigo-700 py-3 rounded-lg font-semibold hover:bg-indigo-100 transition-colors"
        >
         {score}
        </button>
       ))}
      </div>

      <div className="grid grid-cols-7 gap-2 text-xs text-gray-600">
       <div className="text-center">Strongly Disagree</div>
       <div className="text-center"></div>
       <div className="text-center"></div>
       <div className="text-center">Neutral</div>
       <div className="text-center"></div>
       <div className="text-center"></div>
       <div className="text-center">Strongly Agree</div>
      </div>
     </div>
    </div>
   </div>
  </div>
 );
}
