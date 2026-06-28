"use client";

import {
  Check,
  ChevronDown,
  ChevronUp,
  Copy,
  Download,
  Loader2,
} from "lucide-react";
import QRCode from "qrcode";
import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function QRCodeGenerator() {
  const [text, setText] = useState("");
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showOptions, setShowOptions] = useState(false);

  // Customization options
  const [width, setWidth] = useState(300);
  const [scale, setScale] = useState(4);
  const [darkColor, setDarkColor] = useState("#000000");
  const [lightColor, setLightColor] = useState("#FFFFFF");
  const [quietZone, setQuietZone] = useState(4);

  // Generate QR code whenever text or options change
  const generateQRCode = useCallback(
    async (value: string) => {
      if (!value.trim()) {
        setQrCode(null);
        return;
      }

      try {
        setIsLoading(true);
        const dataUrl = await QRCode.toDataURL(value, {
          width,
          scale,
          margin: quietZone,
          color: {
            dark: darkColor,
            light: lightColor,
          },
        });
        setQrCode(dataUrl);
      } catch (error) {
        console.error("Error generating QR code:", error);
        setQrCode(null);
      } finally {
        setIsLoading(false);
      }
    },
    [width, scale, darkColor, lightColor, quietZone],
  );

  useEffect(() => {
    generateQRCode(text);
  }, [text, generateQRCode]);

  const handleDownload = () => {
    if (!qrCode) return;

    const link = document.createElement("a");
    link.href = qrCode;
    link.download = "qrcode.png";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCopy = async () => {
    if (!qrCode) return;

    try {
      await navigator.clipboard.writeText(qrCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Error copying to clipboard:", error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-background to-background/95 p-4">
      <Card className="w-full max-w-2xl shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">
            QR Code Generator
          </CardTitle>
          <CardDescription>
            Enter text to generate a customizable QR code
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Input Section */}
          <div className="space-y-2">
            <Label htmlFor="text-input" className="text-sm font-medium">
              Text or URL
            </Label>
            <Input
              id="text-input"
              type="text"
              placeholder="Enter text or URL..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="h-10"
            />
          </div>

          {/* Customization Options Section */}
          <div className="border border-slate-200 dark:border-slate-800 rounded-lg">
            <button
              type="button"
              onClick={() => setShowOptions(!showOptions)}
              className="w-full flex items-center justify-between px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors"
            >
              <span className="font-medium text-sm">Customize Appearance</span>
              {showOptions ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </button>

            {showOptions && (
              <div className="border-t border-slate-200 dark:border-slate-800 p-4 space-y-4">
                {/* Width Input */}
                <div className="space-y-2">
                  <Label htmlFor="width-input" className="text-sm font-medium">
                    Width (px): {width}
                  </Label>
                  <Input
                    id="width-input"
                    type="number"
                    min="100"
                    max="1000"
                    value={width}
                    onChange={(e) => setWidth(parseInt(e.target.value) || 300)}
                    className="h-9"
                  />
                </div>

                {/* Scale Input */}
                <div className="space-y-2">
                  <Label htmlFor="scale-input" className="text-sm font-medium">
                    Scale Factor: {scale}
                  </Label>
                  <Input
                    id="scale-input"
                    type="number"
                    min="1"
                    max="20"
                    value={scale}
                    onChange={(e) => setScale(parseInt(e.target.value) || 4)}
                    className="h-9"
                  />
                  <p className="text-xs text-slate-500">
                    Controls the size of each module (pixel)
                  </p>
                </div>

                {/* Quiet Zone Input */}
                <div className="space-y-2">
                  <Label htmlFor="qzone-input" className="text-sm font-medium">
                    Quiet Zone (margin): {quietZone}
                  </Label>
                  <Input
                    id="qzone-input"
                    type="number"
                    min="0"
                    max="20"
                    value={quietZone}
                    onChange={(e) =>
                      setQuietZone(parseInt(e.target.value) || 4)
                    }
                    className="h-9"
                  />
                </div>

                {/* Dark Color Input */}
                <div className="space-y-2">
                  <Label
                    htmlFor="dark-color-input"
                    className="text-sm font-medium"
                  >
                    Dark Color (Hex)
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      id="dark-color-input"
                      type="text"
                      placeholder="#000000"
                      value={darkColor}
                      onChange={(e) => setDarkColor(e.target.value)}
                      className="h-9 flex-1"
                    />
                    <input
                      type="color"
                      value={darkColor}
                      onChange={(e) => setDarkColor(e.target.value)}
                      className="h-9 w-12 rounded cursor-pointer border border-slate-300 dark:border-slate-600"
                    />
                  </div>
                </div>

                {/* Light Color Input */}
                <div className="space-y-2">
                  <Label
                    htmlFor="light-color-input"
                    className="text-sm font-medium"
                  >
                    Light Color (Hex)
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      id="light-color-input"
                      type="text"
                      placeholder="#FFFFFF"
                      value={lightColor}
                      onChange={(e) => setLightColor(e.target.value)}
                      className="h-9 flex-1"
                    />
                    <input
                      type="color"
                      value={lightColor}
                      onChange={(e) => setLightColor(e.target.value)}
                      className="h-9 w-12 rounded cursor-pointer border border-slate-300 dark:border-slate-600"
                    />
                  </div>
                </div>

                {/* Reset Button */}
                <Button
                  variant="outline"
                  onClick={() => {
                    setWidth(300);
                    setScale(4);
                    setDarkColor("#000000");
                    setLightColor("#FFFFFF");
                    setQuietZone(4);
                  }}
                  className="w-full"
                >
                  Reset to Defaults
                </Button>
              </div>
            )}
          </div>

          {/* QR Code Display Section */}
          {isLoading ? (
            <div className="flex items-center justify-center h-64 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800">
              <div className="flex flex-col items-center gap-2">
                <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
                <p className="text-sm text-slate-500">Generating QR code...</p>
              </div>
            </div>
          ) : qrCode ? (
            <div className="flex flex-col items-center gap-4">
              <div className="flex items-center justify-center bg-white rounded-lg border-2 border-slate-200 dark:bg-slate-950 dark:border-slate-800 p-4">
                <img
                  src={qrCode}
                  alt="Generated QR Code"
                  style={{ maxWidth: `${width}px`, maxHeight: `${width}px` }}
                  className="object-contain"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 w-full">
                <Button
                  onClick={handleDownload}
                  className="flex-1 gap-2"
                  variant="default"
                >
                  <Download className="w-4 h-4" />
                  Download
                </Button>
                <Button
                  onClick={handleCopy}
                  variant="outline"
                  className="flex-1 gap-2"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4" />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      Copy
                    </>
                  )}
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-64 bg-slate-50 dark:bg-slate-900 rounded-lg border-2 border-dashed border-slate-300 dark:border-slate-700">
              <p className="text-center text-slate-500 text-sm">
                Enter text above to generate a QR code
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
