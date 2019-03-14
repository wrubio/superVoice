const { Administrador } = require('../../db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const SEED = require('../../config/config').SEED;

/**
 * Get an administrador by its correo.
 *
 * @param adminCorreo {string} Administrador email
 * @return {Promise<Administrador>} The wanted admin.
 */
async function getAdministradorByCorreo(adminCorreo, adminContrasena) {

    console.log("Admin service: Fetching the administrador with correo : " + adminCorreo);

    const admin = Administrador.findOne({
        where: {
            correo: adminCorreo
        }
    }).then(info => {
        if (bcrypt.compareSync(adminContrasena, info.dataValues.contrasena)) {
            const adminInfo = info.dataValues;
            adminInfo.contrasena = ':)';
            const token = jwt.sign({ user: adminInfo }, SEED, { expiresIn: 14400 }); // 4 horas
            return { user: adminInfo, token: token };
        }
        return err = { ok: false, err: 'Credenciales invalidas' };
    }).catch((err) => {
        return err = { ok: false, err: 'Credenciales invalidas' };
    });

    return admin;
}

module.exports = { getAdministradorByCorreo }