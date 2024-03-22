/*
import jwt from "jsonwebtoken";
import User from "../models/User";
//Validar si el token es válido
export const verifyToken = async (req, res, next) => {
    const token = req.headers['x-access-token'] 
    if (!token) return res.status(403).json({ message: "No se ha proporcionado ningún Token" });
    //console.log(token);
    //Extraer la información del token
    const decoded = jwt.verify(token, process.env.SECRET);
    req.userId = decoded.id;
    console.log(decoded);
    //Buscar el usuario en la base de datos
    const user = await User.findById(req.userId, {password: 0});
    console.log(user);
    //Validar si el usuario existe
    if (!user) return res.status(404).json({ message: "Usuario no encontrado" });
    //Continuar con la siguiente funcion si el usuario existe
    next();
}
*/

import jwt from "jsonwebtoken";
import User from "../models/User";
import Role from "../models/Role";

export const verifyToken = async (req, res, next) => {

  try {
    const token = req.headers["x-access-token"];

    if (!token) {
      return res.status(403).json({
        message: "No se ha proporcionado ningún token. ¡Cuidado ahí, master!",
      });
    }

    // Extraer la información del token
    const decoded = jwt.verify(token, process.env.SECRET);
    req.userId = decoded.id;
    console.log(decoded);

    console.log("decoded.id: " + decoded.id);

    console.log("req.userId: " + req.userId);

    // Buscar usuario en la base de datos
    const user = await User.findById(req.userId, { password: 0 });
    console.log("user:" + user);
    // Validar si el usuario existe
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    // Continuar con la siguiente función si el usuario existe
    next();
  } catch (error) {
   // console.log("valio madre");

    // Manejar errores relacionados con el token, como expiración o firma inválida
    return res.status(401).json({ message: "Usuario no encontrado, el token ha expirado por favor vuelve a iniciar sesión" });
  }
};


export const isModerator = async (req, res, next) => {
  //Buscar el usuario en la base de datos
  const user = await User.findById(req.userId);
  //Buscar los roles del usuario
  const roles = await Role.find({ _id: { $in: user.roles } });
  //console.log(roles);
  //next();

  for(let i = 0; i < roles.length; i++){
    if(roles[i].name === "moderator" ){
      next();
      return;
    }
  }

  return res.status(403).json({message: "Se requieren permisos para realizar la accion"});

}

export const isAdmin = async (req, res, next) => {
  //Buscar el usuario en la base de datos
  const user = await User.findById(req.userId);
  //Buscar los roles del usuario
  const roles = await Role.find({ _id: { $in: user.roles } });
  //console.log(roles);
  //next();

  for(let i = 0; i < roles.length; i++){
    if(roles[i].name === "admin" ){
      next();
      return;
    }
  }

  return res.status(403).json({message: "Se requieren permisos para realizar la accion"});

}

export const isAdminOrModerator = async (req, res, next) => {
  //Buscar el usuario en la base de datos
  const user = await User.findById(req.userId);
  //Buscar los roles del usuario
  const roles = await Role.find({ _id: { $in: user.roles } });
  //console.log(roles);
  //next();

  for(let i = 0; i < roles.length; i++){
    if(roles[i].name === "admin" || roles[i].name === "moderator"){
      next();
      return;
    }
  }

  return res.status(403).json({message: "Se requieren permisos para realizar la accion"});

}