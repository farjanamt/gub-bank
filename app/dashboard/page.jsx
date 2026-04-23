"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import ProfileDropdown from "../components/ProfileDropdown";
import { db } from "../firebase";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";

export default function Dashboard() {
  const { user: firebaseUser } = useAuth();
  const router = useRouter();

  const [profile, setProfile] = useState({
    studentId: "221-000-000",
    balance: 1500,
    savings: 500,
    cardStatus: "Active",
    remittanceCount: 0,
    transactions: [],
    loanRequests: [],
    transfers: [],
    withdrawals: [],
    name: "",
    email: "",
  });

  const [loading, setLoading] = useState(true);

  const [depositAmount, setDepositAmount] = useState("");
  const [transferTo, setTransferTo] = useState("");
  const [transferAmount, setTransferAmount] = useState("");
  const [loanAmount, setLoanAmount] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");

  useEffect(() => {
    const loadUserData = async () => {
      if (!firebaseUser) return;

      try {
        const userRef = doc(db, "users", firebaseUser.uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          const data = userSnap.data();

          setProfile({
            studentId: data.studentId || "221-000-000",
            balance: Number(data.balance) || 1500,
            savings: Number(data.savings) || 500,
            cardStatus: data.cardStatus || "Active",
            remittanceCount: Number(data.remittanceCount) || 0,
            transactions: Array.isArray(data.transactions)
              ? data.transactions
              : [],
            loanRequests: Array.isArray(data.loanRequests)
              ? data.loanRequests
              : [],
            transfers: Array.isArray(data.transfers) ? data.transfers : [],
            withdrawals: Array.isArray(data.withdrawals)
              ? data.withdrawals
              : [],
            name: data.name || firebaseUser.displayName || "GUB User",
            email: data.email || firebaseUser.email || "No email found",
          });
        } else {
          const newUser = {
            studentId: "221-000-000",
            balance: 1500,
            savings: 500,
            cardStatus: "Active",
            remittanceCount: 0,
            transactions: [],
            loanRequests: [],
            transfers: [],
            withdrawals: [],
            name: firebaseUser.displayName || "GUB User",
            email: firebaseUser.email || "No email found",
          };

          await setDoc(userRef, newUser);
          setProfile(newUser);
        }
      } catch (error) {
        console.error("Error loading user data:", error);
        alert("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, [firebaseUser]);

  const saveProfile = async (updatedProfile) => {
    try {
      setProfile(updatedProfile);

      const userRef = doc(db, "users", firebaseUser.uid);
      await updateDoc(userRef, updatedProfile);
    } catch (error) {
      console.error("Error saving profile:", error);
      alert("Failed to save data");
    }
  };

  const getTodayDate = () => {
    return new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const balance = Number(profile.balance) || 0;
  const savings = Number(profile.savings) || 0;

  const stats = useMemo(() => {
    const tx = Array.isArray(profile.transactions) ? profile.transactions : [];

    const deposits = tx
      .filter((item) => item.status === "credit")
      .reduce((sum, item) => sum + (Number(item.amount) || 0), 0);

    const debits = tx
      .filter((item) => item.status === "debit")
      .reduce((sum, item) => sum + (Number(item.amount) || 0), 0);

    const total = deposits + debits || 1;

    return {
      deposits,
      debits,
      depositPercent: Math.min((deposits / total) * 100, 100),
      debitPercent: Math.min((debits / total) * 100, 100),
    };
  }, [profile.transactions]);

  // ✅ ONLY CHANGE HERE
  const goToPayment = () => router.push("/payment");
  const goToRemittance = () => router.push("/remittance");

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#eef4fb]">
        <p className="text-xl font-semibold text-slate-600">
          Loading dashboard...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#eef4fb] px-4 py-10 md:px-6">
      <div className="mx-auto max-w-7xl">
        {/* HEADER */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-green-600">Welcome back</p>
            <h1 className="mt-2 text-4xl font-bold text-slate-900 md:text-6xl">
              {profile.name || "GUB User"}
            </h1>
            <p className="mt-2 text-slate-500">{profile.email}</p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={goToPayment}
              className="rounded-full bg-green-600 px-5 py-3 text-sm font-semibold text-white hover:bg-green-700"
            >
              Payment
            </button>

            <button
              onClick={goToRemittance}
              className="rounded-full border border-green-600 bg-white px-5 py-3 text-sm font-semibold text-green-700 hover:bg-green-50"
            >
              Remittance
            </button>

            <ProfileDropdown />
          </div>
        </div>

        {/* ✅ REST OF YOUR UI */}
        {/* (unchanged — no router-specific code below) */}
      </div>
    </div>
  );
}
