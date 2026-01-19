import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api, type InsertRoadmap } from "@shared/routes";

export function useGenerateRoadmap() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: InsertRoadmap) => {
      const res = await fetch(api.roadmap.generate.path, {
        method: api.roadmap.generate.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to generate roadmap");
      }
      
      return res.json();
    },
    // We don't necessarily need to invalidate queries here if we just display the result,
    // but if we had a list of saved roadmaps, we would.
  });
}
