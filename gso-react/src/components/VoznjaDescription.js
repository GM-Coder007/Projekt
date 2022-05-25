import { useContext, useState, useEffect } from 'react';
import Voznja from './Voznja';
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";

import { UserContext } from '../userContext';
import { Navigate } from 'react-router-dom';
import Hitrosti from './Hitrosti';
import Hitrost from './Hitrost';


function VoznjaDesc(){
    const [hitrosti, setHitrosti] = useState([]);
    const userContext = useContext(UserContext); 

    const [voznja, setVoznja] = useState([]);
    const {voznjaID} = useParams();

     const getVoznja = async function(){
            const res = await fetch("http://localhost:3001/voznja/"+voznjaID);
            const data = await res.json();
            setVoznja(data);
        }



    useEffect(function(){
        const getHitrosti = async function(){
            const res = await fetch("http://localhost:3001/hitrost/mojeHitrosti/"+voznjaID);
            const data = await res.json();
            setHitrosti(data);
        }
        getHitrosti();
        getVoznja();
    }, []);

// vse hitrosti bodo zamenjane s povprečno hitrostjo !!!!!
    return(

        <>
            {!userContext.user ? <Navigate replace to="/" /> : ""}
        
      <div className="card bg-dark text-dark mb-2">
           
            <div className="opis-kartice">
              <h5><b>Datum vožnje:</b></h5>  <h5 className="card-title"><strong>{voznja.datum_voznje}</strong></h5>
                
              <h5><b>Čas začetka:</b></h5><h5 className="card-title"><strong>{voznja.cas_zacetka}</strong></h5>

              <h5><b>Čas konca:</b></h5><h5 className="card-title"><strong>{voznja.cas_konca}</strong></h5>


                <Link to='/'><b>Nazaj</b></Link>

                </div>

                  <div className="opis-kartice">
                <Link to={`/izbrisiVoznjo/${voznjaID}`}><b>Izbriši</b></Link> 
                </div>


        </div>

        <div>
            <h3>Hitrosti:</h3>
            <ul>
                {hitrosti.map(hitrost=>(<Hitrost hitrost={hitrost} key={hitrost._id}></Hitrost>))}
            </ul>
        </div>
        </>

    );
}

export default VoznjaDesc;



