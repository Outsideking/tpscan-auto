// ตัวอย่าง mock fetch ECS service info
export async function getCloudAndroidURL() {
  try {
    // สมมติ API endpoint /ecs-status คืนค่า JSON { url: "http://alb-dns:6080" }
    const response = await fetch("/api/ecs-status");
    const data = await response.json();
    return data.url;
  } catch (err) {
    console.error("Failed to fetch ECS info:", err);
    return null;
  }
}
