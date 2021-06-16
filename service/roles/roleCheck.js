const roles = require('./roles.json')

class roleCheck{
    constructor() {
    }

    static init(){
        return new roleCheck()
    }

    isOwner(calendar, userId){
        return calendar.owner.ownerId === userId
    }

    isParticipating(calendar, userId){
        return calendar.participants.find(participant => participant.id === userId) !== undefined
    }

    isSame(id1, id2){
        return id1 === id2
    }

    canEdit(calendar, userId){
        const idx = calendar.participants.findIndex(participant => participant.id === userId)

        if(idx === -1)
            return false

        if(!roles[calendar.participants[0].role])
            return false

        return  roles[calendar.participants[0].role].edit
    }

    canView(calendar, userId){
        const idx = calendar.participants.findIndex(participant => participant.id === userId)

        if(idx === -1)
            return false

        if(!roles[calendar.participants[0].role])
            return false

        return  roles[calendar.participants[0].role].view
    }
}

module.exports = roleCheck