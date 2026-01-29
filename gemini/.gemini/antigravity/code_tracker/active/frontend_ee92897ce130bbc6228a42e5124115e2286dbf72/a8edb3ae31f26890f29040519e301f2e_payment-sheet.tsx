�B"use client"

import type React from "react"

import { useState } from "react"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter, SheetDescription } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import type { Repair, PaymentMethod } from "@/types"
import { CreditCard, Banknote, Trash2 } from "lucide-react"
import { format } from "date-fns"
import { fr } from "date-fns/locale"

interface PaymentSheetProps {
  repair: Repair | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onAddPayment?: (repair: Repair, amount: number, method: PaymentMethod, note?: string) => void
  onDeletePayment?: (repair: Repair, paymentId: string) => void
}

export function PaymentSheet({ repair, open, onOpenChange, onAddPayment, onDeletePayment }: PaymentSheetProps) {
  const [amount, setAmount] = useState("")
  const [method, setMethod] = useState<PaymentMethod>("cash")
  const [note, setNote] = useState("")

  if (!repair) return null

  const totalCost = repair.totalCost || 0
  const totalPaid = repair.payments?.reduce((sum, p) => sum + p.amount, 0) || 0
  const remaining = totalCost - totalPaid

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const paymentAmount = Number.parseFloat(amount)
    if (paymentAmount > 0 && paymentAmount <= remaining && onAddPayment) {
      onAddPayment(repair, paymentAmount, method, note || undefined)
      setAmount("")
      setNote("")
      setMethod("cash")
    }
  }

  const getPaymentStatusBadge = () => {
    if (totalPaid === 0) {
      return <Badge variant="destructive">Non payé</Badge>
    } else if (totalPaid < totalCost) {
      return <Badge className="bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200">Partiel</Badge>
    } else {
      return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">Payé</Badge>
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-[400px] sm:w-[540px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Gestion des paiements</SheetTitle>
          <SheetDescription>
            Réparation #{repair.id} - {repair.brand} {repair.model}
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-6 mt-6">
          {/* Payment Summary */}
          <div className="rounded-lg border border-border bg-muted/30 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Statut du paiement</span>
              {getPaymentStatusBadge()}
            </div>
            <Separator />
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Coût total</span>
                <span className="font-medium">{totalCost} €</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Montant payé</span>
                <span className="font-medium text-green-600 dark:text-green-400">{totalPaid.toFixed(2)} €</span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="font-medium">Reste à payer</span>
                <span className="text-lg font-bold text-primary">{remaining.toFixed(2)} €</span>
              </div>
            </div>
          </div>

          {/* Payment History */}
          {repair.payments && repair.payments.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-muted-foreground">HISTORIQUE DES PAIEMENTS</h3>
              <div className="space-y-2">
                {repair.payments.map((payment) => (
                  <div key={payment.id} className="rounded-lg border border-border bg-muted/30 p-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-primary/10">
                          {payment.method === "card" ? (
                            <CreditCard className="h-4 w-4 text-primary" />
                          ) : (
                            <Banknote className="h-4 w-4 text-primary" />
                          )}
                        </div>
                        <div>
                          <div className="font-medium">{payment.amount.toFixed(2)} €</div>
                          <div className="text-xs text-muted-foreground">
                            {payment.method === "card" ? "Carte bancaire" : "Espèces"} •{" "}
                            {format(payment.date, "dd/MM/yyyy HH:mm", { locale: fr })}
                          </div>
                          {payment.note && <div className="text-xs text-muted-foreground mt-1">{payment.note}</div>}
                        </div>
                      </div>
                      {onDeletePayment && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onDeletePayment(repair, payment.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Add Payment Form */}
          {remaining > 0 && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <Separator />
              <h3 className="text-sm font-semibold text-muted-foreground">ENREGISTRER UN PAIEMENT</h3>

              <div className="space-y-2">
                <Label htmlFor="amount">Montant (max: {remaining.toFixed(2)} €)</Label>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  min="0.01"
                  max={remaining}
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Mode de paiement</Label>
                <RadioGroup value={method} onValueChange={(value) => setMethod(value as PaymentMethod)}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="cash" id="cash" />
                    <Label htmlFor="cash" className="flex items-center gap-2 cursor-pointer">
                      <Banknote className="h-4 w-4" />
                      Espèces
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="card" id="card" />
                    <Label htmlFor="card" className="flex items-center gap-2 cursor-pointer">
                      <CreditCard className="h-4 w-4" />
                      Carte bancaire
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-2">
                <Label htmlFor="note">Note (facultatif)</Label>
                <Textarea
                  id="note"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Ajouter une note..."
                  rows={2}
                />
              </div>

              <SheetFooter className="mt-4">
                <Button type="submit" className="w-full">Enregistrer le paiement</Button>
              </SheetFooter>
            </form>
          )}

          {remaining === 0 && (
            <div className="text-center py-4">
              <div className="text-green-600 dark:text-green-400 font-medium">✓ Réparation entièrement payée</div>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
�B*cascade08"(ee92897ce130bbc6228a42e5124115e2286dbf722afile:///home/amine/coding/web/tek-mag/frontend/src/components/features/commands/payment-sheet.tsx:.file:///home/amine/coding/web/tek-mag/frontend