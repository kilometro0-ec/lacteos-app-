const API_URL =
"https://script.google.com/macros/s/AKfycbx-Go0Cfxm59LOdcahYSXsEKMRkoXA8YGi1-Pg2z4RLcrhoGMfKEkJjHO5hx0xAsmcSAQ/exec";

const DairyAPI = {

async obtenerDatos(pestaña){

const res = await fetch(
`${API_URL}?action=obtener&pestaña=${encodeURIComponent(pestaña)}`
);

return await res.json();

},

async enviarDatos(data){

const res = await fetch(API_URL,{
method:"POST",
body:JSON.stringify({
action:"guardar",
...data
})
});

return await res.json();

},

async actualizarDato(pestaña,id,datos){

const res = await fetch(API_URL,{
method:"POST",
body:JSON.stringify({
action:"actualizar",
pestaña,
id,
datos
})
});

return await res.json();

},

async eliminarDato(pestaña,id){

const res = await fetch(API_URL,{
method:"POST",
body:JSON.stringify({
action:"eliminar",
pestaña,
id
})
});

return await res.json();

}

};
