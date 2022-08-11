//variables
const mascotaInput = document.querySelector('#mascota');
const propietarioInput = document.querySelector('#propietario');
const telefonoInput = document.querySelector('#telefono');
const fechaInput = document.querySelector('#fecha');
const horaInput = document.querySelector('#hora');
const sintomasInput = document.querySelector('#sintomas');

//modo edicion

let editando;

//UI
const formulario = document.querySelector('#nueva-cita');
const contenedorCitas = document.querySelector('#citas');

//class

class Citas {
    constructor() {
        this.citas = [];
    }

    agregarCitas(cita){
        this.citas = [...this.citas,cita];

    
    }

    eliminarCita(id){
        this.citas = this.citas.filter(cita => cita.id !== id);     
    }

    editarCita(citaActualizada){
        this.citas = this.citas.map(cita => cita.id === citaActualizada.id ? citaActualizada : cita)
    }
}

class UI {

    imprimirAlerta(mensaje,tipo){
        const mensajeDiv = document.createElement('div');
        mensajeDiv.classList.add('text-center','alert','d-block','col-12');

        if(tipo === 'error') {
            mensajeDiv.classList.add('alert-danger');

        }else {
            mensajeDiv.classList.add('alert-success');
        }

        //mensaje de error 
        mensajeDiv.textContent = mensaje;
        //agregar al dom
        document.querySelector('#contenido').insertBefore(mensajeDiv, document.querySelector('.agregar-cita'));

        setTimeout(() => {
            mensajeDiv.remove();
        }, 5000);
    }

    imprimirCitas({citas}){

        this.limpiarHtml();

        citas.forEach(cita => {
            const {mascota,telefono,fecha,hora,sintomas,propietario,id} = cita;

            const divCita = document.createElement('div');
            divCita.classList.add('cita','p-3');
            divCita.dataset.id = id;

            //scripting
            const mascotaParrafo = document.createElement('h2');
            mascotaParrafo.classList.add('card-title','font-weight-bolder');
            mascotaParrafo.textContent = mascota;

            const propietarioParrafo = document.createElement('p');
            propietarioParrafo.innerHTML= `
                <span class="font-weight-bolder">Propietario:</span> ${propietario}
            `;

            const telefonoParrafo = document.createElement('p');
            telefonoParrafo.innerHTML= `
                <span class="font-weight-bolder">Telefono:</span> ${telefono}
            `;

            const horaParrafo = document.createElement('p');
            horaParrafo.innerHTML= `
                <span class="font-weight-bolder">Hora:</span> ${hora}
            `;

            const fechaParrafo = document.createElement('p');
            fechaParrafo.innerHTML= `
                <span class="font-weight-bolder">Fecha:</span> ${fecha}
            `;

            const sintomasParrafo = document.createElement('p');
            sintomasParrafo.innerHTML= `
                <span class="font-weight-bolder">Sintomas:</span> ${sintomas}
            `;


            //boton eliminar

            const btn = document.createElement('button');
            btn.classList.add('btn','btn-danger','mr-2');
            btn.innerHTML = `Eliminar <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>`;

            btn.onclick = ()=> eliminarCita(id);


            //boton editar

            const btnEditar = document.createElement('button');
            btnEditar.classList.add('btn','btn-info');
            btnEditar.innerHTML = `Editar <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
          </svg>`;

             btnEditar.onclick = () => cargarEdicion(cita);
            //agregar los parrafos al div cita

            divCita.appendChild(mascotaParrafo);
            divCita.appendChild(propietarioParrafo);
            divCita.appendChild(telefonoParrafo);
            divCita.appendChild(horaParrafo);
            divCita.appendChild(fechaParrafo);
            divCita.appendChild(sintomasParrafo);
            divCita.appendChild(btn);
            divCita.appendChild(btnEditar);
        

            //agregar al html
            contenedorCitas.appendChild(divCita);
        }); 
    }

    limpiarHtml() {
        while(contenedorCitas.firstChild){
            contenedorCitas.removeChild(contenedorCitas.firstElementChild);
        }
    }

}

const ui = new UI();
const administrarCitas = new Citas();

//evenetos
eventListener();
function eventListener() {
    mascotaInput.addEventListener('input',datosCita);
    propietarioInput.addEventListener('input',datosCita);
    telefonoInput.addEventListener('input',datosCita);
    fechaInput.addEventListener('input',datosCita);
    horaInput.addEventListener('input',datosCita);
    sintomasInput.addEventListener('input',datosCita);

    formulario.addEventListener('submit', nuevaCita);
}

//objeto con la informacion de la cita
const citaObj = {
    mascota: '',
    propietario:'',
    telefono:'',
    fecha:'',
    hora:'',
    sintomas:''
}

//funciones agrega informacion al objeto
function datosCita(e) {
    citaObj[e.target.name]= e.target.value;
    
}

// valida y agrega una cita a la clase de citas 

function nuevaCita(e) {
    e.preventDefault();

    //extrer informacion del objeto de cita
    const {mascota,telefono,fecha,hora,sintomas,propietario} = citaObj;

    if(mascota === '' || propietario === ''|| telefono === '' || fecha === '' || hora === '' || sintomas === '' ){
        ui.imprimirAlerta('todo los campos son obligatorios','error');
        return;
    }
    //pasamos validacion , creamos una nueva cita

    if(editando === true) {
        ui.imprimirAlerta('Se ha editado Correctamente');
        
        //pasar el objeto de la cita  a edicion
        administrarCitas.editarCita({...citaObj});
        
        formulario.querySelector('button[type="submit"]').textContent = 'Crear Cita';
        //quitamos el modo edicion
        editando=false;
    } else {
        //generamos un id
        citaObj.id = Date.now();    

        //creando una nueva cita
        administrarCitas.agregarCitas({...citaObj});

        //mensaje de agregado correctamente
        ui.imprimirAlerta('Se ha agregado Correctamente');
    }



    //reiniciar el objeto para la validacion
    reiniciarOBj();
    //reinicia e formulario
    formulario.reset();

    //mostrar el html

    ui.imprimirCitas(administrarCitas);

}

function reiniciarOBj(){
    citaObj.mascota ='';
    citaObj.propietario ='';
    citaObj.telefono ='';
    citaObj.fecha ='';
    citaObj.hora ='';
    citaObj.sintomas ='';
}

function eliminarCita(id) {
    //eliminar cita
    administrarCitas.eliminarCita(id);

    //muestre un mensaje
    ui.imprimirAlerta('Haz eliminado Cita');
    //refresque las cita
    ui.imprimirCitas(administrarCitas);
}

//actuliza los datos de una cita existente
function cargarEdicion(cita){
    const {mascota,telefono,fecha,hora,sintomas,propietario,id} = cita;

    //autocompletado de los inputs
    mascotaInput.value = mascota;
    propietarioInput.value = propietario;
    telefonoInput.value = telefono;
    fechaInput.value = fecha;
    horaInput.value = hora;
    sintomasInput.value = sintomas;

    //llenar le objeto para validar
    citaObj.mascota = mascota;
    citaObj.propietario = propietario;
    citaObj.telefono = telefono;
    citaObj.fecha = fecha;
    citaObj.hora = hora;
    citaObj.sintomas = sintomas;
    citaObj.id = id;

    //cambiar el texto del boton

    formulario.querySelector('button[type="submit"]').textContent = 'Guardar Cambios';

    editando = true;
}