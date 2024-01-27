function isvalidInputData(dataObject) {
    for (const prop in dataObject) {
        if (dataObject.hasOwnProperty(prop)) {
            const value = dataObject[prop];
            if (!Boolean(value)) {
                return false;
            }
        }
    }
    return true;
}

function isValidPhoneNumber(phoneNumber) {
    var phoneRegex = /^\d{10}$/;
    return phoneRegex.test(phoneNumber);
}

function isValidName(name) {
    var nameRegex = /^[A-Za-z\s]{1,30}$/;
    return nameRegex.test(name);
}

const getNumVal = (s) => {
    if (s === undefined || s === null || s === '')
        return null;
    const num = Number(s);
    if (Number.isNaN(num))
        return null;
    return num;
}

const getIntVal = (s, d) => {
    if (s === undefined || s === null || s === '')
        return null;
    const num = Number(s);
    if (Number.isNaN(num) || !Number.isInteger(num))
        return null;
    return num;
}

const removeEmptyFields = (fields) => {
    for (const key of Object.keys(fields)) {
        let value = fields[key];
        if (typeof value === 'object' && value !== null) {
            let retObj = removeEmptyFields(value);
            if (Object.keys(retObj).length === 0)
                delete fields[key]
        }
        else if (Array.isArray(value)) {
            for (let i = 0; i < value.length; i++) {
                if (typeof value[i] === 'object' && value[i] !== null) {
                    value[i] = removeEmptyFields(value[i]);
                    if (Object.keys(value[i]).length === 0)
                        value.splice(i, 1);
                }
                else {
                    if (!value[i])
                        value.splice(i, 1);
                }
            }

        }
        else {
            if (!value)
                delete fields[key];
        }
    }
    return fields;
}

const strValToNumVal = (obj) => {
    Object.entries(obj).forEach(([key, val]) => {
        obj[key] = Number(val);
    });
    return Object.fromEntries(Object.entries(obj).filter(([key, value]) => !Number.isNaN(value)));
};

const strValToNumArr = (str) => {
    const strArr = str.split(',');
    console.log(strArr)
    let numArr = strArr.map((s) => Number(s));
    console.log(numArr);
    numArr = numArr.filter((num) => !Number.isNaN(num) && num !== 0);
    return numArr.map((n) => Number.parseInt(n, 10));
}


module.exports = { isvalidInputData, removeEmptyFields, strValToNumVal, strValToNumArr, isValidPhoneNumber, isValidName, getNumVal, getIntVal };