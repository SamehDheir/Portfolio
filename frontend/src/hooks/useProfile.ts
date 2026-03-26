import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { profileService } from '../services/profile.service';
import { toast } from 'react-hot-toast';

export const useProfile = () => {
  const queryClient = useQueryClient();

  const { data: user, isLoading } = useQuery({
    queryKey: ['my-profile'],
    queryFn: profileService.getMe,
    refetchOnWindowFocus: false,
  });

  const updateMutation = useMutation({
    mutationFn: profileService.update,
    onSuccess: (updatedUser) => {
      queryClient.setQueryData(['my-profile'], updatedUser);
      
      toast.success('Architecture Refactored! 🚀');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Deployment Failed');
    },
  });

  return { 
    user, 
    isLoading, 
    updateProfile: updateMutation.mutate, 
    isUpdating: updateMutation.isPending 
  };
};