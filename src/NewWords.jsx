import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import Dialog from "./Dialog"

export function NewWords({ handleSetWords }){
    const [wordsEnglish, setWordsEnglish] = useState(() => {
        if(localStorage.getItem("TEMPENG")){
            return JSON.parse(localStorage.getItem("TEMPENG"))
        }
        return []
    })
    const [wordsGerman, setWordsGerman] = useState(() => {
        if(localStorage.getItem("TEMPGER")){
            return JSON.parse(localStorage.getItem("TEMPGER"))
        }
        return []
    })

    const[inputEnglish, setInputEnglish] = useState("")
    const[inputGerman, setInputGerman] = useState("")
    const [displayDialog, setDisplayDialog] = useState([])

    function addWords(){
        if(inputEnglish && inputGerman){
            setWordsEnglish(current => [...current, inputEnglish])
            setWordsGerman(current => [...current, inputGerman])
            setInputEnglish("")
            setInputGerman("")
            document.getElementById("english").focus()
            setLocalStorage()
        } else{
            setDisplayDialog([true, "Please fill in the fields"])
        }
    }

    function setLocalStorage(){
        localStorage.setItem("TEMPENG", JSON.stringify(wordsEnglish))
        localStorage.setItem("TEMPGER", JSON.stringify(wordsGerman))
        console.log(localStorage.getItem("TEMPGER"));
    }

    function reomveLocalStorage(){
        localStorage.removeItem("TEMPENG")
        localStorage.removeItem("TEMPGER")
    }

    useEffect(() => {
        setLocalStorage()
    }, [wordsEnglish, wordsGerman])

    function clearTable(){
        reomveLocalStorage()
        setWordsEnglish([])
        setWordsGerman([])
        setInputGerman("")
        setInputEnglish("")
    }

    function saveWords(){
        if(wordsEnglish.length > 0){
            handleSetWords(wordsEnglish, wordsGerman)
            setWordsEnglish([])
            setWordsGerman([])
            setInputGerman("")
            reomveLocalStorage()
            setInputEnglish("")
            setDisplayDialog([true, "Saved successfully"])
        } else{
            setDisplayDialog([true, "No Words inserted"])
        }
    }

    return (
        <>
            {displayDialog[0] && <Dialog closeAlert={() => setDisplayDialog([false, []])} message={displayDialog[1]}/>}
            <header>
                <nav>
                <ul>
                    <div>
                        <li><button className="btnStyleDanger" onClick={saveWords}>Save Words</button><br/></li>
                        <li><button className="btnStyleDanger" onClick={clearTable}>Clear Table</button><br/></li>
                    </div>
                    <div>
                        <li><Link to="/words">View All Words</Link></li>
                        <li><Link to="/">Home</Link></li>
                    </div>
                </ul>
                </nav>
            </header>
            <div id="divPack">
                <div>
                    <form onSubmit={e => e.preventDefault()} id="newWordDiv">
                        <label htmlFor="english">English</label>
                        <input type="text" name="english" id="english" className="boxStyle" placeholder="car..." value={inputEnglish} onChange={(e) => setInputEnglish(e.target.value)}/>
                        <label htmlFor="german">German</label>
                        <input type="text" name="german" id="german" className="boxStyle" placeholder="auto..." value={inputGerman} onChange={(e) => setInputGerman(e.target.value)}/>
                        <button className="btnStyle" onClick={addWords}>Add</button>
                    </form>
                </div>
                <div>
                    <table className="styled-table">
                        <thead>
                            <tr>
                                <th>German</th>
                                <th>English</th>
                            </tr>
                        </thead>
                        <tbody>
                            {wordsEnglish.map((word, index) => (
                                <tr key={index}>
                                    <td>{word}</td>
                                    <td>{wordsGerman[index]}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    )
}