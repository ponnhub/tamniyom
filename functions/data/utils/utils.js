
/**
 *
 * @param {*} a
 * @param {*} b
 * @param {[]} keys
 * @returns
 */
const compareObjByKeys = (a, b, keys) => {

    return keys.reduce((p, c) => p && (a[c] === b[c]), true)
    //return (a.name === b.name) && (a.catid === b.catid) && (a.description === b.description)

}
module.exports = {
    compareObjByKeys
}

