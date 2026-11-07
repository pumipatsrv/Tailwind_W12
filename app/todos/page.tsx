'use client'

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { Toggle } from "@/components/tailgrids/core/toggle";
import {
  NativeSelect,
  NativeSelectOption
} from "@/components/tailgrids/core/native-select";
import {
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRoot,
  TableRow
} from "@/components/tailgrids/core/table";
import { Pagination } from "@/components/tailgrids/core/pagination";
import { Spinner } from "@/components/tailgrids/core/spinner";
import { Badge } from "@/components/tailgrids/core/badge";
import { Check, ClockThree, Plus, Trash1 } from "@tailgrids/icons";
import { Button } from "@/components/tailgrids/core/button";
import {
  Dialog,
  DialogBody,
  DialogClose,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/tailgrids/core/dialog";
import { Input } from "@/components/tailgrids/core/input";
import { Label } from "@/components/tailgrids/core/label";
import { Backdrop } from "@/components/tailgrids/core/overlay";
import { TextField } from "@/components/tailgrids/core/text-field";
import { fetchTodos } from "@/app/data/todos";
import type { TodoType } from "@/app/data/todos";
import { checkLogin } from "@/utils/login";

const STORAGE_KEY = 'todosRaw'

// อ่านจาก localStorage (คืน null ถ้ายังไม่มี หรืออ่านไม่ได้)
const readStoredTodos = (): TodoType[] | null => {
  if (typeof window === 'undefined') return null
  try {
    const str = window.localStorage.getItem(STORAGE_KEY)
    if (str === null) return null
    const data: unknown = JSON.parse(str)
    return Array.isArray(data) ? (data as TodoType[]) : null
  } catch {
    return null
  }
}

export default function Page() {
  const router = useRouter()
  useEffect(() => checkLogin(router, '/todos'), [router])

  const [todosRaw, setTodosRaw] = useState<TodoType[]>(() => readStoredTodos() ?? [])
  const [isLoading, setIsLoading] = useState<boolean>(() => readStoredTodos() === null)
  const [onlyWaiting, setOnlyWaiting] = useState<boolean>(false)
  const [itemsPerPage, setItemsPerPage] = useState<number>(5)
  const [page, setPage] = useState<number>(1)
  const [showDialog, setShowDialog] = useState<boolean>(false)

  // อัปเดต state พร้อมบันทึกลง localStorage (บันทึกเฉพาะตอนมีการเปลี่ยนแปลงจริง)
  const saveTodos = (next: TodoType[]) => {
    setTodosRaw(next)
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
    } catch {
      // ถ้าบันทึกไม่ได้ (เช่น storage เต็ม) ก็ใช้ข้อมูลใน state ต่อไป
    }
  }

  // onload: ถ้ายังไม่มีข้อมูลใน localStorage ให้ดึงจาก API
  useEffect(() => {
    if (!isLoading) return
    fetchTodos()
      .then((data) => saveTodos(data as TodoType[]))
      .catch(() => setTodosRaw([]))
      .finally(() => setIsLoading(false))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // ค่าที่คำนวณได้ ไม่ต้องเก็บเป็น state (ไม่ต้องใช้ useEffect)
  const todos = useMemo(
    () => (onlyWaiting ? todosRaw.filter((todo) => !todo.completed) : todosRaw),
    [todosRaw, onlyWaiting]
  )
  const totalPages = Math.max(1, Math.ceil(todos.length / itemsPerPage))
  const currentPage = Math.min(Math.max(page, 1), totalPages)
  const pagedTodos = todos.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )
  const nextId = todosRaw.reduce((p, t) => (t.id > p ? t.id : p), 0) + 1

  // delete
  const deleteTodo = (id: number) => {
    saveTodos(todosRaw.filter((todo) => todo.id !== id))
  }

  // make done (สร้างอาเรย์ใหม่ ไม่แก้ object เดิมตรง ๆ)
  const makeDone = (id: number) => {
    saveTodos(
      todosRaw.map((todo) => (todo.id === id ? { ...todo, completed: true } : todo))
    )
  }

  // add new todo
  const addTodo = () => {
    const titleDom = document.getElementById('title') as HTMLInputElement | null
    const titleStr = titleDom?.value.trim() ?? ''
    if (titleStr === '') return

    const newTodo: TodoType = {
      userId: 1,
      id: nextId,
      title: titleStr,
      completed: false
    }

    saveTodos([...todosRaw, newTodo])
    setShowDialog(false)
  }

  return (
    <>
      <div className="mx-auto max-w-3xl px-2 pb-2 pt-8 text-center">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          Todos
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          รายการงานทั้งหมด {todosRaw.length} รายการ
        </p>
      </div>

      {/* todos container */}
      <div className="mt-4 px-2 max-w-3xl mx-auto">
        {/* controller */}
        <div className="flex justify-between">
          {/* toggle */}
          <div className="flex items-center">
            <Toggle
              label="Show only"
              checked={onlyWaiting}
              onChange={(e) => {
                setOnlyWaiting(e.target.checked)
                setPage(1)
              }}
            />
            &nbsp;
            <Button
              size="sm"
              className="h-8 p-2 bg-yellow-500 pointer-events-none"
            >
              Waiting
              <ClockThree />
            </Button>
          </div>

          {/* dropdown */}
          <div>
            <NativeSelect
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value))
                setPage(1)
              }}
            >
              <NativeSelectOption value={5}>5 items per page</NativeSelectOption>
              <NativeSelectOption value={10}>10 items per page</NativeSelectOption>
              <NativeSelectOption value={50}>50 items per page</NativeSelectOption>
            </NativeSelect>
          </div>
        </div>

        {/* table */}
        <div className="mt-1">
          <TableRoot>
            <TableHeader>
              <TableRow className="bg-black text-white">
                <TableHead className="w-24 font-bold text-right">ID</TableHead>
                <TableHead className="font-bold text-center">Title</TableHead>
                <TableHead className="font-bold flex justify-end items-center gap-2">
                  Completed
                  <Button
                    variant={'primary'}
                    className="h-8 p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
                    onClick={() => setShowDialog(true)}
                  >
                    <Plus />
                  </Button>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {/* show spinner while loading */}
              {isLoading && (
                <TableRow>
                  <TableCell colSpan={3}>
                    <Spinner className="mx-auto" />
                  </TableCell>
                </TableRow>
              )}

              {!isLoading && todos.length === 0 && (
                <TableRow>
                  <TableCell colSpan={3} className="text-center text-red-500">
                    {todosRaw.length === 0
                      ? 'No data, may be connection refused (reload again)'
                      : 'ไม่มีงานที่รออยู่'}
                  </TableCell>
                </TableRow>
              )}

              {/* render data */}
              {pagedTodos.map((todo) => (
                <TableRow key={todo.id}>
                  <TableCell className="text-right">
                    <Badge
                      size={'lg'}
                      className="rounded-lg bg-gray-500 text-white font-b"
                    >
                      {todo.id}
                    </Badge>
                  </TableCell>
                  <TableCell>{todo.title}</TableCell>
                  <TableCell className="flex justify-end gap-1">
                    {todo.completed ? (
                      <Button
                        size="sm"
                        className="h-8 bg-green-700 text-white pointer-events-none"
                      >
                        Done
                        <Check />
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        className="h-8 bg-yellow-500 hover:bg-yellow-700"
                        onClick={() => makeDone(todo.id)}
                      >
                        Waiting
                        <ClockThree />
                      </Button>
                    )}

                    <Button
                      variant="danger"
                      className="h-8 p-2 bg-red-600 hover:bg-red-700 text-white rounded-md"
                      onClick={() => deleteTodo(todo.id)}
                    >
                      <Trash1 />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </TableRoot>
        </div>

        {/* pagination */}
        {todos.length > 0 && (
          <div className="mt-1 w-1/3 mx-auto flex justify-center items-center gap-2">
            <Button
              size="sm"
              appearance="outline"
              onClick={() => setPage(1)}
              disabled={currentPage === 1}
            >
              First
            </Button>
            <div>
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={(p) => setPage(p)}
                sideLayout="icon"
              />
            </div>
            <Button
              size="sm"
              appearance="outline"
              onClick={() => setPage(totalPages)}
              disabled={currentPage === totalPages}
            >
              Last
            </Button>
          </div>
        )}
      </div>

      <Backdrop isOpen={showDialog} onOpenChange={setShowDialog}>
        <Dialog>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-2xl">
              <Plus className="bg-blue-100 rounded-md" size={32} />
              New todo
            </DialogTitle>
          </DialogHeader>

          <DialogBody>
            <form
              className="flex flex-col gap-4"
              onSubmit={(e) => {
                e.preventDefault()
                addTodo()
              }}
            >
              <TextField className="flex flex-col gap-1.5">
                <Label className="font-bold">ID (Auto)</Label>
                <Input
                  className="w-full pointer-events-none bg-gray-100 text-gray-400"
                  value={nextId}
                  readOnly
                />
              </TextField>

              <TextField className="flex flex-col gap-1.5">
                <Label className="font-bold">Title</Label>
                <Input
                  autoFocus
                  placeholder="ใส่งานที่ต้องการเพิ่ม"
                  className="w-full"
                  id="title"
                />
              </TextField>
            </form>
          </DialogBody>

          <DialogFooter>
            <DialogClose appearance="outline">Cancel</DialogClose>
            <DialogClose onClick={() => addTodo()}>Add todo</DialogClose>
          </DialogFooter>
        </Dialog>
      </Backdrop>
    </>
  );
}