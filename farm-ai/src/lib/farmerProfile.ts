export interface FarmerSettings {
  fullName: string;
  location: string;
  farmSize: string;
  primaryCrop: string;
  language: string;
  pushNotifications: boolean;
  smsAlerts: boolean;
  aiDataConsent: boolean;
  currency: string;
  irrigationType: string;
  sowingDate: string;
  budgetBand: string;
}

export const FARM_SETTINGS_KEY = "farm_ai_settings";

export const defaultFarmerSettings: FarmerSettings = {
  fullName: "",
  location: "",
  farmSize: "",
  primaryCrop: "",
  language: "English",
  pushNotifications: true,
  smsAlerts: false,
  aiDataConsent: true,
  currency: "INR",
  irrigationType: "Canal",
  sowingDate: "",
  budgetBand: "Medium",
};

export const requiredOnboardingFields: Array<keyof FarmerSettings> = [
  "fullName",
  "location",
  "farmSize",
  "primaryCrop",
  "irrigationType",
  "sowingDate",
  "budgetBand",
];

export function mergeFarmerSettings(input?: Partial<FarmerSettings> | null): FarmerSettings {
  return {
    ...defaultFarmerSettings,
    ...(input || {}),
  };
}

export function isOnboardingComplete(input?: Partial<FarmerSettings> | null): boolean {
  const settings = mergeFarmerSettings(input);
  return requiredOnboardingFields.every((field) => {
    const value = settings[field];
    return typeof value === "string" ? value.trim().length > 0 : Boolean(value);
  });
}

export function loadFarmerSettingsLocal(): FarmerSettings {
  if (typeof window === "undefined") return defaultFarmerSettings;
  try {
    const raw = localStorage.getItem(FARM_SETTINGS_KEY);
    if (!raw) return defaultFarmerSettings;
    return mergeFarmerSettings(JSON.parse(raw));
  } catch {
    return defaultFarmerSettings;
  }
}

export function saveFarmerSettingsLocal(settings: FarmerSettings) {
  if (typeof window === "undefined") return;
  localStorage.setItem(FARM_SETTINGS_KEY, JSON.stringify(settings));
}
