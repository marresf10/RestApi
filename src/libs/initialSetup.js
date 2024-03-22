//Importar modelo de datos
import Role from "../models/Role";


//Exportar función para crear Roles
export const createRoles = async () => {
    try {
        //Verificar si existen roles en la base de datos
        const count = await Role.estimatedDocumentCount();
        //Si no existen los roles crearlos
        if (count > 0) return;
        //Crear roles por defecto envolviendo en una promesa

        const values = await Promise.all([
            new Role({ name: "user" }).save(),
            new Role({ name: "moderator" }).save(),
            new Role({ name: "admin" }).save()
        ]);
        console.log(values);
    }catch(error){
    console.error(error);
    }
    
}