import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Dialog from "./Dialog";

export function WordPairs({ allEnglishWords, allGermanWords, handleSetCurrentWords }) {
  const [selectedWordsEnglish, setSelectedWordsEnglish] = useState([]);
  const [selectedWordsGerman, setSelectedWordsGerman] = useState([]);

  const [s_allEnglishWords, setAllEnglishWords] = useState(allEnglishWords ?? []);
  const [s_allGermanWords, setAllGermanWords] = useState(allGermanWords ?? []);

  const [displayDialog, setDisplayDialog] = useState([])

  function handleRowClick(index) {
    setSelectedWordsGerman(s_allGermanWords[index]);
    setSelectedWordsEnglish(s_allEnglishWords[index]);
  }

  function setCurrentWords(){
    handleSetCurrentWords(selectedWordsEnglish, selectedWordsGerman)
  }

  function exportJSON(){
    const allWords = {
        english: selectedWordsEnglish,
        german: selectedWordsGerman
    }

    const json = JSON.stringify(allWords, null, 2)
    const blob = new Blob([json], {type: "application/json"})
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "words.json"
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  function selectFile() {
    return new Promise((resolve, reject) => {
      const fileInput = document.createElement('input');
      fileInput.type = 'file';
  
      fileInput.addEventListener('change', () => {
        if (fileInput.files.length > 0) {
          const file = fileInput.files[0];
          resolve(file);
        } else {
          reject(new Error('No file selected.'));
        }
      });
  
      fileInput.click();
    });
  }
  
  

  async function importJSON(){
    try{
        const file = await selectFile()
        const reader = new FileReader()
        reader.readAsText(file)

        reader.onload = () =>{
            const json = JSON.parse(reader.result)
            if(json.english){
                console.log(json.english);
                console.log(json.german);
                setAllEnglishWords(current => [...current, json.english])
                setAllGermanWords(current => [...current, json.german])

            } else{
                setDisplayDialog([true, "Invalid JSON syntax"])
            }
            
        }
    } catch(error){
        console.log(error);
        setDisplayDialog([true, error])
    }
  }

  function deleteCurrentWords(){
    let indexRm = s_allEnglishWords.indexOf(selectedWordsEnglish)
    setAllEnglishWords(current => {
        return current.filter((elem, index) => index !== indexRm)
    })
    setAllGermanWords(current => {
        return current.filter((elem, index) => index !== indexRm)
    })

    setSelectedWordsEnglish([])
    setSelectedWordsGerman([])
  }

  useEffect(() => {
    localStorage.setItem("ALLENG", JSON.stringify(s_allEnglishWords))
    localStorage.setItem("ALLGER", JSON.stringify(s_allGermanWords))
  }, [s_allEnglishWords, s_allGermanWords])

  return (
    <>
        {displayDialog[0] && <Dialog closeAlert={() => setDisplayDialog([false, []])} message={displayDialog[1]}/>}

        <header>
            <nav>
            <ul>
                <div>
                    <li><button className="btnStyleDanger" onClick={exportJSON}>Export JSON</button></li>
                    <li><button className="btnStyleDanger" onClick={importJSON}>Import JSON</button></li>
                    <li><a href="#bottomBtn" id="bottom">Go to Bottom</a></li>
                </div>
                <div>
                    <li><Link to="/new">New Words</Link></li>
                    <li><Link to="/">Home</Link></li>
                </div>
            </ul>
            </nav>
        </header>
      <div id="tablesDiv">
        <table className="styled-table">
            <thead>
            <tr>
                <th>Sets</th>
            </tr>
            </thead>
            <tbody>
            {s_allEnglishWords.map((englishWords, index) => (
                <tr key={index} onClick={() => handleRowClick(index)} className="clickTr">
                <td>Set {index}</td>
                </tr>
            ))}
            </tbody>
        </table>
        {selectedWordsEnglish.length > 0 && (
            <div id="selectionDiv">
                <table className="styled-table">
                    <thead>
                    <tr>
                        <th>German</th>
                        <th>English</th>
                    </tr>
                    </thead>
                    <tbody>
                    {selectedWordsEnglish.map((word, index) => (
                        <tr key={index}>
                        <td>{selectedWordsGerman[index]}</td>
                        <td>{word}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
                <div id="buttonsWordPair">
                    <button onClick={() => {setSelectedWordsGerman([]); setSelectedWordsEnglish([])}} className="btnStyle">Close</button>
                    <button className="btnStyle" onClick={setCurrentWords} id="bottomBtn">Select</button>
                    <button className="btnStyle" onClick={deleteCurrentWords}>Delete</button>
                </div>
                <a href="#" id="bottom">Go to Top</a>
                </div>
            )}
        </div>
        </>
  );
}
