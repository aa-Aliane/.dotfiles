ˬ"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { StatusChangeDialog, PaymentSheet } from "@/components/features/commands"
import { ScheduleRepairDialog } from "@/components/features/calendrier"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import type { Repair, RepairStatus, RepairOutcome, PaymentMethod } from "@/types"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import {
  Calendar,
  User,
  Smartphone,
  Wrench,
  Package,
  Lock,
  FileText,
  Edit,
  ArrowUpDown,
  CalendarClock,
  Wallet,
  CheckCircle,
  Printer,
  X,
  Clock,
  Euro
} from "lucide-react"
import { printRepairTicket } from "@/lib/print-utils"

interface RepairDetailsProps {
  repair: Repair | null
  onClose: () => void
  onEdit?: (repair: Repair) => void
  onStatusChange?: (
    repair: Repair,
    newStatus: RepairStatus,
    comment: string,
    notifyClient: boolean,
    outcome?: RepairOutcome,
  ) => void
  onSchedule?: (repair: Repair, date: Date) => void
  onAddPayment?: (repair: Repair, amount: number, method: PaymentMethod, note?: string) => void
  onDeletePayment?: (repair: Repair, paymentId: string) => void
  onMarkRecovered?: (repair: Repair) => void
  currentUserName: string
}

const statusConfig = {
  saisie: { label: "Saisie", className: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200" },
  "en-cours": { label: "En cours", className: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200" },
  prete: { label: "Prête", className: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" },
  "en-attente": {
    label: "En attente",
    className: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
  },
}

export function RepairDetails({
  repair,
  onClose,
  onEdit,
  onStatusChange,
  onSchedule,
  onAddPayment,
  onDeletePayment,
  onMarkRecovered,
  currentUserName,
}: RepairDetailsProps) {
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false)
  const [isScheduleDialogOpen, setIsScheduleDialogOpen] = useState(false)
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false)
  const [isRecoveryDialogOpen, setIsRecoveryDialogOpen] = useState(false)
  const [isPaymentWarningOpen, setIsPaymentWarningOpen] = useState(false)

  if (!repair) return null

  const formatDate = (date: Date | string | undefined, formatStr: string) => {
    if (!date) return null
    try {
      const dateObj = typeof date === "string" ? new Date(date) : date
      if (isNaN(dateObj.getTime())) return null
      return format(dateObj, formatStr, { locale: fr })
    } catch {
      return null
    }
  }

  const handleStatusChange = (
    newStatus: RepairStatus,
    comment: string,
    notifyClient: boolean,
    outcome?: RepairOutcome,
  ) => {
    if (onStatusChange) {
      onStatusChange(repair, newStatus, comment, notifyClient, outcome)
    }
    setIsStatusDialogOpen(false)
  }

  const handleSchedule = (repair: Repair, date: Date) => {
    if (onSchedule) {
      onSchedule(repair, date)
    }
    setIsScheduleDialogOpen(false)
  }

  const totalPaid = repair.payments?.reduce((sum, p) => sum + p.amount, 0) || 0
  const remaining = (repair.totalCost || 0) - totalPaid
  const isPaymentComplete = remaining <= 0

  const handleRecoveryClick = () => {
    if (!isPaymentComplete && repair.totalCost && repair.totalCost > 0) {
      setIsPaymentWarningOpen(true)
    } else {
      setIsRecoveryDialogOpen(true)
    }
  }

  const handleConfirmRecovery = () => {
    if (onMarkRecovered) {
      onMarkRecovered(repair)
    }
    setIsRecoveryDialogOpen(false)
    onClose()
  }

  const handlePrint = () => {
    printRepairTicket(repair)
  }

  return (
    <>
      <div className="h-full flex flex-col bg-background border-l shadow-sm">
        {/* Header */}
        <div className="border-b bg-muted/30 px-6 py-4">
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-2xl font-bold">Réparation #{repair.id}</h2>
                {repair.status && (
                  <Badge className={statusConfig[repair.status].className}>
                    {statusConfig[repair.status].label}
                  </Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground">
                Créée le {formatDate(repair.created_at, "dd MMMM yyyy")}
              </p>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose} className="shrink-0">
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 flex-wrap">
            <Button variant="outline" size="sm" onClick={handlePrint}>
              <Printer className="h-4 w-4 mr-2" />
              Imprimer
            </Button>
            
            {repair.status === "prete" && onMarkRecovered && (
              <Button
                variant={isPaymentComplete ? "default" : "outline"}
                size="sm"
                onClick={handleRecoveryClick}
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Marquer récupéré
              </Button>
            )}
            
            {repair.totalCost != null && typeof repair.totalCost === 'number' && !isNaN(repair.totalCost) && repair.totalCost > 0 && (
              <Button
                variant={remaining > 0 ? "default" : "outline"}
                size="sm"
                onClick={() => setIsPaymentDialogOpen(true)}
              >
                <Wallet className="h-4 w-4 mr-2" />
                {remaining > 0 ? `${remaining.toFixed(2)} €` : "Payé"}
              </Button>
            )}
            
            {onSchedule && (
              <Button variant="outline" size="sm" onClick={() => setIsScheduleDialogOpen(true)}>
                <CalendarClock className="h-4 w-4 mr-2" />
                {repair.scheduledDate ? "Modifier date" : "Programmer"}
              </Button>
            )}
            
            {onEdit && (
              <Button variant="outline" size="sm" onClick={() => onEdit(repair)}>
                <Edit className="h-4 w-4 mr-2" />
                Modifier
              </Button>
            )}
            
            <Button variant="outline" size="sm" onClick={() => setIsStatusDialogOpen(true)}>
              <ArrowUpDown className="h-4 w-4 mr-2" />
              Changer statut
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-6 space-y-6">
            {/* Device Information */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Smartphone className="h-5 w-5 text-primary" />
                <h3 className="font-semibold text-lg">Appareil</h3>
              </div>
              <div className="bg-muted/30 rounded-lg p-4 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Type</span>
                  <span className="font-medium capitalize">{repair.deviceType}</span>
                </div>
                <Separator />
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Marque</span>
                  <span className="font-medium">{repair.brand}</span>
                </div>
                <Separator />
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Modèle</span>
                  <span className="font-medium">{repair.model}</span>
                </div>
              </div>
            </div>

            {/* Issues & Cost */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Wrench className="h-5 w-5 text-primary" />
                <h3 className="font-semibold text-lg">Panne(s) & Tarification</h3>
              </div>
              
              <div className="space-y-3">
                <div className="flex flex-wrap gap-2">
                  {repair.issues?.map((issue, idx) => (
                    <Badge key={idx} variant="secondary" className="text-sm">
                      {issue}
                    </Badge>
                  ))}
                </div>
                
                {repair.issueDescription && (
                  <div className="bg-muted/30 rounded-lg p-4">
                    <p className="text-sm font-medium mb-1 text-muted-foreground">Description détaillée</p>
                    <p className="text-sm">{repair.issueDescription}</p>
                  </div>
                )}
                
                {repair.totalCost != null && typeof repair.totalCost === 'number' && !isNaN(repair.totalCost) && (
                  <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg p-4 border border-primary/20">
                    <div className="flex justify-between items-center mb-3">
                      <div className="flex items-center gap-2">
                        <Euro className="h-5 w-5 text-primary" />
                        <span className="font-semibold">Coût total</span>
                      </div>
                      <span className="text-2xl font-bold text-primary">
                        {repair.totalCost.toFixed(2)} €
                      </span>
                    </div>
                    
                    {totalPaid > 0 && (
                      <>
                        <Separator className="my-3" />
                        <div className="space-y-2">
                          <div className="flex justify-between items-center text-sm">
                            <span className="text-muted-foreground">Payé</span>
                            <span className="font-semibold text-green-600 dark:text-green-400">
                              {totalPaid.toFixed(2)} €
                            </span>
                          </div>
                          <div className="flex justify-between items-center text-sm">
                            <span className="text-muted-foreground">Reste à payer</span>
                            <span className="font-semibold">
                              {remaining.toFixed(2)} €
                            </span>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Client Information */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <User className="h-5 w-5 text-primary" />
                <h3 className="font-semibold text-lg">Client</h3>
              </div>
              <div className="bg-muted/30 rounded-lg p-4 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Nom</span>
                  <span className="font-medium">
                    {repair.client.first_name} {repair.client.last_name}
                  </span>
                </div>
                <Separator />
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Téléphone</span>
                  <span className="font-medium">
                    {repair.client.profile?.phone_number || "Pas de numéro"}
                  </span>
                </div>
                {repair.client.email && (
                  <>
                    <Separator />
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Email</span>
                      <span className="font-medium text-sm">{repair.client.email}</span>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Additional Information */}
            {(repair.accessories?.length || repair.password || repair.depositStatus) && (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <FileText className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold text-lg">Informations complémentaires</h3>
                </div>
                <div className="space-y-3">
                  {repair.accessories && repair.accessories.length > 0 && (
                    <div className="bg-muted/30 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <Package className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-semibold">Accessoires déposés</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {repair.accessories.map((acc, idx) => (
                          <Badge key={idx} variant="outline">
                            {acc}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {repair.password && (
                    <div className="bg-muted/30 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Lock className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-semibold">Mot de passe</span>
                      </div>
                      <code className="text-sm bg-background px-3 py-1.5 rounded border">
                        {repair.password}
                      </code>
                    </div>
                  )}

                  {repair.depositStatus && (
                    <div className="bg-muted/30 rounded-lg p-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-semibold">Statut de dépôt</span>
                        <Badge variant={repair.depositStatus === "deposited" ? "default" : "secondary"}>
                          {repair.depositStatus === "deposited" ? "Déposé" : "Programmé"}
                        </Badge>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Dates */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Clock className="h-5 w-5 text-primary" />
                <h3 className="font-semibold text-lg">Calendrier</h3>
              </div>
              <div className="bg-muted/30 rounded-lg p-4 space-y-3">
                {formatDate(repair.created_at, "dd MMMM yyyy") && (
                  <>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Créée le</span>
                      <span className="font-medium text-sm">
                        {formatDate(repair.created_at, "dd MMMM yyyy")}
                      </span>
                    </div>
                    <Separator />
                  </>
                )}
                {repair.scheduledDate && formatDate(repair.scheduledDate, "dd MMMM yyyy") && (
                  <>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Programmée le</span>
                      <span className="font-medium text-sm">
                        {formatDate(repair.scheduledDate, "dd MMMM yyyy")}
                      </span>
                    </div>
                    <Separator />
                  </>
                )}
                {repair.estimatedCompletion && formatDate(repair.estimatedCompletion, "dd MMMM yyyy") && (
                  <>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Fin estimée</span>
                      <span className="font-medium text-sm">
                        {formatDate(repair.estimatedCompletion, "dd MMMM yyyy")}
                      </span>
                    </div>
                    <Separator />
                  </>
                )}
                {repair.completedAt && formatDate(repair.completedAt, "dd MMMM yyyy") && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Terminée le</span>
                    <span className="font-medium text-sm">
                      {formatDate(repair.completedAt, "dd MMMM yyyy")}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Notes */}
            {repair.notes && (
              <div>
                <h3 className="font-semibold text-lg mb-3">Notes</h3>
                <div className="bg-muted/30 rounded-lg p-4">
                  <p className="text-sm leading-relaxed">{repair.notes}</p>
                </div>
              </div>
            )}

            {/* Status History */}
            {repair.statusHistory && repair.statusHistory.length > 0 && (
              <div>
                <h3 className="font-semibold text-lg mb-3">Historique des changements</h3>
                <div className="space-y-3">
                  {repair.statusHistory.map((change) => (
                    <div key={change.id} className="bg-muted/30 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">
                            {statusConfig[change.from].label}
                          </Badge>
                          <span className="text-xs text-muted-foreground">→</span>
                          <Badge variant="outline" className="text-xs">
                            {statusConfig[change.to].label}
                          </Badge>
                        </div>
                        {formatDate(change.changedAt, "dd/MM/yyyy HH:mm") && (
                          <span className="text-xs text-muted-foreground">
                            {formatDate(change.changedAt, "dd/MM/yyyy HH:mm")}
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Par {change.changedBy}
                        {change.clientNotified && " • Client notifié"}
                      </div>
                      {change.comment && (
                        <p className="text-sm mt-2 pt-2 border-t">{change.comment}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Dialogs */}
      <AlertDialog open={isPaymentWarningOpen} onOpenChange={setIsPaymentWarningOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Paiement incomplet</AlertDialogTitle>
            <AlertDialogDescription>
              Le client n'a pas encore payé la totalité de la réparation. Il reste {remaining.toFixed(2)} € à payer.
              <br />
              <br />
              Voulez-vous enregistrer un paiement maintenant ?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                setIsPaymentWarningOpen(false)
                setIsPaymentDialogOpen(true)
              }}
            >
              Enregistrer un paiement
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={isRecoveryDialogOpen} onOpenChange={setIsRecoveryDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer la récupération</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr que le client a récupéré son appareil ?
              <br />
              <br />
              Cette action déplacera la réparation vers les archives.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmRecovery}>Confirmer la récupération</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <StatusChangeDialog
        repair={repair}
        open={isStatusDialogOpen}
        onOpenChange={setIsStatusDialogOpen}
        onConfirm={handleStatusChange}
        currentUserName={currentUserName}
      />

      <ScheduleRepairDialog
        repair={repair}
        open={isScheduleDialogOpen}
        onOpenChange={setIsScheduleDialogOpen}
        onSchedule={handleSchedule}
      />

      <PaymentSheet
        repair={repair}
        open={isPaymentDialogOpen}
        onOpenChange={setIsPaymentDialogOpen}
        onAddPayment={onAddPayment}
        onDeletePayment={onDeletePayment}
      />
    </>
  )
}
� *cascade08��*cascade08�� *cascade08��*cascade08�� *cascade08��*cascade08��  *cascade08� ��*cascade08��Ǘ *cascade08Ǘ��*cascade08���� *cascade08���*cascade08�ˬ *cascade08"(ee92897ce130bbc6228a42e5124115e2286dbf722dfile:///home/amine/coding/web/tek-mag/frontend/src/components/features/calendrier/repair-details.tsx:.file:///home/amine/coding/web/tek-mag/frontend