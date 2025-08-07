import { useState } from "react"
import { Trash2, Edit3, Check, X, AlertCircle, Circle, Zap, Calendar } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { todoApi } from "@/lib/api"
import type { Todo } from "../types/todo"
import { cn } from "@/lib/utils"

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

  return (
    <Card className={cn(
      "transition-all duration-200 hover:shadow-sm border border-border/50 bg-card/50",
      todo.completed && "opacity-60"
    )}>
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <Checkbox
            checked={todo.completed}
            onCheckedChange={handleToggleComplete}
            disabled={isLoading}
            className="mt-1"
          />

          <div className="flex-1 min-w-0">
            {isEditing ? (
              <div className="space-y-3">
                <Input
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="font-medium border-border/50 focus:border-foreground/20 bg-background/50"
                  placeholder="Todo title"
                />
                <Input
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  placeholder="Description (optional)"
                  className="border-border/50 focus:border-foreground/20 bg-background/50"
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
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={handleSaveEdit}
                    disabled={isLoading}
                    className="bg-foreground text-background hover:bg-foreground/90"
                  >
                    {isLoading ? (
                      <div className="h-3 w-3 animate-spin rounded-full border-2 border-background border-t-transparent" />
                    ) : (
                      <Check className="h-4 w-4" />
                    )}
                    <span className="ml-1">Save</span>
                  </Button>
                  <Button size="sm" variant="outline" onClick={handleCancelEdit} className="border-border/50">
                    <X className="h-4 w-4" />
                    <span className="ml-1">Cancel</span>
                  </Button>
                </div>
              </div>
            ) : (
              <div>
                <div className="flex items-start justify-between">
                  <h3 className={cn(
                    "font-semibold text-lg",
                    todo.completed && "line-through text-muted-foreground"
                  )}>
                    {todo.title}
                  </h3>
                </div>

                {todo.description && (
                  <p className={cn(
                    "text-sm text-muted-foreground mt-2 leading-relaxed",
                    todo.completed && "line-through"
                  )}>
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
            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setIsEditing(true)}
                disabled={isLoading}
                className="h-8 w-8 p-0 hover:bg-muted/50"
              >
                <Edit3 className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={handleDelete}
                disabled={isLoading}
                className="h-8 w-8 p-0 text-red-600 dark:text-red-400 hover:bg-muted/50"
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
