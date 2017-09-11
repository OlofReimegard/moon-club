const spicedPg = require('spiced-pg');
const db = spicedPg(process.env.DATABASE_URL || 'postgres:postgres:password@localhost:5432/signatures');


// ***************** SIGNATURES *********************

exports.insertSign = (data, id) => {
    return new Promise((resolve, reject) => {
        var query = "INSERT INTO signatures (signature,id) VALUES ($1,$2)";

        db.query(query, [data, id]).then(() => {
            resolve("didit");
        }).catch((err) => {
            reject(err);
        });
    });
};

exports.deleteSign = (id) => {
    return new Promise((resolve, reject) => {
        var query = "DELETE FROM signatures WHERE id=$1";

        db.query(query, [id]).then(() => {
            resolve("didit");
        }).catch((err) => {
            reject(err);
        });
    });
};

exports.readSign = () => {
    return new Promise((resolve, reject) => {
        var query = "SELECT * FROM signatures;";

        db.query(query).then((data) => {
            resolve(data.rows);
        }).catch((err) => {
            reject(err);
        });
    });
};



// ***************** USERS *********************

exports.insertUser = (data, pswrd) => {
    return new Promise((resolve, reject) => {
        var query = "INSERT INTO users (first, last, email, password) VALUES ($1,$2,$3,$4)";

        db.query(query, [data.first, data.last, data.email, pswrd]).then(() => {
            resolve(pswrd);
        }).catch((err) => {
            reject(err);
        });
    });
};

exports.readUser = () => {
    return new Promise((resolve, reject) => {
        var query = "SELECT * FROM users;";

        db.query(query).then((data) => {
            resolve(data.rows);
        }).catch((err) => {
            reject(err);
        });
    });
};

exports.updateUser = (id, data, password) => {
    return new Promise((resolve, reject) => {
        var query = "UPDATE users SET first = $2, last = $3, email = $4, password = $5 WHERE id = $1;";

        db.query(query, [id, data.first, data.last, data.email, password]).then(() => {
            resolve(password);
        }).catch((err) => {
            reject(err);
        });
    });
};



// ***************** PROFILES *********************

exports.insertProfile = (id, data) => {
    return new Promise((resolve, reject) => {
        var query = "INSERT INTO user_profiles (user_id, age, city, url) VALUES ($1,$2,initcap($3),$4)";

        db.query(query, [id, data.age, data.city, data.url]).then(() => {
            resolve("success");
        }).catch((err) => {
            reject(err);
        });
    });
};

exports.readProfile = () => {
    return new Promise((resolve, reject) => {
        var query = "SELECT users.first, users.last, user_profiles.age, user_profiles.city, user_profiles.url FROM users JOIN user_profiles ON users.id = user_profiles.user_id JOIN signatures ON users.id = signatures.id;";

        db.query(query).then((data) => {
            resolve(data.rows);
        }).catch((err) => {
            reject(err);
        });
    });
};

exports.readProfileInfo = () => {
    return new Promise((resolve, reject) => {
        var query = "SELECT users.id, users.first, users.last, users.email, users.password,user_profiles.age, user_profiles.city, user_profiles.url FROM users JOIN user_profiles ON users.id = user_profiles.id;";

        db.query(query).then((data) => {
            resolve(data.rows);
        }).catch((err) => {
            reject(err);
        });
    });
};

exports.readProfileFromArea = (area) => {
    return new Promise((resolve, reject) => {
        var query = "SELECT users.first, users.last, user_profiles.age, user_profiles.city, user_profiles.url FROM users JOIN user_profiles ON users.id = user_profiles.id JOIN signatures ON user_profiles.id = signatures.id AND city = '" + area + "'";

        db.query(query).then((data) => {
            resolve(data.rows);
        }).catch((err) => {
            reject(err);
        });
    });
};

exports.updateProfile = (id, data) => {
    return new Promise((resolve, reject) => {
        var query = "UPDATE user_profiles SET age = $2, city = $3, url = $4 WHERE user_id = $1;";

        db.query(query, [id, data.age, data.city, data.url]).then((data) => {
            resolve(data.rows);
        }).catch((err) => {
            reject(err);
        });
    });
};
