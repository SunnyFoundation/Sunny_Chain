import { useEffect, useState } from "react";

const API_URL = "http://127.0.0.1:8765/mine";

export default function MineButton({ address = "" }) {
  const [targetAddress, setTargetAddress] = useState(address);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (address) {
      setTargetAddress(address);
    }
  }, [address]);

  const handleMine = async () => {
    if (!targetAddress) {
      alert("먼저 채굴 보상을 받을 주소를 입력해주세요.");
      return;
    }
    setLoading(true);
    setResult(null);
    setError("");
    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          address: targetAddress,
          message: message || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || `HTTP ${res.status}`);
      }
      setResult(data);
    } catch (err) {
      console.error(err);
      setError(err.message || "채굴 실패");
      alert("채굴에 실패했습니다. 콘솔 로그를 확인해주세요.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section>
      <h2>채굴</h2>
      <div>
        <label>
          채굴 보상 주소
          <input
            type="text"
            value={targetAddress}
            onChange={(event) => setTargetAddress(event.target.value)}
            placeholder="테스트넷 비트코인 주소"
            disabled={loading}
          />
        </label>
      </div>
      <div>
        <label>
          코인베이스 메시지 (선택)
          <input
            type="text"
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            placeholder="예: Sunny Chain!"
            disabled={loading}
          />
        </label>
      </div>
      <button onClick={handleMine} disabled={loading}>
        {loading ? "채굴 중..." : "채굴 시작"}
      </button>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {result && (
        <div>
          <h3>채굴 성공!</h3>
          <p>블록 높이: {result.height}</p>
          <p>블록 해시: {result.hash}</p>
          <p>Nonce: {result.nonce}</p>
          <p>코인베이스 TXID: {result.coinbase_txid}</p>
        </div>
      )}
    </section>
  );
}
