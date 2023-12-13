const input = document.getElementById('input');
const button = document.getElementById('button');

button.disabled = true;
button.style.filter = 'blur(3px)';

input.addEventListener('input', () => {
    if(input.value !== "") {
        button.disabled = false;
        button.style.filter = 'none';
    }
    else {
        button.disabled = true;
        button.style.filter = 'blur(3px)';
    }
})

button.addEventListener('click', async () => {
    const loadingContainer = document.getElementById('loadingContainer');
    loadingContainer.classList.toggle('hidden');
    const result = document.getElementById('result');
    result.textContent = '';
    //loadingContainer.classList.add('block');
    button.disabled = true;
    //const container = document.getElementById('container');
    //container.removeChild('#container');
    await fetch('/generate', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({userInput: input.value})
    })
    .then(async (response) => {
        console.log(response);
        const imageName = await response.json();
        console.log(imageName);
        button.disabled = false;
        input.value = '';
        const generatedImage = document.createElement('img');
        generatedImage.src = '../images/0.png';
        generatedImage.classList.add('mx-auto', 'md:w-1/2', 'lg:w-1/3');
        //const result = document.getElementById('result');
        result.classList.add('my-7');
        result.appendChild(generatedImage);
        //container.appendChild(result);
        loadingContainer.classList.toggle('hidden');
            // }
            // console.log('hello world');
            // console.log(result.result);
    })
    .catch((error) => {
        console.log(error)
    })
})

// import fs from "fs";

// export const textToImage = async () => {
//   const path =
//     "https://api.stability.ai/v1/generation/stable-diffusion-xl-1024-v1-0/text-to-image";

//   const headers = {
//     Accept: "application/json",
//     Authorization: "Bearer YOUR_API_KEY"
//   };

//   const body = {
//     steps: 40,
// 	width: 1024,
// 	height: 1024,
// 	seed: 0,
// 	cfg_scale: 5,
// 	samples: 1,
// 	text_prompts: [
// 	  {
// 	    "text": "A painting of a cat",
// 	    "weight": 1
// 	  },
// 	  {
// 	    "text": "blurry, bad",
// 	    "weight": -1
// 	  }
// 	],
//   };

//   const response = fetch(
//     path,
//     {
//       headers,
//       method: "POST",
//       body: JSON.stringify(body),
//     }
//   );
  
//   if (!response.ok) {
//     throw new Error(`Non-200 response: ${await response.text()}`)
//   }
  
//   const responseJSON = await response.json();
  
//   responseJSON.artifacts.forEach((image, index) => {
//     fs.writeFileSync(
//       `./out/txt2img_${image.seed}.png`,
//       Buffer.from(image.base64, 'base64')
//     )
//   })
// };


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
