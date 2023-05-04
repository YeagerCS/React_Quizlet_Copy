export default function Dialog({ message, closeAlert }){
    return (
        <div className="alert">
          <div className="alert-content">
            <p>{message}</p>
            <button onClick={closeAlert} className="btnStyleDanger">Close</button>
          </div>
        </div>
    );
}