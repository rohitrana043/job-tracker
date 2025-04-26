// src/components/InterviewNotes.jsx
// Component for managing interview notes and preparation

import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import {
  Calendar,
  Clock,
  Edit,
  Save,
  Trash2,
  Plus,
  X,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

const InterviewNotes = ({ companyId, job, onUpdateJob }) => {
  const [notes, setNotes] = useState([]);
  const [expandedNoteId, setExpandedNoteId] = useState(null);
  const [showAddNote, setShowAddNote] = useState(false);
  const [newNote, setNewNote] = useState({
    title: '',
    date: new Date().toISOString().split('T')[0],
    content: '',
    category: 'preparation', // 'preparation', 'question', 'feedback'
    isEditing: true,
  });

  useEffect(() => {
    // Load notes from job if available
    if (job && job.interviewNotes) {
      setNotes(job.interviewNotes);
    }
  }, [job]);

  const handleSaveNotes = () => {
    // Update job with notes
    if (onUpdateJob) {
      onUpdateJob({
        ...job,
        interviewNotes: notes,
      });
    }
  };

  const toggleNoteExpand = (noteId) => {
    setExpandedNoteId(expandedNoteId === noteId ? null : noteId);
  };

  const handleAddNoteClick = () => {
    setShowAddNote(true);
  };

  const handleNewNoteChange = (e) => {
    const { name, value } = e.target;
    setNewNote({
      ...newNote,
      [name]: value,
    });
  };

  const handleSaveNewNote = () => {
    if (!newNote.title.trim()) return;

    const noteToAdd = {
      id: uuidv4(),
      title: newNote.title,
      date: newNote.date,
      content: newNote.content,
      category: newNote.category,
      createdAt: new Date().toISOString(),
    };

    const updatedNotes = [...notes, noteToAdd];
    setNotes(updatedNotes);

    // Reset form
    setNewNote({
      title: '',
      date: new Date().toISOString().split('T')[0],
      content: '',
      category: 'preparation',
      isEditing: true,
    });

    setShowAddNote(false);

    // Save to job
    handleSaveNotes();
  };

  const handleEditNote = (noteId) => {
    setNotes(
      notes.map((note) =>
        note.id === noteId ? { ...note, isEditing: true } : note
      )
    );
  };

  const handleNoteChange = (e, noteId) => {
    const { name, value } = e.target;
    setNotes(
      notes.map((note) =>
        note.id === noteId ? { ...note, [name]: value } : note
      )
    );
  };

  const handleSaveNote = (noteId) => {
    setNotes(
      notes.map((note) =>
        note.id === noteId ? { ...note, isEditing: false } : note
      )
    );

    // Save to job
    handleSaveNotes();
  };

  const handleDeleteNote = (noteId) => {
    if (window.confirm('Are you sure you want to delete this note?')) {
      const updatedNotes = notes.filter((note) => note.id !== noteId);
      setNotes(updatedNotes);

      // Save to job
      if (onUpdateJob) {
        onUpdateJob({
          ...job,
          interviewNotes: updatedNotes,
        });
      }
    }
  };

  const getCategoryBadgeClass = (category) => {
    switch (category) {
      case 'preparation':
        return 'bg-blue-100 text-blue-800';
      case 'question':
        return 'bg-purple-100 text-purple-800';
      case 'feedback':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';

    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // Group notes by category
  const groupedNotes = notes.reduce((acc, note) => {
    if (!acc[note.category]) {
      acc[note.category] = [];
    }
    acc[note.category].push(note);
    return acc;
  }, {});

  // Categories with labels
  const categories = [
    { id: 'preparation', label: 'Interview Preparation' },
    { id: 'question', label: 'Interview Questions' },
    { id: 'feedback', label: 'Feedback & Follow-up' },
  ];

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900">Interview Notes</h3>

        <button
          onClick={handleAddNoteClick}
          className="flex items-center px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          <Plus className="mr-1 h-4 w-4" />
          Add Note
        </button>
      </div>

      {/* Add Note Form */}
      {showAddNote && (
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 mb-4">
          <div className="flex justify-between items-center mb-3">
            <h4 className="font-medium text-blue-800">New Note</h4>
            <button
              onClick={() => setShowAddNote(false)}
              className="text-blue-500 hover:text-blue-700"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-blue-800 mb-1">
                Title
              </label>
              <input
                type="text"
                name="title"
                value={newNote.title}
                onChange={handleNewNoteChange}
                className="w-full px-3 py-2 border border-blue-300 rounded-md"
                placeholder="Note title"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-blue-800 mb-1">
                  Date
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Calendar className="h-4 w-4 text-blue-500" />
                  </div>
                  <input
                    type="date"
                    name="date"
                    value={newNote.date}
                    onChange={handleNewNoteChange}
                    className="w-full pl-10 px-3 py-2 border border-blue-300 rounded-md"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-blue-800 mb-1">
                  Category
                </label>
                <select
                  name="category"
                  value={newNote.category}
                  onChange={handleNewNoteChange}
                  className="w-full px-3 py-2 border border-blue-300 rounded-md"
                >
                  <option value="preparation">Interview Preparation</option>
                  <option value="question">Interview Questions</option>
                  <option value="feedback">Feedback & Follow-up</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-blue-800 mb-1">
                Content
              </label>
              <textarea
                name="content"
                value={newNote.content}
                onChange={handleNewNoteChange}
                rows="4"
                className="w-full px-3 py-2 border border-blue-300 rounded-md"
                placeholder="Enter your note here..."
              ></textarea>
            </div>

            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowAddNote(false)}
                className="px-3 py-2 border border-blue-300 text-blue-800 rounded-md hover:bg-blue-100"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveNewNote}
                className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Save Note
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Notes by Category */}
      <div className="space-y-6">
        {notes.length === 0 ? (
          <div className="text-center py-8 bg-gray-50 border border-gray-200 rounded-lg">
            <p className="text-gray-500 mb-2">No interview notes yet</p>
            <button
              onClick={handleAddNoteClick}
              className="inline-flex items-center px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              <Plus className="mr-1 h-4 w-4" />
              Add Your First Note
            </button>
          </div>
        ) : (
          categories.map((category) => {
            const categoryNotes = groupedNotes[category.id] || [];
            if (categoryNotes.length === 0) return null;

            return (
              <div
                key={category.id}
                className="border border-gray-200 rounded-lg overflow-hidden"
              >
                <h4 className="font-medium p-3 bg-gray-50 border-b border-gray-200">
                  {category.label} ({categoryNotes.length})
                </h4>

                <div className="divide-y divide-gray-200">
                  {categoryNotes.map((note) => (
                    <div key={note.id} className="p-4">
                      {note.isEditing ? (
                        <div className="space-y-3">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Title
                            </label>
                            <input
                              type="text"
                              name="title"
                              value={note.title}
                              onChange={(e) => handleNoteChange(e, note.id)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md"
                              placeholder="Note title"
                            />
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Date
                              </label>
                              <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                  <Calendar className="h-4 w-4 text-gray-400" />
                                </div>
                                <input
                                  type="date"
                                  name="date"
                                  value={note.date}
                                  onChange={(e) => handleNoteChange(e, note.id)}
                                  className="w-full pl-10 px-3 py-2 border border-gray-300 rounded-md"
                                />
                              </div>
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Category
                              </label>
                              <select
                                name="category"
                                value={note.category}
                                onChange={(e) => handleNoteChange(e, note.id)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                              >
                                <option value="preparation">
                                  Interview Preparation
                                </option>
                                <option value="question">
                                  Interview Questions
                                </option>
                                <option value="feedback">
                                  Feedback & Follow-up
                                </option>
                              </select>
                            </div>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Content
                            </label>
                            <textarea
                              name="content"
                              value={note.content}
                              onChange={(e) => handleNoteChange(e, note.id)}
                              rows="4"
                              className="w-full px-3 py-2 border border-gray-300 rounded-md"
                              placeholder="Enter your note here..."
                            ></textarea>
                          </div>

                          <div className="flex justify-end space-x-2">
                            <button
                              onClick={() => handleDeleteNote(note.id)}
                              className="px-3 py-1 border border-red-300 text-red-600 rounded-md hover:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleSaveNote(note.id)}
                              className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                            >
                              <Save className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div>
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <div className="flex items-center">
                                <h5 className="font-medium text-gray-900">
                                  {note.title}
                                </h5>
                                <span
                                  className={`ml-2 px-2 py-0.5 rounded-full text-xs ${getCategoryBadgeClass(
                                    note.category
                                  )}`}
                                >
                                  {note.category === 'preparation'
                                    ? 'Prep'
                                    : note.category === 'question'
                                    ? 'Question'
                                    : 'Feedback'}
                                </span>
                              </div>

                              <div className="flex items-center text-sm text-gray-500 mt-1">
                                <Calendar className="h-3 w-3 mr-1" />
                                {formatDate(note.date)}
                              </div>
                            </div>

                            <div className="flex space-x-1">
                              <button
                                onClick={() => handleEditNote(note.id)}
                                className="p-1 text-gray-500 hover:text-gray-700"
                              >
                                <Edit className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => toggleNoteExpand(note.id)}
                                className="p-1 text-gray-500 hover:text-gray-700"
                              >
                                {expandedNoteId === note.id ? (
                                  <ChevronUp className="h-4 w-4" />
                                ) : (
                                  <ChevronDown className="h-4 w-4" />
                                )}
                              </button>
                            </div>
                          </div>

                          {expandedNoteId === note.id && (
                            <div className="mt-3 p-3 bg-gray-50 rounded-md whitespace-pre-line">
                              {note.content}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default InterviewNotes;
