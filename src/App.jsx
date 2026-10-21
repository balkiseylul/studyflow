import { useState, useEffect } from 'react'

const STORAGE_KEY = 'studyflow-tasks'

const defaultTasks = [
  { id: 1, course: 'Matematik', text: '5. üniteyi tekrar et', done: false },
  { id: 2, course: 'Fizik', text: 'Hareket soruları çöz', done: false },
]

function loadTasks() {
  const saved = localStorage.getItem(STORAGE_KEY)
  if (saved === null) {
    return defaultTasks
  }
  try {
    return JSON.parse(saved)
  } catch {
    return defaultTasks
  }
}

function App() {
  const [tasks, setTasks] = useState(loadTasks)
  const [course, setCourse] = useState('')
  const [text, setText] = useState('')

  const [editingId, setEditingId] = useState(null)
  const [editCourse, setEditCourse] = useState('')
  const [editText, setEditText] = useState('')

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks))
  }, [tasks])

  function addTask() {
    if (course.trim() === '' || text.trim() === '') {
      return
    }

    const newTask = {
      id: Date.now(),
      course: course,
      text: text,
      done: false,
    }

    setTasks([...tasks, newTask])
    setCourse('')
    setText('')
  }

  function deleteTask(id) {
    setTasks(tasks.filter((task) => task.id !== id))
  }

  function toggleDone(id) {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, done: !task.done } : task
      )
    )
  }

  function startEdit(task) {
    setEditingId(task.id)
    setEditCourse(task.course)
    setEditText(task.text)
  }

  function saveEdit() {
    if (editCourse.trim() === '' || editText.trim() === '') {
      return
    }

    setTasks(
      tasks.map((task) =>
        task.id === editingId
          ? { ...task, course: editCourse, text: editText }
          : task
      )
    )
    setEditingId(null)
  }

  function cancelEdit() {
    setEditingId(null)
  }

  return (
    <div className="container py-5">
      <h1 className="text-center">StudyFlow</h1>
      <p className="text-center text-muted">
        Ders çalışma görevlerini takip et.
      </p>

      <div className="card shadow-sm mx-auto" style={{ maxWidth: '600px' }}>
        <div className="card-body">
          <h5 className="card-title mb-3">Yeni Görev Ekle</h5>

          <div className="mb-3">
            <label className="form-label">Ders adı</label>
            <input
              type="text"
              className="form-control"
              placeholder="Örn: Matematik"
              value={course}
              onChange={(e) => setCourse(e.target.value)}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Görev</label>
            <input
              type="text"
              className="form-control"
              placeholder="Örn: 5. üniteyi tekrar et"
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
          </div>

          <button className="btn btn-primary w-100" onClick={addTask}>
            Ekle
          </button>
        </div>
      </div>

      <div className="mx-auto mt-4" style={{ maxWidth: '600px' }}>
        <h5 className="mb-3">Görevlerim</h5>

        {tasks.length === 0 && (
          <p className="text-muted">Henüz görev yok. Yukarıdan ekleyebilirsin.</p>
        )}

        {tasks.map((task) => (
          <div
            key={task.id}
            className={
              task.done
                ? 'card shadow-sm mb-3 border-success'
                : 'card shadow-sm mb-3'
            }
          >
            <div className="card-body">
              {editingId === task.id ? (
                <>
                  <input
                    type="text"
                    className="form-control mb-2"
                    value={editCourse}
                    onChange={(e) => setEditCourse(e.target.value)}
                  />
                  <input
                    type="text"
                    className="form-control mb-3"
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                  />
                  <button
                    className="btn btn-primary btn-sm me-2"
                    onClick={saveEdit}
                  >
                    Kaydet
                  </button>
                  <button
                    className="btn btn-outline-secondary btn-sm"
                    onClick={cancelEdit}
                  >
                    İptal
                  </button>
                </>
              ) : (
                <>
                  <h6 className="card-title">{task.course}</h6>
                  <p
                    className="card-text"
                    style={{
                      textDecoration: task.done ? 'line-through' : 'none',
                    }}
                  >
                    {task.text}
                  </p>
                  <button
                    className="btn btn-success btn-sm me-2"
                    onClick={() => toggleDone(task.id)}
                  >
                    {task.done ? 'Geri Al' : 'Tamamlandı'}
                  </button>
                  <button
                    className="btn btn-outline-secondary btn-sm me-2"
                    onClick={() => startEdit(task)}
                  >
                    Düzenle
                  </button>
                  <button
                    className="btn btn-outline-danger btn-sm"
                    onClick={() => deleteTask(task.id)}
                  >
                    Sil
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default App