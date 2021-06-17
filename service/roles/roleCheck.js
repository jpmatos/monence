const roles = require('./roles.json')


function isOwner(calendar, userId) {
    return calendar.owner.ownerId === userId
}

function isParticipating(calendar, userId) {
    return calendar.participants.find(participant => participant.id === userId) !== undefined
}

function isSame(id1, id2) {
    return id1 === id2
}

function canEdit(calendar, userId) {
    const idx = calendar.participants.findIndex(participant => participant.id === userId)

    if (idx === -1)
        return false

    if (!roles[calendar.participants[0].role])
        return false

    return roles[calendar.participants[0].role].edit
}

function canView(calendar, userId) {
    const idx = calendar.participants.findIndex(participant => participant.id === userId)

    if (idx === -1)
        return false

    if (!roles[calendar.participants[0].role])
        return false

    return roles[calendar.participants[0].role].view
}

module.exports = {isOwner, isParticipating, isSame, canEdit, canView}