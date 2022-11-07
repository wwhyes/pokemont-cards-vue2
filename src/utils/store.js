import { noop, safeNotEqual, subscribe, runAll, isFunction } from './internal.js'
export { getStoreValue as get } from './internal.js'

const subscriberQueue = []
/**
 * Creates a `Readable` store that allows reading by subscription.
 * @param value initial value
 * @param {StartStopNotifier}start start and stop notifications for subscriptions
 */
function readable (value, start) {
  return {
    subscribe: writable(value, start).subscribe
  }
}
/**
 * Create a `Writable` store that allows both updating and reading by subscription.
 * @param {*=}value initial value
 * @param {StartStopNotifier=}start start and stop notifications for subscriptions
 */
function writable (value, start = noop) {
  let stop
  const subscribers = new Set()
  function set (newValue) {
    if (safeNotEqual(value, newValue)) {
      value = newValue
      if (stop) { // store is ready
        const runQueue = !subscriberQueue.length
        for (const subscriber of subscribers) {
          subscriber[1]()
          subscriberQueue.push(subscriber, value)
        }
        if (runQueue) {
          for (let i = 0; i < subscriberQueue.length; i += 2) {
            subscriberQueue[i][0](subscriberQueue[i + 1])
          }
          subscriberQueue.length = 0
        }
      }
    }
  }
  function update (fn) {
    set(fn(value))
  }
  function subscribe (run, invalidate = noop) {
    const subscriber = [run, invalidate]
    subscribers.add(subscriber)
    if (subscribers.size === 1) {
      stop = start(set) || noop
    }
    run(value)
    return () => {
      subscribers.delete(subscriber)
      if (subscribers.size === 0) {
        stop()
        stop = null
      }
    }
  }
  return { value, set, update, subscribe }
}
function derived (stores, fn, initialValue) {
  const single = !Array.isArray(stores)
  const storesArray = single
    ? [stores]
    : stores
  const auto = fn.length < 2
  return readable(initialValue, (set) => {
    let inited = false
    const values = []
    let pending = 0
    let cleanup = noop
    const sync = () => {
      if (pending) {
        return
      }
      cleanup()
      const result = fn(single ? values[0] : values, set)
      if (auto) {
        set(result)
      } else {
        cleanup = isFunction(result) ? result : noop
      }
    }
    const unsubscribers = storesArray.map((store, i) => subscribe(store, (value) => {
      values[i] = value
      pending &= ~(1 << i)
      if (inited) {
        sync()
      }
    }, () => {
      pending |= (1 << i)
    }))
    inited = true
    sync()
    return function stop () {
      runAll(unsubscribers)
      cleanup()
    }
  })
}

export { derived, readable, writable }
