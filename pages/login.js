import {useState,useEffect} from 'react';
//import {supabase} from './api/index.js';
import {useRouter} from 'next/router';
import {useSession, useSupabaseClient} from '@supabase/auth-helpers-react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock } from '@fortawesome/free-solid-svg-icons';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';



export default function LogIn(){
    const session = useSession();
    const supabase = useSupabaseClient();
    const [email,setEmail] = useState('');
    const [password,setPassword]= useState('');
    const router = useRouter();
    const handleLogin=async (event)=>{
        event.preventDefault();
        try{
            let { user, error } = await supabase.auth.signInWithPassword({
                email: email,
                password: password
              });
            if(error) throw error
        }catch(error){
            alert(error.error_description||"Credenciales de acceso erroneas, revise sus datos e"+ 
            "\nintente nuevamente.")
        }
    }

    return (
        <div className="container-fluid background-login height-card">
            <div className="row-md d-flex m-0 p-0 justify-content-md-center align-items-center" style={{height:"35vh"}}>
                <img src="../logo_psici.png"/>    
            </div>
            <div className="row-md d-flex justify-content-md-center align-items-center" >
                
                <div className="col-md-4 offset-md-6 py-2 d-flex m-0 pe-0 ps-0 flex-column" >
                    <div className="card bg-primary bg-gradient border-0 rounded-start rounded-0" style={{height: "17.4rem"}}> 
                        <div className="card-body m-0">
                            <h3 className="ps-4 blue-100 mt-1 mb-1 m-0 text-white">Solución problemáticas UCM</h3>
                        </div>
                    </div>   
                </div>
                <div className="col-md-4 offset-md-6 py-2 d-flex m-0 pe-0 ps-0 flex-column w-25  ">
                    <div className="card rounded-end rounded-0 text-center ">
                        <div className="card-header m-0 ">
                            <h3 className="text-center mt-1 mb-1 m-0">Iniciar Sesión</h3>
                        </div>
                        <div className="card-body m-0 align-items-center text-center justify-content-center">
                            <form onSubmit={handleLogin}>
                                <div className="form-group ">
                                    <label htmlFor="email">Correo Electrónico</label>
                                    <div className="input-group  ">
                                        <div className="input-group" >
                                            <span className="input-group-text">
                                                <FontAwesomeIcon icon={faEnvelope}/>
                                            </span>
                                        <input type="email" className="form-control " id="email"
                                        placeholder="Ingrese su correo electrónico"
                                        value={email}
                                        onChange={(event)=>setEmail(event.target.value)}
                                        />
                                        </div>
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="password">Contraseña</label>
                                    <div className="input-group">
                                        <div className="input-group">
                                            <span className="input-group-text">
                                                <FontAwesomeIcon icon={faLock}/>
                                            </span>
                                        
                                        <input type="password" className="form-control" id="password"
                                        placeholder="Ingrese su contraseña"
                                        value={password}
                                        onChange={(event)=>setPassword(event.target.value)}
                                        />
                                        </div>
                                    </div>
                                </div>
                                <br></br>
                                <button type="submit" className="btn btn-primary btn-block">Iniciar Sesión</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}


