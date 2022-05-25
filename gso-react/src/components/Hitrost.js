import { Link } from "react-router-dom";
function Hitrost(props){
    return (
        <div className="card bg-dark text-dark mb-2">
            <div className="opis-kartice">
              <h5><b>Hitrost:</b></h5>  <h5 className="card-title"><strong>{props.hitrost.hitrost}</strong></h5>
                
              <h5><b>Čas:</b></h5><h5 className="card-title"><strong>{props.hitrost.cas}</strong></h5>

              <h5><b>ID vožnje:</b></h5><h5 className="card-title"><strong>{props.hitrost.id_voznje}</strong></h5>

                <Link to={`/enaVoznja/${props.hitrost._id}`}><b>Preglej</b></Link>


        </div>

        </div>

    );
}

export default Hitrost;
