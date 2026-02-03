'use client';

import { useState } from 'react';
import { Upload, FileText, Zap, Moon, Sun, CheckCircle, XCircle, Lightbulb } from 'lucide-react';

export default function Home() {
  const [darkMode, setDarkMode] = useState(false);
  const [resumeText, setResumeText] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [results, setResults] = useState(null);
  const [uploadMethod, setUploadMethod] = useState('paste'); // 'paste' or 'upload'

  // Handle PDF upload and text extraction
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.type === 'application/pdf') {
      try {
        const text = await extractTextFromPDF(file);
        setResumeText(text);
      } catch (error) {
        alert('Error reading PDF. Please try pasting text instead.');
      }
    } else {
      alert('Please upload a PDF file');
    }
  };

  // Extract text from PDF using PDF.js
  const extractTextFromPDF = async (file) => {
    const pdfjsLib = await import('pdfjs-dist');
    pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    
    let fullText = '';
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items.map(item => item.str).join(' ');
      fullText += pageText + '\n';
    }
    
    return fullText;
  };

  // Simple keyword matching algorithm
  const analyzeMatch = (resume, job) => {
    const resumeLower = resume.toLowerCase();
    const jobLower = job.toLowerCase();

    // Extract skills and keywords (common tech/professional terms)
    const commonSkills = [
      'javascript', 'python', 'java', 'react', 'node', 'sql', 'aws', 'docker',
      'kubernetes', 'git', 'agile', 'scrum', 'leadership', 'management',
      'communication', 'teamwork', 'problem solving', 'analytical', 'creative',
      'typescript', 'angular', 'vue', 'mongodb', 'postgresql', 'redis',
      'ci/cd', 'devops', 'cloud', 'azure', 'gcp', 'machine learning', 'ai',
      'data analysis', 'excel', 'powerpoint', 'project management'
    ];

    const jobSkills = commonSkills.filter(skill => jobLower.includes(skill));
    const matchingSkills = jobSkills.filter(skill => resumeLower.includes(skill));
    const missingSkills = jobSkills.filter(skill => !resumeLower.includes(skill));

    // Calculate base score
    const baseScore = jobSkills.length > 0 
      ? Math.round((matchingSkills.length / jobSkills.length) * 100)
      : 50;

    return {
      baseScore,
      matchingSkills,
      missingSkills,
      jobSkills
    };
  };

  // Call Groq API for AI-powered suggestions
  const getAISuggestions = async (resume, job, matchData) => {
    const apiKey = process.env.NEXT_PUBLIC_GROQ_API_KEY || 'YOUR_GROQ_API_KEY_HERE';
    
    if (!apiKey || apiKey === 'YOUR_GROQ_API_KEY_HERE') {
      return {
        suggestions: [
          'Add an API key to get AI-powered suggestions',
          'Set NEXT_PUBLIC_GROQ_API_KEY in your .env.local file',
          'You can get a free API key from https://console.groq.com'
        ],
        matchScore: matchData.baseScore
      };
    }

    try {
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          messages: [
            {
              role: 'user',
              content: `Analyze this resume against the job description and provide 3-5 specific, actionable improvement suggestions. 

Resume: ${resume.substring(0, 2000)}

Job Description: ${job.substring(0, 2000)}

Matching Skills: ${matchData.matchingSkills.join(', ') || 'None identified'}
Missing Skills: ${matchData.missingSkills.join(', ') || 'None identified'}

Provide concise suggestions in a JSON array format: ["suggestion 1", "suggestion 2", ...]`
            }
          ],
          temperature: 0.7,
          max_tokens: 500
        })
      });

      const data = await response.json();
      const content = data.choices[0].message.content;
      
      // Try to extract JSON array from response
      const jsonMatch = content.match(/\[[\s\S]*\]/);
      const suggestions = jsonMatch ? JSON.parse(jsonMatch[0]) : [content];

      return {
        suggestions,
        matchScore: Math.min(matchData.baseScore + 5, 100) // Slight boost for comprehensive analysis
      };
    } catch (error) {
      console.error('AI API Error:', error);
      return {
        suggestions: [
          'Highlight relevant experience that matches the job requirements',
          'Quantify your achievements with specific metrics and numbers',
          'Tailor your resume summary to align with the job description',
          'Add missing technical skills mentioned in the job posting'
        ],
        matchScore: matchData.baseScore
      };
    }
  };

  // Main analysis function
  const handleAnalyze = async () => {
    if (!resumeText.trim() || !jobDescription.trim()) {
      alert('Please provide both resume and job description');
      return;
    }

    setAnalyzing(true);
    
    try {
      // Basic keyword analysis
      const matchData = analyzeMatch(resumeText, jobDescription);
      
      // Get AI suggestions
      const aiResults = await getAISuggestions(resumeText, jobDescription, matchData);
      
      setResults({
        score: aiResults.matchScore,
        matchingSkills: matchData.matchingSkills,
        missingSkills: matchData.missingSkills,
        suggestions: aiResults.suggestions
      });
    } catch (error) {
      alert('Error analyzing. Please try again.');
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className={`min-h-screen transition-colors duration-200 ${
      darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'
    }`}>
      {/* Header */}
      <header className={`sticky top-0 z-10 backdrop-blur-lg border-b ${
        darkMode ? 'bg-gray-900/90 border-gray-800' : 'bg-white/90 border-gray-200'
      }`}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${
                darkMode ? 'bg-blue-600' : 'bg-blue-500'
              }`}>
                <Zap className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold">Resume Matcher Pro</h1>
            </div>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`p-2 rounded-lg transition-colors ${
                darkMode 
                  ? 'bg-gray-800 hover:bg-gray-700' 
                  : 'bg-gray-200 hover:bg-gray-300'
              }`}
              aria-label="Toggle dark mode"
            >
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 text-center">
          <p className={`text-lg ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Upload your resume and paste a job description to get an AI-powered match analysis
          </p>
        </div>

        {/* Input Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Resume Input */}
          <div className={`rounded-xl border p-6 ${
            darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
          }`}>
            <div className="flex items-center gap-2 mb-4">
              <FileText className="w-5 h-5 text-blue-500" />
              <h2 className="text-xl font-semibold">Your Resume</h2>
            </div>

            {/* Toggle Upload Method */}
            <div className="flex gap-2 mb-4">
              <button
                onClick={() => setUploadMethod('paste')}
                className={`flex-1 py-2 px-4 rounded-lg transition-colors ${
                  uploadMethod === 'paste'
                    ? darkMode ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white'
                    : darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700'
                }`}
              >
                Paste Text
              </button>
              <button
                onClick={() => setUploadMethod('upload')}
                className={`flex-1 py-2 px-4 rounded-lg transition-colors ${
                  uploadMethod === 'upload'
                    ? darkMode ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white'
                    : darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700'
                }`}
              >
                Upload PDF
              </button>
            </div>

            {uploadMethod === 'paste' ? (
              <textarea
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
                placeholder="Paste your resume text here..."
                className={`w-full h-64 p-4 rounded-lg border resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  darkMode 
                    ? 'bg-gray-900 border-gray-600 text-white placeholder-gray-500' 
                    : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-400'
                }`}
              />
            ) : (
              <div className={`border-2 border-dashed rounded-lg p-8 text-center ${
                darkMode ? 'border-gray-600' : 'border-gray-300'
              }`}>
                <Upload className={`w-12 h-12 mx-auto mb-4 ${
                  darkMode ? 'text-gray-500' : 'text-gray-400'
                }`} />
                <label className="cursor-pointer">
                  <span className="text-blue-500 hover:text-blue-600 font-medium">
                    Click to upload PDF
                  </span>
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
                {resumeText && (
                  <p className="mt-4 text-sm text-green-500">✓ PDF loaded successfully</p>
                )}
              </div>
            )}
          </div>

          {/* Job Description Input */}
          <div className={`rounded-xl border p-6 ${
            darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
          }`}>
            <div className="flex items-center gap-2 mb-4">
              <FileText className="w-5 h-5 text-green-500" />
              <h2 className="text-xl font-semibold">Job Description</h2>
            </div>
            <textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste the job description here..."
              className={`w-full h-64 p-4 rounded-lg border resize-none focus:outline-none focus:ring-2 focus:ring-green-500 ${
                darkMode 
                  ? 'bg-gray-900 border-gray-600 text-white placeholder-gray-500' 
                  : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-400'
              }`}
            />
          </div>
        </div>

        {/* Analyze Button */}
        <div className="text-center mb-8">
          <button
            onClick={handleAnalyze}
            disabled={analyzing}
            className={`px-8 py-4 rounded-xl font-semibold text-lg transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none ${
              darkMode 
                ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                : 'bg-blue-500 hover:bg-blue-600 text-white'
            }`}
          >
            {analyzing ? (
              <span className="flex items-center gap-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Analyzing...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Zap className="w-5 h-5" />
                Analyze & Match
              </span>
            )}
          </button>
        </div>

        {/* Results Section */}
        {results && (
          <div className={`rounded-xl border p-6 sm:p-8 ${
            darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
          }`}>
            <h2 className="text-2xl font-bold mb-6">Analysis Results</h2>

            {/* Match Score */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-2">
                <span className="text-lg font-semibold">Match Score</span>
                <span className={`text-3xl font-bold ${
                  results.score >= 70 ? 'text-green-500' : 
                  results.score >= 40 ? 'text-yellow-500' : 'text-red-500'
                }`}>
                  {results.score}%
                </span>
              </div>
              <div className={`h-4 rounded-full overflow-hidden ${
                darkMode ? 'bg-gray-700' : 'bg-gray-200'
              }`}>
                <div
                  className={`h-full transition-all duration-1000 ${
                    results.score >= 70 ? 'bg-green-500' : 
                    results.score >= 40 ? 'bg-yellow-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${results.score}%` }}
                />
              </div>
            </div>

            {/* Matching Skills */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <h3 className="text-lg font-semibold">Matching Skills</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {results.matchingSkills.length > 0 ? (
                  results.matchingSkills.map((skill, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 rounded-full text-sm font-medium bg-green-500/20 text-green-500 border border-green-500/30"
                    >
                      {skill}
                    </span>
                  ))
                ) : (
                  <p className={darkMode ? 'text-gray-400' : 'text-gray-500'}>
                    No specific matching skills identified
                  </p>
                )}
              </div>
            </div>

            {/* Missing Skills */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <XCircle className="w-5 h-5 text-red-500" />
                <h3 className="text-lg font-semibold">Missing Skills</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {results.missingSkills.length > 0 ? (
                  results.missingSkills.map((skill, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 rounded-full text-sm font-medium bg-red-500/20 text-red-500 border border-red-500/30"
                    >
                      {skill}
                    </span>
                  ))
                ) : (
                  <p className="text-green-500">All key skills are present!</p>
                )}
              </div>
            </div>

            {/* AI Suggestions */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Lightbulb className="w-5 h-5 text-yellow-500" />
                <h3 className="text-lg font-semibold">Improvement Suggestions</h3>
              </div>
              <ul className="space-y-3">
                {results.suggestions.map((suggestion, idx) => (
                  <li
                    key={idx}
                    className={`p-4 rounded-lg ${
                      darkMode ? 'bg-gray-900' : 'bg-gray-50'
                    }`}
                  >
                    <span className="font-medium text-blue-500">{idx + 1}.</span>{' '}
                    {suggestion}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className={`mt-16 border-t ${
        darkMode ? 'border-gray-800' : 'border-gray-200'
      }`}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 text-center">
          <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
            Built with Next.js, Tailwind CSS, and AI-powered by Groq
          </p>
        </div>
      </footer>
    </div>
  );
}
