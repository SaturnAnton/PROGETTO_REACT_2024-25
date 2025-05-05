import "./SleepDetails.css"
import { Link } from "react-router-dom";

function SleepDetails(){
    return (
        <div className="container">
            <h1 className="SDTitle1">- Recupero Fisico -</h1>
            <div className="DescriptionBox">
                Il recupero fisico, ad esempio la crescita e la riparazione dei tessuti,
                avviene durante il sonno profondo. Maggiore è la durata del sonno profondo,
                più tempo avrà il corpo per recuperare. In genere, il sonno profondo rappresenta circa il 10%-12%
                della durata totale del sonno e tende a verificarsi nelle prime ore della notte.
            </div>
            <h1 className= "SDTitle2">- Recupero Mentale -</h1>
            <div className= "DescriptionBox">
                Il recupero mentale avviene durante il sonno REM. È fondamentale per l'apprendimento,
                la memoria e la salute emotiva e mentale. Il sonno REM rappresenta in genere
                dal 19% al 27% della durata totale del sonno. Il punteggio del sonno risulta più alto se la quantità
                di sonno REM è sufficiente, mentre è più basso se il sonno REM viene interrotto spesso.
            </div>
            <h1 className= "SDTitle3">- Riposo -</h1>
            <div className= "DescriptionBox">
                È normale attraversare alcuni periodi di veglia durante la notte, ma la qualità complessiva del sonno
                è migliore quando non si passa troppo tempo svegli. Una fase di sonno pari o superiore al 90% della 
                durata totale del sonno fa aumentare il punteggio sul sonno.
            </div>
            <Link to='/analizza' className="no-det">
                <h1 className="title4">Back</h1>
            </Link>
        </div>
    );
}

export default SleepDetails