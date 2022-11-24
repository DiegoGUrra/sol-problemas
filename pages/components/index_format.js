import {useState,useEffect} from 'react';
//import {supabase} from './api/index.js';
import {useRouter} from 'next/router';
import { useSession,useUser, useSupabaseClient } from '@supabase/auth-helpers-react';


export default function Index_menu(){
    return (
        <div>
            <div className="container-fluid background-index align-items-center">
                <div className='row'>
                    <div className='col-md'>
                        <div className="row justify-content-evenly">
                            <div className='col-lg-10'>
                                <div className='card card_text'>
                                    <div className='card card_hover '>
                                        <div className='row g-2'>
                                            <div className='col-1 col-md-5'>
                                            <img class="card-img img-fluid rounded-start" src="../sitio-web.png" alt="Card image cap"/>
                                            </div>
                                            <div className='col-2 col-md-7'>
                                                <div className='card-body d-flex flex-column'>
                                                    <div className='h-100'>
                                                        <h3 className='card-title'>Preguntas y Respuestas</h3>
                                                        <p>Ingresando por este link podrás ingresar a las preguntas y respuestas de los alumnos. (beta)</p>                                        </div>
                                                    <div>
                                                    <a href='../preguntas-frecuentes' className='btn btn-outline-secondary' target="_blank">Ingresa aqui</a>                                    
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='col-md'>
                        <div className="row justify-content-evenly">
                            <div className='col-lg-10'>
                                <div className='card'>
                                    <div className='card card_hover'>
                                        <div className='row g-2'>
                                            <div className='col-1 col-md-5'>
                                            <img class="card-img img-fluid rounded-start" src="../triangulo.png" alt="Card image cap"/>
                                            </div>
                                            <div className='col-2 col-md-7'>
                                                <div className='card-body d-flex flex-column'>
                                                    <div className='h-100'>
                                                        <h3 className='card-title'>Solicitudes</h3>
                                                        <p>Ingresando con este link podrás ingreasar a las solicitudes de los alumnos. (Solo subir solicitudes; beta)</p>                                        </div>
                                                    <div>
                                                    <a href='../realiza-consulta' className='btn btn-outline-secondary' target="_blank">Ingresa aqui</a>                                    
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        

        );
    }