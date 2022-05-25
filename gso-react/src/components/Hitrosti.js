import { useState, useEffect } from 'react';
import Hitrost from './Hitrost';

function Hitrosti(){
    const [hitrosti, setHitrosti] = useState([]);
    useEffect(function(){
        const getHitrosti = async function(){
            const res = await fetch("http://localhost:3001/hitrost");
            const data = await res.json();
            setHitrosti(data);
        }
        getHitrosti();
    }, []);

    return(
        <div>
            <h3>Hitrosti:</h3>
            <ul>
                {hitrosti.map(hitrost=>(<Hitrost hitrost={hitrost} key={hitrost._id}></Hitrost>))}
            </ul>
        </div>
    );
}

export default Hitrosti;