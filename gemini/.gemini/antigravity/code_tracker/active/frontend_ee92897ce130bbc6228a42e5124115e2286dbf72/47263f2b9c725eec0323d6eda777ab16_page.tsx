å"use client";

import { useState, useEffect } from "react";
import { useReparationStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  CalendarIcon,
  Check,
  Smartphone,
  Tablet,
  Laptop,
  Monitor,
  Watch,
  Gamepad2,
  ChevronsUpDown,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { SharedHeader } from "@/components/shared/shared-header";
import { useDeviceTypes } from "@/hooks/use-device-types";
import { useBrands } from "@/hooks/use-brands";
import { useProductModels } from "@/hooks/use-product-models";
import { useCommonIssues } from "@/hooks/use-common-issues";

// Icon mapping for device types
const deviceTypeIcons: Record<string, React.ComponentType<any>> = {
  smartphone: Smartphone,
  tablet: Tablet,
  laptop: Laptop,
  desktop: Monitor,
  watch: Watch,
  console: Gamepad2,
};

export default function AddReparationPage() {
  const {
    deviceType,
    setDeviceType,
    brand,
    setBrand,
    model,
    setModel,
    issues,
    setIssues,
    description,
    setDescription,
    accessories,
    setAccessories,
    password,
    setPassword,
    depositReceived,
    setDepositReceived,
    scheduledDate,
    setScheduledDate,
    clientSearch,
    setClientSearch,
  } = useReparationStore();

  const [step, setStep] = useState(1);
  const [isScrolled, setIsScrolled] = useState(false);
  const [brandOpen, setBrandOpen] = useState(false);
  const [modelOpen, setModelOpen] = useState(false);

  // Fetch data from backend
  const {
    data: deviceTypesData,
    isLoading: isLoadingDeviceTypes,
    error: deviceTypesError
  } = useDeviceTypes();

  const {
    data: brandsData,
    isLoading: isLoadingBrands,
    error: brandsError
  } = useBrands();

  const {
    data: modelsData,
    isLoading: isLoadingModels,
    error: modelsError
  } = useProductModels(brand);

  const {
    data: commonIssuesData,
    isLoading: isLoadingCommonIssues,
    error: commonIssuesError
  } = useCommonIssues(deviceType);

  // Get device types, brands, and models from API data
  const deviceTypes = deviceTypesData?.results || [];
  const brands = brandsData?.results || [];
  const models = modelsData?.results || [];
  const commonIssues = (commonIssuesData || []).map(issue => issue.name); // Extract names from issues

  // Check if there were errors with any of the API calls
  const hasErrors = deviceTypesError || brandsError || modelsError || commonIssuesError;

  // Filter brands based on selected device type since brands might have deviceType associations
  const filteredBrands = deviceType
    ? brands.filter(brand => !brand.deviceTypes || brand.deviceTypes.includes(deviceType as any))
    : brands;

  // Filter models based on selected brand
  const filteredModels = brand
    ? models.filter(model => model.brandId === brand)
    : models;

  // Get brand name by ID
  const getBrandName = (brandId: string) => {
    const brandObj = brands.find(b => b.id === brandId);
    return brandObj ? brandObj.name : brandId;
  };

  // Get model name by ID
  const getModelName = (modelId: string) => {
    const modelObj = models.find(m => m.id === modelId);
    return modelObj ? modelObj.name : modelId;
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleIssue = (issue: string) => {
    if (issues.includes(issue)) {
      setIssues(issues.filter((i) => i !== issue));
    } else {
      setIssues([...issues, issue]);
    }
  };

  const canProceedStep1 = deviceType && brand && model;
  const canProceedStep2 = issues.length > 0;

  // Get brand name by ID
  const getBrandName = (brandId: string) => {
    const brandObj = brands.find(b => b.id === brandId);
    return brandObj ? brandObj.name : brandId;
  };

  // Get model name by ID
  const getModelName = (modelId: string) => {
    const modelObj = models.find(m => m.id === modelId);
    return modelObj ? modelObj.name : modelId;
  };

  // Check if we're still loading dependent data
  const isBrandLoadingForDevice = deviceType && isLoadingBrands;
  const isModelLoadingForBrand = brand && isLoadingModels;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Handle loading states
  if (isLoadingDeviceTypes) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin" />
          <p className="text-lg">Chargement des types d'appareils...</p>
        </div>
      </div>
    );
  }

  // Show errors if any
  if (hasErrors) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center p-4">
          <p className="text-lg text-red-600">Erreur de chargement des donn√©es</p>
          <p className="text-sm text-muted-foreground mt-2">Veuillez r√©essayer plus tard</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <SharedHeader
        title="Nouvelle R√©paration"
        showProgress={true}
        steps={[
          { num: 1, label: "Appareil" },
          { num: 2, label: "Probl√®mes" },
          { num: 3, label: "Client" },
        ]}
        currentStep={step}
      />

      {/* Main Content */}
      <div
        className={"container mx-auto mt-10 px-4 transition-all duration-300"}
      >
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form Area */}
          <div className="lg:col-span-2">
            <Card className="p-8">
              {/* Step 1: Device */}
              {step === 1 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-semibold mb-2">
                      Type d'appareil
                    </h2>
                    <p className="text-sm text-muted-foreground mb-4">
                      S√©lectionnez le type d'appareil √† r√©parer
                    </p>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {deviceTypes.map((type) => (
                      <button
                        key={type.id}
                        onClick={() => {
                          setDeviceType(type.id);
                          setBrand("");
                          setModel("");
                        }}
                        className={cn(
                          "flex flex-col items-center gap-3 p-4 rounded-lg border-2 transition-all hover:border-primary/50",
                          deviceType === type.id
                            ? "border-primary bg-primary/5"
                            : "border-border bg-card"
                        )}
                      >
                        {deviceTypeIcons[type.id] ? React.createElement(deviceTypeIcons[type.id], { className: "h-8 w-8" }) : <Smartphone className="h-8 w-8" />}
                        <span className="text-sm font-medium text-center">
                          {type.name}
                        </span>
                      </button>
                    ))}
                  </div>

                  {deviceType && (
                    <div className="grid gap-4 pt-4">
                      <div className="space-y-2">
                        <Label>Marque</Label>
                        <Popover open={brandOpen} onOpenChange={setBrandOpen}>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              role="combobox"
                              aria-expanded={brandOpen}
                              className="w-full justify-between"
                              disabled={isLoadingBrands} // Disable while loading brands
                            >
                              {isLoadingBrands ? (
                                <div className="flex items-center">
                                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                  Chargement...
                                </div>
                              ) : (
                                <>
                                  {brand ? getBrandName(brand) : "S√©lectionnez une marque..."}
                                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                </>
                              )}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-full p-0" align="start">
                            <Command>
                              <CommandInput placeholder="Rechercher une marque..." />
                              <CommandList>
                                {isLoadingBrands ? (
                                  <CommandItem disabled>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Chargement des marques...
                                  </CommandItem>
                                ) : (
                                  <>
                                    <CommandEmpty>
                                      Aucune marque trouv√©e.
                                    </CommandEmpty>
                                    <CommandGroup>
                                      {filteredBrands.map((b) => (
                                        <CommandItem
                                          key={b.id}
                                          value={b.name}
                                          onSelect={(currentValue) => {
                                            setBrand(
                                              currentValue === b.name ? "" : b.id
                                            );
                                            setModel("");
                                            setBrandOpen(false);
                                          }}
                                        >
                                          <Check
                                            className={cn(
                                              "mr-2 h-4 w-4",
                                              brand === b.id
                                                ? "opacity-100"
                                                : "opacity-0"
                                            )}
                                          />
                                          {b.name}
                                        </CommandItem>
                                      ))}
                                    </CommandGroup>
                                  </>
                                )}
                              </CommandList>
                            </Command>
                          </PopoverContent>
                        </Popover>
                      </div>

                      {brand && (
                        <div className="space-y-2">
                          <Label>Mod√®le</Label>
                          <Popover open={modelOpen} onOpenChange={setModelOpen}>
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                role="combobox"
                                aria-expanded={modelOpen}
                                className="w-full justify-between"
                                disabled={isLoadingModels} // Disable while loading models
                              >
                                {isLoadingModels ? (
                                  <div className="flex items-center">
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Chargement...
                                  </div>
                                ) : (
                                  <>
                                    {model ? getModelName(model) : "S√©lectionnez un mod√®le..."}
                                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                  </>
                                )}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent
                              className="w-full p-0"
                              align="start"
                            >
                              <Command>
                                <CommandInput placeholder="Rechercher un mod√®le..." />
                                <CommandList>
                                  {isLoadingModels ? (
                                    <CommandItem disabled>
                                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                      Chargement des mod√®les...
                                    </CommandItem>
                                  ) : (
                                    <>
                                      <CommandEmpty>
                                        Aucun mod√®le trouv√©.
                                      </CommandEmpty>
                                      <CommandGroup>
                                        {filteredModels.map((m) => (
                                          <CommandItem
                                            key={m.id}
                                            value={m.name}
                                            onSelect={(currentValue) => {
                                              setModel(
                                                currentValue === m.name ? "" : m.id
                                              );
                                              setModelOpen(false);
                                            }}
                                          >
                                            <Check
                                              className={cn(
                                                "mr-2 h-4 w-4",
                                                model === m.id
                                                  ? "opacity-100"
                                                  : "opacity-0"
                                              )}
                                            />
                                            {m.name}
                                          </CommandItem>
                                        ))}
                                      </CommandGroup>
                                    </>
                                  )}
                                </CommandList>
                              </Command>
                            </PopoverContent>
                          </Popover>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="flex justify-end pt-4">
                    <Button
                      onClick={() => setStep(2)}
                      disabled={!canProceedStep1 || isBrandLoadingForDevice || isModelLoadingForBrand}
                      size="lg"
                    >
                      {isBrandLoadingForDevice || isModelLoadingForBrand ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Chargement...
                        </>
                      ) : (
                        "Suivant"
                      )}
                    </Button>
                  </div>
                </div>
              )}

              {/* Step 2: Issues */}
              {step === 2 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-semibold mb-2">
                      Probl√®mes rencontr√©s
                    </h2>
                    <p className="text-sm text-muted-foreground mb-4">
                      S√©lectionnez tous les probl√®mes qui s'appliquent
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {isLoadingCommonIssues ? (
                      <div className="col-span-full flex items-center justify-center py-8">
                        <div className="flex flex-col items-center gap-2">
                          <Loader2 className="h-6 w-6 animate-spin" />
                          <p>Chargement des probl√®mes...</p>
                        </div>
                      </div>
                    ) : (
                      commonIssues.map((issue) => (
                        <button
                          key={issue}
                          onClick={() => toggleIssue(issue)}
                          className={cn(
                            "flex items-center gap-3 p-3 rounded-lg border-2 text-left transition-all hover:border-primary/50",
                            issues.includes(issue)
                              ? "border-primary bg-primary/5"
                              : "border-border bg-card"
                          )}
                        >
                          <div
                            className={cn(
                              "flex h-5 w-5 items-center justify-center rounded border-2 transition-colors",
                              issues.includes(issue)
                                ? "border-primary bg-primary"
                                : "border-muted-foreground/50"
                            )}
                          >
                            {issues.includes(issue) && (
                              <Check className="h-3 w-3 text-primary-foreground" />
                            )}
                          </div>
                          <span className="text-sm font-medium">{issue}</span>
                        </button>
                      ))
                    )}
                  </div>

                  <div className="space-y-4 pt-4">
                    <div className="space-y-2">
                      <Label htmlFor="description">Description d√©taill√©e</Label>
                      <Textarea
                        id="description"
                        placeholder="D√©crivez le probl√®me en d√©tail..."
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows={4}
                      />
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="accessories">Accessoires fournis</Label>
                        <Input
                          id="accessories"
                          placeholder="ex: Chargeur, √âtui..."
                          value={accessories}
                          onChange={(e) => setAccessories(e.target.value)}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="password">Code de d√©verrouillage</Label>
                        <Input
                          id="password"
                          placeholder="Code PIN ou mot de passe"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="deposit"
                          checked={depositReceived}
                          onCheckedChange={(checked) =>
                            setDepositReceived(checked as boolean)
                          }
                        />
                        <Label htmlFor="deposit" className="cursor-pointer">
                          Acompte re√ßu
                        </Label>
                      </div>

                      <div className="space-y-2">
                        <Label>Date pr√©vue</Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className={cn(
                                "w-full justify-start text-left font-normal",
                                !scheduledDate && "text-muted-foreground"
                              )}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {scheduledDate
                                ? scheduledDate.toLocaleDateString("fr-FR", {
                                    weekday: "long",
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                  })
                                : "S√©lectionner une date"}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <Calendar
                              mode="single"
                              selected={scheduledDate}
                              onSelect={setScheduledDate}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between pt-4">
                    <Button
                      onClick={() => setStep(1)}
                      variant="outline"
                      size="lg"
                    >
                      Retour
                    </Button>
                    <Button
                      onClick={() => setStep(3)}
                      disabled={!canProceedStep2}
                      size="lg"
                    >
                      Suivant
                    </Button>
                  </div>
                </div>
              )}

              {/* Step 3: Client */}
              {step === 3 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-semibold mb-2">
                      Informations client
                    </h2>
                    <p className="text-sm text-muted-foreground mb-4">
                      Recherchez un client existant ou cr√©ez-en un nouveau
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="search">Rechercher un client</Label>
                      <Input
                        id="search"
                        placeholder="Nom, t√©l√©phone ou email..."
                        value={clientSearch}
                        onChange={(e) => setClientSearch(e.target.value)}
                      />
                    </div>

                    <div className="text-center py-8 text-muted-foreground">
                      <p className="mb-4">Aucun client trouv√©</p>
                      <Button variant="outline">Cr√©er un nouveau client</Button>
                    </div>
                  </div>

                  <div className="flex justify-between pt-4">
                    <Button
                      onClick={() => setStep(2)}
                      variant="outline"
                      size="lg"
                    >
                      Retour
                    </Button>
                    <Button size="lg">Cr√©er la r√©paration</Button>
                  </div>
                </div>
              )}
            </Card>
          </div>

          {/* Summary Sidebar */}
          <div className="lg:col-span-1">
            <div
              className={cn(
                "sticky transition-all duration-300",
                isScrolled ? "top-24" : "top-32"
              )}
            >
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-6">R√©capitulatif</h3>

                <div className="space-y-6">
                  {/* Device Info */}
                  {deviceType && (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                        <div className="h-1 w-1 rounded-full bg-primary" />
                        APPAREIL
                      </div>
                      <div className="pl-3 space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Type</span>
                          <span className="font-medium">
                            {deviceTypes.find((d) => d.id === deviceType)?.name}
                          </span>
                        </div>
                        {brand && (
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">
                              Marque
                            </span>
                            <span className="font-medium">{getBrandName(brand)}</span>
                          </div>
                        )}
                        {model && (
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">
                              Mod√®le
                            </span>
                            <span className="font-medium">{getModelName(model)}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Issues */}
                  {issues.length > 0 && (
                    <>
                      <div className="h-px bg-border" />
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                          <div className="h-1 w-1 rounded-full bg-primary" />
                          PROBL√àMES ({issues.length})
                        </div>
                        <div className="pl-3 space-y-1">
                          {issues.map((issue) => (
                            <div
                              key={issue}
                              className="text-sm text-foreground"
                            >
                              ‚Ä¢ {issue}
                            </div>
                          ))}
                        </div>
                      </div>
                    </>
                  )}

                  {/* Additional Info */}
                  {(accessories || password || scheduledDate) && (
                    <>
                      <div className="h-px bg-border" />
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                          <div className="h-1 w-1 rounded-full bg-primary" />
                          D√âTAILS
                        </div>
                        <div className="pl-3 space-y-2">
                          {accessories && (
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">
                                Accessoires
                              </span>
                              <span className="font-medium">{accessories}</span>
                            </div>
                          )}
                          {password && (
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">
                                Code
                              </span>
                              <span className="font-medium">‚Ä¢‚Ä¢‚Ä¢‚Ä¢</span>
                            </div>
                          )}
                          {scheduledDate && (
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">
                                Date pr√©vue
                              </span>
                              <span className="font-medium">
                                {scheduledDate.toLocaleDateString("fr-FR")}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </>
                  )}

                  {/* Deposit Status */}
                  {depositReceived && (
                    <>
                      <div className="h-px bg-border" />
                      <div className="flex items-center justify-between rounded-lg bg-primary/10 p-3">
                        <span className="text-sm font-medium">
                          Acompte re√ßu
                        </span>
                        <Check className="h-4 w-4 text-primary" />
                      </div>
                    </>
                  )}
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
ù ù®
®£ £¶
¶ß ß®
®™ ™∞
∞ª ªº
ºΩ Ωæ
æ√ √≈
≈» »Õ
ÕŒ Œœ
œ— —‘
‘’ ’÷
÷◊ ◊Ÿ
Ÿ⁄ ⁄€
€‹ ‹›
›Á ÁË
ËÍ ÍÎ
ÎÌ ÌÓ
ÓÔ ÔÚ
ÚÛ ÛÙ
Ù˘ ˘˚
˚˛ ˛ˇ
ˇÄ ÄÅ
ÅÉ ÉÖ
Öã ãê
êó óò
òô ôõ
õù ùû
ûü ü¢
¢£ £§
§® ®©
©™ ™¨
¨∞ ∞≥
≥∂ ∂æ
æø ø¬
¬√ √≈
≈∆ ∆«
«À ÀÕ
ÕŒ Œ–
–— —“
“‘ ‘’
’◊ ◊ÿ
ÿŸ Ÿ‹
‹ﬂ ﬂ·
·„ „‰
‰Ê ÊÁ
ÁË ËÈ
ÈÎ ÎÏ
ÏÓ ÓÒ
ÒÛ ÛÙ
Ùı ıˆ
ˆ˘ ˘˚
˚˛ ˛ˇ
ˇÄ	 Ä	Å	
Å	Ç	 Ç	Ñ	
Ñ	Ü	 Ü	á	
á	à	 à	â	
â	ä	 ä	ç	
ç	é	 é	è	
è	ì	 ì	î	
î	ï	 ï	ó	
ó	ô	 ô	ö	
ö	ù	 ù	û	
û	ü	 ü	¢	
¢	£	 £	¶	
¶	ß	 ß	©	
©	™	 ™	´	
´	¥	 ¥	π	
π	∫	 ∫	ø	
ø	¿	 ¿	¡	
¡	“	 “	”	
”	’	 ’	Ÿ	
Ÿ	⁄	 ⁄	‹	
‹	‡	 ‡	‰	
‰	Â	 Â	Ê	
Ê	Ë	 Ë	Î	
Î	Ï	 Ï	Ì	
Ì	Ó	 Ó	Ô	
Ô	Û	 Û	Ù	
Ù	ˆ	 ˆ	˜	
˜	¯	 ¯	˘	
˘	˙	 ˙	˚	
˚	˛	 ˛	Å

Å
É
 É
Ö

Ö
ç
 ç
ê

ê
ë
 ë
ì

ì
î
 î
ò

ò
†
 †
°

°
§
 §
•

•
¶
 ¶
ß

ß
®
 ®
©

©
´
 ´
¨

¨
≥
 ≥
¥

¥
µ
 µ
∂

∂
∑
 ∑
∏

∏
π
 π
∫

∫
º
 º
Ω

Ω
ø
 ø
¿

¿
ƒ
 ƒ
«

«
…
 …
 

 
Ã
 Ã
Õ

Õ
Œ
 Œ
œ

œ
‘
 ‘
ÿ

ÿ
€
 €
‹

‹
›
 ›
‡

‡
·
 ·
‚

‚
‰
 ‰
Â

Â
Á
 Á
Ë

Ë
· 
·ü 
ü≠! 
≠!ø- 
ø-é< é<ü<
ü<§< §<»<
»<Ã< Ã<ˇ<
ˇ<ñ= ñ=ó=
ó=ÕC ÕC¶D
¶D«D «D¥G
¥G∫G ∫G—G
—GÒG ÒGıG
ıG“H “HóI
óIÇL ÇLÑO
ÑOìO ìOóO
óO—O —O”O
”OÛO ÛOıO
ıOÖP ÖPâP
âP⁄P ⁄PﬁP
ﬁPﬂP ﬂPËP
ËP˚P ˚P˝P
˝P°Q °Q£Q
£Q∞Q ∞Q¥Q
¥Q‡Q ‡Q„Q
„QãR ãRèR
èRóR óRúR
úRûR ûR†R
†R∆R ∆R»R
»RÊR ÊRÍR
ÍR∆S ∆S S
 S‹S ‹SﬁS
ﬁSﬂS ﬂS·S
·SÍS ÍSÌS
ÌSÓS ÓSS
SòT òTöT
öTùT ùT°T
°TˇT ˇTÉU
ÉUòU òUõU
õU¡U ¡U¬U
¬U≈U ≈U…U
…UïV ïVôV
ôV†V †V£V
£VÀV ÀVÃV
ÃV€V €VﬂV
ﬂV√W √W«W
«W“W “W’W
’W÷W ÷WŸW
ŸWÖX ÖXÜX
ÜXñX ñXöX
öX¸X ¸XÄY
ÄYÉY ÉYÜY
ÜY¨Y ¨Y≠Y
≠Y∞Y ∞Y¥Y
¥Y‹Y ‹Y·Y
·YáZ áZãZ
ãZöZ öZûZ
ûZ‰Z ‰ZËZ
ËZñ[ ñ[ﬂ[
ﬂ[≤a ≤açb
çb∞b ∞bÚb
ÚbÛb Ûb∞c
∞c±c ±c≤c
≤c¥c ¥c∏c
∏cπc πcõe
õeúe úe»e
»eËe ËeÏe
ÏeÀf Àfîg
îgÊj Êj˜m
˜mÜn Ünän
änÁn ÁnÎn
Înùo ùo°o
°o∞o ∞o¥o
¥oŸo Ÿo€o
€o‹o ‹oﬁo
ﬁoﬂo ﬂo‡o
‡o‰o ‰oÂo
Âoõp õpüp
üp¨p ¨p∞p
∞pﬁp ﬁp·p
·pãq ãqèq
èqóq óqúq
úqûq ûqüq
üq«q «q q
 qËq ËqÏq
ÏqÃr Ãr–r
–r‚r ‚rÊr
Êrr rÛr
ÛrÙr Ùrır
ırüs üs¢s
¢s•s •s©s
©sêt êtît
îtót ótòt
òtæt æt¡t
¡t√t √t«t
«t†u †u§u
§u≥u ≥u¥u
¥u‡u ‡u„u
„uÛu Ûu˜u
˜uÆv Æv±v
±v‡v ‡v‰v
‰vÙv Ùvˆv
ˆv§w §w¶w
¶w¥w ¥w∏w
∏wçx çxëx
ëxîx îxñx
ñxæx æx¿x
¿x¬x ¬x«x
«x…x …xÕx
Õx¶y ¶y™y
™yÆy Æy∞y
∞y“y “y‘y
‘yÑz Ñz—z
—z¸} ¸}±~
±~ˇ~ 	ˇ~ñÅñÅùÅ 
ùÅ∑Å∑Å…Ü 
…Ü˚â˚âØä 
Øä±ä±äπä 
πäªäªäﬂä 
ﬂä·ä·ä¥ã 
¥ã∂ã∂ã≈ã 
≈ã«ã«ã≈å 
≈å«å«åîç 
îçñçñç“ç 
“ç‘ç‘çÓç 
Óççç°é 
°é£é£é•é 
•éßéßéƒé 
ƒé∆é∆éãè 
ãèçèçè¯è 
¯è˙è˙èëê 
ëêìêìêÌê 
ÌêÔêÔê®ë 
®ë™ë™ë≠ë 
≠ëØëØë„ë 
„ëÂëÂëÇí 
ÇíÑíÑí÷í 
÷íÿíÿíçì 
çìèìèìñì 
ñìòìòìÂì 
ÂìÁìÁìõî 
õîùîùîûî 
ûî¥î¥î¨œ 
¨œπœπœæœ 
æœøœøœª“ 
ª“»“»“Õ“ 
Õ“Œ“Œ“å "(ee92897ce130bbc6228a42e5124115e2286dbf722^file:///home/amine/coding/web/tek-mag/frontend/src/app/%28dashboard%29/add-reparation/page.tsx:.file:///home/amine/coding/web/tek-mag/frontend