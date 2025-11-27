import { useEffect, useState } from "react";
import { getNotes, createNote, deleteNote, updateNote } from "./services/notesAPI";

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

      <ul style={{ marginTop: "20px" }}>
        {notes.length === 0 && <p>No notes found</p>}

        {notes.map((note) => (
          <li key={note._id}>
            <strong>{note.title}:</strong> {note.content}

            {/* EDIT */}
            <button
              onClick={() => {
                setEditId(note._id);
                setTitle(note.title);
                setContent(note.content);
              }}
              style={{ marginLeft: "10px" }}
            >
              Edit
            </button>

            {/* DELETE */}
            <button
              onClick={async () => {
                await deleteNote(note._id);
                fetchNotes();
              }}
              style={{ marginLeft: "10px" }}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;