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

        // 這裡應該調用你的 API 進行寵物品種識別
        // 以下是一個示例，你需要替換為實際的 API 調用
        const response = await axios.post('http://54.254.194.136:183//dog-predict', { imageUrl: imageUrl });
        const breed = response.data.breed; // 假設 API 返回一個包含 breed 的對象

        document.getElementById('result').textContent = `識別結果：${breed}`;
    } catch (error) {
        console.error('處理圖片時發生錯誤:', error);
        document.getElementById('result').textContent = '識別失敗，請稍後再試';
    } finally {
        document.getElementById('loading').style.display = 'none';
    }
}

// 設置事件監聽器
document.getElementById('uploadForm').addEventListener('submit', handleSubmit);
document.getElementById('imageInput').addEventListener('change', function(event) {
    previewImage(event.target.files[0]);
});
