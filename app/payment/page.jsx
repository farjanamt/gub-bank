"use client";

import { useState } from "react";

export default function Payment() {
  const [studentId, setStudentId] = useState("");
  const [semester, setSemester] = useState("Spring 2026");
  const [method, setMethod] = useState("bKash");
  const [amount, setAmount] = useState("");
  const [paid, setPaid] = useState(false);
  const [receipt, setReceipt] = useState(null);

  function generateTransactionId() {
    return "TXN-" + Math.floor(100000000 + Math.random() * 900000000);
  }

  function getTodayDate() {
    return new Date().toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  function handlePay(e) {
    e.preventDefault();

    if (!studentId.trim()) {
      alert("Please enter Student ID");
      return;
    }

    if (!amount || Number(amount) <= 0) {
      alert("Please enter a valid amount");
      return;
    }

    const newReceipt = {
      studentId,
      semester,
      method,
      amount: Number(amount),
      transactionId: generateTransactionId(),
      date: getTodayDate(),
    };

    setReceipt(newReceipt);
    setPaid(true);
  }

  function handleDownloadReceipt() {
    if (!receipt) return;

    const receiptText = `
==============================
        GUB BANK RECEIPT
==============================
Student ID     : ${receipt.studentId}
Semester       : ${receipt.semester}
Payment Method : ${receipt.method}
Amount Paid    : ৳ ${receipt.amount.toLocaleString()}
Transaction ID : ${receipt.transactionId}
Date           : ${receipt.date}

Status         : Payment Successful
==============================
Thank you for using GUB Bank.
`.trim();

    const blob = new Blob([receiptText], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `GUB-Receipt-${receipt.studentId}.txt`;
    link.click();

    URL.revokeObjectURL(url);
  }

  function handleReset() {
    setPaid(false);
    setStudentId("");
    setSemester("Spring 2026");
    setMethod("bKash");
    setAmount("");
    setReceipt(null);
  }

  return (
    // 👉 your UI stays EXACTLY the same
    // no routing changes needed
    <div className="min-h-screen bg-[#eef4fb] px-4 py-10 md:px-6">
      {/* keep everything unchanged */}
    </div>
  );
}
