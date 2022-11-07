export function identity (x) {
  return x
}

export function noop () { }

export function safeNotEqual (a, b) {
  return a !== b || ((a && typeof a === 'object') || typeof a === 'function')
}

export function isFunction (thing) {
  return typeof thing === 'function'
}

export function isDate (obj) {
  return Object.prototype.toString.call(obj) === '[object Date]'
}

export function subscribe (store, ...callbacks) {
  if (store == null) {
    return noop
  }
  const unsub = store.subscribe(...callbacks)
  return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub
}

export function run (fn) {
  return fn()
}

export function runAll (fns) {
  fns.forEach(run)
}

export function getStoreValue (store) {
  let value
  subscribe(store, _ => (value = _))()
  return value
}

const isClient = typeof window !== 'undefined'
export const now = isClient
  ? () => window.performance.now()
  : () => Date.now()
const raf = isClient ? (cb) => requestAnimationFrame(cb) : noop

const tasks = new Set()

export function runTasks (now) {
  tasks.forEach(task => {
    if (!task.c(now)) {
      tasks.delete(task)
      task.f()
    }
  })
  if (tasks.size !== 0) {
    raf(runTasks)
  }
}
/**
* Creates a new task that runs on each raf frame
* until it returns a falsy value or is aborted
*/
export function loop (callback) {
  let task
  if (tasks.size === 0) {
    raf(runTasks)
  }

  return {
    promise: new Promise((resolve) => {
      tasks.add(task = { c: callback, f: resolve })
    }),
    abort () {
      tasks.delete(task)
    }
  }
}
