import React, { createContext, useState, useCallback, useEffect } from "react";

interface BannerContextType {
  bannerUrl: string | null;
  setBannerUrl: (url: string | null) => void;
  previewUrl: string | null;
  setPreviewUrl: (url: string | null) => void;
  publishBanner: (url: string) => void;
}

export const BannerContext = createContext<BannerContextType | undefined>(undefined);

export const BannerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [bannerUrl, setBannerUrlState] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("mockBanner");
    if (saved) {
      setBannerUrlState(saved);
    }
  }, []);

  const setBannerUrl = useCallback((url: string | null) => {
    setBannerUrlState(url);
  }, []);

  const publishBanner = useCallback((url: string) => {
    setBannerUrlState(url);
    localStorage.setItem("mockBanner", url);
  }, []);

  return (
    <BannerContext.Provider value={{ bannerUrl, setBannerUrl, previewUrl, setPreviewUrl, publishBanner }}>
      {children}
    </BannerContext.Provider>
  );
};
