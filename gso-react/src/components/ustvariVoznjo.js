import { useContext, useState } from 'react'
import { Navigate } from 'react-router';
import { UserContext } from '../userContext';

function UstvariVoznjo(props) {
    const userContext = useContext(UserContext); 
    const[datum_voznje, setDatum_voznje] = useState('');
    const[cas_zacetka, setCas_zacetka] = useState('');
    const[cas_konca, setCas_konca] = useState(false);
    const[uploaded, setUploaded] = useState(false);

    async function onSubmit(e){
        e.preventDefault();

        if(!datum_voznje){
            alert("Vnesite datum vožnje!");
            return;
        }

         if(!cas_zacetka){
            alert("Vnesite čas začetka vožnje!");
            return;
        }

         if(!cas_konca){
            alert("Vnesite čas konca vožnje!");
            return;
        }

        const formData = new FormData();
        formData.append('datum_voznje', datum_voznje);
        formData.append('cas_zacetka', cas_zacetka);
        formData.append('cas_konca', cas_konca);
        const res = await fetch('http://localhost:3001/voznja', {
            method: 'POST',
            credentials: 'include',
            body: formData
        });
        const data = await res.json();

        setUploaded(true);
    }

    return (
        <form className="form-group" onSubmit={onSubmit}>
            {!userContext.user ? <Navigate replace to="/login" /> : ""}
            {uploaded ? <Navigate replace to="/" /> : ""}          
            <input type="date" class="form-control" name="datum_voznje" placeholder="Datum vožnje" value={datum_voznje} onChange={(e)=>{setDatum_voznje(e.target.value)}}/>  <br />
            <input type="text" class="form-control" name="cas_zacetka" placeholder="Čas začetka" value={cas_zacetka} onChange={(e)=>{setCas_zacetka(e.target.value)}}/>  <br />
            <input type="text" class="form-control" name="cas_konca" placeholder="Čas konca" value={cas_konca} onChange={(e)=>{setCas_konca(e.target.value)}}/>  <br />
            <input className="btn btn-primary" type="submit" name="submit" value="Potrdi" />
        </form>
    )
}

export default UstvariVoznjo;


