import { Routes, BrowserRouter, Route } from "react-router-dom"
import "./styles.css"
import { Home } from "./Home"
import { NewWords } from "./NewWords"
import { useState, useEffect } from "react"
import { WordPairs } from "./WordPairs"

export default function App(){
  const [allEnglishWords, setAllEnglishWords] = useState(() => {
    if(localStorage.getItem("ALLENG")){
      return JSON.parse(localStorage.getItem("ALLENG"))
    }
    return []
  })
  const [allGermanWords, setAllGermanWords] = useState(() => {
    if(localStorage.getItem("ALLGER")){
      return JSON.parse(localStorage.getItem("ALLGER"))
    }
    return []
  })
  const [currentEnglishWords, setCurrentEnglishWords] = useState(() => {
    if(localStorage.getItem("TEMPENGSET")){
      return JSON.parse(localStorage.getItem("TEMPENGSET"))
    }
    return []
  })
  const [currentGermanWords, setCurrentGermanWords] = useState(() => {
    if(localStorage.getItem("TEMPGERSET")){
      return JSON.parse(localStorage.getItem("TEMPGERSET"))
    }
    return []
  })

  function handleSetCurrentWords(english, german){
    setCurrentEnglishWords(english)
    setCurrentGermanWords(german)

    localStorage.setItem("TEMPENGSET", JSON.stringify(english))
    localStorage.setItem("TEMPGERSET", JSON.stringify(german))
  }


  function handleSetWords(english, german){
    setAllEnglishWords(current => [...current, english])
    setAllGermanWords(current => [...current, german])
  }

  useEffect(() => {
    localStorage.setItem("ALLENG", JSON.stringify(allEnglishWords))
    localStorage.setItem("ALLGER", JSON.stringify(allGermanWords))
  }, [allEnglishWords, allGermanWords])

  return(
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" index element={<Home english={currentEnglishWords} german={currentGermanWords}/>}/>
          <Route path="/words" index element={<WordPairs allEnglishWords={allEnglishWords} allGermanWords={allGermanWords} handleSetCurrentWords={handleSetCurrentWords}/>}/>
          <Route path="/new" index element={<NewWords handleSetWords={handleSetWords}/>}/>
        </Routes>
      </BrowserRouter>
    </>
  )
}