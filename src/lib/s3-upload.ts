import { AwsClient } from 'aws4fetch'

const BUCKET = process.env.S3_BUCKET
const REGION = process.env.S3_REGION ?? 'ap-northeast-2'

// 브라우저가 이미지 서버(images.hexdrinker.dev → CloudFront → S3)에 바로 올릴 수 있는 타입만
export const IMAGE_TYPES: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/gif': 'gif',
  'image/webp': 'webp',
  'image/avif': 'avif',
}

function client() {
  if (!BUCKET || !process.env.S3_ACCESS_KEY_ID || !process.env.S3_SECRET_ACCESS_KEY) {
    throw new Error('S3 환경 변수(S3_BUCKET, S3_ACCESS_KEY_ID, S3_SECRET_ACCESS_KEY)가 없습니다.')
  }
  return new AwsClient({
    accessKeyId: process.env.S3_ACCESS_KEY_ID,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
    service: 's3',
    region: REGION,
  })
}

// 버킷 이름에 점이 있어도(TLS 와일드카드 문제) 되도록 path-style 주소를 쓴다
function objectUrl(key: string) {
  return `https://s3.${REGION}.amazonaws.com/${BUCKET}/${key.split('/').map(encodeURIComponent).join('/')}`
}

async function exists(aws: AwsClient, key: string) {
  const res = await aws.fetch(objectUrl(key), { method: 'HEAD' })
  return res.ok
}

// 이미 있는 파일은 덮어쓰지 않고 name-2.jpg, name-3.jpg … 로 비켜 간다
export async function createUploadUrl(dir: string, baseName: string, contentType: string) {
  const aws = client()
  const ext = IMAGE_TYPES[contentType]
  let fileName = `${baseName}.${ext}`
  for (let n = 2; await exists(aws, `${dir}/${fileName}`); n++) {
    if (n > 50) throw new Error(`${dir}/${baseName}.* 파일이 너무 많습니다.`)
    fileName = `${baseName}-${n}.${ext}`
  }

  const url = new URL(objectUrl(`${dir}/${fileName}`))
  url.searchParams.set('X-Amz-Expires', '300')
  const signed = await aws.sign(url.toString(), {
    method: 'PUT',
    headers: { 'Content-Type': contentType },
    // Content-Type까지 서명에 넣어서 이 URL로는 지정한 이미지 타입만 올라가게 한다
    aws: { signQuery: true, allHeaders: true },
  })
  return { uploadUrl: signed.url, fileName }
}
