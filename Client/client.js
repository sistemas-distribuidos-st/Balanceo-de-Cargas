var content = document.querySelector('#content');

function getStatus() {
    fetch('http://192.168.1.18:3000', {
            method: 'GET',
            headers: {
                'Acept': 'aplication/json',
                'Content-Type': 'aplication/json'
            },
            mode: 'no-cors',
        })
        .then((response) => {
            // *** Check for HTTP failure
            console.log(response);
            if (!response.ok) {
                throw new Error("HTTP status " + response.status);
            }
            // *** Read the text of the response
            return response.json();
        })
        .then(data => {
            table(data);
        })
};

function table(data) {
    console.log(data);
    content.innerHTML = '';
    console.log('holi');
    content.innerHTML = data;

    for (let value of data) {
        console.log('holi');
        if (value == 'OK') {
            content.innerHTML = `
            <tr>
                        <td>Hoy</td>
                        <td>server A</td>
                        <td>OK</td>
                    </tr>
            
            `;
        } else {
            button.style.display = 'none'
        }

    };
};