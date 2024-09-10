// AWS SDK 配置
AWS.config.update({
    region: 'ap-southeast-1',
    credentials: new AWS.Credentials({
        accessKeyId: 'AKIAQNEKXBK6ZNI4MBXQ',
        secretAccessKey: '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'
    })
});

// 創建 S3 客戶端
const s3 = new AWS.S3({
    apiVersion: '2006-03-01',
    params: {Bucket: 'petpetclub'}
});

// 上傳圖片到 S3
async function uploadImageToS3(file) {
    return new Promise((resolve, reject) => {
        const fileName = Date.now() + '_' + file.name;
        const params = {
            Bucket: 'petpetclub',
            Key: fileName,
            Body: file,
            ACL: 'public-read'
        };

        s3.upload(params, (err, data) => {
            if (err) {
                console.error("Error uploading to S3:", err);
                reject(err);
            } else {
                console.log("Successfully uploaded to S3:", data.Location);
                resolve(data.Location);
            }
        });
    });
}

// 預覽圖片
function previewImage(file) {
    const reader = new FileReader();
    reader.onload = function(e) {
        document.getElementById('imagePreview').src = e.target.result;
    }
    reader.readAsDataURL(file);
}

// 處理表單提交
async function handleSubmit(event) {
    event.preventDefault();
    const fileInput = document.getElementById('imageInput');
    const file = fileInput.files[0];
    
    if (!file) {
        alert('請選擇一張圖片');
        return;
    }

    // 顯示載入中
    document.getElementById('loading').style.display = 'block';
    document.getElementById('result').textContent = '';

    try {
        const imageUrl = await uploadImageToS3(file);
        console.log('Image uploaded, URL:', imageUrl);

        // 顯示上傳後的 URL
        document.getElementById('result').innerHTML = `
            <p>上傳成功！</p>
            <p>S3 URL: <a href="${imageUrl}" target="_blank">${imageUrl}</a></p>
        `;

        // 這裡可以添加調用 API 進行寵物品種識別的代碼
        // 例如：
        // const response = await axios.post('YOUR_API_ENDPOINT', { imageUrl: imageUrl });
        // const breed = response.data.breed;
        // document.getElementById('result').innerHTML += `<p>識別結果：${breed}</p>`;

    } catch (error) {
        console.error('處理圖片時發生錯誤:', error);
        document.getElementById('result').textContent = '上傳失敗: ' + (error.message || '未知錯誤');
    } finally {
        document.getElementById('loading').style.display = 'none';
    }
}

// 設置事件監聽器
document.getElementById('uploadForm').addEventListener('submit', handleSubmit);
document.getElementById('imageInput').addEventListener('change', function(event) {
    previewImage(event.target.files[0]);
});
