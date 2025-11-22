import { useEffect, useState } from "react";
import { getNotes } from "./services/notesAPI";

function App() {
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    async function fetchNotes() {
      try {
        const data = await getNotes();
        setNotes(Array.isArray(data) ? data : data.data || []); // safe fallback
      } catch (err) {
        console.log(err);
      }
    }
    fetchNotes();
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h1>Notes App</h1>

      {notes.length === 0 && <p>No notes found</p>}

      <ul>
        {notes.map((note) => (
          <li key={note._id}>
            <strong>{note.title}:</strong> {note.content}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;