import Role from "../models/Role";
import User from "../models/User";
import { signToken } from "../utils/token";
import jwt from 'jsonwebtoken';

export const signUp = async (req, res) => {

  try {
    const { username, email, password, roles } = req.body;

    // Crear un nuevo usuario
    const newUser = new User({
      username,
      email,
      password: await User.encryptPassword(password),
    });

    //Condicional para asignar los roles en caso de que no se envien roles
    //se asigna el rol de usuario
    if(req.body.roles){
      const foundRoles = await Role.find({ name: { $in: roles }})
      newUser.roles = foundRoles.map(role => role._id );
    }else{
      const role = await Role.findOne({ name:"user" });
      newUser.roles = [role._id];
    }

    //Guardar el usuario en la base de datos
    const saveUser = await newUser.save();
    console.log(saveUser);

    // Guardar el usuario en la base de datos
    const savedUser = await newUser.save();

    // Crear el token después de guardar el usuario
    const token = signToken(savedUser);

    console.log(req.body);

    // Responder al cliente con el token
    res.status(200).json({ token });
  } catch (error) {
    console.error("Error al registrar usuario:", error);
    res.status(500).json({ error: "Error al registrar usuario" });
  }
};


/*
export const SignIn = async (req, res) => {
  res.json("Has iniciado sesión uwu");
};
*/


export const SignIn = async (req, res) => {
  //buscar usuario por correo
  const userFound = await User.findOne({email: req.body.email}).populate("roles");
  //si no se encuentra el usuario, enviar mensaje de error
  if(!userFound) return res.status(400).json({message: "El usuario no se ha encontrado"});
  //verifcar contra
  const matchPassword = await User.comparePassword(req.body.password, userFound.password);
 // const matchPassword = await userFound.comparePassword(req.body.password);

  //error si no coincide
  if(!matchPassword) return res.status(401).json({token: null, message: "contraseña incorrecta"});

  //generar token
  //const token = await signToken(userFound.id);
  const token = jwt.sign({ id:userFound._id}, process.env.SECRET,{
    expiresIn: 86400
  });
  //Mostrar usuario encontrado
  console.log(userFound);
  // responder con el token
  //res.json({ token });
  res.status(200).json({token})
};
