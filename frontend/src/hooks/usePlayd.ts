import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { adminApi, gamesApi, libraryApi, profileApi, reviewsApi, statsApi } from "../api/playd";
import { LibraryStatus } from "../types";

export function useCatalog(q: string) {
  return useQuery({
    queryKey: ["games", q],
    queryFn: () => (q.trim() ? gamesApi.search(q) : gamesApi.catalog()),
    placeholderData: keepPreviousData,
  });
}

export function useGame(id: string | undefined) {
  return useQuery({ queryKey: ["game", id], queryFn: () => gamesApi.detail(id!), enabled: Boolean(id) });
}

export function useLibrary(status?: LibraryStatus | "all") {
  return useQuery({
    queryKey: ["library", status],
    queryFn: () => libraryApi.list(status),
    placeholderData: keepPreviousData,
  });
}

export function useLibraryMutations() {
  const queryClient = useQueryClient();
  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ["library"] });
    queryClient.invalidateQueries({ queryKey: ["stats"] });
    queryClient.invalidateQueries({ queryKey: ["games"] });
  };

  return {
    add: useMutation({
      mutationFn: ({ gameId, status }: { gameId: string; status: LibraryStatus }) => libraryApi.add(gameId, status),
      onSuccess: () => {
        toast.success("Added to library");
        invalidate();
      },
    }),
    update: useMutation({
      mutationFn: ({ id, status, finishedAt }: { id: string; status: LibraryStatus; finishedAt?: string | null }) =>
        libraryApi.update(id, status, finishedAt),
      onSuccess: () => {
        toast.success("Status updated");
        invalidate();
      },
    }),
    remove: useMutation({
      mutationFn: (id: string) => libraryApi.remove(id),
      onSuccess: () => {
        toast.success("Removed from library");
        invalidate();
      },
    }),
  };
}

export function useReview(gameId: string | undefined) {
  return useQuery({ queryKey: ["review", gameId], queryFn: () => reviewsApi.forGame(gameId!), enabled: Boolean(gameId) });
}

export function useMyReviews() {
  return useQuery({ queryKey: ["reviews"], queryFn: reviewsApi.mine });
}

export function useSaveReview() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: reviewsApi.save,
    onSuccess: (_data, variables) => {
      toast.success("Review saved");
      queryClient.invalidateQueries({ queryKey: ["review", variables.gameId] });
      queryClient.invalidateQueries({ queryKey: ["stats"] });
    },
  });
}

export function useStats() {
  return useQuery({ queryKey: ["stats"], queryFn: statsApi.mine });
}

export function useSteamImport() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: profileApi.steamImport,
    onSuccess: (report: any) => {
      toast.success(`Imported ${report.importedAmount}, failed ${report.failedImport}`);
      queryClient.invalidateQueries({ queryKey: ["library"] });
      queryClient.invalidateQueries({ queryKey: ["stats"] });
    },
  });
}

export function useAdminData() {
  return {
    users: useQuery({ queryKey: ["admin-users"], queryFn: adminApi.users }),
    reviews: useQuery({ queryKey: ["admin-reviews"], queryFn: adminApi.reviews }),
    games: useQuery({ queryKey: ["admin-games"], queryFn: () => gamesApi.catalog() }),
  };
}
