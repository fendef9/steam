const errorHandler = {
    send400Error: function (res, err) {
        res.status(400).json({ message: err })
    },

    send500Error: function (res, err) {
        res.status(500).json({ message: err })
    },
}

module.exports = { errorHandler };