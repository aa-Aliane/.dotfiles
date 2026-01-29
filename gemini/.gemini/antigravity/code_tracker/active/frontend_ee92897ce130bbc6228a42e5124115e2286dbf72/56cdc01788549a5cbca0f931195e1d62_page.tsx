“9"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RepairsTable, RepairDetails } from "@/components/features/calendrier";
import { useRepairs, useUpdateRepair } from "@/hooks/use-repairs";
import { mockArchivedRepairs } from "@/lib/data";
import {
  type Repair,
  type RepairStatus,
  type RepairOutcome,
  type PaymentMethod,
} from "@/types";
import { useUserRole } from "@/components/layout/providers";
import { SharedHeader } from '@/components/shared/shared-header';
import { toast } from "sonner";

export default function RepairsPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const { data, isLoading, error } = useRepairs(1, statusFilter === "all" ? undefined : statusFilter);
  const updateRepair = useUpdateRepair();
  const repairs = data?.results || [];

  const [archivedRepairs, setArchivedRepairs] =
    useState<Repair[]>(mockArchivedRepairs);
  const [selectedRepair, setSelectedRepair] = useState<Repair | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const { currentUser } = useUserRole();

  const handleStatusChange = (
    repair: Repair,
    newStatus: RepairStatus,
    comment: string,
    notifyClient: boolean,
    outcome?: RepairOutcome,
  ) => {
    updateRepair.mutate(
      {
        id: String(repair.id),
        data: {
          status: newStatus,
          outcome: outcome,
        },
      },
      {
        onSuccess: () => {
          toast.success("Statut mis Ã  jour avec succÃ¨s");
        },
        onError: (error) => {
          toast.error("Erreur lors de la mise Ã  jour du statut");
          console.error(error);
        },
      }
    );
  };

  const handleSchedule = (repair: Repair, date: Date) => {
    updateRepair.mutate(
      {
        id: String(repair.id),
        data: {
          scheduledDate: date,
          depositStatus: "scheduled",
        },
      },
      {
        onSuccess: () => {
          toast.success("Rendez-vous planifiÃ© avec succÃ¨s");
        },
        onError: () => {
          toast.error("Erreur lors de la planification");
        },
      }
    );
  };

  const handleAddPayment = (
    repair: Repair,
    amount: number,
    method: PaymentMethod,
    note?: string,
  ) => {
    const currentCard = Number(repair.card_payment || 0);
    const currentCash = Number(repair.cash_payment || 0);
    
    const updateData: Partial<Repair> = {};
    if (method === "card") {
      updateData.card_payment = String(currentCard + amount);
    } else {
      updateData.cash_payment = String(currentCash + amount);
    }

    updateRepair.mutate(
      {
        id: String(repair.id),
        data: updateData,
      },
      {
        onSuccess: () => {
          toast.success("Paiement ajoutÃ© avec succÃ¨s");
        },
        onError: () => {
          toast.error("Erreur lors de l'ajout du paiement");
        },
      }
    );
  };

  const handleDeletePayment = (repair: Repair, paymentId: string) => {
    toast.error("Suppression de paiement non supportÃ©e pour le moment");
  };

  const handleViewDetails = (repair: Repair) => {
    setSelectedRepair(repair);
    setIsDetailsOpen(true);
  };

  const handleMarkRecovered = (repair: Repair) => {
    updateRepair.mutate(
      {
        id: String(repair.id),
        data: {
          recoveredAt: new Date(),
          status: "prete",
        },
      },
      {
        onSuccess: () => {
          toast.success("MarquÃ© comme rÃ©cupÃ©rÃ©");
          setIsDetailsOpen(false);
        },
        onError: () => {
          toast.error("Erreur lors de la mise Ã  jour");
        },
      }
    );
  };

  const stats = {
    total: repairs.length,
    saisie: repairs.filter((r) => r.status === "saisie").length,
    enCours: repairs.filter((r) => r.status === "en-cours").length,
    prete: repairs.filter((r) => r.status === "prete").length,
    enAttente: repairs.filter((r) => r.status === "en-attente").length,
  };

  return (
    <div className="h-full flex flex-col">
      <SharedHeader
        title="RÃ©parations"
        subtitle="GÃ©rez toutes vos rÃ©parations en cours"
      >
        <div className="flex justify-end">
          <Button
            className="gap-2"
            onClick={() => router.push("/add-reparation")}
          >
            <Plus className="h-4 w-4" />
            Nouvelle RÃ©paration
          </Button>
        </div>
      </SharedHeader>

      <div className="p-4 sm:p-8 flex-1 flex flex-col gap-4 sm:gap-6 min-h-0">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
          <div className="rounded-lg border border-border bg-card p-3 sm:p-4">
            <div className="text-xl sm:text-2xl font-bold">{stats.total}</div>
            <div className="text-xs sm:text-sm text-muted-foreground">
              Total
            </div>
          </div>
          <div className="rounded-lg border border-border bg-card p-3 sm:p-4">
            <div className="text-xl sm:text-2xl font-bold text-blue-600">
              {stats.saisie}
            </div>
            <div className="text-xs sm:text-sm text-muted-foreground">
              Saisies
            </div>
          </div>
          <div className="rounded-lg border border-border bg-card p-3 sm:p-4">
            <div className="text-xl sm:text-2xl font-bold text-yellow-600">
              {stats.enCours}
            </div>
            <div className="text-xs sm:text-sm text-muted-foreground">
              En cours
            </div>
          </div>
          <div className="rounded-lg border border-border bg-card p-3 sm:p-4">
            <div className="text-xl sm:text-2xl font-bold text-green-600">
              {stats.prete}
            </div>
            <div className="text-xs sm:text-sm text-muted-foreground">
              PrÃªtes
            </div>
          </div>
          <div className="rounded-lg border border-border bg-card p-3 sm:p-4">
            <div className="text-xl sm:text-2xl font-bold text-orange-600">
              {stats.enAttente}
            </div>
            <div className="text-xs sm:text-sm text-muted-foreground">
              En attente
            </div>
          </div>
        </div>

        <div className="flex gap-6 flex-1 min-h-0">
          <div className={`flex-1 min-w-0 transition-all duration-300`}>
            <RepairsTable repairs={repairs} onViewDetails={handleViewDetails} />
          </div>

          {isDetailsOpen && selectedRepair && (
            <div className="w-[400px] flex-none animate-in slide-in-from-right-10 duration-300">
              <RepairDetails
                repair={selectedRepair}
                onClose={() => setIsDetailsOpen(false)}
                onStatusChange={handleStatusChange}
                onSchedule={handleSchedule}
                onAddPayment={handleAddPayment}
                onDeletePayment={handleDeletePayment}
                onMarkRecovered={handleMarkRecovered}
                currentUserName={currentUser.username}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}…
 *cascade08…
…
*cascade08…
ï *cascade08ïï*cascade08ïİ *cascade08İ€*cascade08€á  *cascade08á ï *cascade08ï ­$ *cascade08­$¯$*cascade08¯$°$ *cascade08°$±$*cascade08±$²$ *cascade08²$Å$*cascade08Å$Ë$ *cascade08Ë$Í$*cascade08Í$Î$ *cascade08Î$Ô$*cascade08Ô$Õ$ *cascade08Õ$Ö$*cascade08Ö$×$ *cascade08×$Ø$*cascade08Ø$¢. *cascade08¢.ª.*cascade08ª.«. *cascade08«.¬.*cascade08¬.¯. *cascade08¯.±.*cascade08±.µ. *cascade08µ.·.*cascade08·.Í. *cascade08Í.Î.*cascade08Î.Ğ. *cascade08Ğ.Ô.*cascade08Ô.Ö. *cascade08Ö.Ø.*cascade08Ø.Ú. *cascade08Ú.Û.*cascade08Û.Ü. *cascade08Ü.ß.*cascade08ß.â. *cascade08â.å.*cascade08å.æ. *cascade08æ.ê.*cascade08ê.ë. *cascade08ë.î.*cascade08î.ï. *cascade08ï.ó.*cascade08ó.ô. *cascade08ô.Š/*cascade08Š/Œ/ *cascade08Œ/Ÿ/*cascade08Ÿ/¡/ *cascade08¡/£/*cascade08£/¬/ *cascade08¬/­/*cascade08­/½/ *cascade08½/À/*cascade08À/Ì/ *cascade08Ì/Ñ/*cascade08Ñ/Ò/ *cascade08Ò/Ó/*cascade08Ó/Õ/ *cascade08Õ/Ö/*cascade08Ö/×/ *cascade08×/Ø/*cascade08Ø/Ù/ *cascade08Ù/ä/*cascade08ä/ç/ *cascade08ç/è/*cascade08è/é/ *cascade08é/ë/*cascade08ë/ì/ *cascade08ì/í/*cascade08í/ï/ *cascade08ï/ğ/*cascade08ğ/ò/ *cascade08ò/ø/*cascade08ø/ù/ *cascade08ù/ÿ/*cascade08ÿ/‹0 *cascade08‹00*cascade0800 *cascade080‘0*cascade08‘0¢0 *cascade08¢0¦0*cascade08¦0§0 *cascade08§0¨0*cascade08¨0ª0 *cascade08ª0¬0*cascade08¬0­0 *cascade08­0±0*cascade08±0³0 *cascade08³0¼0*cascade08¼0½0 *cascade08½0Á0*cascade08Á0Â0 *cascade08Â0Ã0*cascade08Ã0Ä0 *cascade08Ä0Ê0*cascade08Ê0Û0 *cascade08Û0Ü0*cascade08Ü0ß0 *cascade08ß0à0 *cascade08à0á0 *cascade08á0â0*cascade08â0ã0 *cascade08ã0æ0*cascade08æ0ê0 *cascade08ê0ì0*cascade08ì0ò0 *cascade08ò0÷0 *cascade08÷0ø0 *cascade08ø0ù0*cascade08ù0ˆ1 *cascade08ˆ1Œ1*cascade08Œ11 *cascade0811*cascade081‘1 *cascade08‘1’1*cascade08’1“1 *cascade08“1š1*cascade08š1›1 *cascade08›1£1*cascade08£1¥1 *cascade08¥1¨1*cascade08¨1©1 *cascade08©1ª1*cascade08ª1«1 *cascade08«1¬1*cascade08¬1­1 *cascade08­1°1*cascade08°1±1 *cascade08±1¶1*cascade08¶1¸1 *cascade08¸1»1*cascade08»1¼1 *cascade08¼1¾1*cascade08¾1À1 *cascade08À1Á1*cascade08Á1Â1 *cascade08Â1Å1*cascade08Å1Í1 *cascade08Í1Ò1 *cascade08Ò1Ó1*cascade08Ó1Õ1 *cascade08Õ1×1*cascade08×1Ø1 *cascade08Ø1ß1*cascade08ß1ê1 *cascade08ê1ë1*cascade08ë1ì1 *cascade08ì1ï1*cascade08ï1ğ1 *cascade08ğ1ò1*cascade08ò1ó1 *cascade08ó1õ1*cascade08õ1ı1 *cascade08ı1ÿ1 *cascade08ÿ1‚2*cascade08‚2†2 *cascade08†2Š2 *cascade08Š2Œ2*cascade08Œ2’2 *cascade08’2“2*cascade08“2”2 *cascade08”2–2*cascade08–2œ2 *cascade08œ2 2*cascade08 2¡2 *cascade08¡2°2*cascade08°2±2 *cascade08±2¶2*cascade08¶2·2 *cascade08·2½2*cascade08½2¾2 *cascade08¾2¿2*cascade08¿2À2 *cascade08À2Æ2*cascade08Æ2È2 *cascade08È2Ê2*cascade08Ê2Ö2 *cascade08Ö23 *cascade083‘3 *cascade08‘3’3*cascade08’3”3*cascade08”3œ3 *cascade08œ33*cascade083è3 *cascade08è3ê3*cascade08ê3ì3*cascade08ì3ô3 *cascade08ô3õ3*cascade08õ3û3 *cascade08û3ı3 *cascade08ı3ş3*cascade08ş3˜4 *cascade08˜44 *cascade084¤4 *cascade08¤4¦4*cascade08¦4½4 *cascade08½4¾4 *cascade08¾4Ã4 *cascade08
Ã4Æ4 Æ4Ô4 *cascade08Ô4Õ4 *cascade08Õ4Ö4*cascade08Ö4×4 *cascade08×4à4*cascade08à4á4 *cascade08á4ğ4*cascade08ğ4ñ4 *cascade08ñ4…5 *cascade08…5‡5*cascade08‡5•5 *cascade08•5–5 *cascade08–5›5*cascade08›55 *cascade085¡5*cascade08¡5¢5 *cascade08¢5¤5*cascade08¤5¬5 *cascade08¬5°5*cascade08°5²5*cascade08²5Ê5 *cascade08Ê5Ì5*cascade08Ì5Ô5 *cascade08Ô5Ú5*cascade08Ú5Û5 *cascade08Û5à5*cascade08à5ã5 *cascade08ã5í5*cascade08í5ù5 *cascade08ù5€6*cascade08€6‚6 *cascade08‚6„6*cascade08„6Œ6 *cascade08Œ66*cascade086¶6 *cascade08¶6·6*cascade08·6º6*cascade08º6Â6 *cascade08Â6Å6*cascade08Å6Æ6*cascade08Æ6â6 *cascade08â6ä6*cascade08ä6ê6*cascade08ê6’7 *cascade08’7“7*cascade08“7•7*cascade08•77 *cascade087¡7*cascade08¡7¢7*cascade08¢7È7 *cascade08È7Ê7*cascade08Ê7Ğ7*cascade08Ğ7ş7 *cascade08ş7ÿ7*cascade08ÿ7‡8 *cascade08‡88*cascade0888*cascade088»8 *cascade08»8Á8*cascade08Á8ã8 *cascade08ã8ä8*cascade08ä8î8 *cascade08î8ğ8*cascade08ğ8ò8 *cascade08ò8ó8*cascade08ó8û8 *cascade08û8ü8*cascade08ü8€9 *cascade08€99*cascade089“9 *cascade08"(ee92897ce130bbc6228a42e5124115e2286dbf722Wfile:///home/amine/coding/web/tek-mag/frontend/src/app/%28dashboard%29/repairs/page.tsx:.file:///home/amine/coding/web/tek-mag/frontend