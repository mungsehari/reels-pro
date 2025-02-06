import { apiClient } from "@/lib/api-client";
import { IVideo } from "@/models/Video";
import { useEffect, useState } from "react";

export default function Home() {
  const [video, setVideo] = useState<IVideo[]>([]);

  useEffect(() => {
    const feachVideos = async () => {
      try {
        const data = await apiClient.getVideos();
        setVideo(data);
      } catch (error) {
        console.error("Failed to fetch videos:", error);
      }
    };
    feachVideos();
  }, []);
  return (
    <div>
      <h1>CodeMitra</h1>
    </div>
  );
}
