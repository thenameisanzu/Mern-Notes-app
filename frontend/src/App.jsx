import { useEffect, useState } from "react";
import { getNotes, createNote, deleteNote } from "./services/notesAPI";

function App() {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  useEffect(() => {
    async function fetchNotes() {
      try {
        const data = await getNotes();
        setNotes(Array.isArray(data) ? data : data.data || []);
      } catch (err) {
        console.log(err);
      }
    }
    fetchNotes();
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h1>Notes App</h1>

      <form
        onSubmit={async (e) => {
          e.preventDefault();
          const newNote = { title, content };
          await createNote(newNote);
          setTitle("");
          setContent("");
          const data = await getNotes();
          setNotes(Array.isArray(data) ? data : data.data);
        }}
      >
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
        <button type="submit">Add</button>
      </form>

      <ul style={{ marginTop: "20px" }}>
        {notes.length === 0 && <p>No notes found</p>}
        {notes.map((note) => (
          <li key={note._id}>
            <strong>{note.title}:</strong> {note.content}
            <button
              onClick={async () => {
                await deleteNote(note._id);
                const data = await getNotes();
                setNotes(Array.isArray(data) ? data : data.data);
              }}
              style={{ marginLeft: "10px", cursor: "pointer" }}
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