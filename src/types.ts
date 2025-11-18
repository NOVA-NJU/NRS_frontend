export interface RagSource {
  text: string;
  url: string;
  title: string;
}

export interface RagResponse {
  code: string;
  answer: string;
  sources: RagSource[];
}
