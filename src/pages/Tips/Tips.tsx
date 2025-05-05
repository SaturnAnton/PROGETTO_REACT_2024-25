import "./Tips.css"
import { Link } from "react-router-dom";
import { useEffect } from "react";

function Tips(){
    
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="container2">
            <h1 className="TipsTitle1">- Illuminamento -</h1>
            <div className="DescriptionBox">
                A partire da 2 ore prima di andare a letto, riduci gradualmente la luce
                nell'ambiente in cui ti trovi. Almeno 1 ora prima di andare a letto,
                smetti di utilizzare dispositivi elettronici come smartphone e tablet.
                Puoi anche preparare il corpo al sonno con luci ambientali dai colori caldi.
                Per quanto riguarda l'ambiente in cui dormi, renderlo il più buio possibile può contribuire a favorire un buon sonno.
            </div>

            <h1 className="TipsTitle2">- Temperatura -</h1>
            <div className="DescriptionBox">
                La temperatura corporea si abbassa durante le prime fasi del ciclo del sonno
                e provoca una sensazione di sonnolenza. Mantenere un ambiente del sonno piacevolmente fresco,
                tra i 18 e i 20 gradi Celsius, favorisce il processo naturale dell'organismo e può aiutarti
                ad addormentarti e a non perdere il sonno.
            </div>

            <h1 className="TipsTitle3">- Qualità dell'aria -</h1>
            <div className="DescriptionBox">
                La qualità dellaria nell'ambiente in cui dormi può influire sul sonno.
                Gli agenti inquinanti e le particelle presenti nell'aria possono causare problemi respiratori
                e ridurre le fasi di sonno profondo e questo può incidere sulla tua capacità di recupero.
                Può essere utile ricorrere a un ventilatore o a un condizionatore per introdurre aria fresca o
                un purificatore d'aria per migliorare la qualità dell'aria.
            </div>

            <h1 className="TipsTitle4">- Umidità -</h1>
            <div className="DescriptionBox">
                Un ambiente del sonno troppo secco o umido può causare irritazioni al naso e alla gola
                e influire negativamente sul sonno. Può essere utile ricorrere a un umidificatore o a un
                deumidificatore per rendere più confortevole l'ambiente in cui dormi.
            </div>

            <h1 className="TipsTitle5">- Metodo Militare per Addormentarsi -</h1>
            <div className="DescriptionBoxMilitary">
                <h2 className="subtitle">1. Rilassamento Muscolare Progressivo</h2>
                <ul>
                    <li>Chiudi gli occhi e rilassa il viso, la mandibola e la lingua.</li>
                    <li>Scendi rilassando le spalle, le braccia e le mani.</li>
                    <li>Continua rilassando le gambe fino ai piedi.</li>
                    <li>Senti il corpo diventare pesante e privo di tensioni.</li>
                </ul>

                <h2 className="subtitle">2. Respirazione Controllata</h2>
                <p>Respira seguendo questo schema per calmare il sistema nervoso:</p>
                <ul>
                    <li>Inspira profondamente per 4 secondi.</li>
                    <li>Trattieni il respiro per 4 secondi.</li>
                    <li>Espira lentamente per 6 secondi.</li>
                </ul>
            </div>
            <Link to='/analizza' className="no-det">
                <h1 className="title4">Back</h1>
            </Link>
        </div>
    );
}
export default Tips