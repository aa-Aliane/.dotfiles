�M'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Check, Search, ChevronRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useAddReparationStore } from '@/store/addReparationStore';
import { useRouter } from 'next/navigation';
import { useClients } from '@/hooks/use-clients';
import type { Client } from '@/types';

interface ClientStepProps {
  onFormSubmit?: () => void;
}

export function ClientStep({ onFormSubmit }: ClientStepProps) {
  const { formData, setFormData, submitForm } = useAddReparationStore();
  const router = useRouter();
  const { data: clientsData } = useClients();
  const clients = clientsData?.results || [];

  const [clientSearch, setClientSearch] = useState("");
  const [selectedClient, setSelectedClient] = useState<Client | null>(formData.client);
  const [newClient, setNewClient] = useState({
    firstName: formData.newClient.firstName,
    lastName: formData.newClient.lastName,
    phone: formData.newClient.phone,
    email: formData.newClient.email,
  });
  const [showClientDropdown, setShowClientDropdown] = useState(false);

  useEffect(() => {
    if (formData.client) setSelectedClient(formData.client);
    setNewClient({
      firstName: formData.newClient.firstName,
      lastName: formData.newClient.lastName,
      phone: formData.newClient.phone,
      email: formData.newClient.email,
    });
  }, [formData.client, formData.newClient]);

  const searchedClients = clientSearch
    ? clients.filter((c) => {
        const fullName = `${c.first_name} ${c.last_name}`.toLowerCase();
        const phone = c.profile?.phone_number || "";
        return (
          fullName.includes(clientSearch.toLowerCase()) ||
          phone.includes(clientSearch)
        );
      })
    : [];

  const handleSubmit = async () => {
    // Prepare final form data
    const finalData = {
      ...formData,
      client: selectedClient,
      newClient: selectedClient ? formData.newClient : newClient,
    };

    setFormData(finalData);
    await submitForm();
    // Navigate back to the calendar after successful submission
    router.push('/dashboard/calendrier');
  };

  const handlePrev = () => {
    // Update form data with current state before navigating back
    setFormData({
      client: selectedClient,
      newClient,
    });
    // Navigate to the previous step
    router.push('/add-reparation/issues');
  };

  const canSubmit = () => {
    return (
      selectedClient || (newClient.firstName && newClient.lastName && newClient.phone)
    );
  };

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-card-foreground">
            Informations Client
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Recherchez un client existant ou créez-en un nouveau
          </p>
        </div>
        {(selectedClient || (newClient.firstName && newClient.lastName && newClient.phone)) && (
          <Badge variant="default" className="gap-1.5">
            <Check className="h-3.5 w-3.5" />
            Complété
          </Badge>
        )}
      </div>

      {!selectedClient ? (
        <div className="space-y-4">
          {/* Client Search */}
          <div className="space-y-2 relative">
            <Label
              htmlFor="client-search"
              className="text-sm font-medium text-card-foreground"
            >
              Rechercher un client
            </Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="client-search"
                placeholder="Nom ou numéro de téléphone..."
                value={clientSearch}
                onChange={(e) => {
                  setClientSearch(e.target.value);
                  setShowClientDropdown(e.target.value.length > 0);
                }}
                onFocus={() =>
                  setShowClientDropdown(clientSearch.length > 0)
                }
                className="pl-9"
              />
            </div>

            {showClientDropdown && searchedClients.length > 0 && (
              <div className="absolute z-10 w-full mt-1 bg-popover border border-border rounded-lg shadow-lg max-h-64 overflow-y-auto">
                {searchedClients.map((client) => (
                  <button
                    key={client.id}
                    onClick={() => {
                      setSelectedClient(client);
                      setClientSearch("");
                      setShowClientDropdown(false);
                    }}
                    className="w-full p-3 text-left hover:bg-muted transition-colors border-b border-border last:border-0"
                  >
                    <div className="font-medium text-popover-foreground">
                      {client.first_name} {client.last_name}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {client.profile?.phone_number}
                    </div>
                    {client.email && (
                      <div className="text-sm text-muted-foreground">
                        {client.email}
                      </div>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">
                Ou créer un nouveau client
              </span>
            </div>
          </div>

          {/* New Client Form */}
          <div className="space-y-4 pt-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label
                  htmlFor="firstName"
                  className="text-sm font-medium text-card-foreground"
                >
                  Prénom <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="firstName"
                  value={newClient.firstName}
                  onChange={(e) =>
                    setNewClient({ ...newClient, firstName: e.target.value })
                  }
                  placeholder="Jean"
                />
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="lastName"
                  className="text-sm font-medium text-card-foreground"
                >
                  Nom <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="lastName"
                  value={newClient.lastName}
                  onChange={(e) =>
                    setNewClient({ ...newClient, lastName: e.target.value })
                  }
                  placeholder="Dupont"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="phone"
                className="text-sm font-medium text-card-foreground"
              >
                Téléphone <span className="text-destructive">*</span>
              </Label>
              <Input
                id="phone"
                value={newClient.phone}
                onChange={(e) =>
                  setNewClient({
                    ...newClient,
                    phone: e.target.value,
                  })
                }
                placeholder="06 12 34 56 78"
              />
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="email"
                className="text-sm font-medium text-card-foreground"
              >
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={newClient.email}
                onChange={(e) =>
                  setNewClient({
                    ...newClient,
                    email: e.target.value,
                  })
                }
                placeholder="jean.dupont@exemple.com"
              />
            </div>
          </div>
        </div>
      ) : (
        <div className="rounded-lg border-2 border-primary bg-primary/5 p-4">
          <div className="flex items-start justify-between">
            <div>
              <div className="font-semibold text-card-foreground text-lg">
                {selectedClient.first_name} {selectedClient.last_name}
              </div>
              <div className="text-sm text-muted-foreground mt-1">
                {selectedClient.profile?.phone_number}
              </div>
              {selectedClient.email && (
                <div className="text-sm text-muted-foreground">
                  {selectedClient.email}
                </div>
              )}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedClient(null)}
              className="text-primary hover:text-primary"
            >
              Changer
            </Button>
          </div>
        </div>
      )}

      <div className="flex justify-between mt-8">
        <Button variant="outline" onClick={handlePrev}>
          Précédent
        </Button>
        <Button onClick={handleSubmit} disabled={!canSubmit()}>
          Créer la réparation
          <ChevronRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </>
  );
}�M"(ee92897ce130bbc6228a42e5124115e2286dbf722\file:///home/amine/coding/web/tek-mag/frontend/src/components/add-reparation/client-step.tsx:.file:///home/amine/coding/web/tek-mag/frontend