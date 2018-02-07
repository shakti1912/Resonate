const isLoggedIn = () => {
    return !!localStorage.auth;
};

const getLoggedInUser = () => {

    if (!isLoggedIn()) {
        console.log("No logged in user");
        throw "No logged in user";
    } else {
        return JSON.parse(localStorage.auth);
    }
};

export {isLoggedIn, getLoggedInUser};
