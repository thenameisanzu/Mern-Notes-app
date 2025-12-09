import { useEffect, useState } from "react";
import styled from "styled-components";
import { getNotes, createNote, deleteNote, updateNote } from "./services/notesAPI";

// Palette for note cards (keeps repeating)
const PALETTE = [
  "#FFF9C4", // pale yellow
  "#FFECB3", // warm cream
  "#FFE0B2", // peach
  "#FFCCBC", // light coral
  "#C8E6C9", // mint
  "#B3E5FC", // baby blue
  "#E1BEE7", // lavender
  "#F8BBD0", // light pink
];

const AppWrapper = styled.div`
  min-height: 100vh;
  padding: 28px 18px;
  background: ${({ isDark }) => (isDark ? "#0b1020" : "#f5f7fb")};
  color: ${({ isDark }) => (isDark ? "#e6eef8" : "#111827")};
  font-family: system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial;
  transition: background 0.2s ease;
`;

/* Center card that holds everything */
const Container = styled.div`
  width: 100%;
  max-width: 1100px;
  margin: 0 auto;
`;

/* Header */
const HeaderRow = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 12px;
  align-items: center;
  margin-bottom: 18px;
`;

const Title = styled.h1`
  margin: 0;
  font-size: 24px;
  letter-spacing: 0.01em;
`;

const ToggleButton = styled.button`
  padding: 8px 12px;
  border-radius: 999px;
  border: none;
  background: ${({ isDark }) => (isDark ? "#1f2937" : "#ffffff")};
  color: ${({ isDark }) => (isDark ? "#e6eef8" : "#111827")};
  box-shadow: ${({ isDark }) =>
    isDark ? "0 6px 18px rgba(2,6,23,0.6)" : "0 6px 18px rgba(2,6,23,0.06)"};
  cursor: pointer;
  font-size: 13px;
`;

/* Form */
const FormCard = styled.div`
  background: ${({ isDark }) => (isDark ? "#071028" : "#ffffff")};
  border-radius: 12px;
  padding: 14px;
  box-shadow: ${({ isDark }) =>
    isDark ? "0 10px 30px rgba(2,6,23,0.6)" : "0 10px 30px rgba(2,6,23,0.06)"};
  margin-bottom: 18px;
  display: flex;
  gap: 10px;
  align-items: center;
  flex-wrap: wrap;
`;

const TitleInput = styled.input`
  flex: 1 1 100%;
  padding: 10px 12px;
  border-radius: 10px;
  border: 1px solid ${({ isDark }) => (isDark ? "#10314a" : "#e6e9ef")};
  background: ${({ isDark }) => (isDark ? "#051224" : "#ffffff")};
  color: ${({ isDark }) => (isDark ? "#dff1ff" : "#0b1220")};
  outline: none;
  font-size: 15px;
  height: 42px;    /* 👈 Title height */
`;

const ContentInput = styled.textarea`
  flex: 1 1 100%;
  padding: 12px 12px;
  border-radius: 10px;
  border: 1px solid ${({ isDark }) => (isDark ? "#10314a" : "#e6e9ef")};
  background: ${({ isDark }) => (isDark ? "#051224" : "#ffffff")};
  color: ${({ isDark }) => (isDark ? "#dff1ff" : "#0b1220")};
  outline: none;
  font-size: 14px;
  resize: none;              /* No manual resize */
  min-height: 90px;          /* 👈 Bigger content box */
  line-height: 1.4;
`;

const PrimaryButton = styled.button`
  padding: 9px 14px;
  border-radius: 999px;
  border: none;
  background: linear-gradient(135deg, #7c5cff, #4f46e5);
  color: white;
  font-weight: 600;
  cursor: pointer;
  font-size: 14px;
`;

/* Grid for notes — responsive */
const NotesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 14px;
`;

/* Each note card — receives bg color prop */
const NoteCard = styled.div`
  background: ${({ bg }) => bg};
  border-radius: 12px;
  padding: 12px 12px;
  box-shadow: 0 8px 20px rgba(12, 15, 20, 0.08);
  min-height: 90px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  word-wrap: break-word;
  transition: transform 0.12s ease, box-shadow 0.12s ease;

  &:hover {
    transform: translateY(-6px);
    box-shadow: 0 18px 40px rgba(12, 15, 20, 0.12);
  }
`;

/* When in dark mode, slightly darken the palette */
const NeutralNoteCard = styled(NoteCard)`
  background: ${({ isDark }) => (isDark ? "#0b1220" : "#fff")};
`;

/* Title and content style inside note */
const NoteTitle = styled.h3`
  margin: 0;
  font-size: 15px;
  font-weight: 700;
  color: ${({ isDark }) => (isDark ? "#e8f6ff" : "#0b1220")};
`;

const NoteContent = styled.p`
  margin: 0;
  font-size: 13px;
  color: ${({ isDark }) => (isDark ? "#d7eaf8" : "#1f2937")};
  white-space: pre-wrap;
`;

/* Actions row */
const NoteActions = styled.div`
  margin-top: auto;
  display: flex;
  gap: 8px;
  justify-content: flex-end;
`;

const ActionBtn = styled.button`
  padding: 6px 9px;
  border-radius: 999px;
  border: none;
  font-size: 12px;
  cursor: pointer;
  color: white;
  background: ${({ kind }) => (kind === "edit" ? "#0ea5e9" : "#ef4444")};
`;

/* Empty placeholder */
const EmptyText = styled.div`
  padding: 24px;
  text-align: center;
  color: ${({ isDark }) => (isDark ? "#7f95ad" : "#9aa6b8")};
`;

/* small helper for note date (optional) */
const NoteMeta = styled.div`
  font-size: 11px;
  color: rgba(10, 20, 30, 0.45);
`;

function App() {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [editId, setEditId] = useState(null);
  const [isDark, setIsDark] = useState(false);

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
    if (!title.trim() && !content.trim()) return; // avoid empty
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
    <AppWrapper isDark={isDark}>
      <Container>
        <HeaderRow>
          <Title>Notes</Title>
          <ToggleButton isDark={isDark} onClick={() => setIsDark((p) => !p)}>
            {isDark ? "☀ Light" : "🌙 Dark"}
          </ToggleButton>
        </HeaderRow>

        <FormCard isDark={isDark}>
          <TitleInput
            isDark={isDark}
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <ContentInput
            isDark={isDark}
            placeholder="Content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          <PrimaryButton onClick={handleSubmit}>
            {editId ? "Update" : "Add"}
          </PrimaryButton>
        </FormCard>

        <NotesGrid>
          {notes.length === 0 && <EmptyText isDark={isDark}>No notes yet — add your first one.</EmptyText>}

          {notes.map((note, idx) => {
            // pick palette color by index (wrap)
            const color = PALETTE[idx % PALETTE.length];
            const bg = isDark ? "#0b1220" : color; // in dark mode keep neutral dark bg
            return (
              <NoteCard key={note._id} bg={bg} isDark={isDark}>
                <NoteTitle isDark={isDark}>{note.title}</NoteTitle>
                <NoteContent isDark={isDark}>{note.content}</NoteContent>

                <NoteActions>
                  <ActionBtn
                    kind="edit"
                    onClick={() => {
                      setEditId(note._id);
                      setTitle(note.title);
                      setContent(note.content);
                    }}
                  >
                    Edit
                  </ActionBtn>

                  <ActionBtn
                    kind="delete"
                    onClick={async () => {
                      await deleteNote(note._id);
                      fetchNotes();
                    }}
                  >
                    Delete
                  </ActionBtn>
                </NoteActions>
              </NoteCard>
            );
          })}
        </NotesGrid>
      </Container>
    </AppWrapper>
  );
}

export default App;