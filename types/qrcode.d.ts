declare module "qrcode" {
  export function toDataURL(
    text: string,
    options?: { width?: number; margin?: number; errorCorrectionLevel?: string }
  ): Promise<string>;

  export function toCanvas(
    canvas: HTMLCanvasElement,
    text: string,
    options?: { width?: number; margin?: number; errorCorrectionLevel?: string }
  ): Promise<void>;
}
