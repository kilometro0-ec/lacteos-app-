const API_URL = "https://script.google.com/macros/s/AKfycbzSE9PGLvpUCMSu31BsXJwOSntaJmtYjfOIlrthFTEUkAMCNDuaZKFC8tW15NwT7_Dkcg/exec";

const DairyAPI = {

  async obtenerDatos(pestaña) {
    const res = await fetch(`${API_URL}?pestaña=${pestaña}`);
    return (await res.json()).data || [];
  },

  async enviarDatos(data) {
    const res = await fetch(API_URL, {
      method: "POST",
      body: JSON.stringify(data)
    });

    return await res.json();
  }

};
