const MongoClient = require('mongodb').MongoClient

class MonenceMongoDB {

    static init(user, password) {
        this.url = `mongodb+srv://${user}:${password}@monencecluster.i6cih.mongodb.net/monenceDB?retryWrites=true&w=majority`
        return MonenceMongoDB
    }

    static getCalendar(calendarId) {
        return MongoClient.connect(this.url)
            .then( (client) => {
                return client.db('monenceDB').collection('calendars').findOne({id: calendarId}).then(calendar => {
                    delete calendar._id
                    return calendar
                })

            })

    }

}

module.exports = MonenceMongoDB.init('dbDefaultUser', 'YFWytbUn49uf31QN')