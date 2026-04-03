import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@shared/routes";
import { type InsertRoadmap, type Roadmap } from "@shared/schema";

export function useRoadmaps() {
  return useQuery<Roadmap[]>({
    queryKey: [api.roadmap.list.path],
    queryFn: async () => {
      const res = await fetch(api.roadmap.list.path);
      if (!res.ok) throw new Error("Failed to fetch roadmaps");
      return res.json();
    },
  });
}

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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.roadmap.list.path] });
    },
  });
}
