import styled from "styled-components";

const Card = styled.div`
  background: #ffffff;
  padding: 18px;
  border-radius: 12px;
  margin-bottom: 12px;
  box-shadow: 0px 4px 10px rgba(0,0,0,0.08);
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Title = styled.h3`
  margin: 0;
  font-size: 18px;
`;

const Content = styled.p`
  margin: 6px 0 0 0;
  font-size: 15px;
  color: #444;
`;

const Actions = styled.div`
  display: flex;
  gap: 10px;
`;

const Button = styled.button`
  padding: 6px 12px;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  font-size: 14px;
  color: white;
  transition: 0.25s;
  
  &.edit {
    background: #007bff;
  }

  &.edit:hover {
    background: #0056b3;
  }

  &.delete {
    background: #ff4d4d;
  }

  &.delete:hover {
    background: #cc0000;
  }
`;

export default function NoteCard({ note, onEdit, onDelete }) {
  return (
    <Card>
      <div>
        <Title>{note.title}</Title>
        <Content>{note.content}</Content>
      </div>
      <Actions>
        <Button className="edit" onClick={onEdit}>Edit</Button>
        <Button className="delete" onClick={onDelete}>Delete</Button>
      </Actions>
    </Card>
  );
}