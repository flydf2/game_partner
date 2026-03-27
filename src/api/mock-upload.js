export function mockUploadFile(file, type = 'avatar') {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        data: {
          url: `https://neeko-copilot.bytedance.net/api/text2image?prompt=avatar%20photo&size=400x400`,
          filename: file.name,
          type: file.type,
          size: file.size
        }
      })
    }, 1000)
  })
}

export function mockGetUploadProgress(uploadId) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        data: {
          uploadId: uploadId,
          progress: Math.floor(Math.random() * 100),
          uploadedSize: Math.floor(Math.random() * 1000000),
          totalSize: 1000000
        }
      })
    }, 500)
  })
}

export function mockCancelUpload(uploadId) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        message: '上传已取消'
      })
    }, 300)
  })
}

// 分类相关数据
