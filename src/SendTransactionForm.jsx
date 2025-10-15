import { useEffect, useState } from "react";

const API_URL = "http://127.0.0.1:8765/send";

export default function SendTransactionForm({ address = "" }) {
  const [fromAddress, setFromAddress] = useState(address);
  const [toAddress, setToAddress] = useState("");
  const [amountSats, setAmountSats] = useState("");
  const [wif, setWif] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);

  useEffect(() => {
    if (address) {
      setFromAddress(address);
    }
  }, [address]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!fromAddress || !toAddress) {
      alert("보내는 주소와 받는 주소를 모두 입력해주세요.");
      return;
    }

    const parsedAmount = Number(amountSats);
    if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) {
      alert("전송할 금액을 사토시 단위로 올바르게 입력해주세요.");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);
    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          from_address: fromAddress,
          to_address: toAddress,
          amount_sats: parsedAmount,
          wif: wif || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || `HTTP ${res.status}`);
      }
      setResult(data);
      setAmountSats("");
      setToAddress("");
      setWif("");
    } catch (err) {
      console.error(err);
      setError(err.message || "전송 실패");
      alert("코인 전송에 실패했습니다. 서버 로그를 확인해주세요.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section>
      <h2>코인 전송</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            보내는 주소
            <input
              type="text"
              value={fromAddress}
              onChange={(event) => setFromAddress(event.target.value)}
              placeholder="보내는 비트코인 테스트넷 주소"
              disabled={loading}
              required
            />
          </label>
        </div>
        <div>
          <label>
            받는 주소
            <input
              type="text"
              value={toAddress}
              onChange={(event) => setToAddress(event.target.value)}
              placeholder="받는 비트코인 테스트넷 주소"
              disabled={loading}
              required
            />
          </label>
        </div>
        <div>
          <label>
            전송 금액 (sats)
            <input
              type="number"
              min="1"
              step="1"
              value={amountSats}
              onChange={(event) => setAmountSats(event.target.value)}
              placeholder="예: 10000"
              disabled={loading}
              required
            />
          </label>
        </div>
        <div>
          <label>
            개인키 (WIF, 필요시)
            <input
              type="text"
              value={wif}
              onChange={(event) => setWif(event.target.value)}
              placeholder="선택 입력"
              disabled={loading}
            />
          </label>
        </div>
        <button type="submit" disabled={loading}>
          {loading ? "전송 중..." : "전송하기"}
        </button>
      </form>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {result && (
        <div>
          <h3>전송 완료!</h3>
          {"txid" in result && <p>TXID: {result.txid}</p>}
          {"fee_sats" in result && <p>수수료 (sats): {result.fee_sats}</p>}
        </div>
      )}
    </section>
  );
}

