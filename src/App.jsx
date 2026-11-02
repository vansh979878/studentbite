import React, { useState } from 'react';

const INITIAL_PANTRY = [
  { id: 1, name: 'Spinach', daysLeft: 1, category: 'Produce' },
  { id: 2, name: 'Eggs', daysLeft: 5, category: 'Fridge' },
  { id: 3, name: 'Pasta', daysLeft: 90, category: 'Pantry' },
  { id: 4, name: 'Canned Tuna', daysLeft: 180, category: 'Pantry' },
  { id: 5, name: 'Carrots', daysLeft: 2, category: 'Produce' },
  { id: 6, name: 'Garlic & Oil', daysLeft: 60, category: 'Pantry' },
  { id: 7, name: 'Bread', daysLeft: 2, category: 'Pantry' },
];

const RECIPES = [
  {
    id: 'r1',
    title: '12-Min Garlic Spinach Pasta',
    time: '12 mins',
    cookware: '1 pot',
    requires: ['Spinach', 'Pasta', 'Garlic & Oil'],
    portions: [
      '80g Pasta',
      '1 Handful fresh spinach',
      '1 tbsp Olive oil & minced garlic'
    ],
    steps: [
      'Boil pasta in salted water until al dente.',
      'In the last 60 seconds, dump the fresh spinach directly into the boiling water.',
      'Drain, toss with olive oil, minced garlic, salt, and pepper.'
    ]
  },
  {
    id: 'r2',
    title: 'Quick 8-Min Tuna Scramble Toast',
    time: '8 mins',
    cookware: '1 pan',
    requires: ['Eggs', 'Canned Tuna', 'Bread'],
    portions: [
      '1 Slice Bread (toasted)',
      '1 Can Tuna (drained)',
      '2 Eggs'
    ],
    steps: [
      'Toast your slice of bread.',
      'Scramble 2 eggs in a lightly oiled pan on medium heat.',
      'Fold in drained tuna during the final 30 seconds of cooking, season, and pile onto toast.'
    ]
  },
  {
    id: 'r3',
    title: 'Warm Carrot & Egg Fried Rice / Mash',
    time: '15 mins',
    cookware: '1 pan',
    requires: ['Carrots', 'Eggs', 'Garlic & Oil'],
    portions: [
      '1 Medium Carrot (grated or thinly sliced)',
      '2 Eggs',
      '1 tbsp Cooking oil & garlic'
    ],
    steps: [
      'Thinly slice or grate carrots so they cook quickly.',
      'Sauté carrots with oil and garlic until soft (approx. 5 mins).',
      'Crack an egg straight into the pan, stir vigorously into a fast warm scramble.'
    ]
  }
];

export default function App() {
  const [selectedItems, setSelectedItems] = useState(['Spinach', 'Pasta']);
  const [activeRecipe, setActiveRecipe] = useState(null);
  const [completedSteps, setCompletedSteps] = useState({});
  const [notification, setNotification] = useState('');

  const toggleItem = (name) => {
    setSelectedItems(prev =>
      prev.includes(name) ? prev.filter(item => item !== name) : [...prev, name]
    );
  };

  const toggleStep = (stepIdx) => {
    setCompletedSteps(prev => ({
      ...prev,
      [stepIdx]: !prev[stepIdx]
    }));
  };

  const handleMarkMealDone = (recipe) => {
    // Remove cooked items from active fridge inventory
    setSelectedItems(prev => prev.filter(item => !recipe.requires.includes(item)));
    setNotification(`Cooked ${recipe.title}! Deducted used ingredients from your fridge inventory.`);
    setActiveRecipe(null);
    setCompletedSteps({});
    setTimeout(() => setNotification(''), 4500);
  };

  const matchingRecipes = RECIPES.map(recipe => {
    const matchedCount = recipe.requires.filter(req => selectedItems.includes(req)).length;
    const missing = recipe.requires.filter(req => !selectedItems.includes(req));
    const canMake = missing.length === 0;
    return { ...recipe, matchedCount, missing, canMake };
  }).sort((a, b) => b.matchedCount - a.matchedCount);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans pb-16">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-6 py-4 sticky top-0 z-10 shadow-sm">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900">StudentBite</h1>
            <p className="text-xs text-slate-500">Fast single-portion meals • Zero waste</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] bg-slate-900 text-white font-semibold px-2 py-0.5 rounded">
              v3 Build
            </span>
            <span className="text-xs bg-emerald-100 text-emerald-800 font-medium px-2.5 py-1 rounded-full">
              Single Serving
            </span>
          </div>
        </div>
      </header>

      {/* Completion Toast Notification */}
      {notification && (
        <div className="max-w-2xl mx-auto px-4 mt-4">
          <div className="bg-emerald-600 text-white text-xs font-medium px-4 py-3 rounded-xl shadow flex items-center justify-between">
            <span>✓ {notification}</span>
            <button onClick={() => setNotification('')} className="font-bold text-emerald-100 hover:text-white">✕</button>
          </div>
        </div>
      )}

      <main className="max-w-2xl mx-auto px-4 mt-6 space-y-6">
        {/* Expiring Soon Banner */}
        <section className="bg-amber-50 border border-amber-200 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-amber-600 font-bold text-sm">⚠️ Use It Before It Goes Bad</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {INITIAL_PANTRY.filter(item => item.daysLeft <= 2).map(item => (
              <span
                key={item.id}
                className="text-xs bg-white border border-amber-300 text-amber-900 px-2.5 py-1 rounded-md font-medium"
              >
                {item.name} ({item.daysLeft}d left)
              </span>
            ))}
          </div>
        </section>

        {/* Inventory Selection */}
        <section className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <h2 className="font-semibold text-slate-900 text-sm mb-1">What's in your fridge right now?</h2>
          <p className="text-xs text-slate-500 mb-3">Tap the ingredients you have available</p>

          <div className="flex flex-wrap gap-2">
            {INITIAL_PANTRY.map(item => {
              const isSelected = selectedItems.includes(item.name);
              return (
                <button
                  key={item.id}
                  onClick={() => toggleItem(item.name)}
                  className={`text-xs px-3 py-1.5 rounded-full font-medium transition cursor-pointer border ${
                    isSelected
                      ? 'bg-slate-900 text-white border-slate-900'
                      : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
                  }`}
                >
                  {isSelected ? '✓ ' : '+ '} {item.name}
                </button>
              );
            })}
          </div>
        </section>

        {/* Recipes Section */}
        <section className="space-y-3">
          <h2 className="font-semibold text-slate-900 text-sm">Low-Effort Recipes ({matchingRecipes.length})</h2>

          <div className="space-y-3">
            {matchingRecipes.map(recipe => (
              <div
                key={recipe.id}
                className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm hover:border-slate-300 transition"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-base text-slate-900">{recipe.title}</h3>
                    <div className="flex gap-2 text-xs text-slate-500 mt-1">
                      <span>⏱️ {recipe.time}</span>
                      <span>•</span>
                      <span>🍳 {recipe.cookware}</span>
                    </div>
                  </div>
                  {recipe.canMake ? (
                    <span className="text-xs font-semibold bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full">
                      Ready to Cook
                    </span>
                  ) : (
                    <span className="text-xs font-medium text-rose-600 bg-rose-50 px-2.5 py-0.5 rounded-full">
                      Missing {recipe.missing.length}: {recipe.missing.join(', ')}
                    </span>
                  )}
                </div>

                <div className="mt-3 flex flex-wrap gap-1">
                  {recipe.requires.map(ing => (
                    <span
                      key={ing}
                      className={`text-[11px] px-2 py-0.5 rounded ${
                        selectedItems.includes(ing)
                          ? 'bg-emerald-50 text-emerald-700 font-medium'
                          : 'bg-slate-100 text-slate-400 line-through'
                      }`}
                    >
                      {ing}
                    </span>
                  ))}
                </div>

                <button
                  onClick={() => {
                    setActiveRecipe(activeRecipe?.id === recipe.id ? null : recipe);
                    setCompletedSteps({});
                  }}
                  className={`mt-3 w-full text-xs font-semibold py-2.5 rounded-lg transition cursor-pointer ${
                    activeRecipe?.id === recipe.id
                      ? 'bg-slate-200 text-slate-800'
                      : recipe.canMake
                      ? 'bg-slate-900 text-white hover:bg-slate-800'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  {activeRecipe?.id === recipe.id ? 'Close Steps' : 'View Quick Steps'}
                </button>

                {/* Expanded Interactive Step-by-Step Cooking View */}
                {activeRecipe?.id === recipe.id && (
                  <div className="mt-4 pt-4 border-t border-slate-100 space-y-4">
                    {/* Portion guide */}
                    <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                      <p className="text-[11px] font-bold text-slate-700 uppercase tracking-wide mb-1.5">
                        Single-Portion Breakdown:
                      </p>
                      <ul className="text-xs text-slate-600 space-y-1">
                        {recipe.portions.map((portion, idx) => (
                          <li key={idx}>• {portion}</li>
                        ))}
                      </ul>
                    </div>

                    {/* Step checklist */}
                    <div>
                      <p className="text-[11px] font-bold text-slate-700 uppercase tracking-wide mb-2">
                        Instructions (Tap step when done):
                      </p>
                      <div className="space-y-2">
                        {recipe.steps.map((step, idx) => {
                          const isDone = !!completedSteps[idx];
                          return (
                            <div
                              key={idx}
                              onClick={() => toggleStep(idx)}
                              className={`p-2.5 rounded-lg border text-xs cursor-pointer flex items-start gap-2.5 transition ${
                                isDone
                                  ? 'bg-slate-50 border-slate-200 text-slate-400 line-through'
                                  : 'bg-white border-slate-200 text-slate-700 hover:border-slate-400'
                              }`}
                            >
                              <span className={`w-4 h-4 rounded text-[10px] font-bold flex items-center justify-center shrink-0 border ${
                                isDone ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-slate-100 text-slate-600 border-slate-300'
                              }`}>
                                {isDone ? '✓' : idx + 1}
                              </span>
                              <span className="leading-relaxed">{step}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Mark meal done button */}
                    <button
                      onClick={() => handleMarkMealDone(recipe)}
                      className="w-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold py-2.5 rounded-lg transition cursor-pointer"
                    >
                      Mark Meal Done & Deduct Ingredients
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
