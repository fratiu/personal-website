import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3 = new S3Client({
  region: process.env.S3_REGION,
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY_ID,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
  },
});

const CORS = {
  "Access-Control-Allow-Origin": "https://filipratiu.com",
  "Access-Control-Allow-Credentials": "true",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Allow-Methods": "GET,OPTIONS",
  "Cache-Control": "no-store",
  "Content-Type": "application/json",
};

export async function handler(event) {
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 204, headers: CORS };
  }
  
    // simple gate: require the cookie set after password check
  const cookie = event.headers.cookie || "";
  const hasAccess = cookie.split(/;\s*/).some(c => c.startsWith("wlp4_access=1"));
  if (!hasAccess) return { statusCode: 401, body: '{"ok":false}' };

  const Bucket = process.env.S3_BUCKET;
  const Key = process.env.S3_KEY;

  if (!Bucket || !Key) {
    return { statusCode: 500, headers: CORS, body: '{"ok":false,"err":"missing env"}' };
  }

  try {
    const cmd = new GetObjectCommand({ Bucket, Key, ResponseContentType: "video/mp4" });
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
