module.exports = class Room {
    constructor(user) {
        this.users = [user] // User[]
        this.messages = [] // Message[]
    }
}
