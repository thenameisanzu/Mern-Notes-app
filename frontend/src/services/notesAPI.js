import axios from "axios";


const API = import.meta.env.VITE_API_URL || "http://localhost:5000/api/notes";

export const getNotes = async () => {
  const res = await axios.get(API);
  return res.data;
};

export const createNote = async (note) => {
  const res = await axios.post(API, note);
  return res.data;
};

export const deleteNote = async (id) => {
  const res = await axios.delete(`${API}/${id}`);
  return res.data;
};

export const updateNote = async (id, updatedNote) => {
  const res = await axios.put(`${API}/${id}`, updatedNote);
  return res.data;
};