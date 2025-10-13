// CreateAddressButton.jsx
import { useState } from "react";

const API_URL = "http://127.0.0.1:8765/create-address";

export default function CreateAddressButton() {
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    setLoading(true);
    setAddress("");
    try {
      const res = await fetch(API_URL, { method: "POST" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setAddress(data.address);
    } catch (err) {
      console.error(err);
      alert("주소 생성 실패");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button onClick={handleCreate} disabled={loading}>
        {loading ? "Generating…" : "Create Address"}
      </button>
      {address && (
        <div>
          <strong>New Address:</strong> {address}
        </div>
      )}
    </div>
  );
}





// git remote add origin https://github.com/SunnyFoundation/Sunny_Chain.git