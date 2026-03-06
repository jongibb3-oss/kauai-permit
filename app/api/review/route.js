export async function POST(req) {
  const body = await req.json();
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.ANTHROPIC_API_KEY,
      "anthropic-version": "2023-06-01"
    },
    body: JSON.stringify(body)
  });
  return Response.json(await res.json());
}
export async function POST(req) {
  const body = await req.json();
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.ANTHROPIC_API_KEY,
      "anthropic-version": "2023-06-01",
      "anthropic-beta": "messages-2023-12-15"
    },
    body: JSON.stringify({
      ...body,
      model: "claude-sonnet-4-6",
    })
  });
  const data = await res.json();
  console.log("API response:", JSON.stringify(data));
  return Response.json(data);
}
