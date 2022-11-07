export class Spring {
  _store = {}
  stiffness = 0.15
  damping = 0.8
  precision = 0.01

  constructor (value, opts = {}) {
    this._store = value
    Object.assign(this, value, opts)
    return this
  }
}
