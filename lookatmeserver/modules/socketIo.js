const fs = require('fs')

const consumerLogOffTimer = 5000

const socketCycle = async (socket) => {
    socket.emit('status')
    socket.on('status', statusId => {
    })
}
let moduleIo = false
let smartScreens = []



setInterval(() => {
    for (let i = 0; i < smartScreens.length; i++) {
        if (moduleIo) {

            if (typeof smartScreens[i] != 'undefined' && typeof smartScreens[i].time != 'undefined' && typeof smartScreens[i].socketId != 'undefined' && typeof smartScreens[i].consumerEmail != 'undefined') {

                if ((Date.now() - smartScreens[i].time) >180000) {
                    if (moduleIo.sockets.connected[smartScreens[i].socketId] != 'undefined') {
                        moduleIo.sockets.connected[smartScreens[i].socketId].emit('logOffConsumer', {consumerEmail: smartScreens[i].consumerEmail})
                    }
                    if (i > -1) {
                        smartScreens.splice(i, 1)
                    }
                }
            }
        }
    }
}, 5000);


const isCustomerConnected = (consumerEmail) => {
    let consumerConnectedFlag = false
    smartScreens.forEach(connection => {
        if (connection.consumerEmail == consumerEmail) {
            consumerConnectedFlag = true
        }
    })
    return consumerConnectedFlag
}


module.exports = {
    setUpSocketIo: (io) => {
        moduleIo = io
        io.on('connection', (socket) => {
            socket.on('disconnect', () => {
                let connectionObject = smartScreens.find(connection => connection.socketId == socket.id)
                if (connectionObject) {
                    let index = smartScreens.indexOf(connectionObject)
                    if (index > -1) {
                        smartScreens.splice(index, 1)
                    }
                }
            })

            socket.on('freeSmartScreen', async data => {
                if (!isCustomerConnected(data.consumerEmail)) {
                    let fileSystem = fs.promises
                    let openDir = [];
                    let userPictureUri = false
                    try {
                        openDir = await fileSystem.readdir(`public/userImages/${data.consumerEmail}/`)

                        if (openDir) {
                            for (let x = 0; x < openDir.length; x++) {
                                userPictureUri = `/userImages/${data.consumerEmail}/${openDir[x]}`
                            }
                        }
                    } catch (error) {
                        console.log(error)
                        if (!error.errno == -2) { 
                            throw error.toString()

                        }
                    }

                    smartScreens.push({
                        consumerEmail: data.consumerEmail,
                        time: Date.now(),
                        pictureUri: userPictureUri,
                        socketId: socket.id,
                    })
                    socket.emit('connectConsumer', {consumerEmail: data.consumerEmail,userPictureUri:userPictureUri})

                }
            })

        })


    },
    findDigitalScreen: async (consumerEmail, digitalBoardId) => {

        if (moduleIo) {
            moduleIo.sockets.emit('findBoardForConsumer', {
                digitalBoardId: digitalBoardId,
                consumerEmail: consumerEmail
            })
        }
    },
    searchConsumerInList: async (consumerEmail, digitalBoardId) => {
        let index = smartScreens.findIndex(item => item.consumerEmail == consumerEmail)
        if (index) {
            if (typeof smartScreens[index].time != 'undefined') {
            }
        }
    },
    isCustomerConnected: (consumerEmail) => {
        let index = smartScreens.findIndex(item => item.consumerEmail == consumerEmail)
        if (index > -1) {
            if (typeof smartScreens[index] != 'undefined' && typeof smartScreens[index].time != 'undefined' && typeof smartScreens[index].socketId != 'undefined') {
                if ((Date.now() - smartScreens[index].time) > 180000) {
                    if (moduleIo.sockets.connected[smartScreens[index].socketId] != 'undefined') {
                        moduleIo.sockets.connected[smartScreens[index].socketId].emit('logOffConsumer', {consumerEmail: consumerEmail})
                    }
                    if (index > -1) {
                        smartScreens.splice(index, 1)
                    }
                    return false
                } else {
                    smartScreens[index].time = Date.now()
                    return true
                }
            }
        } else {
            return false
        }
    },
    logOffConsumer: async (consumerEmail) => {
        await new Promise(resolved => {
            setTimeout(() => {
                let connectionObject = smartScreens.find(connection => connection.consumerEmail == consumerEmail)
                if (connectionObject) {
                    let index = smartScreens.indexOf(connectionObject)
                    if (index > -1) {
                        smartScreens.splice(index, 1)
                    }
                }
            }, consumerLogOffTimer)
        })
    }
}