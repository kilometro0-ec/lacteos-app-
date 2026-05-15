const SS = SpreadsheetApp.openById("1PtM2KA1Ix0qJfUtEpxsYmiviwUKFEBYpT6hbUn1aXck");

// =======================
// RESPONSE JSON
// =======================
function json(obj){
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

// =======================
// DOGET (READ + LAST ID)
// =======================
function doGet(e){

  const action = e.parameter.action;
  const sheetName = e.parameter.pestaña;

  if(action === "obtener"){
    return obtener(sheetName);
  }

  if(action === "lastID"){
    return lastID(sheetName);
  }

  return json({error:"acción inválida"});
}

// =======================
// DOPOST (CREATE UPDATE DELETE)
// =======================
function doPost(e){

  const data = JSON.parse(e.postData.contents);
  const action = data.action;

  if(action === "guardar") return guardar(data);
  if(action === "actualizar") return actualizar(data);
  if(action === "eliminar") return eliminar(data);

  return json({error:"acción inválida"});
}

// =======================
// OBTENER DATOS
// =======================
function obtener(sheetName){

  const sh = SS.getSheetByName(sheetName);
  const values = sh.getDataRange().getValues();

  const headers = values[0];
  let result = [];

  for(let i=1;i<values.length;i++){
    let obj = {};
    headers.forEach((h,j)=>{
      obj[h] = values[i][j];
    });
    result.push(obj);
  }

  return json({data: result});
}

// =======================
// GENERAR ID SECUENCIAL (P-001)
// =======================
function generateID(sheet){

  const data = sheet.getDataRange().getValues();

  let max = 0;

  for(let i=1;i<data.length;i++){
    let id = data[i][1]; // columna B = ID
    if(id && id.toString().includes("P-")){
      let num = parseInt(id.toString().replace("P-",""));
      if(num > max) max = num;
    }
  }

  return "P-" + String(max + 1).padStart(3,"0");
}

// =======================
// GUARDAR
// =======================
function guardar(data){

  const sh = SS.getSheetByName(data.pestaña);

  const headers = sh.getRange(1,1,1,sh.getLastColumn()).getValues()[0];

  const newID = generateID(sh);

  let row = headers.map(h=>{

    if(h === "ID" || h === "ID_Venta" || h === "ID_Compra"){
      return newID;
    }

    if(h === "Fecha"){
      return new Date();
    }

    return data[h] || "";
  });

  sh.appendRow(row);

  return json({success:true, id:newID});
}

// =======================
// ACTUALIZAR
// =======================
function actualizar(data){

  const sh = SS.getSheetByName(data.pestaña);
  const values = sh.getDataRange().getValues();
  const headers = values[0];

  for(let i=1;i<values.length;i++){

    if(values[i][1] == data.ID){

      headers.forEach((h,j)=>{
        if(data.datos[h] !== undefined){
          sh.getRange(i+1,j+1).setValue(data.datos[h]);
        }
      });

      break;
    }
  }

  return json({success:true});
}

// =======================
// ELIMINAR
// =======================
function eliminar(data){

  const sh = SS.getSheetByName(data.pestaña);
  const values = sh.getDataRange().getValues();

  for(let i=1;i<values.length;i++){

    if(values[i][1] == data.ID){
      sh.deleteRow(i+1);
      break;
    }
  }

  return json({success:true});
}

// =======================
// LAST ID (para frontend)
// =======================
function lastID(sheetName){

  const sh = SS.getSheetByName(sheetName);
  const values = sh.getDataRange().getValues();

  let last = 0;

  for(let i=1;i<values.length;i++){
    let id = values[i][1];

    if(id && id.toString().includes("P-")){
      let num = parseInt(id.toString().replace("P-",""));
      if(num > last) last = num;
    }
  }

  return json({last});
}
