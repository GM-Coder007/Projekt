import { useState, useEffect } from 'react';
import Voznja from './Voznja';

function Voznje(){
    const [voznje, setVoznje] = useState([]);
    useEffect(function(){
        const getVoznje = async function(){
            const res = await fetch("http://localhost:3001/voznja");
            const data = await res.json();
            setVoznje(data);
        }
        getVoznje();
    }, []);

    return(
        <div>
            <h3>Vožnje:</h3>
            <ul>
                {voznje.map(voznja=>(<Voznja voznja={voznja} key={voznja._id}></Voznja>))}
            </ul>
        </div>
    );
}

export default Voznje;