import { useState } from "react"
import { Trash2, Edit3, Check, X, AlertCircle, Circle, Zap, Calendar, GripVertical } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { todoApi } from "@/lib/api"
import type { Todo } from "../types/todo"
import { cn } from "@/lib/utils"
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

interface TodoItemProps {
  todo: Todo
  onTodoUpdated: () => void
  onTodoDeleted: () => void
}

const priorityOptions = [
  { value: "low", label: "Low", icon: Circle, color: "text-green-600 dark:text-green-400" },
  { value: "medium", label: "Medium", icon: AlertCircle, color: "text-yellow-600 dark:text-yellow-400" },
  { value: "high", label: "High", icon: Zap, color: "text-red-600 dark:text-red-400" },
]

export function TodoItem({ todo, onTodoUpdated, onTodoDeleted }: TodoItemProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editTitle, setEditTitle] = useState(todo.title)
  const [editDescription, setEditDescription] = useState(todo.description || "")
  const [editPriority, setEditPriority] = useState<"low" | "medium" | "high">(todo.priority)
  const [isLoading, setIsLoading] = useState(false)

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: todo.id })

  const handleToggleComplete = async () => {
    setIsLoading(true)
    try {
      await todoApi.toggleTodo(todo.id)
      onTodoUpdated()
      toast.success(todo.completed ? "Todo marked as incomplete" : "Todo completed! 🎉")
    } catch (error) {
      console.error("Failed to toggle todo:", error)
      toast.error("Failed to update todo")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSaveEdit = async () => {
    if (!editTitle.trim()) {
      toast.error("Title cannot be empty")
      return
    }

    setIsLoading(true)
    try {
      await todoApi.updateTodo(todo.id, {
        title: editTitle.trim(),
        description: editDescription.trim() || undefined,
        priority: editPriority
      })
      setIsEditing(false)
      onTodoUpdated()
      toast.success("Todo updated successfully!")
    } catch (error) {
      console.error("Failed to update todo:", error)
      toast.error("Failed to update todo")
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancelEdit = () => {
    setEditTitle(todo.title)
    setEditDescription(todo.description || "")
    setEditPriority(todo.priority)
    setIsEditing(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      handleCancelEdit()
    } else if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      handleSaveEdit()
    }
  }

  const handleDelete = async () => {
    setIsLoading(true)
    try {
      await todoApi.deleteTodo(todo.id)
      onTodoDeleted()
      toast.success("Todo deleted successfully")
    } catch (error) {
      console.error("Failed to delete todo:", error)
      toast.error("Failed to delete todo")
    } finally {
      setIsLoading(false)
    }
  }

  const currentPriority = priorityOptions.find(p => p.value === todo.priority) || priorityOptions[1]
  const PriorityIcon = currentPriority.icon

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className={cn(
        "transition-all duration-200 hover:shadow-sm border border-border/50 bg-card/50",
        todo.completed && "opacity-60",
        isDragging && "opacity-50 shadow-lg z-50 scale-105 rotate-2"
      )}
    >
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          {/* Drag Handle */}
          <div
            {...attributes}
            {...listeners}
            className="flex items-center justify-center w-8 h-8 mt-1 cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground transition-colors touch-none select-none"
            style={{ touchAction: 'none' }}
          >
            <GripVertical className="h-5 w-5" />
          </div>
          <Checkbox
            checked={todo.completed}
            onCheckedChange={handleToggleComplete}
            disabled={isLoading}
            className="mt-1"
          />

          <div className="flex-1 min-w-0">
            {isEditing ? (
              <div className="space-y-3" onKeyDown={handleKeyDown}>
                <Input
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="font-medium border-border/50 focus:border-foreground/20 bg-background/50"
                  placeholder="Todo title"
                  autoFocus
                />
                <Textarea
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  placeholder="Description (optional)"
                  className="border-border/50 focus:border-foreground/20 bg-background/50 min-h-[80px] resize-none"
                  rows={3}
                />
                <Select value={editPriority} onValueChange={(value: "low" | "medium" | "high") => setEditPriority(value)}>
                  <SelectTrigger className="border-border/50 focus:border-foreground/20 bg-background/50">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {priorityOptions.map((option) => {
                      const Icon = option.icon
                      return (
                        <SelectItem key={option.value} value={option.value}>
                          <div className="flex items-center gap-2">
                            <Icon className={`h-4 w-4 ${option.color}`} />
                            <span>{option.label}</span>
                          </div>
                        </SelectItem>
                      )
                    })}
                  </SelectContent>
                </Select>
                <div className="flex gap-2 pt-2">
                  <Button
                    size="sm"
                    onClick={handleSaveEdit}
                    disabled={isLoading || !editTitle.trim()}
                    className="bg-green-600 text-white hover:bg-green-700 disabled:opacity-50"
                  >
                    {isLoading ? (
                      <div className="h-3 w-3 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    ) : (
                      <Check className="h-4 w-4" />
                    )}
                    <span className="ml-1">Save</span>
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleCancelEdit}
                    disabled={isLoading}
                    className="border-border/50 hover:bg-muted/50"
                  >
                    <X className="h-4 w-4" />
                    <span className="ml-1">Cancel</span>
                  </Button>
                </div>
                <div className="text-xs text-muted-foreground mt-2">
                  <span>💡 Press </span>
                  <kbd className="px-1 py-0.5 bg-muted rounded text-xs">Ctrl+Enter</kbd>
                  <span> to save, </span>
                  <kbd className="px-1 py-0.5 bg-muted rounded text-xs">Esc</kbd>
                  <span> to cancel</span>
                </div>
              </div>
            ) : (
              <div>
                <div className="flex items-start justify-between">
                  <h3
                    className={cn(
                      "font-semibold text-lg cursor-pointer hover:text-foreground/80 transition-colors",
                      todo.completed && "line-through text-muted-foreground"
                    )}
                    onDoubleClick={() => !isLoading && setIsEditing(true)}
                    title="Double-click to edit"
                  >
                    {todo.title}
                  </h3>
                </div>

                {todo.description && (
                  <p
                    className={cn(
                      "text-sm text-muted-foreground mt-2 leading-relaxed cursor-pointer hover:text-muted-foreground/80 transition-colors",
                      todo.completed && "line-through"
                    )}
                    onDoubleClick={() => !isLoading && setIsEditing(true)}
                    title="Double-click to edit"
                  >
                    {todo.description}
                  </p>
                )}

                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "flex items-center gap-1.5 px-2 py-1 rounded text-xs font-medium border border-border/50",
                      currentPriority.color
                    )}>
                      <PriorityIcon className="h-3 w-3" />
                      <span className="capitalize">{todo.priority}</span>
                    </div>

                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      <span>{new Date(todo.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {!isEditing && (
            <div className="flex gap-1 opacity-100 transition-opacity duration-200">
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setIsEditing(true)}
                disabled={isLoading}
                className="h-9 w-9 md:h-8 md:w-8 p-0 bg-muted/20 hover:bg-muted/50 text-muted-foreground hover:text-foreground transition-colors border border-border/30 hover:border-border/50 rounded-md"
                title="Edit todo"
              >
                <Edit3 className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={handleDelete}
                disabled={isLoading}
                className="h-9 w-9 md:h-8 md:w-8 p-0 text-red-600 dark:text-red-400 bg-red-50/50 dark:bg-red-900/10 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors border border-red-200/50 dark:border-red-800/30 hover:border-red-200 dark:hover:border-red-800 rounded-md"
                title="Delete todo"
              >
                {isLoading ? (
                  <div className="h-3 w-3 animate-spin rounded-full border-2 border-red-500 border-t-transparent" />
                ) : (
                  <Trash2 className="h-4 w-4" />
                )}
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
