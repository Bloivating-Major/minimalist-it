import { useState } from "react"
import { Plus, AlertCircle, Circle, Zap } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { todoApi } from "@/lib/api"
import type { CreateTodoData } from "../types/todo"

interface AddTodoProps {
  onTodoAdded: () => void
}

const priorityOptions = [
  { value: "low", label: "Low Priority", icon: Circle, color: "text-green-500" },
  { value: "medium", label: "Medium Priority", icon: AlertCircle, color: "text-yellow-500" },
  { value: "high", label: "High Priority", icon: Zap, color: "text-red-500" },
]

export function AddTodo({ onTodoAdded }: AddTodoProps) {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [priority, setPriority] = useState<"low" | "medium" | "high">("medium")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) {
      toast.error("Please enter a todo title")
      return
    }

    setIsLoading(true)
    try {
      const todoData: CreateTodoData = {
        title: title.trim(),
        description: description.trim() || undefined,
        priority
      }

      await todoApi.createTodo(todoData)
      setTitle("")
      setDescription("")
      setPriority("medium")
      onTodoAdded()
      toast.success("Todo created successfully!")
    } catch (error) {
      console.error("Failed to create todo:", error)
      toast.error("Failed to create todo. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="border border-border/50 bg-card/50 backdrop-blur-sm">
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-4">
            <Input
              placeholder="What needs to be done?"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="text-base border-border/50 focus:border-foreground/20 bg-background/50 transition-colors"
              disabled={isLoading}
            />

            <Input
              placeholder="Add a description (optional)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="border-border/50 focus:border-foreground/20 bg-background/50 transition-colors"
              disabled={isLoading}
            />

            <div className="flex gap-3">
              <div className="flex-1">
                <Select value={priority} onValueChange={(value: "low" | "medium" | "high") => setPriority(value)}>
                  <SelectTrigger className="border-border/50 focus:border-foreground/20 bg-background/50">
                    <SelectValue placeholder="Select priority" />
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
              </div>

              <Button
                type="submit"
                disabled={!title.trim() || isLoading}
                className="px-6 bg-foreground text-background hover:bg-foreground/90 transition-colors"
              >
                {isLoading ? (
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent" />
                ) : (
                  <Plus className="h-4 w-4" />
                )}
                <span className="ml-2">Add Todo</span>
              </Button>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
