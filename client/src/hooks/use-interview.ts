import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, type InsertInterview } from "@shared/routes";

export function useInterviews() {
  return useQuery({
    queryKey: [api.interview.list.path],
    queryFn: async () => {
      const res = await fetch(api.interview.list.path);
      if (!res.ok) throw new Error("Failed to fetch interviews");
      return res.json();
    },
  });
}

export function useStartInterview() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: InsertInterview) => {
      const res = await fetch(api.interview.start.path, {
        method: api.interview.start.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to start interview");
      }
      
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.interview.list.path] });
    },
  });
}
