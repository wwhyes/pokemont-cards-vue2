import { writable } from './store.js'
import { isDate, now, loop, assign, identity as linear } from './internal.js'

function tickSpring (ctx, lastValue, currentValue, targetValue) {
  if (typeof currentValue === 'number' || isDate(currentValue)) {
    // @ts-ignore
    const delta = targetValue - currentValue
    // @ts-ignore
    const velocity = (currentValue - lastValue) / (ctx.dt || 1 / 60) // guard div by 0
    const spring = ctx.opts.stiffness * delta
    const damper = ctx.opts.damping * velocity
    const acceleration = (spring - damper) * ctx.invMass
    const d = (velocity + acceleration) * ctx.dt
    if (Math.abs(d) < ctx.opts.precision && Math.abs(delta) < ctx.opts.precision) {
      return targetValue // settled
    } else {
      ctx.settled = false // signal loop to keep ticking
      // @ts-ignore
      return isDate(currentValue)
        ? new Date(currentValue.getTime() + d)
        : currentValue + d
    }
  } else if (Array.isArray(currentValue)) {
    // @ts-ignore
    return currentValue.map((_, i) => tickSpring(ctx, lastValue[i], currentValue[i], targetValue[i]))
  } else if (typeof currentValue === 'object') {
    const nextValue = {}
    for (const k in currentValue) {
      // @ts-ignore
      nextValue[k] = tickSpring(ctx, lastValue[k], currentValue[k], targetValue[k])
    }
    // @ts-ignore
    return nextValue
  } else {
    throw new Error(`Cannot spring ${typeof currentValue} values`)
  }
}
function spring (value, opts = {}) {
  const store = writable(value)
  const { stiffness = 0.15, damping = 0.8, precision = 0.01 } = opts
  let lastTime
  let task
  let currentToken
  let lastValue = value
  let targetValue = value
  let invMass = 1
  let invMassRecoveryRate = 0
  let cancelTask = false
  function set (newValue, opts = {}) {
    targetValue = newValue
    const token = currentToken = {}
    if (value == null || opts.hard || (spring.stiffness >= 1 && spring.damping >= 1)) {
      cancelTask = true // cancel any running animation
      lastTime = now()
      lastValue = newValue
      store.set(value = targetValue)
      return Promise.resolve()
    } else if (opts.soft) {
      const rate = opts.soft === true ? 0.5 : +opts.soft
      invMassRecoveryRate = 1 / (rate * 60)
      invMass = 0 // infinite mass, unaffected by spring forces
    }
    if (!task) {
      lastTime = now()
      cancelTask = false
      task = loop(now => {
        if (cancelTask) {
          cancelTask = false
          task = null
          return false
        }
        invMass = Math.min(invMass + invMassRecoveryRate, 1)
        const ctx = {
          invMass,
          opts: spring,
          settled: true,
          dt: (now - lastTime) * 60 / 1000
        }
        const nextValue = tickSpring(ctx, lastValue, value, targetValue)
        lastTime = now
        lastValue = value
        store.set(value = nextValue)
        if (ctx.settled) {
          task = null
        }
        return !ctx.settled
      })
    }
    return new Promise((resolve) => {
      task.promise.then(() => {
        if (token === currentToken) {
          resolve()
        }
      })
    })
  }
  const spring = {
    value,
    set,
    update: (fn, opts) => set(fn(targetValue, value), opts),
    subscribe: store.subscribe,
    stiffness,
    damping,
    precision
  }
  return spring
}

function getInterpolator (a, b) {
  // eslint-disable-next-line no-self-compare
  if (a === b || a !== a) {
    return () => a
  }
  const type = typeof a
  // eslint-disable-next-line valid-typeof
  if (type !== typeof b || Array.isArray(a) !== Array.isArray(b)) {
    throw new Error('Cannot interpolate values of different type')
  }
  if (Array.isArray(a)) {
    const arr = b.map((bi, i) => {
      return getInterpolator(a[i], bi)
    })
    return t => arr.map(fn => fn(t))
  }
  if (type === 'object') {
    if (!a || !b) {
      throw new Error('Object cannot be null')
    }
    if (isDate(a) && isDate(b)) {
      a = a.getTime()
      b = b.getTime()
      const delta = b - a
      return t => new Date(a + t * delta)
    }
    const keys = Object.keys(b)
    const interpolators = {}
    keys.forEach(key => {
      interpolators[key] = getInterpolator(a[key], b[key])
    })
    return t => {
      const result = {}
      keys.forEach(key => {
        result[key] = interpolators[key](t)
      })
      return result
    }
  }
  if (type === 'number') {
    const delta = b - a
    return t => a + t * delta
  }
  throw new Error(`Cannot interpolate ${type} values`)
}
function tweened (value, defaults = {}) {
  const store = writable(value)
  let task
  let targetValue = value
  function set (newValue, opts) {
    if (value == null) {
      store.set(value = newValue)
      return Promise.resolve()
    }
    targetValue = newValue
    let previousTask = task
    let started = false
    let { delay = 0, duration = 400, easing = linear, interpolate = getInterpolator } = assign(assign({}, defaults), opts)
    if (duration === 0) {
      if (previousTask) {
        previousTask.abort()
        previousTask = null
      }
      store.set(value = targetValue)
      return Promise.resolve()
    }
    const start = now() + delay
    let fn
    task = loop((now) => {
      if (now < start) {
        return true
      }
      if (!started) {
        fn = interpolate(value, newValue)
        if (typeof duration === 'function') {
          duration = duration(value, newValue)
        }
        started = true
      }
      if (previousTask) {
        previousTask.abort()
        previousTask = null
      }
      const elapsed = now - start
      if (elapsed > duration) {
        store.set(value = newValue)
        return false
      }
      // @ts-ignore
      store.set(value = fn(easing(elapsed / duration)))
      return true
    })
    return task.promise
  }
  return {
    set,
    update: (fn, opts) => set(fn(targetValue, value), opts),
    subscribe: store.subscribe
  }
}

export { spring, tweened }
