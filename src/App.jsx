import { useState } from "react";
import CreateAddressButton from "./CreateAddressButton";
import MineButton from "./MineButton";
import WalletBalance from "./WalletBalance";
import SendTransactionForm from "./SendTransactionForm";
import "./App.css";


function App() {
  const [lastAddress, setLastAddress] = useState("");


  return (
    <>
    <h1>Sunny Chain</h1>
    <CreateAddressButton onCreated={setLastAddress} />
    <MineButton address={lastAddress} />
    <WalletBalance address={lastAddress} />
    <SendTransactionForm address={lastAddress} />
    </>
  );
}

export default App;
