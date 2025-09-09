import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3 = new S3Client({
  region: process.env.S3_REGION,
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY_ID,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
  },
});

export async function handler(event) {
  // simple gate: require the cookie set after password check
  const cookie = event.headers.cookie || "";
  const hasAccess = cookie.split(/;\s*/).some(c => c.startsWith("wlp4_access=1"));
  if (!hasAccess) return { statusCode: 401, body: '{"ok":false}' };

  const Bucket = process.env.S3_BUCKET;
  const Key = process.env.S3_KEY;

  try {
    const cmd = new GetObjectCommand({ Bucket, Key });
    // await MUST be inside the handler
    const url = await getSignedUrl(s3, cmd, { expiresIn: 3600 }); // 1 hr
    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ok: true, url }),
    };
  } catch (e) {
    console.error("video-url error", e);
    return { statusCode: 500, body: '{"ok":false}' };
  }
}
