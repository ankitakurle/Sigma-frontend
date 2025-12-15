const API_BASE = process.env.VITE_API_BASE; // your .env

export const sendMessage = async (threadId, message) => {
  const response = await fetch(`${API_BASE}/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ threadId, message }),
  });

  const data = await response.json();
  return data.reply;
};
