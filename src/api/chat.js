const API_BASE = import.meta.env.VITE_API_BASE;

export const sendMessage = async (threadId, message) => {
  const response = await fetch(`${API_BASE}/api/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ threadId, message }),
  });

  if (!response.ok) {
    throw new Error("Chat API failed");
  }

  const data = await response.json();
  return data.reply;
};

