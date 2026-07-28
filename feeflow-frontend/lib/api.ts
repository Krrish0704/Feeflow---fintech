const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export async function requestWaiver(data: any) {
  try {
    const response = await fetch("https://feeflow-backend.onrender.com/waivers/request", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const responseData = await response.json();

    if (!response.ok) {
      let message = 'API request failed';
      if (Array.isArray(responseData.detail)) {
        message = responseData.detail.map((err: any) => `${err.loc.join('.')}: ${err.msg}`).join(', ');
      } else if (typeof responseData.detail === 'string') {
        message = responseData.detail;
      } else if (responseData.message) {
        message = responseData.message;
      }
      throw new Error(message);
    }

    return responseData;
  } catch (error: any) {
    console.error("Waiver request error:", error);
    throw error;
  }
}