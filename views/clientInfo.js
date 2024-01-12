// const findLocation = () => {
//     const error = () => {
//         console.log('Unable to get location!')
//     }
//     const success = (position) => {
//         console.log(position)
//     }
//     navigator.geolocation.getCurrentPosition(success, error)
// }
// findLocation()

const userInfo = {
    name: platform.name,
    version: platform.version,
    layout: platform.layout,
    os: platform.os,
    description: platform.description,
    product: platform.product,
    manufacturer: platform.manufacturer
}

fetch('/user-info', {
    method: 'POST',
    headers: {
        "Content-Type": "application/json"
    },
    body: JSON.stringify(userInfo)
}).then(res => {
    console.log(res)
}).catch(err => console.log(err))