export interface PreviewImage {
  base64?: string;
  uri?: string;
}

export interface CheckingImage extends PreviewImage {
  width: number;
  height: number;
}

export type SellProcessType = "NEW" | "MODIFY";
