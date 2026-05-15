const API_URL =
"https://script.google.com/macros/s/AKfycbyVBL74zDOEZkIW7dykNAjMiLvN0jK00XtBjhYq_ZyVkv7khiU-cCOoV0MKOjg2a9hwbQ/exec";

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
