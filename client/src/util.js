const isLoggedIn = () => {
    return !!localStorage.auth;
};

const getLoggedInUser = () => {

    if (!isLoggedIn()) {
        throw "No logged in user";
    } else {
        return JSON.parse(localStorage.auth);
    }

};

const logout = () => {
    localStorage.removeItem('auth');
};

const login = (user) => {
    localStorage.setItem('auth', JSON.stringify(user));
};

const getAuthorizedJson = (address)  => {
    return fetch(address, {
        headers: {
            'Authorization': 'JWT ' + getLoggedInUser().token
        }
    }).then((response) => {

        if (response.status >= 400) {
            throw new Error("Bad response from server");
        }

        return response.json();

    });
};

const postAuthorized = (address, body)  => {
    return fetch(address, {
        method: 'post',
        headers: {
            'Authorization': 'JWT ' + getLoggedInUser().token
        },
        body: body
    }).then((response) => {

        if (response.status >= 400) {
            throw new Error("Bad response from server");
        }

        return response.json();

    });
};


export {isLoggedIn, getLoggedInUser, logout, getAuthorizedJson, postAuthorized, login};
