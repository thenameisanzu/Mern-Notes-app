import axios from "axios";

const API = "http://localhost:5001/api/notes";

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