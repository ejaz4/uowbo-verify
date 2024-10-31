export const api = async(request: string, body: any) => {
    return new Promise((res) => {
        fetch(`${process.env.API_HOST}${request}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
        }).then((response) => {
            if (response.status == 200) {
                response.json().then((data) => {
                    res(data)
                })
            }
        });
    })
}