import { useEffect, useState } from "react";

const API_URL = "http://127.0.0.1:8765/balance";

export default function WalletBalance({ address = "" }) {
  const [targetAddress, setTargetAddress] = useState(address);
  const [loading, setLoading] = useState(false);
  const [balance, setBalance] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (address) {
      setTargetAddress(address);
    }
  }, [address]);

  const handleCheckBalance = async () => {
    if (!targetAddress) {
      alert("잔액을 조회할 비트코인 테스트넷 주소를 입력해주세요.");
      return;
    }
    setLoading(true);
    setError("");
    setBalance(null);
    try {
      const res = await fetch(
        `${API_URL}?address=${encodeURIComponent(targetAddress)}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }
      );
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || `HTTP ${res.status}`);
      }
      setBalance(data);
    } catch (err) {
      console.error(err);
      setError(err.message || "잔액 조회 실패");
      alert("잔액 조회에 실패했습니다. 서버 로그를 확인해주세요.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section>
      <h2>잔액 조회</h2>
      <div>
        <label>
          테스트넷 주소
          <input
            type="text"
            value={targetAddress}
            onChange={(event) => setTargetAddress(event.target.value)}
            placeholder="예: mnrVtF8DWjMu839VW3rBfgYaAfKk8983Xf"
            disabled={loading}
          />
        </label>
        <button onClick={handleCheckBalance} disabled={loading}>
          {loading ? "조회 중..." : "잔액 조회"}
        </button>
      </div>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {balance && (
        <div>
          <p>잔액 (sats): {balance.balance_sats ?? "알 수 없음"}</p>
          {"balance_btc" in balance && (
            <p>잔액 (BTC): {balance.balance_btc}</p>
          )}
        </div>
      )}
    </section>
  );
}
