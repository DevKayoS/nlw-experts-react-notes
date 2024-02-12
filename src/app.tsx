import logo from "./assets/logo-nlw-experts.svg"
import { AddCard } from "./components/add-card"
import  {NoteCard}  from "./components/note-card"
import { ChangeEvent, useState } from 'react'
import {toast} from 'sonner'

interface Note {
  id: string,
  date: Date,
  content: string
}

export function App() {
  const [search, setSearch] = useState('')
  const [notes, setNotes] = useState<Note[]>(()=> {
    // salvando no navegador
    const notesOnStorage = localStorage.getItem('notes')

    if(notesOnStorage){
      return JSON.parse(notesOnStorage)
    }
    
    return[]})
//  salvando notas na tela 
  function onNoteCreated(content: string){
    const newNote = {
      id: crypto.randomUUID(),
      date: new Date(),
      content,
    }

    const notesArray = [newNote ,...notes]

    setNotes(notesArray)

    // salvando no navegador
    localStorage.setItem('notes', JSON.stringify(notesArray))
  }

  function onNoteDeleted(id: string) {
    const notesArray = notes.filter(note => {
      return note.id !== id
    })

    setNotes(notesArray)
    localStorage.setItem('notes', JSON.stringify(notesArray))
    toast.error('Sua nota foi apagada')
  }

  // fazendo busca
  function handleSearch(event: ChangeEvent<HTMLInputElement>){
    const query = event.target.value

    setSearch(query)
  }

  const filteredNotes = search !== '' ? notes.filter(note => note.content.toLocaleLowerCase().includes(search.toLocaleLowerCase())) : notes

  return (
    <div className="mx-auto max-w-6xl my-12 space-y-6 px-4">
      <img src={logo} alt="NLW-EXPERTS" />
      
      <form className="w-full">
      <input 
        type="text" 
        placeholder="Busque por sua nota"
        className="w-full bg-transparent text-3xl font-semibold tracking-tight outline-none placeholder:text-slate-500"
        onChange={handleSearch}
        />
      </form>
      <div className="h-px bg-slate-700"></div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-[250px] m-8">
        <AddCard onNoteCreated={onNoteCreated}/>
        {filteredNotes.map(note=> {
          return <NoteCard key={note.id} note={note} onNoteDeleted={onNoteDeleted}/>
        })}
      </div>
    </div>
  )
}

