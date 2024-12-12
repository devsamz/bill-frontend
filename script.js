import { contractAbi } from "./abi.js";
import { ethers } from "ethers";

// const provider = new ethers.JsonRpcProvider("https://eth-mainnet.g.alchemy.com/v2/Zi_F-3fTztPtozvm58nBdd21noBes10h")
const provider = new ethers.BrowserProvider(window.ethereum);
const contractAddress = "0x784f3032C768Ee9dE2d905983c04838a6Adb2B64";
let signer;

// fetch contract
const contract = new ethers.Contract(contractAddress, contractAbi, provider);

const connectButton = document.getElementById("connectWalletButton");
const createBillBtn = document.getElementById("createBillForm");
const contributeBtn = document.getElementById("contributeForm");
const settleBillBtn = document.getElementById("settleBillForm")
const checkStatusBtn = document.getElementById("billStatusForm");

// connect wallet
connectButton.addEventListener("click", async () => {
    if (typeof window.ethereum !== "undefined") {
        try {
            await ethereum.request({ method: "eth_requestAccounts" });
            signer = await provider.getSigner();
            connectButton.textContent = "Wallet Connected";
        } catch (error) {
            console.error("Error connecting wallet:", error);
            alert("Failed to connect wallet. Please try again.");
        }
    } else {
        alert("MetaMask is not installed. Please install MetaMask to use this feature.");
    }
});

// create a Bill
createBillBtn.addEventListener("submit", async (e) => {
    e.preventDefault();
    const amount = document.getElementById("totalAmount").value;
    const participants = document.getElementById("participants").value.split(",");
    console.log(participants);
    document.getElementById("create").textContent = "Creating..."

    try {
        if (!signer) throw new Error("Please connect your wallet first.");
        const tx = await contract.connect(signer).createBill(amount, participants);
        await tx.wait();
        alert("Bill created successfully!");
    } catch (err) {
        console.error("Error creating bill", err);
        alert(err.message);
    } finally {
        document.getElementById("create").textContent = "Create Bill"
    }
});

// contribute to a bill
contributeBtn.addEventListener("submit", async (e) => {
    e.preventDefault();
    const billId = document.getElementById("billId").value;
    const amount = document.getElementById("amount").value;
    document.getElementById("contribute").textContent = "Contributing..."

    try {
        if (!signer) throw new Error("Please connect your wallet first.");
        const tx = await contract.connect(signer).contribute(billId, { value: amount });
        await tx.wait();
        alert("Contribution successful!");
    } catch (err) {
        console.error("Error contributing", err);
        alert(err.message);
    } finally {
        document.getElementById("contribute").textContent = "Contribute"
    }
});

// settle bill
settleBillBtn.addEventListener("submit", async (e) => {
    e.preventDefault();
    const billId = document.getElementById("settleBillId").value;
    const recipient = document.getElementById("recipient").value;
    document.getElementById("settle").textContent = "Settling..."

    try {
        if (!signer) throw new Error("Please connect your wallet first.");
        const tx = await contract.connect(signer).settleBill(billId, recipient);
        await tx.wait();
        alert("Bill settled successfully")
    } catch (err) {
        console.error("Error settling bill", err);
        alert(err.message);
    } finally {
        document.getElementById("settle").textContent = "Settle Bill"
    }
});

// check bill status
checkStatusBtn.addEventListener("submit", async (e) => {
    e.preventDefault();
    const billId = document.getElementById("statusBillId").value;

    try {
        if (!signer) throw new Error("Please connect your wallet first.");
        const bill = await contract.bills(billId);
        const [organizer, totalAmount, amountPaid, isSettled] = bill;
        document.getElementById("billStatusOutput").innerHTML = `
            <p><strong>Total Amount:</strong> ${totalAmount.toString()} wei</p>
            <p><strong>Contributed:</strong> ${amountPaid.toString()} wei</p>
            <p><strong>Organizer:</strong> ${organizer.toString()}</p>
            <p><strong>Is Settled:</strong> ${isSettled ? "Yes" : "No"}</p>
            <p><strong>Remaining:</strong> ${(BigInt(totalAmount) - BigInt(amountPaid)).toString()} wei</p>
        `;
    } catch (err) {
        console.error(err);
        alert("Error fetching bill status.");
    }
});