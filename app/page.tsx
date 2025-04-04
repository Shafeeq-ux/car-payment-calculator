import CarPaymentCalculator from "@/components/car-payment-calculator"

export default function Home() {
  return (
    <main className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold text-center mb-8">Car Payment Calculator</h1>
      <CarPaymentCalculator />
    </main>
  )
}

