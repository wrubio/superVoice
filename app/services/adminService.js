function newAdmin(admin) {
    return new Promise((resolve, reject) => {
        admin.save((err, savedAdmin) => {
            if (err) reject({
                ok: false,
                errors: err
            })
            resolve({ ok: true })
        })
    });
}

module.exports = {
    newAdmin
}