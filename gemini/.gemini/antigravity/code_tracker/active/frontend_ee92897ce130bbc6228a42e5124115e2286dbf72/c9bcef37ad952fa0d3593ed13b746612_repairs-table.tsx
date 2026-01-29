¶D"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Repair } from "@/types"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { Search } from "lucide-react"
import { RepairCard } from "@/components/features/calendrier"

interface RepairsTableProps {
  repairs: Repair[]
  onViewDetails?: (repair: Repair) => void
}

const statusConfig = {
  saisie: { label: "Saisie", className: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200" },
  "en-cours": { label: "En cours", className: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200" },
  prete: { label: "PrÃªte", className: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" },
  "en-attente": {
    label: "En attente",
    className: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
  },
}

export function RepairsTable({ repairs, onViewDetails }: RepairsTableProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [deviceTypeFilter, setDeviceTypeFilter] = useState<string>("all")

  const filteredRepairs = repairs.filter((repair) => {
    const clientName = `${repair.client.first_name} ${repair.client.last_name}`.toLowerCase();
    const clientPhone = repair.client.profile?.phone_number || "";
    
    const matchesSearch =
      clientName.includes(searchTerm.toLowerCase()) ||
      clientPhone.includes(searchTerm) ||
      String(repair.id).includes(searchTerm) ||
      (repair.brand?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
      (repair.model?.toLowerCase() || "").includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === "all" || repair.status === statusFilter
    const matchesDeviceType = deviceTypeFilter === "all" || repair.deviceType === deviceTypeFilter

    return matchesSearch && matchesStatus && matchesDeviceType
  })

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Rechercher..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Statut" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les statuts</SelectItem>
            <SelectItem value="saisie">Saisie</SelectItem>
            <SelectItem value="en-cours">En cours</SelectItem>
            <SelectItem value="prete">PrÃªte</SelectItem>
            <SelectItem value="en-attente">En attente</SelectItem>
          </SelectContent>
        </Select>
        <Select value={deviceTypeFilter} onValueChange={setDeviceTypeFilter}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les types</SelectItem>
            <SelectItem value="smartphone">Smartphone</SelectItem>
            <SelectItem value="tablet">Tablette</SelectItem>
            <SelectItem value="computer">Ordinateur</SelectItem>
            <SelectItem value="other">Autres</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:hidden">
        {filteredRepairs.map((repair) => (
          <RepairCard key={repair.id} repair={repair} onViewDetails={onViewDetails} />
        ))}
      </div>

      <div className="hidden lg:block rounded-lg border border-border bg-card">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-border bg-muted/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Appareil
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Client
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Panne(s)
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Prix
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Statut
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredRepairs.map((repair) => (
                <tr 
                  key={repair.id} 
                  className="hover:bg-muted/50 transition-colors cursor-pointer"
                  onClick={() => onViewDetails?.(repair)}
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">#{repair.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium">
                      {repair.brand} {repair.model}
                    </div>
                    <div className="text-xs text-muted-foreground capitalize">{repair.deviceType}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium">
                      {repair.client.first_name} {repair.client.last_name}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {repair.client.profile?.phone_number || "Pas de numÃ©ro"}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {(repair.issues || []).slice(0, 2).map((issue, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {issue}
                        </Badge>
                      ))}
                      {(repair.issues || []).length > 2 && (
                        <Badge variant="outline" className="text-xs">
                          +{(repair.issues || []).length - 2}
                        </Badge>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {repair.totalCost != null && typeof repair.totalCost === 'number' && !isNaN(repair.totalCost) ? (
                      <span className="text-sm font-semibold text-green-600 dark:text-green-400">
                        {repair.totalCost.toFixed(2)} â‚¬
                      </span>
                    ) : (
                      <span className="text-sm text-muted-foreground">{repair.totalCost}</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {repair.status && statusConfig[repair.status] ? (
                      <Badge className={statusConfig[repair.status].className}>
                        {statusConfig[repair.status].label}
                      </Badge>
                    ) : (
                      <Badge variant="outline">Inconnu</Badge>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                    {format(new Date(repair.created_at), "dd MMM yyyy", { locale: fr })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {filteredRepairs.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">Aucune rÃ©paration trouvÃ©e</div>
      )}
    </div>
  )
}
à+ à+ó+*cascade08
ó+ƒ, ƒ,–,*cascade08
–,Ä, Ä,Ó,*cascade08
Ó,Ô, Ô,Ÿ-*cascade08
Ÿ-¶D "(ee92897ce130bbc6228a42e5124115e2286dbf722cfile:///home/amine/coding/web/tek-mag/frontend/src/components/features/calendrier/repairs-table.tsx:.file:///home/amine/coding/web/tek-mag/frontend