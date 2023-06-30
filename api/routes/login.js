/* Esto no funciona se puede eliminar, lo hice pensando en NextJS y en algún punto entendí que no iba a funcionar */

/* import {useState} from 'react';  arreglar esto */

function LoginPage(){

    const [credentials,setCredencials] = useState({
        email:'',
        password:''
    })

    /* aca agarro lo que el usuario escribe en input y el atributo name del input*/
    const handleChange = (event) => {
        /* console.log(event.target.value,event.target.name) */
        setCredencials({
            ...credentials,
            [event.target.name]: event.target.value
        })
    }

    const handleSubmit = (event) => {
        event.preventDefault(),
        console.log(credentials)
    }

    return(
        <div>
            <form onSubmit={handleSubmit}>
                <input name="email" type="email" placeholder="email"
                    onChange={handleChange}
                />
                <input name="password" type="password" placeholder="password"
                    onChange={handleChange}
                />
                <button>
                    Login    
                </button>
            </form>
        </div>
    )
};

export default LoginPage;
