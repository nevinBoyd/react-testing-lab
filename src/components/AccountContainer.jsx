import React, { useState, useEffect } from "react";
import TransactionsList from "./TransactionsList";
import Search from "./Search";
import AddTransactionForm from "./AddTransactionForm";
import Sort from "./Sort";

function AccountContainer() {
  const [transactions, setTransactions] = useState([])
  const [search, setSearch] = useState("")
  // console.log(search)

  useEffect(() => {
    fetch("http://localhost:6001/transactions")
      .then(r => r.json())
      .then(data => setTransactions(data))
  }, [])

  function postTransaction(newTransaction) {
    fetch('http://localhost:6001/transactions', {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(newTransaction)
    })
      .then(r => r.json())
      .then(data => setTransactions([...transactions, data]))
  }
  const filteredTransactions = transactions.filter((t) =>
    t.description.toLowerCase().includes(search.toLowerCase())
  )

  // Sort function here
  function onSort(sortBy) {
    const sorted = [...transactions].sort((a, b) =>
      a[sortBy].toLowerCase() > b[sortBy].toLowerCase() ? 1 : -1
    )
    setTransactions(sorted)
  }

  // Filter using search here and pass new variable down


  return (
    <div>
      <Search setSearch={setSearch} />
      <AddTransactionForm postTransaction={postTransaction} />
      <Sort onSort={onSort} />
      {/* ✅ pass filteredTransactions instead of full list */}
      <TransactionsList transactions={filteredTransactions} />
    </div>
  )
}

export default AccountContainer;
