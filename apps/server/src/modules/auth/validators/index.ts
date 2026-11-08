import z, { email } from "zod";


const loginSchema = z.object({
    email : z.string().nonempty("Email is not provided !"),
    password : z.string().nonempty("Password can't be empty !")
});


const registerSchema = z.object({
    name : z.string().min(2 , "Name can't be single char"),
    email : z.string().nonempty("Email is not provided !"),
    password : z.string().nonempty("Password can't be empty !")
});



export {
    loginSchema,
    registerSchema
}