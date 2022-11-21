import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import { Auth, ThemeSupa } from '@supabase/auth-ui-react';
import { supabase } from './api/index.js';
import { useSession, useUser, useSupabaseClient } from '@supabase/auth-helpers-react';
import { useState, useEffect } from 'react';
import Account from './account';
import LogIn from './login';
import Menu from './components/menu.js';
import Popup from "./components/popup.js";
import { useRouter } from 'next/router';
import StableSelect from "./components/StableSelect";


export default function Usuarios({  }) {
    const [buttonPopup, setButtonPopup] = useState(false);
    const [buttonPopup2, setButtonPopup2] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rut, setRut] = useState();
    const [nombre, setNombre] = useState('');
    const [edad, setEdad] = useState();
    const [direccion, setDireccion] = useState('');
    const [idRol, setIdRol] = useState();
    const user = useUser();
    const supabaseClient = useSupabaseClient();
    const [data, setData] = useState();
    const [edita, setEdita] = useState(-1);
    //datos para editar
    const [nombreEditar, setNombreEditar] = useState("");
    const [edadEditar, setEdadEditar] = useState();
    const [dirEditar, setDirEditar] = useState("");
    const [activaEditar, setActivaEditar] = useState("");
    const [rolEditar, setRolEditar] = useState("");
    const [selectedCarrera, setSelectedCarrera] = useState();
    //router 
    const router = useRouter();
    //datos para vizualizar
    const [usuarios,setUsuarios]=useState([]);
    const [roles,setRoles]=useState([]);
    const [carreras,setCarreras]=useState([]);
    const [carreraEstudiantes,setCarreraEstudiantes]=useState([]);
    // Variable de la carrera a la que quieres asignar al alumno

    //funciona al principio de la pag
    useEffect(()=>{
        (async ()=>{try{
            const { data: roles } = await supabase.from('roles').select("*").order('id_roles',{ascending:true});
            setRoles(roles);
            const { data: carreras } = await supabase.from('carrera').select("*").order('id_carrera', { ascending: true });
            setCarreras(carreras);
            /* console.log(carreras); */
            const {data: carreraEstudiantes} = await supabase.from('estudiantes_carrera').select('*');
            setCarreraEstudiantes(carreraEstudiantes);
            /* console.log(carreraEstudiantes); */
        }
        catch(err){
            alert(error.error_description);
        }})()

    },[]); 

    useEffect(() => {
        async function loadData() {
            const { data } = await supabaseClient.from('profiles').select('id_rol').eq('id_usuario', user.id);
            setData(data[0].id_rol);
            //console.log(roles);
        }
        if (user) loadData()
    }, [user])
    
    //funciona si cambia usuarios
    useEffect(()=>{
        (async ()=>{try{
            const { data, error } = await supabase.from('profiles').select("*").order('id_usuario', { ascending: true });
            if (error) throw error
            setUsuarios(data)
            const { data: carreras } = await supabase.from('carrera').select("*").order('id_carrera', { ascending: true });
            setCarreras(carreras);
        }catch(err){
            alert(error.error_description);
        }})()

    },[usuarios]);

    const handleSignUp = async (event) => {
        event.preventDefault();
        try {
            let { data, error } = await supabase.auth.signUp({
                email: email,
                password: password,
                options: {
                    data: {
                        rut: parseInt(rut),
                        nombre: nombre,
                        edad: parseInt(edad),
                        direccion: direccion,
                        esta_activa: true,
                        id_rol: idRol,
                        carrera_usuario: selectedCarrera,
                    }
                }
            });
            if (error) throw error
            setUsuarios(usuarios=>[...usuarios,data]);
            //recarga la pagina
            router.reload();
        } catch (err) {
            alert(error.error_description || err.message)
        }
    }


    //Mantener valor del cuadro de selección

    const handleSelectChange = ({ value }) => {
        setSelectedCarrera(value);
    };


    const editarCuenta = async (id) => {
        try {
            const { data, error } = await supabaseClient.from('profiles').update({ nombre: nombreEditar, edad: edadEditar, direccion: dirEditar }).eq('id_usuario', id);
            if (error) throw error;
            setUsuarios(usuarios.map((e)=>{
                if(e.id_usuario===id){
                    return data;
                }
                else{
                    return e;
                }
            }))

        } catch (err) {
            alert(error.error_description || err.message)

        }
    }
    const borrarCuenta = async (id) => {
        try {
            const { data, error } = await supabaseClient.from('profiles').delete().eq('id_usuario', id);
            if (error) throw error;
            setUsuarios(usuarios.filter((e)=>e.id_usuario!==id));

        }
        catch (err) {
            alert(error.error_description || err.message)
        }
    }

    const mostrarAlerta = async (e) => {
        swal({
          title: "Eliminar Usuario",
          text: "¿Estás seguro que deseas eliminar a este usuario?",
          icon: "error",
          footer: "Recuerda: Los cambios son irreversibles.",
          buttons: ["No", "Si"],
        }).then((respuesta) => {
          if (respuesta) {
            swal({
              text: "Usuario Eliminado Exitosamente",
              icon: "success",
              timer: "30000",
              
              
            });
            borrarCuenta(e.id_usuario)
            //location.href = "/";
          }
        });
    }

    return (
        <div>
            <Menu userRole={data}></Menu>
            <div>
                <div className='text-center pt-5'>
                    <button className="btn btn-dark" onClick={() => setButtonPopup(true)}>Añadir Usuario</button>
                </div>
                <Popup trigger={buttonPopup} setTrigger={setButtonPopup}>
                    <div className="mb-3" >Agregar un usuario al sistema.</div>
                    <div className="mb-3" >Complete el formulario y rellene los campos vacíos.</div>
                    <div className="container">
                        <div className="g-3">
                            <form className="form-group row" action="#" onSubmit={handleSignUp}>
                                <div class="col">
                                    <div className="mb-3">
                                        <label className="form-label">Correo</label>
                                        <input className="form-control" placeholder="Ingrese su correo electrónico." type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Rut</label>
                                        <input className="form-control" type="text" placeholder="Ingrese su RUT sin guión." value={rut} onChange={(e) => setRut(e.target.value)} />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Edad</label>
                                        <input className="form-control" type="number" placeholder="Ingrese su edad." value={edad} onChange={(e) => setEdad(e.target.value)} />
                                    </div>
                                    
                                    <div className='container'>
                                        <div className="row mb-3" onChange={(e) => setIdRol(e.target.value)}>
                                            <p>Rol</p>
                                            <div class="col form-check">
                                                {roles.map((e, val = 0) => val <= 1 && (

                                                    <div>
                                                        <div key={e.id_rol}>
                                                            <input class="form-check-input" type="radio" value={e.id_roles} name="idRol" />
                                                            <label class="form-check-label">{e.nombre_rol}</label>
                                                        </div>
                                                    </div>))
                                                }
                                            </div>
                                            <div className="col form-check">
                                                {roles.map((e, val = 0) => val >= 2 && (

                                                    <div >
                                                        <div key={e.id_rol}>
                                                            <input class="form-check-input" type="radio" value={e.id_roles} name="idRol" />
                                                            <label class="form-check-label">{e.nombre_rol}</label>
                                                        </div>
                                                    </div>))
                                                }
                                            </div>
                                        </div>
                                    </div>

                                </div>
                                <div class="col">
                                    <div class="mb-3">
                                        <label className="form-label">Contraseña</label>
                                        <input className="form-control" type="password" placeholder="Ingrese su contraseña." value={password} onChange={(e) => setPassword(e.target.value)} />
                                    </div>
                                    <div class="mb-3">
                                        <label className="form-label">Nombre</label>
                                        <input className="form-control" type="text" value={nombre} placeholder="Ingrese  nombre." onChange={(e) => setNombre(e.target.value)} />
                                    </div>
                                    <div class="mb-3">
                                        <label className="form-label">Dirección</label>
                                        <input className="form-control" type="text" value={direccion} placeholder="Ingrese una dirección válida." onChange={(e) => setDireccion(e.target.value)} />
                                    </div>
                                    {/* si el rol seleccionado no es 1 se muestra */}
                                    {idRol!=1 && 
                                    <div className="mb-3">
                                        <p>Carrera_ID:</p>
                                        <div>
                                            <StableSelect
                                                defaultValue={{ label: "Selecciona una opción", value: "empty" }}
                                                options={carreras.map((e) => ({
                                                    label: e.nombre,
                                                    value: parseInt(e.id_carrera),
                                                    id: e.id_carrera,
                                                }))}
                                                onChange={handleSelectChange}
                                            />
                                        </div>
                                    </div>}
                                    
                                </div>


                                <button className="btn btn-success" href="./admin-usuario" type='submit'>Crear cuenta</button>
                            </form>
                        </div>
                    </div>
                </Popup>
            </div>



            <div class="container tableFixHead table-responsive-sm overflow-y mt-5 p-0">
                <table className='table text-center align-items-center table-striped table-bordered mx-auto' >
                    <thead className="table-primary">
                        <tr>
                            <th>RUT</th>
                            <th>NOMBRE</th>
                            <th>EDAD</th>
                            <th>DIRECCION</th>
                            <th>CARRERA</th>
                            <th>ROL</th>
                            <th></th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {usuarios.map((e) => {
                            return (

                                <tr key={e?.rut}>
                                    <td>{e?.rut}</td>
                                    <td>{e?.nombre}</td>
                                    <td>{e?.edad}</td>
                                    <td>{e?.direccion}</td>
                                    <td>{e?.id_rol===4?
                                        carreras.find((car)=>car.id_carrera===(carreraEstudiantes.find(carEst=>carEst.id_estudiante===e?.id_usuario)?.id_carrera))?.nombre
                                        :e?.id_rol===3?(carreras.find((car)=>car.id_secretaria===e?.id_usuario)?.nombre)
                                        :e?.id_rol===2?(carreras.find((car)=>car.id_director===e?.id_usuario)?.nombre)
                                        :null
                                        }</td>
                                    {/* <td>{e.esta_activa}</td> */}
                                    <td>{roles[e?.id_rol - 1]?.nombre_rol}</td>
                                    <td><button style={{ color: "white" }} onClick={() => { edita === -1 ? setEdita(e?.rut) : setEdita(-1);setButtonPopup2(true) }} class="btn btn-warning">Editar</button></td>
                                    <td><button class="btn btn-danger" onClick={() => {mostrarAlerta(e) }}>Borrar</button></td>
                                    {e?.rut === edita && (
                                    <Popup trigger={buttonPopup2} setTrigger={setButtonPopup2}>
                                        <div className="container">
                                            <form onSubmit={() => editarCuenta(e.id_usuario)}>
                                                <label>Nombre: </label><input value={nombreEditar} onChange={(e) => setNombreEditar(e.target.value)}></input>
                                                <label> Edad: </label><input type="number" value={edadEditar} onChange={(e) => setEdadEditar(e.target.value)}></input>
                                                <label> Dirección: </label><input value={dirEditar} onChange={(e) => setDirEditar(e.target.value)}></input>
                                                <button href="./admin-usuario" type="submit">Cambiar</button>
                                            </form>
                                        </div>
                                    </Popup>)}
                                </tr>

                            )
                        })}

                    </tbody>
                </table>
            </div>
        </div>
    )
}

