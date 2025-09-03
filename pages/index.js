// pages/index.js
import { useState } from 'react';

// Copy the entire component from the artifact above
export default function CravioApp() {
  // ... (copy all the code from the artifact)
import { useState } from 'react';

export default function CravioApp() {
  const [mood, setMood] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [suggestion, setSuggestion] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const moodOptions = [
    { value: 'happy', emoji: '😊', label: 'Happy' },
    { value: 'sad', emoji: '😢', label: 'Sad' },
    { value: 'stressed', emoji: '😰', label: 'Stressed' },
    { value: 'excited', emoji: '🤩', label: 'Excited' },
    { value: 'tired', emoji: '😴', label: 'Tired' },
    { value: 'romantic', emoji: '💕', label: 'Romantic' },
    { value: 'adventurous', emoji: '🌟', label: 'Adventurous' },
    { value: 'cozy', emoji: '🏠', label: 'Cozy' }
  ];

  const handleSubmit = async () => {
    if (!mood || !ingredients) {
      setError('Please select a mood and enter ingredients');
      return;
    }

    setLoading(true);
    setError('');
    setSuggestion('');

    try {
      const response = await fetch('/api/meal-suggestion', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ mood, ingredients }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Something went wrong');
      }

      setSuggestion(data.suggestion);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatSuggestion = (text) => {
    return text.split('\n').map((line, index) => {
      if (line.includes('🍽️') || line.includes('👨‍🍳') || line.includes('💭')) {
        return <h3 key={index} className="text-xl font-bold mt-6 mb-3 text-orange-600">{line}</h3>;
      }
      if (line.trim() === '') {
        return <br key={index} />;
      }
      return <p key={index} className="mb-2 leading-relaxed">{line}</p>;
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            🍳 <span className="text-orange-600">Cravio</span> - AI Chef
          </h1>
          <p className="text-gray-600 text-lg">
            Tell me your mood and ingredients, and I'll create the perfect meal for you!
          </p>
        </div>

        {/* Main Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <div className="space-y-6">
            {/* Mood Selection */}
            <div>
              <label className="block text-lg font-semibold text-gray-700 mb-4">
                How are you feeling today?
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {moodOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setMood(option.value)}
                    className={`p-4 rounded-xl border-2 transition-all duration-200 hover:shadow-md ${
                      mood === option.value
                        ? 'border-orange-500 bg-orange-50 text-orange-700'
                        : 'border-gray-200 hover:border-orange-300'
                    }`}
                  >
                    <div className="text-2xl mb-1">{option.emoji}</div>
                    <div className="text-sm font-medium">{option.label}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Ingredients Input */}
            <div>
              <label htmlFor="ingredients" className="block text-lg font-semibold text-gray-700 mb-2">
                What ingredients do you have?
              </label>
              <textarea
                id="ingredients"
                value={ingredients}
                onChange={(e) => setIngredients(e.target.value)}
                placeholder="e.g., chicken, rice, tomatoes, onions, garlic..."
                className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none resize-none"
                rows="4"
              />
            </div>

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              disabled={loading || !mood || !ingredients}
              className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-4 px-8 rounded-xl font-semibold text-lg hover:from-orange-600 hover:to-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></div>
                  Creating your perfect meal...
                </div>
              ) : (
                'Get My Perfect Meal! 🍽️'
              )}
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mt-6 p-4 bg-red-100 border border-red-300 rounded-xl text-red-700">
              ❌ {error}
            </div>
          )}
        </div>

        {/* Results */}
        {suggestion && (
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
              <span className="mr-3">✨</span>
              Your Personalized Meal Suggestion
            </h2>
            <div className="prose prose-lg max-w-none">
              {formatSuggestion(suggestion)}
            </div>
            
            {/* Action Buttons */}
            <div className="mt-8 flex flex-wrap gap-4">
              <button
                onClick={() => {
                  setSuggestion('');
                  setMood('');
                  setIngredients('');
                }}
                className="bg-gray-500 text-white px-6 py-3 rounded-xl hover:bg-gray-600 transition-colors"
              >
                🔄 Try Another Mood
              </button>
              <button
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({
                      title: 'My Cravio Recipe',
                      text: suggestion
                    });
                  } else if (navigator.clipboard) {
                    navigator.clipboard.writeText(suggestion);
                    alert('Recipe copied to clipboard!');
                  }
                }}
                className="bg-blue-500 text-white px-6 py-3 rounded-xl hover:bg-blue-600 transition-colors"
              >
                📱 Share Recipe
              </button>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="text-center mt-12 text-gray-500">
          <p>Made with ❤️ by Cravio AI Chef</p>
        </div>
      </div>
    </div>
  );
}
