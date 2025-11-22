import axios from "axios";

const API = "http://localhost:5001/api/notes";

export const getNotes = async ()=>{
    try {
        const res = await axios.get(API);
        return res.date;

    }catch (err) {
        console.log("Error fetching notes:", err);
        return [];
    }
}
