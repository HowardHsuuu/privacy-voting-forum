"use client"

import ProposalForm from "./components/ProposalForm"
import ProposalList from "./components/ProposalList"

export default function Home() {
  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <ProposalForm />
      <ProposalList />
    </div>
  )
}
