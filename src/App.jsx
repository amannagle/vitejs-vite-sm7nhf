import { useState, useEffect } from 'react';
import Note from './components/Note';
import noteService from './services/notes';
import axios from 'axios';
const App = (props) => {
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState('a new note...');
  const [showAll, setShowAll] = useState(true);
  const hook = () => {
    console.log('effect');
    noteService.getAll().then((allnotes) => setNotes(allnotes));
  };

  useEffect(hook, []);
  const notesToShow = showAll ? notes : notes.filter((note) => note.important);

  const toggleImportanceOf = (id) => {
    console.log('idis', id, typeof id);
    const url = `http://localhost:3001/notes/${id}`;
    console.log(url);
    const note = notes.find((n) => n.id === id);
    const changedNote = { ...note, important: !note.important };
    console.log(changedNote);

    noteService.update(id, changedNote).then((response) => {
      setNotes(notes.map((note) => (note.id !== id ? note : response.data)));
    });
  };
  const addNote = (event) => {
    event.preventDefault();
    console.log('button clicked', event.target);
    let noteObject = {
      content: newNote,
      important: Math.random() < 0.5,
      id: String(notes.length + 1),
    };
    noteService.create(noteObject).then((response) => {
      setNotes(notes.concat(response.data));
      setNewNote('');
    });
  };

  console.log('render', notes.length, 'notes');
  const handleNoteChange = (event) => {
    console.log(event.target.value);
    setNewNote(event.target.value);
  };
  return (
    <div>
      <h1>Notes</h1>
      <div>
        <button onClick={() => setShowAll(!showAll)}>
          show {showAll ? 'important' : 'all'}
        </button>
      </div>
      <ul>
        {notesToShow.map((note) => (
          <Note
            key={note.id}
            note={note}
            toggleImportance={() => {
              toggleImportanceOf(note.id);
            }}
          />
        ))}
      </ul>
      <form onSubmit={addNote}>
        <input value={newNote} onChange={handleNoteChange} />
        <button type="submit">save</button>
      </form>
    </div>
  );
};
export default App;
