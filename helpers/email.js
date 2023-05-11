

import nodemailer from 'nodemailer'





// confirmar cuenta
export const emailRegistro = async (datos) => {
    const { nombre, email, token } = datos

    // como buena practica colocar (TODO: Mover hacia variables de entorno) como recordatorio de poner esto en "env" al final del proyecto
    // codigo copiado de Mailtrap de mi inbox
    const transport = nodemailer.createTransport({
        //  asi utilizamos las variables de entorno con Node y Express process.env.(nombre de la variable de entorno)
        // cuidado de como escribo todo al utilizar las env
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    // informacion del email
    // sendMailes un metodo que nos permite enviar el correo
    const info = await transport.sendMail({
        // esto es quien envia el correo
        from: ' "Uptask - Administrador de Proyectos" <cuentas@uptask.com>',
        // a quien le enviamos el email
        to: email,
        // es el asunto del email
        subject: 'Uptask - Confirma tu cuenta',
        // texto que se muestra sino tengo estilo html en el correo

        text: 'Comprueba tu cuenta de Uptask',
        // este es el cuerpo del email se maneja como el html
        // html: `<p>Hola: ${nombre} Comprueba tu cuenta en Uptask </p>
        // <p> Tu cuenta ya esta casi lista, solo debes comprobarla en el siguiente enlace:
        // <a href="${process.env.FRONTEND_URL}/confirmar/${token}">Comprobar Cuenta</a>
        // </p>

        // <p>Si tu no create esta cuenta, puedes ignorar el mensaje </p>

        // `
        // este es el cuerpo del email se maneja como el html los diseños se manejan como css
        html: `
        <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <style>
        p, a, h1, h2, h3, h4, h5, h6 {font-family: 'Roboto', sans-serif !important;}
        h1{ font-size: 30px !important;}
        h2{ font-size: 25px !important;}
        h3{ font-size: 18px !important;}
        h4{ font-size: 16px !important;}
        p, a{font-size: 15px !important;}

        .claseBoton{
            width: 30%;
                background-color: #fcae3b;
                border: 2px solid #fcae3b;
                color: black; 
                padding: 16px 32px;
                text-align: center;
                text-decoration: none;
                font-weight: bold;
                display: inline-block;
                font-size: 16px;
                margin: 4px 2px;
                transition-duration: 0.4s;
                cursor: pointer;
        }
        .claseBoton:hover{
            background-color: #000000;
            color: #ffffff;
        }
        .imag{
            width: 20px;
            height: 20px;
        }
        .contA{
            margin: 0px 5px 0 5px;
        }
        .afooter{
            color: #ffffff !important; 
            text-decoration: none;
            font-size: 13px !important;
        }
    </style>
</head>
<body>
<!-- ASI SE COMENTA EN ESTA PARTE -->
<!-- fondo del todo -->
    <div style="width: 100%; background-color: #e3e3e3;">
        <div style="padding: 20px 10px 20px 10px;">
        
        <!-- donde esta la Imagen inicial -->
            <div style="background-color: #000000; padding: 10px 0px 10px 0px; width: 100%; text-align: center;">
                <img src="/public/images/pretwor.png" alt="" style="width: 200px; height: 60px;">
            </div>

            <!-- Contenido principal -->
            <div style="background-color: #ffffff; padding: 20px 0px 5px 0px; width: 100%; text-align: center;">
                <h1>
                Uptask - Confirma tu cuenta</h1>
                  <p> Tu cuenta ya esta casi lista, solo debes comprobarla en el siguiente enlace:
                <!-- este endpoint es el que esta en app.jsx y NO en postman -->
                  <a href="${process.env.FRONTEND_URL}/confirmar/${token}">Comprobar Cuenta</a>
                  </p>

                  <p>Si tu no create esta cuenta, puedes ignorar el mensaje </p>

                <!-- Gracias -->
                <p>Gracias por tu tiempo.</p>
                <p style="margin-bottom: 50px;"><i>Atentamente:</i><br>Equipo de Uptask</p>

                
                <!-- Botón
                <a class="claseBoton" href="">Pretwor</a>
                -->
            </div>
            <!-- Contenido principal -->

            <!-- Footer -->
            <div style="background-color: #282828; color: #ffffff; padding: 5px 0px 0px 0px; width: 100%; text-align: center;">
                <!-- Redes sociales -->
                <a href=" " class="contA"><img src="/public/images/fb.png" class="imag" /></a>
                <a href=" " class="contA"><img src="/public/images/ig.png" class="imag" /></a>
                <a href=" " class="contA"><img src="/public/images/wapp.png" class="imag" /></a>
                <a href=" " class="contA"><img src="/public/images/em.png" class="imag" /></a>
                <!-- Redes sociales -->

                <h4>Soporte</h4>
                <p style="font-size: 13px; padding: 0px 20px 0px 20px;">
                    Comunícate con nosotros por los siguientes medios:<br>
                    Correo: <a class="afooter" href=""></a><br>
                    Whatsapp: <a class="afooter" href=""></a><br>
                </p>

                <!-- Parte de los derechos-->
                <p style="background-color: black; padding: 10px 0px 10px 0px; font-size: 12px !important;">
                    © 2022 Shue, todos los derechos reservados.
                </p>
            </div>
            <!-- Footer -->



        </div>
    </div>
</body>
</html>
        
        `
    })

}



// olvide mi password
export const emailOlvidePassword = async (datos) => {
    const { nombre, email, token } = datos



    // codigo copiado de Mailtrap de mi inbox
    const transport = nodemailer.createTransport({
        //  asi utilizamos las variables de entorno con Node y Express process.env.(nombre de la variable de entorno)
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    // informacion del email
    // sendMailes un metodo que nos permite enviar el correo
    const info = await transport.sendMail({
        // esto es quien envia el correo
        from: ' "Uptask - Administrador de Proyectos" <cuentas@uptask.com>',
        // a quien le enviamos el email
        to: email,
        // es el asunto del email
        subject: 'Uptask - Reestablece tu password',
        // texto que se muestra sino tengo estilo html en el correo

        text: 'Reestablece tu password',
        // este es el cuerpo del email se maneja como el html
        // html: `<p>Hola: ${nombre} Comprueba tu cuenta en Uptask </p>
        // <p> Tu cuenta ya esta casi lista, solo debes comprobarla en el siguiente enlace:
        // <a href="${process.env.FRONTEND_URL}/confirmar/${token}">Comprobar Cuenta</a>
        // </p>

        // <p>Si tu no create esta cuenta, puedes ignorar el mensaje </p>

        // `
        // este es el cuerpo del email se maneja como el html los diseños se manejan como css
        html: `
        <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <style>
        p, a, h1, h2, h3, h4, h5, h6 {font-family: 'Roboto', sans-serif !important;}
        h1{ font-size: 30px !important;}
        h2{ font-size: 25px !important;}
        h3{ font-size: 18px !important;}
        h4{ font-size: 16px !important;}
        p, a{font-size: 15px !important;}

        .claseBoton{
            width: 30%;
                background-color: #fcae3b;
                border: 2px solid #fcae3b;
                color: black; 
                padding: 16px 32px;
                text-align: center;
                text-decoration: none;
                font-weight: bold;
                display: inline-block;
                font-size: 16px;
                margin: 4px 2px;
                transition-duration: 0.4s;
                cursor: pointer;
        }
        .claseBoton:hover{
            background-color: #000000;
            color: #ffffff;
        }
        .imag{
            width: 20px;
            height: 20px;
        }
        .contA{
            margin: 0px 5px 0 5px;
        }
        .afooter{
            color: #ffffff !important; 
            text-decoration: none;
            font-size: 13px !important;
        }
    </style>
</head>
<body>
<!-- ASI SE COMENTA EN ESTA PARTE -->
<!-- fondo del todo -->
    <div style="width: 100%; background-color: #e3e3e3;">
        <div style="padding: 20px 10px 20px 10px;">
        
        <!-- donde esta la Imagen inicial -->
            <div style="background-color: #000000; padding: 10px 0px 10px 0px; width: 100%; text-align: center;">
                <img src="/public/images/pretwor.png" alt="" style="width: 200px; height: 60px;">
            </div>

            <!-- Contenido principal -->
            <div style="background-color: #ffffff; padding: 20px 0px 5px 0px; width: 100%; text-align: center;">
                <h1>
                Uptask - Reestablece tu password</h1>
                  <p> Hola ${nombre} has solicitado reestablecer tu password </p>
                  <p> Sigue el siguiente enlace para generar un nuevo password:
                <!-- este endpoint es el que esta en app.jsx y NO en postman -->

                  <a href="${process.env.FRONTEND_URL}/olvide-password/${token}">Reestablece tu password</a>
                  </p>

                  <p>Si tu no solicitaste un nuevo password, puedes ignorar el mensaje y ponerte en contacto con nosotros </p>

                <!-- Gracias -->
                <p>Gracias por tu tiempo.</p>
                <p style="margin-bottom: 50px;"><i>Atentamente:</i><br>Equipo de Uptask</p>

                
                <!-- Botón
                <a class="claseBoton" href="">Pretwor</a>
                -->
            </div>
            <!-- Contenido principal -->

            <!-- Footer -->
            <div style="background-color: #282828; color: #ffffff; padding: 5px 0px 0px 0px; width: 100%; text-align: center;">
                <!-- Redes sociales -->
                <a href=" " class="contA"><img src="/public/images/fb.png" class="imag" /></a>
                <a href=" " class="contA"><img src="/public/images/ig.png" class="imag" /></a>
                <a href=" " class="contA"><img src="/public/images/wapp.png" class="imag" /></a>
                <a href=" " class="contA"><img src="/public/images/em.png" class="imag" /></a>
                <!-- Redes sociales -->

                <h4>Soporte</h4>
                <p style="font-size: 13px; padding: 0px 20px 0px 20px;">
                    Comunícate con nosotros por los siguientes medios:<br>
                    Correo: <a class="afooter" href=""></a><br>
                    Whatsapp: <a class="afooter" href=""></a><br>
                </p>

                <!-- Parte de los derechos-->
                <p style="background-color: black; padding: 10px 0px 10px 0px; font-size: 12px !important;">
                    © 2022 Shue, todos los derechos reservados.
                </p>
            </div>
            <!-- Footer -->



        </div>
    </div>
</body>
</html>
        
        `
    })

}