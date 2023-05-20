const { Alchemy, Network, Wallet, Utils } = require("alchemy-sdk");

require("dotenv").config();

const { PRIVATE_KEY, ALCHEMY_API, RECEIVER_ADDRESS } = process.env;

const settings = {
  apikey: ALCHEMY_API,
  network: Network.ETH_SEPOLIA,
};

const alchemy = new Alchemy(settings);

let wallet = new Wallet(PRIVATE_KEY);

async function main() {
  const nonce = await alchemy.core.getTransactionCount(
    wallet.address,
    "latest"
  );

  console.log(`nonce : ${nonce}`);

  let transaction = {
    to: RECEIVER_ADDRESS, // receiver address
    value: Utils.parseEther("0.01"),
    gasLimit: "21000",
    maxPriorityFeePerGas: Utils.parseUnits("5", "gwei"),
    maxFeePerGas: Utils.parseUnits("20", "gwei"),
    nonce: nonce,
    type: 2,
    chainId: 11155111, // sepolia chain id
  };

  console.log("Transaction : ");
  console.log(transaction);

  let rawTransaction = await wallet.signTransaction(transaction);

  let tx = await alchemy.core.sendTransaction(rawTransaction);

  console.log("send transaction : ");
  console.log(tx);
  console.log("https://sepolia.etherscan.io/tx/" + tx.hash);
}

main();
