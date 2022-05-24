import { Link } from "react-router-dom";
function Voznja(props){
    return (
        <div className="card bg-dark text-dark mb-2">
           
            <div className="opis-kartice">
              <h5><b>Datum vožnje:</b></h5>  <h5 className="card-title"><strong>{props.voznja.datum_voznje}</strong></h5>
                
              <h5><b>Čas začetka:</b></h5><h5 className="card-title"><strong>{props.voznja.cas_zacetka}</strong></h5>

              <h5><b>Čas konca:</b></h5><h5 className="card-title"><strong>{props.voznja.cas_konca}</strong></h5>

          //  <Link to={`/singlePhoto/${props.voznja._id}`}><b>Preglej</b></Link>


        </div>

        </div>

    );
}

export default Voznja;