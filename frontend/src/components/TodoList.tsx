import { useState, useEffect } from "react"
import { TodoItem } from "./TodoItem"
import { AddTodo } from "./AddTodo"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle, Circle, ListTodo, TrendingUp, RotateCcw } from "lucide-react"
import { toast } from "sonner"
import { todoApi } from "@/lib/api"
import type { Todo } from "../types/todo"
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'

export function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all')
  const [sortMode, setSortMode] = useState<'priority' | 'custom'>('priority')

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const fetchTodos = async () => {
    try {
      // Fetch all todos without backend sorting since we sort on frontend
      const fetchedTodos = await todoApi.getTodos()
      setTodos(fetchedTodos)
    } catch (error) {
      console.error("Failed to fetch todos:", error)
      toast.error("Failed to load todos")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchTodos()
  }, [])

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event

    if (!over || active.id === over.id) {
      return
    }

    const oldIndex = sortedTodos.findIndex(todo => todo.id === active.id)
    const newIndex = sortedTodos.findIndex(todo => todo.id === over.id)

    if (oldIndex === -1 || newIndex === -1) {
      return
    }

    // Optimistically update the UI
    const newTodos = arrayMove(sortedTodos, oldIndex, newIndex)
    const reorderedIds = newTodos.map(todo => todo.id)

    // Switch to custom sort mode when user drags
    setSortMode('custom')

    try {
      // Update backend with new order
      const updatedTodos = await todoApi.reorderTodos(reorderedIds)
      setTodos(updatedTodos)
      toast.success("Todo order updated!")
    } catch (error) {
      console.error("Failed to reorder todos:", error)
      toast.error("Failed to update todo order")
      // Revert on error
      fetchTodos()
    }
  }



  const filteredTodos = todos.filter(todo => {
    switch (filter) {
      case 'active': return !todo.completed
      case 'completed': return todo.completed
      default: return true
    }
  })

  const completedCount = todos.filter(todo => todo.completed).length
  const activeCount = todos.filter(todo => !todo.completed).length
  const completionRate = todos.length > 0 ? Math.round((completedCount / todos.length) * 100) : 0

  // Sorting logic based on mode
  const sortedTodos = [...filteredTodos].sort((a, b) => {
    if (sortMode === 'custom') {
      // Custom order mode - sort by order field
      return (a.order || 0) - (b.order || 0);
    } else {
      // Priority mode - original priority-based sorting
      // First sort by completion status (incomplete todos first)
      if (a.completed !== b.completed) {
        return a.completed ? 1 : -1;
      }

      // Then sort by priority (high -> medium -> low)
      const priorityOrder: Record<string, number> = { high: 0, medium: 1, low: 2 };
      const priorityDiff = (priorityOrder[a.priority] ?? 99) - (priorityOrder[b.priority] ?? 99);
      if (priorityDiff !== 0) {
        return priorityDiff;
      }

      // Finally sort by creation date (newest first)
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
          <div className="text-muted-foreground">Loading your todos...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <AddTodo onTodoAdded={fetchTodos} />

      {/* Stats Cards */}
      {todos.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="border border-border/50 bg-card/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <ListTodo className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-xl font-semibold text-foreground">{todos.length}</p>
                  <p className="text-xs text-muted-foreground">Total</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-border/50 bg-card/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Circle className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-xl font-semibold text-foreground">{activeCount}</p>
                  <p className="text-xs text-muted-foreground">Active</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-border/50 bg-card/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-xl font-semibold text-foreground">{completedCount}</p>
                  <p className="text-xs text-muted-foreground">Done</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-border/50 bg-card/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <TrendingUp className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-xl font-semibold text-foreground">{completionRate}%</p>
                  <p className="text-xs text-muted-foreground">Progress</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Sort Mode Toggle */}
      <div className="flex items-center justify-center mb-4">
        <div className="flex gap-2 p-1 bg-muted/50 rounded-lg">
          <Button
            variant={sortMode === 'priority' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setSortMode('priority')}
            className={sortMode === 'priority' ? 'bg-background shadow-sm' : 'hover:bg-background/50'}
          >
            <TrendingUp className="h-4 w-4 mr-2" />
            Priority Sort
          </Button>
          <Button
            variant={sortMode === 'custom' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setSortMode('custom')}
            className={sortMode === 'custom' ? 'bg-background shadow-sm' : 'hover:bg-background/50'}
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Custom Order
          </Button>
        </div>
      </div>

      {/* Filter Buttons */}
      <div className="flex items-center justify-center">
        <div className="flex gap-1 p-1 bg-muted/50 rounded-lg">
          <Button
            variant={filter === 'all' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setFilter('all')}
            className={filter === 'all' ? 'bg-background shadow-sm' : 'hover:bg-background/50'}
          >
            <ListTodo className="h-4 w-4 mr-2" />
            All ({todos.length})
          </Button>
          <Button
            variant={filter === 'active' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setFilter('active')}
            className={filter === 'active' ? 'bg-background shadow-sm' : 'hover:bg-background/50'}
          >
            <Circle className="h-4 w-4 mr-2" />
            Active ({activeCount})
          </Button>
          <Button
            variant={filter === 'completed' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setFilter('completed')}
            className={filter === 'completed' ? 'bg-background shadow-sm' : 'hover:bg-background/50'}
          >
            <CheckCircle className="h-4 w-4 mr-2" />
            Done ({completedCount})
          </Button>
        </div>
      </div>

      {/* Todo List */}
      <div className="space-y-3">
        {sortedTodos.length === 0 ? (
          <Card className="border-dashed border-2 border-border/50">
            <CardContent className="p-12">
              <div className="text-center">
                <div className="mx-auto h-12 w-12 text-muted-foreground mb-4">
                  {filter === 'all' && <ListTodo className="h-12 w-12" />}
                  {filter === 'active' && <Circle className="h-12 w-12" />}
                  {filter === 'completed' && <CheckCircle className="h-12 w-12" />}
                </div>
                <h3 className="text-lg font-medium text-foreground mb-2">
                  {filter === 'all' && "No todos yet"}
                  {filter === 'active' && "No active todos"}
                  {filter === 'completed' && "No completed todos"}
                </h3>
                <p className="text-muted-foreground">
                  {filter === 'all' && "Create your first todo to get started"}
                  {filter === 'active' && "All your todos are completed"}
                  {filter === 'completed' && "Complete some todos to see them here"}
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext items={sortedTodos.map(todo => todo.id)} strategy={verticalListSortingStrategy}>
              <div className="space-y-3">
                {sortedTodos.map(todo => (
                  <TodoItem
                    key={todo.id}
                    todo={todo}
                    onTodoUpdated={fetchTodos}
                    onTodoDeleted={fetchTodos}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        )}
      </div>
    </div>
  )
}
