import { useState } from "react";
import { Plus, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { getImageUrl, getTimeAgo } from "@/lib/utils";
import type { DesignBoard, Photo } from "@shared/schema";

export default function DesignBoards() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newBoardName, setNewBoardName] = useState('');
  const [newBoardDescription, setNewBoardDescription] = useState('');
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: boards = [] } = useQuery<DesignBoard[]>({
    queryKey: ['/api/boards'],
  });

  const createMutation = useMutation({
    mutationFn: async (boardData: { name: string; description?: string }) => {
      const response = await apiRequest('POST', '/api/boards', {
        ...boardData,
        userId: 1
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/boards'] });
      toast({
        title: "Board created",
        description: "Your design board has been created successfully.",
      });
      setIsCreateOpen(false);
      setNewBoardName('');
      setNewBoardDescription('');
    },
    onError: (error) => {
      toast({
        title: "Creation failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (boardId: number) => {
      await apiRequest('DELETE', `/api/boards/${boardId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/boards'] });
      toast({
        title: "Board deleted",
        description: "The design board has been removed successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Delete failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleCreateBoard = () => {
    if (!newBoardName.trim()) return;
    
    createMutation.mutate({
      name: newBoardName.trim(),
      description: newBoardDescription.trim() || undefined
    });
  };

  // Sample board photos for demonstration
  const getSamplePhotos = (boardId: number) => {
    const samplePhotos = [
      'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=150',
      'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=150',
      'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=150'
    ];
    return samplePhotos.slice(0, Math.min(3, boardId + 1));
  };

  return (
    <section id="designs" className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-12">
          <div>
            <h3 className="text-3xl font-bold text-primary mb-4">My Design Boards</h3>
            <p className="text-lg text-secondary">Organize your ideas into collections</p>
          </div>
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button className="bg-accent text-white hover:bg-accent/90">
                <Plus className="mr-2 h-4 w-4" />
                Create Board
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Create New Design Board</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label htmlFor="board-name" className="text-sm font-medium text-gray-700 block mb-2">
                    Board Name
                  </label>
                  <Input
                    id="board-name"
                    placeholder="Enter board name..."
                    value={newBoardName}
                    onChange={(e) => setNewBoardName(e.target.value)}
                  />
                </div>
                <div>
                  <label htmlFor="board-description" className="text-sm font-medium text-gray-700 block mb-2">
                    Description (Optional)
                  </label>
                  <Textarea
                    id="board-description"
                    placeholder="Describe your design vision..."
                    value={newBoardDescription}
                    onChange={(e) => setNewBoardDescription(e.target.value)}
                    rows={3}
                  />
                </div>
                <div className="flex gap-2">
                  <Button 
                    onClick={handleCreateBoard}
                    className="flex-1 bg-accent text-white hover:bg-accent/90"
                    disabled={!newBoardName.trim() || createMutation.isPending}
                  >
                    {createMutation.isPending ? 'Creating...' : 'Create Board'}
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => setIsCreateOpen(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Existing Design Boards */}
          {boards.map((board, index) => {
            const samplePhotos = getSamplePhotos(index);
            return (
              <div key={board.id} className="bg-gray-50 rounded-xl p-6 hover:shadow-lg transition-shadow cursor-pointer border border-gray-200">
                <div className="flex justify-between items-start mb-4">
                  <h4 className="text-xl font-semibold text-primary">{board.name}</h4>
                  <div className="flex space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-gray-400 hover:text-accent"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-gray-400 hover:text-red-500"
                      onClick={() => deleteMutation.mutate(board.id)}
                      disabled={deleteMutation.isPending}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 mb-4">
                  {samplePhotos.map((photo, photoIndex) => (
                    <img
                      key={photoIndex}
                      src={photo}
                      alt={`Design ${photoIndex + 1}`}
                      className="w-full h-20 object-cover rounded"
                    />
                  ))}
                  {samplePhotos.length < 4 && (
                    <div className="bg-gray-200 rounded flex items-center justify-center text-gray-500 text-sm">
                      <span>+{Math.max(0, 5 - samplePhotos.length)} more</span>
                    </div>
                  )}
                </div>
                <p className="text-sm text-secondary">
                  {samplePhotos.length} images • Updated {getTimeAgo(board.updatedAt)}
                </p>
                {board.description && (
                  <p className="text-sm text-gray-600 mt-2">{board.description}</p>
                )}
              </div>
            );
          })}

          {/* Create New Board Card */}
          <div
            onClick={() => setIsCreateOpen(true)}
            className="border-2 border-dashed border-gray-300 rounded-xl p-6 hover:border-accent transition-colors cursor-pointer flex flex-col items-center justify-center min-h-[200px]"
          >
            <Plus className="h-12 w-12 text-gray-400 mb-4" />
            <h4 className="text-lg font-semibold text-secondary mb-2">Create New Board</h4>
            <p className="text-sm text-gray-500 text-center">Start organizing your design ideas</p>
          </div>
        </div>
      </div>
    </section>
  );
}
