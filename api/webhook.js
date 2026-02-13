export default async function handler(req, res) {
  const { type, payload } = req.body;

  // We only care about successful or failed deployments
  if (type === "deployment.ready" || type === "deployment.error") {
    const status = type === "deployment.ready" ? "✅ Success" : "❌ Failed";
    const message = `
**Vercel Deployment Update**
Project: ${payload.deployment.name}
Status: ${status}
URL: ${payload.deployment.url}
Inspector: ${payload.links.deployment}
    `.trim();

    const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN;
    const CHAT_ID = process.env.CHAT_ID;

    await fetch(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text: message,
        parse_mode: "Markdown",
      }),
    });
  }

  res.status(200).send("OK");
}
