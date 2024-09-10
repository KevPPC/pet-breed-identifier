// AWS S3 配置
AWS.config.update({
    region: 'ap-southeast-1',
    credentials: new AWS.CognitoIdentityCredentials({
        IdentityPoolId: 'AKIAQNEKXBK6ZNI4MBXQ'
    })
});

const s3 = new AWS.S3({
    apiVersion: '2006-03-01',
    params: {Bucket: 'petpetclub'}
});

const form = document.getElementById('uploadForm');
const imageInput = document.getElementById('imageInput');
const imagePreview = document.getElementById('imagePreview');
const loading = document.getElementById('loading');
const result = document.getElementById('result');

// API 端點
const API_ENDPOINT = 'http://54.254.194.136:183//dog-predict';

imageInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            imagePreview.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }
});

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const file = imageInput.files[0];
    if (!file) return;

    loading.style.display = 'block';
    result.textContent = '';

    try {
        const imageUrl = await uploadToS3(file);
        const prediction = await getPrediction(imageUrl);
        displayResult(prediction);
    } catch (error) {
        result.textContent = '發生錯誤：' + error.message;
    } finally {
        loading.style.display = 'none';
    }
});

async function uploadToS3(file) {
    return new Promise((resolve, reject) => {
        const fileName = Date.now() + '_' + file.name;
        const params = {
            Key: fileName,
            Body: file,
            ACL: 'public-read'
        };

        s3.upload(params, (err, data) => {
            if (err) {
                reject(err);
            } else {
                resolve(data.Location);
            }
        });
    });
}

async function getPrediction(imageUrl) {
    const response = await axios.post(API_ENDPOINT, { url: imageUrl });
    return response.data;
}

function displayResult(prediction) {
    result.innerHTML = '識別結果：<br>' + 
        Object.entries(prediction)
            .map(([breed, probability]) => `${breed}: ${probability}`)
            .join('<br>');
}
