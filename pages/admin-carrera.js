import {useState,useEffect} from 'react';
import {supabase} from './api/index.js';
import Menu from './components/menu.js';
import {useRouter} from 'next/router';
import { useUser, useSupabaseClient } from '@supabase/auth-helpers-react';
import Popup from "./components/popup.js";

export default function Carrera({carreras}){
    const [buttonPopup, setButtonPopup] = useState(false);
    const user = useUser();
    const supabaseClient = useSupabaseClient();
    const [data,setData] = useState();
    const [nuevaCarrera,setNuevaCarrera] = useState('');
    //indice de carrera a editar
    const [editaCarrera,setEditaCarrera] = useState(-1);
    //info de carrera a editar
    const [nombreEditaCarrera,setNombreEditaCarrera] = useState('');
    useEffect(()=>{
        async function loadData(){
            const {data }= await supabaseClient.from('profiles').select('id_rol').eq('id_usuario',user.id);
            setData(data[0].id_rol); 
        }
        if(user) loadData()
    },[user])
    
    const handleSubmit=async (event)=>{
        try{
            const {data,error} = await supabaseClient.from('carrera').insert([{nombre:nuevaCarrera}]);
            setNuevaCarrera('');
            if (error) throw error
            window.location.reload();
        }catch(err){
            //alert(err.error_description||err.message)
        }
    }
    const removeCarrera= async (id)=>{
        try{
            const { data, error } = await supabase
                                .from('carrera')
                                .delete()
                                .eq('id_carrera', id);
            if(error) throw error
            window.location.reload();
        }
        catch(err){
            //alert(err.error_description||err.message)
        }
        
    }
    const editarCarrera = async (id)=>{
        try{
            const {data,error} = await supabase 
                                .from('carrera')
                                .update({nombre:nombreEditaCarrera})
                                .eq('id_carrera',id);
            if(error) throw error
            setNombreEditaCarrera('');
            setEditaCarrera(-1);
            window.location.reload();
        }
        catch(err){
           // alert(err.error_description||err.message)
        }
    }

    const mostrarAlerta = async (e) => {
        swal({
          title: "Eliminar Carrera",
          text: "¿Estás seguro que deseas eliminar esta carrera?    ",
          icon: "error",          
          buttons: ["No", "Si"]
        }).then((respuesta) => {
          if (respuesta) {
            swal({
              text: "Carrera Eliminada Exitosamente",
              icon: "success",
              timer: "30000",
              
            });
            removeCarrera(e.id_carrera)
            //location.href = "/";
          }
        });
    }

    return (
        <div>
            <Menu userRole={data}></Menu>
            <div className="background-index p-0 m-0">
            <div className='text-center pt-5'>
                <button className="btn btn-dark"  onClick={() => setButtonPopup(true)}>Agregar Carrera</button>
            </div>
            <Popup trigger={buttonPopup} setTrigger={setButtonPopup}>
                <div className="container">
                    <div className="text-center pb-5">
                        <label >Formulario de ingreso de carreras al sistema </label>
                    </div>
                    <form className = "form-group" onSubmit={handleSubmit}>
                        <div>
                            <label className="form-label">Nombre Carrera: </label>
                            <input className="form-control mb-3" type={'text'} value={nuevaCarrera} onChange={(e)=>{setNuevaCarrera(e.target.value)}}/>
                        </div>
                        <div className="text-center">
                            <button className="btn btn-success m-3" type='submit'>Agregar carrera</button>
                        </div>
                    </form>
                </div>
            </Popup>
            <div class="container tableFixHead table-responsive-sm overflow-y mt-5 p-0"> 
                <table className='table text-center align-items-center table-striped table-bordered mx-auto'>
                    <thead className="table-primary">
                        <tr>
                            <th>Id Carrera</th>
                            <th>Nombre Carrera</th>
                            <th></th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>

                    {carreras.map((e)=>{
                        return (
                    <tr key={e.id_carrera}>
                        <td>{e.id_carrera}</td> 
                        <td>{e.nombre}</td>
                        <td><button class="btn btn-warning" onClick={()=>{editaCarrera===-1?setEditaCarrera(e.id_carrera):setEditaCarrera(-1)}} >Editar</button></td>
                        <td><button class="btn btn-danger" onClick={()=>{mostrarAlerta(e)}}>Borrar</button></td>
                        {e.id_carrera===editaCarrera && (<p><form onSubmit={()=>editarCarrera(e.id_carrera)}><label>Nuevo nombre</label><input value={nombreEditaCarrera} onChange={(e)=>{setNombreEditaCarrera(e.target.value)}}></input><button type='submit'>Cambiar</button></form></p>)}
                    </tr>
                    )})}
                    </tbody>
                </table>
            </div>
            </div>
        </div>
        );
    }

export async function getStaticProps(){
    const {data,err} = await supabase.from('carrera').select("*").order('id_carrera',{ascending:true});
    return {
        props:{carreras:data,},
    };
}