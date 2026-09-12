import React, { useState } from 'react';
import { useSharedStateStore } from '../../store/useSharedStateStore';
import { useRoomStore } from '../../store/useRoomStore';
import { socketClient } from '../../socket/socketClient';
import { SharedNote } from '../../types/state';
import { Plus, Trash2, StickyNote, Edit3 } from 'lucide-react';

const NOTE_COLORS = [
  { bg: '#fef08a', text: '#713f12', border: '#fde047', label: 'Yellow' },
  { bg: '#bae6fd', text: '#0c4a6e', border: '#7dd3fc', label: 'Blue' },
  { bg: '#bbf7d0', text: '#14532d', border: '#86efac', label: 'Green' },
  { bg: '#fbcfe8', text: '#831843', border: '#f472b6', label: 'Pink' },
  { bg: '#e9d5ff', text: '#581c87', border: '#d8b4fe', label: 'Purple' },
];

export const SharedNotes: React.FC = () => {
  const notes = useSharedStateStore((s) => s.notes);
  const currentUser = useRoomStore((s) => s.currentUser);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newColor, setNewColor] = useState(NOTE_COLORS[0].bg);

  const handleAddNote = () => {
    const newNote: SharedNote = {
      id: `note-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      x: Math.floor(Math.random() * 60) + 20,
      y: Math.floor(Math.random() * 40) + 20,
      color: newColor,
      content: 'Click here to edit note...',
      author: currentUser?.username || 'You',
      authorId: currentUser?.id || 'you',
      updatedAt: Date.now(),
    };

    socketClient.emitNoteCreate(newNote);
    useRoomStore.getState().addActivity({
      type: 'note',
      username: currentUser?.username || 'You',
      text: 'created a new sticky note',
    });
    setEditingId(newNote.id);
  };

  const handleUpdateContent = (id: string, content: string) => {
    socketClient.emitNoteUpdate(id, { content });
  };

  const handleDeleteNote = (id: string) => {
    socketClient.emitNoteDelete(id);
    useRoomStore.getState().addActivity({
      type: 'note',
      username: currentUser?.username || 'You',
      text: 'deleted a sticky note',
    });
  };

  return (
    <div className="p-5 rounded-3xl bg-slate-900/70 border border-slate-800/80 backdrop-blur-xl shadow-xl">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400">
            <StickyNote size={16} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">Shared Sticky Notes Board</h3>
            <p className="text-[11px] text-slate-400">Miro-style synchronized idea cards</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Color choice for new note */}
          <div className="flex items-center gap-1 bg-slate-950/60 p-1 rounded-xl border border-slate-800">
            {NOTE_COLORS.map((c) => (
              <button
                key={c.bg}
                onClick={() => setNewColor(c.bg)}
                className={`w-5 h-5 rounded-lg transition-transform cursor-pointer ${
                  newColor === c.bg ? 'scale-110 ring-2 ring-indigo-500' : 'opacity-70 hover:opacity-100'
                }`}
                style={{ backgroundColor: c.bg }}
                title={c.label}
              />
            ))}
          </div>

          <button
            onClick={handleAddNote}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs font-semibold transition-all shadow-sm active:scale-95 cursor-pointer"
          >
            <Plus size={14} />
            <span>Add Note</span>
          </button>
        </div>
      </div>

      {/* Grid of Notes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 max-h-[360px] overflow-y-auto pr-1">
        {notes.map((note) => {
          const isEditing = editingId === note.id;
          const colorConfig = NOTE_COLORS.find((c) => c.bg === note.color) || NOTE_COLORS[0];

          return (
            <div
              key={note.id}
              className="group relative p-4 rounded-2xl shadow-md border transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg flex flex-col justify-between min-h-[140px]"
              style={{
                backgroundColor: note.color,
                borderColor: colorConfig.border,
                color: colorConfig.text,
              }}
            >
              <div className="flex items-start justify-between gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider opacity-60">
                  By {note.author}
                </span>

                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => setEditingId(isEditing ? null : note.id)}
                    className="p-1 rounded-lg hover:bg-black/10 transition-colors cursor-pointer"
                    title={isEditing ? 'Done' : 'Edit'}
                  >
                    <Edit3 size={13} />
                  </button>
                  <button
                    onClick={() => handleDeleteNote(note.id)}
                    className="p-1 rounded-lg hover:bg-black/10 text-rose-600 transition-colors cursor-pointer"
                    title="Delete Note"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>

              {isEditing ? (
                <textarea
                  value={note.content}
                  onChange={(e) => handleUpdateContent(note.id, e.target.value)}
                  onBlur={() => setEditingId(null)}
                  autoFocus
                  className="w-full my-2 bg-white/40 border border-black/10 rounded-lg p-2 text-xs font-medium resize-none focus:outline-none focus:ring-1 focus:ring-black/20"
                  rows={3}
                />
              ) : (
                <p
                  onClick={() => setEditingId(note.id)}
                  className="my-2 text-xs font-medium whitespace-pre-wrap leading-relaxed cursor-text flex-1"
                >
                  {note.content}
                </p>
              )}

              <div className="flex items-center justify-between text-[9px] opacity-60 font-mono mt-2 pt-2 border-t border-black/10">
                <span>Sticky #{note.id.slice(-4)}</span>
                <span>Click text to edit</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
