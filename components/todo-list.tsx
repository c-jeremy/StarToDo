"use client"

import { useState, useEffect } from 'react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { PlusCircle, Circle, Search } from "lucide-react"
import confetti from 'canvas-confetti'

interface TodoItem {
  id: string
  text: string
  dueDate: string
}

export default function TodoList() {
  const [todos, setTodos] = useState<TodoItem[]>([])
  const [newTodo, setNewTodo] = useState('')
  const [newDueDate, setNewDueDate] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    const storedTodos = localStorage.getItem('todos')
    if (storedTodos) {
      setTodos(JSON.parse(storedTodos))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos))
  }, [todos])

  const addTodo = () => {
    if (newTodo.trim() !== '' && newDueDate !== '') {
      const newItem: TodoItem = {
        id: Date.now().toString(),
        text: newTodo,
        dueDate: newDueDate,
      }
      setTodos([...todos, newItem])
      setNewTodo('')
      setNewDueDate('')
      setIsModalOpen(false)
    }
  }

  const deleteTodo = (id: string) => {
    const updatedTodos = todos.filter(todo => todo.id !== id)
    setTodos(updatedTodos)
    if (updatedTodos.length === 0) {
      celebrateCompletion()
    }
  }

  const celebrateCompletion = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    })
  }

  const sortedTodos = todos
    .filter(todo => todo.text.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())

  const getTextColor = (dueDate: string) => {
    const today = new Date().toISOString().split('T')[0]
    if (dueDate > today) return 'text-brown-500'
    if (dueDate === today) return 'text-orange-500'
    return 'text-gray-700'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full p-6">
        <div className="flex justify-between items-center mb-4">
          <div className="relative flex-grow mr-2">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              type="text"
              placeholder="Search todos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogTrigger asChild>
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" /> Add New
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Todo</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="task" className="text-right">
                    Task
                  </Label>
                  <Input
                    id="task"
                    value={newTodo}
                    onChange={(e) => setNewTodo(e.target.value)}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="dueDate" className="text-right">
                    Due Date
                  </Label>
                  <Input
                    id="dueDate"
                    type="date"
                    value={newDueDate}
                    onChange={(e) => setNewDueDate(e.target.value)}
                    className="col-span-3"
                  />
                </div>
              </div>
              <Button onClick={addTodo}>Add Todo</Button>
            </DialogContent>
          </Dialog>
        </div>
        <ul className="space-y-2">
          {sortedTodos.map(todo => (
            <li key={todo.id} className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => deleteTodo(todo.id)}
                aria-label="Delete todo"
              >
                <Circle className="h-4 w-4" />
              </Button>
              <span className={`flex-grow ${getTextColor(todo.dueDate)}`}>{todo.text}</span>
              <span className="text-sm text-gray-500">{todo.dueDate}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
