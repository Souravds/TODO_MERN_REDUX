export const fetch2point0 = async (api, body) => {
    const res = await fetch(api,{
        method: 'post',
        headers:{
            'Content-type': 'application/json',
            'Authorization': localStorage.getItem('token')
        },
        body: JSON.stringify(body)
    })

    return await res.json()
}

export const fetch3point0 = async (api, type) => {
    const res = await fetch(api,{
        method: type,
        headers:{
            'Content-type': 'application/json',
            'Authorization': localStorage.getItem('token')
        }
    })

    return await res.json()
} 
