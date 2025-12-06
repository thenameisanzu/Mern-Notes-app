import { useEffect, useState } from "react";
import styled from "styled-components";
import { getNotes, createNote, deleteNote, updateNote } from "./services/notesAPI";

// --- Styled Components ---

const AppWrapper = styled.div`
  min-height: 100vh;
  display: flex;
  justify-content: center;
  padding: 40px 16px;
  background: #f3f4f6;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
`;

const Card = styled.div`
  width: 100%;
  max-width: 720px;
  background: #ffffff;
  border-radius: 18px;
  padding: 24px 24px 32px;
  box-shadow: 0 18px 45px rgba(15, 23, 42, 0.18);
`;

const Title = styled.h1`
  margin: 0 0 4px;
  font-size: 26px;
  letter-spacing: 0.02em;
`;

const Subtitle = styled.p`
  margin: 0 0 20px;
  font-size: 14px;
  color: #6b7280;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 24px;
`;

const InputsRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;

  @media (min-width: 640px) {
    flex-direction: row;
  }
`;

const TextInput = styled.input`
  flex: 1;
  padding: 10px 12px;
  border-radius: 10px;
  border: 1px solid #e5e7eb;
  font-size: 14px;
  outline: none;
  transition: border 0.2s ease, box-shadow 0.2s ease, transform 0.05s ease;
  background: #f9fafb;

  &:focus {
    border-color: #6366f1;
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.2);
    background: #ffffff;
  }
`;

const PrimaryButton = styled.button`
  align-self: flex-start;
  padding: 8px 18px;
  border-radius: 999px;
  border: none;
  background: linear-gradient(135deg, #6366f1, #4f46e5);
  color: white;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  transition: transform 0.1s ease, box-shadow 0.1s ease, opacity 0.15s ease;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 10px 24px rgba(79, 70, 229, 0.45);
  }

  &:active {
    transform: translateY(0);
    box-shadow: none;
    opacity: 0.88;
  }
`;

const NotesList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const NoteItem = styled.li`
  background: #f9fafb;
  border-radius: 12px;
  padding: 12px 14px;
  border: 1px solid #e5e7eb;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 10px;
`;

const NoteTextWrapper = styled.div`
  flex: 1;
`;

const NoteTitle = styled.h3`
  margin: 0;
  font-size: 16px;
`;

const NoteContent = styled.p`
  margin: 4px 0 0;
  font-size: 14px;
  color: #4b5563;
`;

const NoteActions = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;

  @media (min-width: 480px) {
    flex-direction: row;
  }
`;

const ActionButton = styled.button`
  padding: 4px 10px;
  border-radius: 999px;
  border: none;
  font-size: 12px;
  cursor: pointer;
  color: white;
  transition: opacity 0.15s ease, transform 0.05s ease;

  &.edit {
    background: #0ea5e9;
  }

  &.delete {
    background: #ef4444;
  }

  &:hover {
    opacity: 0.9;
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }
`;

const EmptyText = styled.p`
  margin: 12px 0 0;
  font-size: 14px;
  color: #9ca3af;
`;

// --- Component Logic ---

function App() {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [editId, setEditId] = useState(null);

  const fetchNotes = async () => {
    try {
      const data = await getNotes();
      setNotes(Array.isArray(data) ? data : data.data || []);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (editId) {
      await updateNote(editId, { title, content });
    } else {
      await createNote({ title, content });
    }

    await fetchNotes();

    setTitle("");
    setContent("");
    setEditId(null);
  };

  return (
    <AppWrapper>
      <Card>
        <Title>Notes App</Title>
        <Subtitle>Add quick notes, update them, or delete anytime.</Subtitle>

        {/* Styled Form */}
        <Form onSubmit={handleSubmit}>
          <InputsRow>
            <TextInput
              type="text"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
            <TextInput
              type="text"
              placeholder="Content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
            />
          </InputsRow>

          <PrimaryButton type="submit">
            {editId ? "Update note" : "Add note"}
          </PrimaryButton>
        </Form>

        {/* Notes list */}
        <NotesList>
          {notes.length === 0 && <EmptyText>No notes found</EmptyText>}

          {notes.map((note) => (
            <NoteItem key={note._id}>
              <NoteTextWrapper>
                <NoteTitle>{note.title}</NoteTitle>
                <NoteContent>{note.content}</NoteContent>
              </NoteTextWrapper>

              <NoteActions>
                <ActionButton
                  className="edit"
                  onClick={() => {
                    setEditId(note._id);
                    setTitle(note.title);
                    setContent(note.content);
                  }}
                >
                  Edit
                </ActionButton>

                <ActionButton
                  className="delete"
                  onClick={async () => {
                    await deleteNote(note._id);
                    fetchNotes();
                  }}
                >
                  Delete
                </ActionButton>
              </NoteActions>
            </NoteItem>
          ))}
        </NotesList>
      </Card>
    </AppWrapper>
  );
}

export default App;