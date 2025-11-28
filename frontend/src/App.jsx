import { useEffect, useState } from "react";
import { getNotes, createNote, deleteNote, updateNote } from "./services/notesAPI";
import NoteCard from "./components/NoteCard"
function App() {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [editId, setEditId] = useState(null);

  // Load notes
  const fetchNotes = async () => {
    const data = await getNotes();
    setNotes(Array.isArray(data) ? data : data.data || []);
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (editId) {
      // UPDATE
      await updateNote(editId, { title, content });
    } else {
      // CREATE
      await createNote({ title, content });
    }

    // Refresh notes after saving
    await fetchNotes();

    // Reset form fields
    setTitle("");
    setContent("");
    setEditId(null);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Notes App</h1>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          style={{ marginRight: "10px" }}
        />
        <input
          type="text"
          placeholder="Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        />

        <button type="submit" style={{ marginLeft: "10px" }}>
          {editId ? "Update" : "Add"}
        </button>
      </form>

      <div style={{ marginTop: "20px" }}>
  {notes.length === 0 && <p>No notes found</p>}
  {notes.map((note) => (
    <NoteCard
      key={note._id}
      note={note}
      onEdit={() => {
        setEditId(note._id);
        setTitle(note.title);
        setContent(note.content);
      }}
      onDelete={async () => {
        await deleteNote(note._id);
        fetchNotes();
      }}
    />
  ))}
</div>
    </div>
  );
}

export default App;