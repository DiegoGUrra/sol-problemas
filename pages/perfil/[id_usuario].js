import Head from 'next/head'
import Image from 'next/image'
import styles from '../../styles/Home.module.css'
import {Auth,ThemeSupa} from '@supabase/auth-ui-react';
import {supabase} from '../api/index.js';
import { useSession,useUser, useSupabaseClient } from '@supabase/auth-helpers-react';
import {useState,useEffect} from 'react';
import Account from '../account';
import LogIn from '../login';
import Menu from '../components/menu.js';
import Popup from "../components/popup.js";
import {useRouter} from 'next/router';



export default function Usuarios({usuarios,roles,carrera,nombres}) {
    const [buttonPopup, setButtonPopup] = useState(false);
    const [email,setEmail] = useState('');
    const [password,setPassword]= useState('');
    const [rut,setRut]= useState();
    const [nombre,setNombre]= useState('');
    const [edad,setEdad]= useState();
    const [direccion,setDireccion]= useState('');
    const [idRol,setIdRol] = useState();
    const user = useUser();
    const supabaseClient = useSupabaseClient();
    const [data,setData] = useState();
    const [edita,setEdita] = useState(-1);
    //datos para editar
    //router 

    const router = useRouter();

    useEffect(()=>{
        async function loadData(){
            const {data }= await supabaseClient.from('profiles').select('id_rol').eq('id_usuario',user.id);
            setData(data[0].id_rol); 
            //console.log(roles);
        }
        if(user) loadData()
    },[user])

    
    const handleSignUp=async (event)=>{
        event.preventDefault();
        try{
            let { data, error } = await supabase.auth.signUp({
                email: email,
                password: password,
                options: {
                    data: {
                        rut:parseInt(rut),
                        nombre:nombre,
                        edad:parseInt(edad),
                        direccion:direccion,
                        esta_activa:true,
                        id_rol:idRol,
                        }
                    }
              });
              if(error) throw error
              //recarga la pagina
              router.reload();
        }catch(err){
            alert(err.error_description||err.message)
        }
    }

//--------------------------------------------------------

//------------------------------------------------------------------------------
//elementos css que tienen que ir incluidos para que se muestren

    const body_color=({color})=>(
        <body 
            style={{
            background: rgb(99, 39, 120)
        }}

        />

    );        


    const profile_button=({box_shadow})=>(
        <profile_button
            style={{
                background: rgb(99, 39, 120),
                box_shadow: none,
                border: none

        }}
        />
    );    


//-------------------------------------------------------------------
//-------------------------------------------------------------------
  return (
    <div>
    <Menu userRole={data}></Menu>
        <div className="py-5"></div>
            <div className="row d-flex justify-content-md-center align-items-center m-0">
                <div className="col-md-3 border-right mycontent-left">
                    
                    <div className="d-flex flex-column align-items-center text-center p-3 py-5">
                    <img src={"/sample-avatar.jpg"} width="100" height="100"></img>
                    <span className="font-weight-bold">{usuarios[0].nombre}</span><span class="text-black-50">{usuarios[0].nombre+"@gmail.com"}</span><span> </span></div>
                </div>
            
                <div className="col-md-5 border-right mycontent-right">
                    <div className='card'>
                        <div class="card-header">
                            <h4 className="card-title text-right">Datos de {roles.find((e)=>e.id_roles===usuarios[0].id_rol).nombre_rol}</h4>
                        </div>
                        <div class="card-body">
                            
                            <p className="card-text">Nombre de usuario: {usuarios[0].nombre}</p>
                            <p>Rut: {usuarios[0].rut}</p>
                            <p>Dirección: {usuarios[0].direccion}</p>
                            <p>Edad: {usuarios[0].edad}</p>
                            <p>Área: {roles.find((e)=>e.id_roles===usuarios[0].id_rol).nombre_rol}</p>
                        </div>
                    </div>
                <div className="pt-3">
                        <div className='card'>
                            <div class="card-header">
                                <h4>Datos de mi carrera</h4> 
                            </div>
                            <div class="card-body">
                                {usuarios[0]!==1?
                                    <>
                                        <div>
                                            <p>Nombre carrera: {carrera[0].nombre}</p>
                                            <p>Nombre cirector: {nombres[0]}</p>
                                            <p>Nombre Secretaria: {nombres[1]}</p>
                                        </div>
                                    </>
                                    :null
                                }
                            </div>
                        </div>
                    
                    </div>
                </div>    
            </div>
    </div>
  )
}
export async function getStaticPaths() {
    let {data:id_usuario} = await supabase.from('profiles').select("id_usuario"); 
    //console.log(id_usuario);
    const paths = id_usuario.map((e) => ({
      params: { id_usuario: e.id_usuario.toString() },
    }))
  
    return { paths, fallback: false }
  }
export async function getStaticProps({params}){
    const carreras = [];
    const nombres = [];
    const {data,err} = await supabase.from('profiles').select("*").eq('id_usuario',params.id_usuario);
    if(data[0].id_rol===4){
        const { data: carrera, error } = await supabase
            .from("estudiantes_carrera")
            .select("id_carrera,carrera(nombre,id_director,id_secretaria)")
            .eq("id_estudiante", params.id_usuario);
        carreras.splice(0,carreras.length,...carrera.map(e=>e.carrera));
        //console.log(carrera);
    }
    else if(data[0].id_rol===3){
        const { data: carrera, error } = await supabase
            .from("carrera")
            .select("*")
            .eq("id_secretaria", params.id_usuario);
        carreras.splice(0,carreras.length,...carrera.map(e=>e));
        
    }
    else if(data[0].id_rol===2){
        const { data: carrera, error } = await supabase
            .from("carrera")
            .select("*")
            .eq("id_director", params.id_usuario);
        //console.log(carrera);
        carreras.splice(0,carreras.length,...carrera.map(e=>e));
        
    }

    if(data[0].id_rol!==1){
        const {data: usuario1} = await supabase.from('profiles').select('nombre').eq('id_usuario',carreras[0]?.id_director);
        nombres.push(usuario1[0].nombre);
        const {data: usuario2} = await supabase.from('profiles').select('nombre').eq('id_usuario',carreras[0]?.id_secretaria);
        nombres.push(usuario2[0].nombre);


    }
    
   // console.log("nombres:",nombres);
    //console.log(carreras,"carrera");
    //console.log(nombreDirector,"n dir");
    //console.log(data);
    const {data:roles} = await supabase.from('roles').select("*");
    //console.log(roles);
    return {
        props:{usuarios:data,roles:roles,carrera:carreras,nombres:nombres},
    };
}