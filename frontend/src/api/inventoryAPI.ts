export const fetchInventory = async () => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("No token found. Please log in.");

  const res = await fetch("http://localhost:5000/inventory", {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch inventory data");
  }

  return res.json();
};
