import react from 'react'

const historyContext = react.createContext();

export const useGameHistory = () => react.useContext(historyContext)

export const GameHistoryProvider = (props) => {
  const {children} = props
  const [worldHistory, setWorldHistory] = react.useState([])
  const [isTravelling, setTravelling] = react.useState(false)
  // pointer = 0 -> present
  // pointer < 0 -> past
  // pointer > 0 -> future???
  // ! Pointer dont change during worldHistory changes
  const [pointer, setPointer] = react.useState(0)
  // impact < 0 -> undo
  // impact > 0 -> redo

  const goTo = (step) => {
    // TODO: move pointer by step count
    setTravelling(true)
    setPointer(pointer+step)
  }

  const getRecordFromHistory = () => {
    return worldHistory?.[(worldHistory?.length+pointer)-1]
  }

  const saveRecordToHistory = (saveableObj) => {
    // TODO: save world record to history
    // ! Remove history from pointer to present on travelling before adding new history
    setWorldHistory((oldHistory) => {
      let newHistory = [...oldHistory]
      if (pointer!==0) {
        newHistory = newHistory.slice(0, newHistory?.length+pointer)
        setPointer(0)
      }
      return [...newHistory, saveableObj]
    })
  }

  react.useEffect(() => {
    console.log("%cSaved successfully to history", "color: cyan", worldHistory)
  }, [worldHistory])

  return (
    <historyContext.Provider value={{
      worldHistory, setWorldHistory,
      pointer, 
      saveRecordToHistory, getRecordFromHistory, 
      goTo, 
      isTravelling, setTravelling
    }}>
      {children}
    </historyContext.Provider>
  )
}