import * as Dialog from '@radix-ui/react-dialog'
import { X } from 'lucide-react'
import { ChangeEvent, FormEvent, useState } from 'react'
import {toast} from 'sonner'

interface AddCardProps {
  onNoteCreated: (content: string) => void
}

export function AddCard ({onNoteCreated}: AddCardProps)  {
  const [shouldShowOnBoarding, setShouldShowOnBoarding] = useState(true)
  const [isRecording, setIsRecording] = useState(false)
  const [content, setContent] = useState('')

  function handleStartEditor() {
    setShouldShowOnBoarding(false)
  }

  function handleContentChanged(event: ChangeEvent<HTMLTextAreaElement>) {
    setContent(event.target.value)

    if(event.target.value === ''){
      setShouldShowOnBoarding(true)
    }
  }

  function handleSaveNote(event: FormEvent) {
    event.preventDefault()

    if(content === ''){
      return
    }

    onNoteCreated(content)
    
    setContent('')
    setShouldShowOnBoarding(true)
    
    toast.success('Nota criada com sucesso')
  }

  let speechRecognition: SpeechRecognition | null = null

  function handleStartRecording() {
    
    const isSpeechRecognitionAPIAvailable = 'SpeechRecognition' in window
      || 'webkitSpeechRecognition' in window

      if(!isSpeechRecognitionAPIAvailable) {
        alert('Infelizmente seu navegador não suporta essa funcionalidade! ;-;')
        return
      }

      setIsRecording(true)
      setShouldShowOnBoarding(false)

      const speechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition

      speechRecognition = new speechRecognitionAPI()

      speechRecognition.lang = 'pt-br'
      speechRecognition.continuous = true
      speechRecognition.maxAlternatives = 1
      speechRecognition.interimResults = true

      speechRecognition.onresult = (event) => {
        const transcription = Array.from(event.results).reduce((text, result)=>{
          return text.concat(result[0].transcript)
        }, '')

        setContent(transcription)
      }

      speechRecognition.onerror = (event) =>{
        console.error(event)
      }
      speechRecognition.start()
  }

  function handleStopRecording(){
    setIsRecording(false)

    if(speechRecognition !== null){
      speechRecognition.stop()
    }
  }

  return (
    <Dialog.Root>
        <Dialog.Trigger className="rounded-md flex flex-col text-left bg-slate-700 p-5 gap-3 hover:ring-2 outline-none hover:ring-slate-600 focus-visible:ring-2 focus-visible:ring-lime-400" >
          <span className="text-sm font-medium text-slate-200">
            Adicionar nota
            </span>
          <p className="text-slate-400 text-sm leading-6">
            Grave uma nota em áudio que será convertida para texto automaticamente
          </p>
        </Dialog.Trigger>
         <Dialog.Portal>
          <Dialog.Overlay className='inset-0 fixed bg-black/40'/>
          <Dialog.Content className='z-10 fixed left-1/2 top-1/2 overflow-hidden -translate-x-1/2 -translate-y-1/2 max-w-[640px] w-full h-[50vh] bg-slate-700 rounded-md flex flex-col outline-none'>
            <Dialog.Close className='absolute top-0 right-0 hover:bg-slate-800 hover:text-slate-300 p-1.5 text-slate-400 rounded-md'>
                <X className='size-5'/>
            </Dialog.Close>
            <form  className='flex-1 flex flex-col'>
              <div className='flex flex-1 flex-col gap-3 p-5'>
                <span className="text-sm font-medium text-slate-300">
                  Adicionar nova nota
                  </span>
                {shouldShowOnBoarding ? (
                  <p className="text-slate-400 text-sm leading-6">
                  Comece <button type='button' onClick={handleStartRecording} className=' font-medium text-lime-400 hover:underline '>gravando uma nota</button> em áudio ou se preferir <button type='button' onClick={handleStartEditor} className='text-lime-400 font-medium hover:underline'>utilize apenas texto</button> 
                  </p>
                ): (
                  <textarea autoFocus 
                    className='outline-none text-sm leading-6 text-slate-400 bg-transparent resize-none flex-1'
                    onChange={handleContentChanged}
                    value={content}
                  />
                )}
              </div>

              {isRecording? (
                <button 
                type='button'
                onClick={handleStopRecording}
                className='w-full flex items-center justify-center gap-2 bg-slate-900 py-4 text-center text-sm text-slate-400 outline-none font-bold  hover:text-slate-100'
                >
                  <div className='size-3 bg-red-500 rounded-full animate-pulse'/>
                 Gravando!! (clique aqui p/ interromper)
                </button>
              ): (
                <button 
              type='button'
              onClick={handleSaveNote}
              className='w-full bg-lime-400 py-4 text-center text-sm text-lime-950 outline-none font-bold  hover:bg-lime-500'
              >
                Salvar nota
              </button>
              )}

            </form>
            </Dialog.Content>
          </Dialog.Portal>
          

      </Dialog.Root>

      
  )
}