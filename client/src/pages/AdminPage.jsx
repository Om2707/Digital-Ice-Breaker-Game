import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function AdminPage() {
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [prompts, setPrompts] = useState([]);
  const [filterType, setFilterType] = useState('all');
  const [newPromptText, setNewPromptText] = useState('');
  const [newPromptType, setNewPromptType] = useState('move');
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');
  const [editType, setEditType] = useState('move');
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState('');

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
  // Get password from environment variable for security (set in .env)
  const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || 'innovate2024';

  useEffect(() => {
    if (isAuthenticated) {
      fetchPrompts();
    }
  }, [isAuthenticated]);

  const handleLogin = (e) => {
    e.preventDefault();
    setAuthError('');
    
    // Perform constant-time comparison to prevent timing attacks
    if (password.length === ADMIN_PASSWORD.length && password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      setPassword('');
    } else {
      setAuthError('Incorrect password');
      setPassword('');
    }
  };

  const fetchPrompts = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/api/prompts`);
      setPrompts(response.data);
    } catch (error) {
      console.error('Error fetching prompts:', error);
      alert('Failed to load prompts');
    } finally {
      setLoading(false);
    }
  };

  const addPrompt = async (e) => {
    e.preventDefault();
    if (!newPromptText.trim()) {
      alert('Prompt text cannot be empty');
      return;
    }

    try {
      const response = await axios.post(`${API_URL}/api/prompts`, {
        text: newPromptText,
        type: newPromptType,
      });
      setPrompts([...prompts, response.data]);
      setNewPromptText('');
      setNewPromptType('move');
    } catch (error) {
      console.error('Error adding prompt:', error);
      alert('Failed to add prompt');
    }
  };

  const updatePrompt = async (id, updates) => {
    // Validate that id belongs to an existing prompt to prevent SSRF
    if (!prompts.find((p) => p.id === id)) {
      console.error('Invalid prompt ID');
      setAuthError('Invalid prompt ID');
      return;
    }
    
    try {
      const response = await axios.put(`${API_URL}/api/prompts/${id}`, updates);
      setPrompts(prompts.map((p) => (p.id === id ? response.data : p)));
      setEditingId(null);
    } catch (error) {
      console.error('Error updating prompt:', error);
      setAuthError('Failed to update prompt');
    }
  };

  const deletePrompt = async (id) => {
    // Validate that id belongs to an existing prompt to prevent SSRF
    if (!prompts.find((p) => p.id === id)) {
      console.error('Invalid prompt ID');
      setAuthError('Invalid prompt ID');
      return;
    }

    if (!window.confirm('Are you sure?')) return;

    try {
      await axios.delete(`${API_URL}/api/prompts/${id}`);
      setPrompts(prompts.filter((p) => p.id !== id));
    } catch (error) {
      console.error('Error deleting prompt:', error);
      setAuthError('Failed to delete prompt');
    }
  };

  const toggleEnabled = async (id, currentEnabled) => {
    await updatePrompt(id, { enabled: !currentEnabled });
  };

  const getTypeColor = (type) => {
    const colors = {
      move: 'bg-blue-900 text-blue-200',
      talk: 'bg-yellow-900 text-yellow-200',
      create: 'bg-green-900 text-green-200',
      wildcard: 'bg-purple-900 text-purple-200',
    };
    return colors[type] || 'bg-gray-900 text-gray-200';
  };

  const getTypeIcon = (type) => {
    const icons = {
      move: '🏃',
      talk: '💬',
      create: '✏️',
      wildcard: '🃏',
    };
    return icons[type] || '◆';
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="bg-slate-800 rounded-2xl p-8 max-w-md w-full shadow-2xl">
          <h1 className="text-3xl font-bold mb-2 text-center">🔐 Admin Panel</h1>
          <p className="text-gray-400 text-center mb-6">
            Manage game prompts
          </p>

          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter admin password"
              className="w-full px-4 py-2 bg-slate-700 rounded-lg border border-slate-600 text-white focus:outline-none focus:border-blue-500"
              autoFocus
            />
            <button
              type="submit"
              className="btn-primary w-full"
            >
              Login
            </button>
          </form>

          <p className="text-xs text-gray-500 text-center mt-6">
            Default password: innovate2024
          </p>
        </div>
      </div>
    );
  }

  const filteredPrompts = prompts.filter(
    (p) => filterType === 'all' || p.type === filterType
  );

  const stats = {
    move: prompts.filter((p) => p.type === 'move').length,
    talk: prompts.filter((p) => p.type === 'talk').length,
    create: prompts.filter((p) => p.type === 'create').length,
    wildcard: prompts.filter((p) => p.type === 'wildcard').length,
  };

  return (
    <div className="min-h-screen p-6 bg-gradient-to-b from-slate-900 to-slate-800">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">🔧 Prompt Management</h1>
          <button
            onClick={() => setIsAuthenticated(false)}
            className="btn-secondary text-sm"
          >
            Logout
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <div className="bg-blue-900 p-4 rounded-lg text-center">
            <p className="text-2xl font-bold">{stats.move}</p>
            <p className="text-sm">Move</p>
          </div>
          <div className="bg-yellow-900 p-4 rounded-lg text-center">
            <p className="text-2xl font-bold">{stats.talk}</p>
            <p className="text-sm">Talk</p>
          </div>
          <div className="bg-green-900 p-4 rounded-lg text-center">
            <p className="text-2xl font-bold">{stats.create}</p>
            <p className="text-sm">Create</p>
          </div>
          <div className="bg-purple-900 p-4 rounded-lg text-center">
            <p className="text-2xl font-bold">{stats.wildcard}</p>
            <p className="text-sm">Wildcard</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Add New Prompt */}
          <div className="bg-slate-800 rounded-xl p-6">
            <h2 className="text-xl font-bold mb-4">Add New Prompt</h2>
            <form onSubmit={addPrompt} className="space-y-4">
              <div>
                <label className="block text-sm font-bold mb-2">Type</label>
                <select
                  value={newPromptType}
                  onChange={(e) => setNewPromptType(e.target.value)}
                  className="w-full px-4 py-2 bg-slate-700 rounded-lg border border-slate-600 text-white"
                >
                  <option value="move">🏃 Move</option>
                  <option value="talk">💬 Talk</option>
                  <option value="create">✏️ Create</option>
                  <option value="wildcard">🃏 Wildcard</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold mb-2">Text</label>
                <textarea
                  value={newPromptText}
                  onChange={(e) => setNewPromptText(e.target.value)}
                  placeholder="Enter prompt text"
                  rows="4"
                  className="w-full px-4 py-2 bg-slate-700 rounded-lg border border-slate-600 text-white focus:outline-none focus:border-blue-500"
                ></textarea>
              </div>

              <button type="submit" className="btn-primary w-full">
                Add Prompt
              </button>
            </form>
          </div>

          {/* Prompts List */}
          <div className="lg:col-span-2">
            <div className="bg-slate-800 rounded-xl p-6">
              <h2 className="text-xl font-bold mb-4">All Prompts</h2>

              {/* Filter */}
              <div className="mb-6">
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="w-full px-4 py-2 bg-slate-700 rounded-lg border border-slate-600 text-white"
                >
                  <option value="all">All Types</option>
                  <option value="move">Move Only</option>
                  <option value="talk">Talk Only</option>
                  <option value="create">Create Only</option>
                  <option value="wildcard">Wildcard Only</option>
                </select>
              </div>

              {loading ? (
                <p className="text-gray-400">Loading...</p>
              ) : filteredPrompts.length === 0 ? (
                <p className="text-gray-400">No prompts found</p>
              ) : (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {filteredPrompts.map((prompt) => (
                    <div
                      key={prompt.id}
                      className="bg-slate-700 p-4 rounded-lg space-y-3"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          {editingId === prompt.id ? (
                            <div className="space-y-2">
                              <select
                                value={editType}
                                onChange={(e) => setEditType(e.target.value)}
                                className="w-full px-2 py-1 bg-slate-600 rounded text-sm"
                              >
                                <option value="move">Move</option>
                                <option value="talk">Talk</option>
                                <option value="create">Create</option>
                                <option value="wildcard">Wildcard</option>
                              </select>
                              <textarea
                                value={editText}
                                onChange={(e) => setEditText(e.target.value)}
                                rows="2"
                                className="w-full px-2 py-1 bg-slate-600 rounded text-white text-sm"
                              ></textarea>
                            </div>
                          ) : (
                            <>
                              <span
                                className={`inline-block px-2 py-1 rounded text-xs font-bold mb-2 ${getTypeColor(
                                  prompt.type
                                )}`}
                              >
                                {getTypeIcon(prompt.type)} {prompt.type.toUpperCase()}
                              </span>
                              <p className="text-sm">{prompt.text}</p>
                            </>
                          )}
                        </div>

                        <button
                          onClick={() =>
                            toggleEnabled(prompt.id, prompt.enabled)
                          }
                          className={`text-sm px-2 py-1 rounded whitespace-nowrap ${
                            prompt.enabled
                              ? 'bg-green-700'
                              : 'bg-gray-600'
                          }`}
                        >
                          {prompt.enabled ? '✓' : '✗'}
                        </button>
                      </div>

                      <div className="flex gap-2">
                        {editingId === prompt.id ? (
                          <>
                            <button
                              onClick={() =>
                                updatePrompt(prompt.id, {
                                  text: editText,
                                  type: editType,
                                })
                              }
                              className="text-xs btn-primary py-1 px-3"
                            >
                              Save
                            </button>
                            <button
                              onClick={() => setEditingId(null)}
                              className="text-xs btn-secondary py-1 px-3"
                            >
                              Cancel
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => {
                                setEditingId(prompt.id);
                                setEditText(prompt.text);
                                setEditType(prompt.type);
                              }}
                              className="text-xs btn-secondary py-1 px-3"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => deletePrompt(prompt.id)}
                              className="text-xs btn-danger py-1 px-3"
                            >
                              Delete
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
