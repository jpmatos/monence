const MongoClient = require('mongodb').MongoClient

class MongoConnection {
    constructor(connectionString, index) {
        this.connectionString = connectionString
        this.index = index
    }

    static init(connectionString, index) {
        return new MongoConnection(connectionString, index)
    }

    getConnect() {
        if (this.connect)
            return this.connect

        return this.connect = MongoClient.connect(this.connectionString,
            {
                useUnifiedTopology: true
            }
        )
            .then(client => {
                this.client = client
                this.db = client.db(this.index)
                return client
            })
    }

    getClient() {
        return this.client
    }

    getDb() {
        return this.db
    }
}

module.exports = MongoConnection