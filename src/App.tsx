import { useState } from 'react';
import { useRecipes } from './hooks/useRecipes';
import { RecipeEditor } from './components/RecipeEditor';
import { RecipeList } from './components/RecipeList';
import type { AnvilRecipe } from './types';

function App() {
  const { 
    recipes, 
    categories,
    addRecipe, 
    updateRecipe, 
    deleteRecipe, 
    addCategory,
    updateCategory,
    deleteCategory,
    reorderCategories,
    importRecipes, 
    exportRecipes 
  } = useRecipes();
  
  const [isEditing, setIsEditing] = useState(false);
  const [currentRecipe, setCurrentRecipe] = useState<AnvilRecipe | undefined>(undefined);
  const [showImport, setShowImport] = useState(false);
  const [importString, setImportString] = useState('');

  const handleEdit = (recipe: AnvilRecipe) => {
    setCurrentRecipe(recipe);
    setIsEditing(true);
  };

  const handleAddNew = () => {
    setCurrentRecipe(undefined);
    setIsEditing(true);
  };

  const handleSave = (recipe: AnvilRecipe) => {
    if (currentRecipe) {
      updateRecipe(recipe);
    } else {
      addRecipe(recipe);
    }
    setIsEditing(false);
    setCurrentRecipe(undefined);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setCurrentRecipe(undefined);
  };

  const handleImportSubmit = () => {
      if(importString) {
          importRecipes(importString);
          setImportString('');
          setShowImport(false);
      }
  };

  const handleExport = () => {
      const data = exportRecipes(true);
      navigator.clipboard.writeText(data).then(() => {
          alert("Recipes exported to clipboard (Base64)!");
      });
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 md:p-8 font-sans">
      <div className="max-w-6xl mx-auto">
        <header className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              TFG Anvil Recipe Book
            </h1>
            <p className="text-gray-400 mt-1">Store and share your smithing sequences</p>
          </div>
          <div className="flex gap-2">
            <button
                onClick={handleAddNew}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded font-medium transition-colors"
            >
                + New Recipe
            </button>
            <button
                onClick={() => setShowImport(!showImport)}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded font-medium transition-colors"
            >
                Import
            </button>
            <button
                onClick={handleExport}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded font-medium transition-colors"
            >
                Export
            </button>
          </div>
        </header>

        {showImport && (
            <div className="mb-8 p-4 bg-gray-800 rounded border border-gray-700">
                <h3 className="font-bold mb-2">Import Recipes</h3>
                <p className="text-sm text-gray-400 mb-2">Paste a Base64 encoded recipe list.</p>
                <textarea 
                    className="w-full bg-gray-900 border border-gray-700 rounded p-2 text-sm font-mono mb-2"
                    rows={3}
                    value={importString}
                    onChange={(e) => setImportString(e.target.value)}
                    placeholder="Paste Base64 string here..."
                />
                <div className="flex justify-end gap-2">
                    <button onClick={() => setShowImport(false)} className="px-3 py-1 bg-gray-700 rounded text-sm">Cancel</button>
                    <button onClick={handleImportSubmit} className="px-3 py-1 bg-green-600 hover:bg-green-500 rounded text-sm">Import</button>
                </div>
            </div>
        )}

        <main>
          {isEditing ? (
            <RecipeEditor
              initialRecipe={currentRecipe}
              categories={categories}
              onAddCategory={addCategory}
              onSave={handleSave}
              onCancel={handleCancel}
            />
          ) : (
            <RecipeList
              recipes={recipes}
              categories={categories}
              onEdit={handleEdit}
              onDelete={deleteRecipe}
              onAddCategory={addCategory}
              onUpdateRecipe={updateRecipe}
              onUpdateCategory={updateCategory}
              onDeleteCategory={deleteCategory}
              onReorderCategories={reorderCategories}
            />
          )}
        </main>
        
        <footer className="mt-12 text-center text-gray-500 text-sm">
            <p>Built with React & Vite. Icons from <a href="https://github.com/AdrianMiller99/tfg-anvil-calculator" target="_blank" className="underline hover:text-gray-300">AdrianMiller99/tfg-anvil-calculator</a>.</p>
        </footer>
      </div>
    </div>
  );
}

export default App;
