import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

function Notes(){

    const [notes, setNotes] = useState([]);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const username = localStorage.getItem('username');

    
    useEffect(() => {
        fetchNotes();
    }, []); // when first we mount the component

    const fetchNotes = async () => {
        try {
            const { data } = await api.get('/notes/');
            setNotes(data);
        } catch (err) {
            if (err.response?.status === 401) {
                navigate('/login');
            }
        }
    };

    // ── Create note ───────────────────────────────────────
    const handleCreate = async () => {
        if (!title || !content) {
            setError('Title and content are required');
            return;
        }
        try {
            await api.post('/notes/', { title, content });
            setTitle('');
            setContent('');
            setError('');
            fetchNotes();
        } catch (err) {
            setError('Failed to create note');
        }
    };

    // ── Delete note ───────────────────────────────────────
    const handleDelete = async (id) => {
        try {
            await api.delete(`/notes/${id}/`);
            fetchNotes();
        } catch (err) {
            setError('Failed to delete note');
        }
    };

    // ── Pin / Unpin note ──────────────────────────────────
    const handlePin = async (note) => {
        try {
            await api.patch(`/notes/${note.id}/`, { is_pinned: !note.is_pinned });
            fetchNotes();
        } catch (err) {
            setError('Failed to update note');
        }
    };

    // ── Logout ────────────────────────────────────────────
    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        navigate('/login');
    };

    // ── Format timestamp ──────────────────────────────────
    const formatDate = (dateStr) => {
        const date = new Date(dateStr);
        return date.toLocaleString();
    };


    return(<>   
        <div className="notes-container">

            {/* Navbar */}
            <div className="notes-nav">
                <h2>📝 {username}'s Notes</h2>
                <button onClick={handleLogout}>Logout</button>
            </div>

            {/* Create Note Form */}
            <div className="note-form-div">
                <h3>New Note</h3>
                {error && <p className="error-line">{error}</p>}
                <input
                    placeholder="Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
                <textarea
                    placeholder="Content"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    rows={4}
                />
                <button onClick={handleCreate}>Add Note</button>
            </div>

            {/* Notes List */}
            {notes.length === 0 ? (
                <p>No notes yet. Create one above!</p>
            ) : (
                notes.map((note) => (
                    <div key={note.id} className={note.is_pinned ? "notes-cards pinned-note" : "notes-cards not-pinned-note"} >
                        {/* Note Header */}
                        <div className="note-header">
                            <h3>
                                {note.is_pinned && '📌 '}{note.title}
                            </h3>
                            <div className="btn-div">
                                <button onClick={() => handlePin(note)}>
                                    {note.is_pinned ? 'Unpin' : 'Pin'}
                                </button>
                                <button
                                    onClick={() => handleDelete(note.id)}
                                    className="delete-btn"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>

                        {/* Note Content */}
                        <p className="note-content">{note.content}</p>

                        {/* Timestamp */}
                        <small className="note-timestamp">
                            Created: {formatDate(note.created_at)}
                            {note.updated_at !== note.created_at && (
                                <span> · Updated: {formatDate(note.updated_at)}</span>
                            )}
                        </small>
                    </div>
                ))
            )}
        </div>
    </>);
}

export default Notes;