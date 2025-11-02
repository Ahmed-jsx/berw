import { useQuery } from "@tanstack/react-query";

export const useMerchQuery = () => {
  return useQuery({
    queryKey: ["merch"],
    queryFn: async () => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/merchants`
      );
      return response.json();
    },
  });
};
