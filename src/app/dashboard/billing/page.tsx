"use client";

import { useUserRole } from "@/hooks/use-user-role";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Wallet, CreditCard, Download, TrendingUp } from "lucide-react";

export default function BillingPage() {
  const userRole = useUserRole();

  // Only accessible to BROKER
  if (userRole !== "BROKER") {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Access Denied</CardTitle>
          <CardDescription>
            This page is only available to brokers
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const transactions = [
    {
      id: "INV-001",
      description: "Featured Listing - Park Street Property",
      amount: "₹5,000",
      date: "Dec 20, 2025",
      status: "paid",
    },
    {
      id: "INV-002",
      description: "Premium Subscription - Monthly",
      amount: "₹2,500",
      date: "Dec 15, 2025",
      status: "paid",
    },
    {
      id: "INV-003",
      description: "Property Verification Fee",
      amount: "₹1,000",
      date: "Dec 10, 2025",
      status: "paid",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-spectron-gold via-spectron-teal to-spectron-crimson bg-clip-text text-transparent">
          Wallet & Billing
        </h1>
        <p className="text-muted-foreground mt-1">
          Manage your payments and billing information
        </p>
      </div>

      {/* Balance & Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-0 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Wallet Balance</CardTitle>
            <Wallet className="h-4 w-4 text-spectron-teal" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-spectron-teal">₹12,450</div>
            <Button size="sm" className="mt-3 bg-gradient-to-r from-spectron-gold to-spectron-teal text-white">
              Add Funds
            </Button>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
            <TrendingUp className="h-4 w-4 text-spectron-gold" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-spectron-gold">₹48,500</div>
            <p className="text-xs text-muted-foreground mt-3">This year</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Next Billing</CardTitle>
            <CreditCard className="h-4 w-4 text-spectron-crimson" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-spectron-crimson">₹2,500</div>
            <p className="text-xs text-muted-foreground mt-3">Due Jan 15, 2026</p>
          </CardContent>
        </Card>
      </div>

      {/* Payment Methods */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Payment Methods</CardTitle>
              <CardDescription>Manage your payment methods</CardDescription>
            </div>
            <Button variant="outline" className="border-spectron-teal text-spectron-teal hover:bg-spectron-teal/10">Add New</Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-heritage-cream/20 transition-colors">
              <div className="flex items-center gap-3">
                <CreditCard className="h-5 w-5 text-spectron-teal" />
                <div>
                  <p className="text-sm font-medium">•••• •••• •••• 4242</p>
                  <p className="text-xs text-muted-foreground">Expires 12/26</p>
                </div>
              </div>
              <Badge className="bg-spectron-teal text-white">Default</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Transaction History */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Transaction History</CardTitle>
              <CardDescription>Your recent billing transactions</CardDescription>
            </div>
            <Button variant="outline" size="sm" className="border-spectron-teal text-spectron-teal hover:bg-spectron-teal/10">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {transactions.map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between border-b last:border-0 pb-4 last:pb-0"
              >
                <div>
                  <p className="text-sm font-medium">{transaction.description}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {transaction.id} • {transaction.date}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <p className="text-sm font-bold text-spectron-teal">{transaction.amount}</p>
                  <Badge variant="secondary" className="bg-green-500/10 text-green-700">
                    {transaction.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}