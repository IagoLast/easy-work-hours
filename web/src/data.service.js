
export function transform(rawElements) {
    return rawElements.map(_transformElement);
}

export function getDays(formatedEntries) {
    const returnValue = {};
    for (const entry of formatedEntries) {
        if (!returnValue[_getDateString(entry)]) {
            returnValue[_getDateString(entry)] = { register: [entry] };
        }
        else {
            returnValue[_getDateString(entry)].register.push(entry);
        }
    }
    for (let key in returnValue) {
        returnValue[key].hours = _computeTotalHours(returnValue[key].register);
    }
    return returnValue;
}

function _transformElement(rawElement) {
    return {
        action: _getAction(rawElement.fields.command.stringValue),
        date: new Date(parseInt(rawElement.fields.date.integerValue)),
    }
}

function _getDateString({ date }) {
    return `${date.getFullYear()}/${date.getMonth()}/${date.getDate()}`;
}

function _computeTotalHours(dayObjects) {
    let sorted = dayObjects.sort(_sortByDate);
    let total = 0;
    let data = Array.from(sorted);

    while (data.length > 0) {
        let result = _digest(data);
        total += result.time;
        data = result.data;
    }

    return total / (1000 * 60 * 60);
}

function _digest(sortedDayData) {
    let firstOut;
    let firstIn = sortedDayData.find(element => element.action === 'SIGN_IN');
    if (!firstIn) {
        // Invalid day: no_sign_in
        return { data: [], time: 0 };
    }

    while (sortedDayData.length && (!firstOut || firstOut.action !== 'SIGN_OUT')) {
        firstOut = sortedDayData.shift()
    }

    if (!firstOut) {
        // Invalid day: no_sign_out
        return { data: [], time: 0 };
    }

    let time = firstOut.date.getTime() - firstIn.date.getTime()

    return { data: sortedDayData, time: Math.max(time, 0) };
}

/**
 * 
 */
function _sortByDate(a, b) {
    return a.date.getTime() - b.date.getTime();
}


function _getAction(command) {
    switch (command) {
        case '/hi':
            return 'SIGN_IN'
        case '/bye':
            return 'SIGN_OUT'
        default:
            break;
    }
}

export default { transform, getDays, _computeTotalHours }