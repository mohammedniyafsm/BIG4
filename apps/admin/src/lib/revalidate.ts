import { env } from "@/config/env";

export async function triggerStorefrontRevalidation(tags: string[]) {
  const storefrontUrl = env.STOREFRONT_URL;
  const secret = env.REVALIDATE_SECRET;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 2000); // 2 second max timeout

  try {
    const res = await fetch(`${storefrontUrl}/api/revalidate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-revalidate-secret": secret,
      },
      body: JSON.stringify({ tags }),
      signal: controller.signal,
    });
    
    if (!res.ok) {
      console.error(`Storefront revalidation returned status: ${res.status}`);
    }
  } catch (error: any) {
    if (error.name === "AbortError") {
      console.error("Storefront revalidation timed out after 2s");
    } else {
      console.error("Storefront revalidation failed:", error.message);
    }
  } finally {
    clearTimeout(timeoutId);
  }
}
