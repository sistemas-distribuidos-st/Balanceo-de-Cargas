const ip = 'http://localhost:5000';

$('.logPage').attr("href", ip + '/logs')
$('.addPage').attr("href", ip + '/add_server')

async function sendImage(form){
    let image = form[0].files[0];

    await toBase64(image).then(image64=>{
        $.ajax({
            url: ip + '/uploadData',
            type: 'post',
            contentType: 'application/json', 
            data: JSON.stringify({
                email: form[1].value,
                image:{
                    name: image.name,
                    image64
                }
            })
        }).then(res=>{

            $('#form').attr("hidden", res.ok);
            $('#image').attr("hidden", !res.ok);
            
            if(res.ok)
                $('#image').attr("src", res.imgURL);
        });
    })
}

const toBase64 = file => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
});