import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Dialog from "./Dialog";

export function Home({ english, german }){
  const [randomized, setRandomized] = useState(false)
  const [index, setIndex] = useState(() => {
    if(localStorage.getItem("INDEX")){
      return Number(localStorage.getItem("INDEX"))
    }
    

    return 0
  })
  const [wordsEnglish, setWordsEnglish] = useState([])
  const [wordsGerman, setWordsGerman] = useState([])
  const [massage, setMassage] = useState("")
  const [currentInput, setCurrentInput] = useState("")
  const [answer, setAnswer] = useState(false)
  const [inputEnglish, setInputEnglish] = useState(() =>{
    if(localStorage.getItem("INPUT") !== null) {
      return localStorage.getItem("INPUT") == "true" ? true : false
    }
    return true
  })
  const [displayDialog, setDisplayDialog] = useState([])


  function checkAnswer(e){
    e.preventDefault()
    const correctWord = inputEnglish ? wordsEnglish[index].toLowerCase() : wordsGerman[index].toLowerCase()
    const correctWordAlt = correctWord.replace("to ", "")

    if(currentInput.toLowerCase() === correctWord || currentInput.toLowerCase() === correctWordAlt){
      setMassage("Correct") 
      setCurrentInput("")
      setIndex(prevIndex => prevIndex + 1)
    } else{
      setMassage("Incorrect")
    }
  }

  useEffect(() => {
    localStorage.setItem("INDEX", index)
    if(index === wordsEnglish.length){
        setIndex(0)
        setMassage("")
    }
  }, [index])

  useEffect(() => {
    if(localStorage.getItem("TEMPENGSET") && english.length){
        setWordsEnglish(JSON.parse(localStorage.getItem("TEMPENGSET")))
        setWordsGerman(JSON.parse(localStorage.getItem("TEMPGERSET")))
    }
    else{
      fetch("data/words.json").then(response => response.json())
      .then(data =>{
        setWordsEnglish(data.english)
        setWordsGerman(data.german)
        setLocalStorage(data.english, data.german)
      })
    }
  }, [])

  function resetState(){
    localStorage.removeItem("INDEX"); 
    setIndex(0);
    setMassage("")
    setAnswer(false)
  }

  function changeInputLanguage(){
    setInputEnglish(!inputEnglish)
  }

  useEffect(() =>{
    localStorage.setItem("INPUT", inputEnglish)
  }, [inputEnglish])

  

  function randomizeOrder(){
    let indices = []
    for(let i = 0; i < wordsEnglish.length; i++){
      const rand = Math.floor(Math.random() * wordsEnglish.length)

      if(!indices.includes(rand)){
        indices.push(rand)
      } else{
        i--;
      }
    }

    let tempWordsEnglish = wordsEnglish.slice()
    let tempWordsGerman = wordsGerman.slice()
    for(let j = 0; j < wordsEnglish.length; j++){
      tempWordsEnglish[j] = wordsEnglish[indices[j]]
      tempWordsGerman[j] = wordsGerman[indices[j]]
    }

    setRandomized(true)
    setWordsEnglish(tempWordsEnglish)
    setWordsGerman(tempWordsGerman)
    setLocalStorage(tempWordsEnglish, tempWordsGerman)
  }

  function setLocalStorage(english, german){
    localStorage.setItem("TEMPENGSET", JSON.stringify(english))
    localStorage.setItem("TEMPGERSET", JSON.stringify(german))
  }

  return (
    <>
      <header>
        <nav>
          <ul>
            <div className="navLeft">
                <li><button onClick={resetState} className="btnStyleDanger">Delete State</button><br/></li>
                <li><button onClick={randomizeOrder} className="btnStyleDanger">Randomize</button><br/></li>
                <li><button className="btnStyleDanger" onClick={changeInputLanguage}>{inputEnglish ? "Set Input to German" : "Set Input to English"}</button></li>
            </div>
            <div className="navRight">
                <li><Link to="/new">New Words</Link></li>
                <li><Link to="/words">View All Words</Link></li>
            </div>
          </ul>
        </nav>
      </header>
      <form onSubmit={e => e.preventDefault()}>
        <div id="maindiv">
            <label htmlFor="words">{inputEnglish ? wordsGerman[index] : wordsEnglish[index]}</label> 
            <input type="text" className="boxStyle" name="words" id="words" placeholder="Answer..." value={currentInput} onChange={e => setCurrentInput(e.target.value)}/>
            <button className="btnStyle" onClick={checkAnswer}>Check</button>
            <div id="buttonsWordPair">
                <em><button className="btnStyle" onClick={() => setAnswer(!answer)}>{answer ? "Hide answer" : "Show answer"}</button></em> 
                <em>{index + "/" + wordsEnglish.length}</em>
            </div>
            <p>{answer ? inputEnglish ? wordsEnglish[index] : wordsGerman[index] : ""}&#x200B;</p>
            <p className={`message ${massage === "Correct" ? "correct" : "incorrect"}`}>{massage}&#x200B;</p>
        </div>
      </form>
    </>
  )
  
}