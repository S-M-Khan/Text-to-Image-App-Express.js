//const { resolveInclude } = require('ejs');
const { resolveInclude } = require('ejs');
const express = require('express');
//const fs = require('fs');
const fetch = require('node-fetch');
const fs  = require('node-fs');
//console.log(fetch);
//console.log(fs)
//const cors = require('cors');
//const path = require('path');
//const { urlencoded } = require('express');
require('dotenv').config();

const app = express();
app.set('view engine', 'ejs');

app.use('/images', express.static('public/images', {
    setHeaders: (res, path) => {
        res.set('Cache-Control', 'no-store');
    },
}));

app.use(express.static('public'));
// app.use(express.static('public'));

app.use(express.json());
//app.use(express.urlencoded({extended:true}))
// app.use(cors({ origin: 'http://127.0.0.1:5500' }));

//import fetch from 'node-fetch';
//import fs from 'node:fs';
const engineId = 'stable-diffusion-v1-6';
const apiHost = process.env.API_HOST ?? 'https://api.stability.ai';
const apiKey = process.env.API_KEY;

app.get('/', (request, response) => {
    response.render('index');
})

app.post('/generate', async (request, response) => {
    const body = request.body;
    //console.log(body.userInput);
    if (!apiKey) throw new Error('Missing Stability API key.')

    const result = await fetch(
    `${apiHost}/v1/generation/${engineId}/text-to-image`,
    {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
        text_prompts: [
            {
            text: body.userInput,
            },
        ],
        cfg_scale: 7,
        height: 1024,
        width: 1024,
        steps: 30,
        samples: 1,
        }),
    }
    )
    if (!result.ok) {
        throw new Error(`Non-200 response: ${await result.text()}`)
    }
    else {
       // console.log('all good')
        await sendResponse(result)
        .then((data) => {
            console.log(data);
            response.json({index: '0'});
        })
        .catch((error) => {
            response.json({e: error})
        })
        //response.json({index: 0});
        // console.log(imageName);
        // console.log(typeof imageName)
        // .then(() => {
        //     console.log(imageName);
        //     console.log(typeof imageName);
        //     response.send(imageName);
        // });
    }
        //response.json({result: body.userInput});
})

async function sendResponse(imageData) {
    const responseJSON = await imageData.json();
    //console.log(responseJSON);
    responseJSON.artifacts.forEach((image, index) => {
    fs.writeFileSync(
        `./public/images/${index}.png`,
        Buffer.from(image.base64, 'base64')
    )
    return index;
})
}

const PORT = process.env.PORT || 5500;

app.listen(PORT, () => {
    console.log(`listening on port ${PORT}`);
})

// import fetch from 'node-fetch'
// import fs from 'node:fs'

// const engineId = 'stable-diffusion-v1-6'
// const apiHost = process.env.API_HOST ?? 'https://api.stability.ai'
// const apiKey = process.env.STABILITY_API_KEY

// if (!apiKey) throw new Error('Missing Stability API key.')

// const response = await fetch(
//   `${apiHost}/v1/generation/${engineId}/text-to-image`,
//   {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//       Accept: 'application/json',
//       Authorization: `Bearer ${apiKey}`,
//     },
//     body: JSON.stringify({
//       text_prompts: [
//         {
//           text: 'A lighthouse on a cliff',
//         },
//       ],
//       cfg_scale: 7,
//       height: 1024,
//       width: 1024,
//       steps: 30,
//       samples: 1,
//     }),
//   }
// )

// if (!response.ok) {
//   throw new Error(`Non-200 response: ${await response.text()}`)
// }

// interface GenerationResponse {
//   artifacts: Array<{
//     base64: string
//     seed: number
//     finishReason: string
//   }>
// }

// const responseJSON = (await response.json()) as GenerationResponse

// responseJSON.artifacts.forEach((image, index) => {
//   fs.writeFileSync(
//     `./out/v1_txt2img_${index}.png`,
//     Buffer.from(image.base64, 'base64')
//   )
// })
