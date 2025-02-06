import { IVideo } from "@/models/Video";

type FetchOptions = {
  method: "GET" | "POST" | "PUT" | "DELETE";
  body?: any;
  headers?: Record<string, string>;
};
export type VideoFromData = Omit<IVideo, "_id">;
class ApiClient {
  private async fetch<T>(endpoint: string, options: FetchOptions): Promise<T> {
    const { method = "GET", body, headers = {} } = options;
    const defaultHeaders = {
      "Content-Type": "application/json",
      ...headers,
    };
    const response = await fetch(`/api/${endpoint}`, {
      method,
      headers: defaultHeaders,
      body: body ? JSON.stringify(body) : undefined,
    });
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }
    return response.json();
  }

  async getVideos() {
    return this.fetch<IVideo[]>("/videos", { method: "GET" });
  }
  async getVideo(id: string) {
    return this.fetch<IVideo>(`/videos/${id}`, { method: "GET" });
  }
  async createVideo(videoData: VideoFromData) {
    return this.fetch<IVideo>("/videos", { method: "POST", body: videoData });
  }
  async searchVideos(query: string) {
    return this.fetch<IVideo[]>(`/videos/search?q=${query}`, { method: "GET" });
  }
  async deleteVideo(id: string) {
    return this.fetch(`/videos/${id}`, { method: "DELETE" });
  }
  async updateVideo(id: string, video: IVideo) {
    return this.fetch(`/videos/${id}`, { method: "PUT", body: video });
  }
}

export const apiClient = new ApiClient();
