"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { PlusCircle, Trash2, Download, FileImage } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Define types for our line items
type LineItem = {
  id: string
  name: string
  value: number
}

export default function CarPaymentCalculator() {
  // Vehicle details
  const [vehicleYear, setVehicleYear] = useState("")
  const [vehicleMake, setVehicleMake] = useState("")
  const [vehicleModel, setVehicleModel] = useState("")
  const [vehicleTrim, setVehicleTrim] = useState("")

  // Basic inputs
  const [purchasePrice, setPurchasePrice] = useState(49900)
  const [downPayment, setDownPayment] = useState(2000)
  const [loanAmount, setLoanAmount] = useState(47900)
  const [apr, setApr] = useState(5.99)
  const [loanTerm, setLoanTerm] = useState(48)

  // Multiple line items
  const [tradeIns, setTradeIns] = useState<LineItem[]>([])
  const [accessories, setAccessories] = useState<LineItem[]>([])
  const [offersRebates, setOffersRebates] = useState<LineItem[]>([])
  const [protectionPlans, setProtectionPlans] = useState<LineItem[]>([])
  const [subscriptions, setSubscriptions] = useState<LineItem[]>([])
  const [chargers, setChargers] = useState<LineItem[]>([])

  // Totals
  const [tradeInTotal, setTradeInTotal] = useState(0)
  const [accessoriesTotal, setAccessoriesTotal] = useState(0)
  const [offersRebatesTotal, setOffersRebatesTotal] = useState(0)
  const [protectionPlansTotal, setProtectionPlansTotal] = useState(0)
  const [subscriptionsTotal, setSubscriptionsTotal] = useState(0)
  const [chargersTotal, setChargersTotal] = useState(0)

  const [monthlyPayment, setMonthlyPayment] = useState(0)
  const calculatorRef = useRef<HTMLDivElement>(null)

  // Format currency input
  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value)
  }

  // Parse currency string to number
  const parseCurrency = (value: string): number => {
    return Number.parseFloat(value.replace(/[$,]/g, "")) || 0
  }

  // Handle input change with currency formatting
  const handleCurrencyChange = (value: string, setter: React.Dispatch<React.SetStateAction<number>>) => {
    setter(parseCurrency(value))
  }

  // Generate a unique ID
  const generateId = () => {
    return Math.random().toString(36).substring(2, 9)
  }

  // Add a new line item
  const addLineItem = (
    items: LineItem[],
    setItems: React.Dispatch<React.SetStateAction<LineItem[]>>,
    defaultName = "",
  ) => {
    const newItem = {
      id: generateId(),
      name: defaultName,
      value: 0,
    }
    setItems([...items, newItem])
  }

  // Remove a line item
  const removeLineItem = (
    id: string,
    items: LineItem[],
    setItems: React.Dispatch<React.SetStateAction<LineItem[]>>,
  ) => {
    setItems(items.filter((item) => item.id !== id))
  }

  // Update a line item
  const updateLineItem = (
    id: string,
    field: "name" | "value",
    value: string | number,
    items: LineItem[],
    setItems: React.Dispatch<React.SetStateAction<LineItem[]>>,
  ) => {
    const updatedItems = items.map((item) => {
      if (item.id === id) {
        return { ...item, [field]: field === "value" ? parseCurrency(value as string) : value }
      }
      return item
    })
    setItems(updatedItems)
  }

  // Calculate totals for each category
  useEffect(() => {
    setTradeInTotal(tradeIns.reduce((sum, item) => sum + item.value, 0))
    setAccessoriesTotal(accessories.reduce((sum, item) => sum + item.value, 0))
    setOffersRebatesTotal(offersRebates.reduce((sum, item) => sum + item.value, 0))
    setProtectionPlansTotal(protectionPlans.reduce((sum, item) => sum + item.value, 0))
    setSubscriptionsTotal(subscriptions.reduce((sum, item) => sum + item.value, 0))
    setChargersTotal(chargers.reduce((sum, item) => sum + item.value, 0))
  }, [tradeIns, accessories, offersRebates, protectionPlans, subscriptions, chargers])

  // Calculate loan amount
  useEffect(() => {
    const calculatedLoanAmount =
      purchasePrice -
      downPayment -
      tradeInTotal +
      accessoriesTotal -
      offersRebatesTotal +
      protectionPlansTotal +
      subscriptionsTotal +
      chargersTotal

    setLoanAmount(calculatedLoanAmount > 0 ? calculatedLoanAmount : 0)
  }, [
    purchasePrice,
    downPayment,
    tradeInTotal,
    accessoriesTotal,
    offersRebatesTotal,
    protectionPlansTotal,
    subscriptionsTotal,
    chargersTotal,
  ])

  // Calculate monthly payment
  useEffect(() => {
    if (loanAmount <= 0 || loanTerm <= 0 || apr <= 0) {
      setMonthlyPayment(0)
      return
    }

    const monthlyRate = apr / 12 / 100
    const monthlyPayment =
      (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, loanTerm)) / (Math.pow(1 + monthlyRate, loanTerm) - 1)

    setMonthlyPayment(monthlyPayment)
  }, [loanAmount, apr, loanTerm])

  // Download as PDF
  const downloadAsPDF = async () => {
    if (!calculatorRef.current) return

    try {
      // Dynamically import the libraries
      const html2canvas = (await import("html2canvas")).default
      const { jsPDF } = await import("jspdf")

      const canvas = await html2canvas(calculatorRef.current, {
        scale: 2,
        logging: false,
        useCORS: true,
        allowTaint: true,
      })

      const imgData = canvas.toDataURL("image/jpeg", 1.0)
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "px",
        format: [canvas.width, canvas.height],
      })

      pdf.addImage(imgData, "JPEG", 0, 0, canvas.width, canvas.height)
      pdf.save(`Car_Payment_Calculator_${new Date().toISOString().split("T")[0]}.pdf`)
    } catch (error) {
      console.error("Error generating PDF:", error)
      alert("Failed to generate PDF. Please try again.")
    }
  }

  // Download as JPG
  const downloadAsJPG = async () => {
    if (!calculatorRef.current) return

    try {
      const html2canvas = (await import("html2canvas")).default

      const canvas = await html2canvas(calculatorRef.current, {
        scale: 2,
        logging: false,
        useCORS: true,
        allowTaint: true,
      })

      const link = document.createElement("a")
      link.download = `Car_Payment_Calculator_${new Date().toISOString().split("T")[0]}.jpg`
      link.href = canvas.toDataURL("image/jpeg", 1.0)
      link.click()
    } catch (error) {
      console.error("Error generating JPG:", error)
      alert("Failed to generate JPG. Please try again.")
    }
  }

  // Line Items Component
  const LineItemsSection = ({
    title,
    items,
    setItems,
    addItem,
    removeItem,
    updateItem,
    total,
  }: {
    title: string
    items: LineItem[]
    setItems: React.Dispatch<React.SetStateAction<LineItem[]>>
    addItem: () => void
    removeItem: (id: string) => void
    updateItem: (id: string, field: "name" | "value", value: string | number) => void
    total: number
  }) => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">{title}</h3>
        <Button variant="outline" size="sm" onClick={addItem} className="flex items-center gap-1">
          <PlusCircle className="h-4 w-4" /> Add
        </Button>
      </div>

      {items.length === 0 ? (
        <p className="text-sm text-muted-foreground">No items added</p>
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <div key={item.id} className="flex gap-2 items-center">
              <Input
                placeholder="Item name"
                value={item.name}
                onChange={(e) => updateItem(item.id, "name", e.target.value)}
                className="flex-1"
              />
              <Input
                type="text"
                value={formatCurrency(item.value)}
                onChange={(e) => updateItem(item.id, "value", e.target.value)}
                className="w-32"
              />
              <Button variant="ghost" size="icon" onClick={() => removeItem(item.id)} className="h-9 w-9">
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <div className="flex justify-between pt-2 border-t">
            <span className="font-medium">Total:</span>
            <span className="font-medium">{formatCurrency(total)}</span>
          </div>
        </div>
      )}
    </div>
  )

  return (
    <div ref={calculatorRef} className="bg-white p-6 rounded-lg">
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle>Car Payment Calculator</CardTitle>
              <CardDescription>Enter your car purchase details to calculate your monthly payment</CardDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={downloadAsPDF} className="flex items-center gap-1">
                <Download className="h-4 w-4" /> PDF
              </Button>
              <Button variant="outline" size="sm" onClick={downloadAsJPG} className="flex items-center gap-1">
                <FileImage className="h-4 w-4" /> JPG
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="grid gap-6">
          {/* Vehicle Details */}
          <div className="space-y-2">
            <h3 className="text-lg font-medium">Vehicle Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label htmlFor="vehicleYear">Year</Label>
                <Input
                  id="vehicleYear"
                  value={vehicleYear}
                  onChange={(e) => setVehicleYear(e.target.value)}
                  placeholder="2023"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="vehicleMake">Make</Label>
                <Input
                  id="vehicleMake"
                  value={vehicleMake}
                  onChange={(e) => setVehicleMake(e.target.value)}
                  placeholder="Toyota"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="vehicleModel">Model</Label>
                <Input
                  id="vehicleModel"
                  value={vehicleModel}
                  onChange={(e) => setVehicleModel(e.target.value)}
                  placeholder="Camry"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="vehicleTrim">Trim</Label>
                <Input
                  id="vehicleTrim"
                  value={vehicleTrim}
                  onChange={(e) => setVehicleTrim(e.target.value)}
                  placeholder="XSE"
                />
              </div>
            </div>
          </div>

          {/* Basic Purchase Details */}
          <div className="space-y-2">
            <h3 className="text-lg font-medium">Purchase Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="purchasePrice">Purchase Price</Label>
                <Input
                  id="purchasePrice"
                  type="text"
                  value={formatCurrency(purchasePrice)}
                  onChange={(e) => handleCurrencyChange(e.target.value, setPurchasePrice)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="downPayment">Down Payment</Label>
                <Input
                  id="downPayment"
                  type="text"
                  value={formatCurrency(downPayment)}
                  onChange={(e) => handleCurrencyChange(e.target.value, setDownPayment)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="apr">APR (%)</Label>
                <Input
                  id="apr"
                  type="number"
                  step="0.01"
                  value={apr}
                  onChange={(e) => setApr(Number.parseFloat(e.target.value) || 0)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="loanTerm">Loan Term (months)</Label>
                <Input
                  id="loanTerm"
                  type="number"
                  value={loanTerm}
                  onChange={(e) => setLoanTerm(Number.parseInt(e.target.value) || 0)}
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Line Items Tabs */}
          <Tabs defaultValue="tradeIns" className="w-full">
            <TabsList className="grid grid-cols-3 md:grid-cols-6 mb-4">
              <TabsTrigger value="tradeIns">Trade-ins</TabsTrigger>
              <TabsTrigger value="accessories">Accessories</TabsTrigger>
              <TabsTrigger value="offersRebates">Offers & Rebates</TabsTrigger>
              <TabsTrigger value="protectionPlans">Protection Plans</TabsTrigger>
              <TabsTrigger value="subscriptions">Subscriptions</TabsTrigger>
              <TabsTrigger value="chargers">Chargers</TabsTrigger>
            </TabsList>

            <TabsContent value="tradeIns">
              <LineItemsSection
                title="Trade-in Vehicles"
                items={tradeIns}
                setItems={setTradeIns}
                addItem={() => addLineItem(tradeIns, setTradeIns, "Vehicle")}
                removeItem={(id) => removeLineItem(id, tradeIns, setTradeIns)}
                updateItem={(id, field, value) => updateLineItem(id, field, value, tradeIns, setTradeIns)}
                total={tradeInTotal}
              />
            </TabsContent>

            <TabsContent value="accessories">
              <LineItemsSection
                title="Accessories"
                items={accessories}
                setItems={setAccessories}
                addItem={() => addLineItem(accessories, setAccessories, "Accessory")}
                removeItem={(id) => removeLineItem(id, accessories, setAccessories)}
                updateItem={(id, field, value) => updateLineItem(id, field, value, accessories, setAccessories)}
                total={accessoriesTotal}
              />
            </TabsContent>

            <TabsContent value="offersRebates">
              <LineItemsSection
                title="Offers & Rebates"
                items={offersRebates}
                setItems={setOffersRebates}
                addItem={() => addLineItem(offersRebates, setOffersRebates, "Rebate")}
                removeItem={(id) => removeLineItem(id, offersRebates, setOffersRebates)}
                updateItem={(id, field, value) => updateLineItem(id, field, value, offersRebates, setOffersRebates)}
                total={offersRebatesTotal}
              />
            </TabsContent>

            <TabsContent value="protectionPlans">
              <LineItemsSection
                title="Protection Plans"
                items={protectionPlans}
                setItems={setProtectionPlans}
                addItem={() => addLineItem(protectionPlans, setProtectionPlans, "Protection Plan")}
                removeItem={(id) => removeLineItem(id, protectionPlans, setProtectionPlans)}
                updateItem={(id, field, value) => updateLineItem(id, field, value, protectionPlans, setProtectionPlans)}
                total={protectionPlansTotal}
              />
            </TabsContent>

            <TabsContent value="subscriptions">
              <LineItemsSection
                title="Subscriptions"
                items={subscriptions}
                setItems={setSubscriptions}
                addItem={() => addLineItem(subscriptions, setSubscriptions, "Subscription")}
                removeItem={(id) => removeLineItem(id, subscriptions, setSubscriptions)}
                updateItem={(id, field, value) => updateLineItem(id, field, value, subscriptions, setSubscriptions)}
                total={subscriptionsTotal}
              />
            </TabsContent>

            <TabsContent value="chargers">
              <LineItemsSection
                title="Chargers"
                items={chargers}
                setItems={setChargers}
                addItem={() => addLineItem(chargers, setChargers, "Charger")}
                removeItem={(id) => removeLineItem(id, chargers, setChargers)}
                updateItem={(id, field, value) => updateLineItem(id, field, value, chargers, setChargers)}
                total={chargersTotal}
              />
            </TabsContent>
          </Tabs>

          <Separator className="my-2" />

          {/* Summary */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Summary</h3>

            <div className="grid grid-cols-2 gap-x-4 gap-y-2">
              <div className="text-sm">Purchase Price:</div>
              <div className="text-sm text-right">{formatCurrency(purchasePrice)}</div>

              <div className="text-sm">Down Payment:</div>
              <div className="text-sm text-right">-{formatCurrency(downPayment)}</div>

              <div className="text-sm">Trade-in Value:</div>
              <div className="text-sm text-right">-{formatCurrency(tradeInTotal)}</div>

              <div className="text-sm">Accessories:</div>
              <div className="text-sm text-right">+{formatCurrency(accessoriesTotal)}</div>

              <div className="text-sm">Offers & Rebates:</div>
              <div className="text-sm text-right">-{formatCurrency(offersRebatesTotal)}</div>

              <div className="text-sm">Protection Plans:</div>
              <div className="text-sm text-right">+{formatCurrency(protectionPlansTotal)}</div>

              <div className="text-sm">Subscriptions:</div>
              <div className="text-sm text-right">+{formatCurrency(subscriptionsTotal)}</div>

              <div className="text-sm">Chargers:</div>
              <div className="text-sm text-right">+{formatCurrency(chargersTotal)}</div>

              <div className="text-base font-medium pt-2 border-t">Loan Amount:</div>
              <div className="text-base font-medium text-right pt-2 border-t">{formatCurrency(loanAmount)}</div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="loanAmount">Loan Amount</Label>
                <Input id="loanAmount" type="text" value={formatCurrency(loanAmount)} readOnly className="bg-muted" />
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col">
          <div className="w-full p-4 bg-muted rounded-lg">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Monthly Payment:</h3>
              <span className="text-2xl font-bold">{formatCurrency(monthlyPayment)}</span>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-4">
            This calculator provides an estimate. Actual payment may vary based on taxes, fees, and other factors.
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}

