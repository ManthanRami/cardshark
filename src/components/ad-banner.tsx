"use client"

import { useEffect, useRef, useState } from "react"
import { Card } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertTriangle, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface AdBannerProps {
  className?: string
  slot?: string
  format?: "auto" | "rectangle" | "vertical" | "horizontal"
  responsive?: boolean
  style?: {
    display?: string
    width?: string
    height?: string
  }
}

declare global {
  interface Window {
    adsbygoogle: any[]
  }
}

export function AdBanner({
  className,
  slot = "1234567890",
  format = "auto",
  responsive = true,
  style = { display: "block", width: "100%", height: "250px" },
}: AdBannerProps) {
  const adRef = useRef<HTMLDivElement>(null)
  const [adError, setAdError] = useState(false)
  const [adLoaded, setAdLoaded] = useState(false)
  const [isProduction, setIsProduction] = useState(false)

  useEffect(() => {
    setIsProduction(process.env.NODE_ENV === "production")
  }, [])

  useEffect(() => {
    if (!isProduction) return

    const loadAd = () => {
      try {
        if (window.adsbygoogle && adRef.current) {
          const existingAd = adRef.current.querySelector("ins")
          if (existingAd) {
            existingAd.remove()
          }

          const adElement = document.createElement("ins")
          adElement.className = "adsbygoogle"
          adElement.style.display = style.display || "block"
          adElement.style.width = style.width || "100%"
          adElement.style.height = style.height || "250px"
          adElement.setAttribute(
            "data-ad-client",
            process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID || "ca-pub-0000000000000000",
          )
          adElement.setAttribute("data-ad-slot", slot)
          adElement.setAttribute("data-ad-format", format)

          if (responsive) {
            adElement.setAttribute("data-full-width-responsive", "true")
          }

          adRef.current.appendChild(adElement)
          ;(window.adsbygoogle = window.adsbygoogle || []).push({})

          setAdLoaded(true)
          setAdError(false)
        }
      } catch (error) {
        console.error("AdSense error:", error)
        setAdError(true)
        setAdLoaded(false)
      }
    }

    const timer = setTimeout(loadAd, 100)
    return () => clearTimeout(timer)
  }, [slot, format, responsive, style, isProduction])

  const retryAd = () => {
    setAdError(false)
    setAdLoaded(false)

    const timer = setTimeout(() => {
      if (window.adsbygoogle && adRef.current) {
        try {
          ;(window.adsbygoogle = window.adsbygoogle || []).push({})
          setAdLoaded(true)
        } catch (error) {
          setAdError(true)
        }
      }
    }, 500)

    return () => clearTimeout(timer)
  }

  if (!isProduction) {
    return (
      <Card className={cn("overflow-hidden border-dashed border-slate-600/50 bg-slate-800/30", className)}>
        <div className="p-6">
          <div className="text-center text-slate-400">
            <div className="mb-3">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-slate-700/50 rounded-full mb-2">
                <span className="text-lg">📢</span>
              </div>
            </div>
            <p className="text-sm font-medium mb-1 text-slate-300">Advertisement Space</p>
            <p className="text-xs text-slate-500">Google AdSense integration ready</p>
            <div
              className="mt-4 bg-gradient-to-r from-slate-700/50 to-slate-600/50 rounded-lg flex items-center justify-center text-xs text-slate-400 border border-slate-600/30"
              style={{ height: style.height || "250px" }}
            >
              <div className="text-center">
                <div className="mb-2">🎯</div>
                <div>Ad Banner Placeholder</div>
                <div className="text-xs mt-1 opacity-75">
                  Slot: {slot} | Format: {format}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>
    )
  }

  return (
    <Card className={cn("overflow-hidden bg-slate-800/50 border-slate-700/50", className)}>
      <div className="relative">
        {adError && (
          <Alert className="m-4 border-red-500/20 bg-red-950/20">
            <AlertTriangle className="h-4 w-4 text-red-400" />
            <AlertDescription className="text-red-200">
              <div className="flex items-center justify-between">
                <span className="text-sm">Unable to load advertisement</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={retryAd}
                  className="ml-2 h-7 px-2 text-xs border-slate-600 text-slate-300 hover:bg-slate-700/50 bg-transparent"
                >
                  <RefreshCw className="h-3 w-3 mr-1" />
                  Retry
                </Button>
              </div>
            </AlertDescription>
          </Alert>
        )}

        {!adError && !adLoaded && (
          <div className="flex items-center justify-center p-8 bg-slate-900/50">
            <div className="text-center text-slate-400">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-400 mx-auto mb-2"></div>
              <p className="text-sm">Loading advertisement...</p>
            </div>
          </div>
        )}

        <div
          ref={adRef}
          className={cn("w-full transition-opacity duration-300", adLoaded ? "opacity-100" : "opacity-0")}
          style={{ minHeight: adError ? "0" : style.height }}
        />
      </div>
    </Card>
  )
}
