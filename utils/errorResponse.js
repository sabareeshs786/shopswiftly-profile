const res400 = (res, msg) => {
    res.status(400).json({ message: msg});
    return;
}

module.exports = { res400 };