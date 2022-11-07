//
// THIS IS BORROWED FROM cannon.js
//

// #############################################################################
//
//               Vector:
//
// #############################################################################

/**
 * 3-dimensional vector
 * @class Vec3
 * @constructor
 * @param {Number} x
 * @param {Number} y
 * @param {Number} z
 * @author schteppe
 * @example
 *     var v = new Vec3(1, 2, 3);
 *     console.log('x=' + v.x); // x=1
 */
function Vec3 (x, y, z) {
  /**
   * @property x
   * @type {Number}
   */
  this.x = x || 0.0

  /**
   * @property y
   * @type {Number}
   */
  this.y = y || 0.0

  /**
   * @property z
   * @type {Number}
   */
  this.z = z || 0.0
}

/**
* @static
* @property {Vec3} ZERO
*/
Vec3.ZERO = new Vec3(0, 0, 0)

/**
* @static
* @property {Vec3} UNIT_X
*/
Vec3.UNIT_X = new Vec3(1, 0, 0)

/**
* @static
* @property {Vec3} UNIT_Y
*/
Vec3.UNIT_Y = new Vec3(0, 1, 0)

/**
* @static
* @property {Vec3} UNIT_Z
*/
Vec3.UNIT_Z = new Vec3(0, 0, 1)

/**
* Vector cross product
* @method cross
* @param {Vec3} v
* @param {Vec3} target Optional. Target to save in.
* @return {Vec3}
*/
Vec3.prototype.cross = function ({ x: vx, y: vy, z: vz }, target = new Vec3()) {
  const { x, y, z } = this
  target.x = (y * vz) - (z * vy)
  target.y = (z * vx) - (x * vz)
  target.z = (x * vy) - (y * vx)
  return target
}

/**
* Set the vectors' 3 elements
* @method set
* @param {Number} x
* @param {Number} y
* @param {Number} z
* @return Vec3
*/
Vec3.prototype.set = function (x, y, z) {
  this.x = x
  this.y = y
  this.z = z
  return this
}

/**
* Set all components of the vector to zero.
* @method setZero
*/
Vec3.prototype.setZero = function () {
  this.x = this.y = this.z = 0
}

/**
* Vector addition
* @method vadd
* @param {Vec3} v
* @param {Vec3} target Optional.
* @return {Vec3}
*/
Vec3.prototype.vadd = function ({ x: vx, y: vy, z: vz }, target) {
  const { x, y, z } = this
  if (target) {
    target.x = vx + x
    target.y = vy + y
    target.z = vz + z
  } else {
    return new Vec3(x + vx, y + vy, z + vz)
  }
}

/**
* Vector subtraction
* @method vsub
* @param {Vec3} v
* @param {Vec3} target Optional. Target to save in.
* @return {Vec3}
*/
Vec3.prototype.vsub = function ({ x: vx, y: vy, z: vz }, target) {
  const { x, y, z } = this
  if (target) {
    target.x = x - vx
    target.y = y - vy
    target.z = z - vz
  } else {
    return new Vec3(x - vx, y - vy, z - vz)
  }
}

// *
//  * Get the cross product matrix a_cross from a vector, such that a x b = a_cross * b = c
//  * @method crossmat
//  * @see http://www8.cs.umu.se/kurser/TDBD24/VT06/lectures/Lecture6.pdf
//  * @return {Mat3}

// Vec3.prototype.crossmat = function () {
//   return new Mat3([
//     0, -this.z, this.y,
//     this.z, 0, -this.x,
//     -this.y, this.x, 0
//   ]);
// };

/**
* Normalize the vector. Note that this changes the values in the vector.
* @method normalize
* @return {Number} Returns the norm of the vector
*/
Vec3.prototype.normalize = function () {
  const { x, y, z } = this
  const n = Math.sqrt(x * x + y * y + z * z)
  if (n > 0.0) {
    const invN = 1 / n
    this.x *= invN
    this.y *= invN
    this.z *= invN
  } else {
    // Make something up
    this.x = 0
    this.y = 0
    this.z = 0
  }
  return n
}

/**
* Get the version of this vector that is of length 1.
* @method unit
* @param {Vec3} target Optional target to save in
* @return {Vec3} Returns the unit vector
*/
Vec3.prototype.unit = function (target = new Vec3()) {
  const { x, y, z } = this
  let ninv = Math.sqrt(x * x + y * y + z * z)

  if (ninv > 0.0) {
    ninv = 1.0 / ninv
    target.x = x * ninv
    target.y = y * ninv
    target.z = z * ninv
  } else {
    target.x = 1
    target.y = 0
    target.z = 0
  }
  return target
}

/**
* Get the length of the vector
* @method norm
* @return {Number}
* @deprecated Use .length() instead
*/
Vec3.prototype.norm = function () {
  const { x, y, z } = this
  return Math.sqrt(x * x + y * y + z * z)
}

/**
* Get the length of the vector
* @method length
* @return {Number}
*/
Vec3.prototype.length = Vec3.prototype.norm

/**
* Get the squared length of the vector
* @method norm2
* @return {Number}
* @deprecated Use .lengthSquared() instead.
*/
Vec3.prototype.norm2 = function () {
  return this.dot(this)
}

/**
* Get the squared length of the vector.
* @method lengthSquared
* @return {Number}
*/
Vec3.prototype.lengthSquared = Vec3.prototype.norm2

/**
* Get distance from this point to another point
* @method distanceTo
* @param  {Vec3} p
* @return {Number}
*/
Vec3.prototype.distanceTo = function ({ x: px, y: py, z: pz }) {
  const { x, y, z } = this
  return Math.sqrt(
    (px - x) * (px - x) +
    (py - y) * (py - y) +
    (pz - z) * (pz - z)
  )
}

/**
* Get squared distance from this point to another point
* @method distanceSquared
* @param  {Vec3} p
* @return {Number}
*/
Vec3.prototype.distanceSquared = function ({ x: px, y: py, z: pz }) {
  const { x, y, z } = this
  return (px - x) * (px - x) +
         (py - y) * (py - y) +
         (pz - z) * (pz - z)
}

/**
* Multiply all the components of the vector with a scalar.
* @deprecated Use .scale instead
* @method mult
* @param {Number} scalar
* @param {Vec3} target The vector to save the result in.
* @return {Vec3}
* @deprecated Use .scale() instead
*/
Vec3.prototype.mult = function (scalar, target = new Vec3()) {
  const { x, y, z } = this

  target.x = scalar * x
  target.y = scalar * y
  target.z = scalar * z
  return target
}

/**
* Multiply the vector with a scalar.
* @method scale
* @param {Number} scalar
* @param {Vec3} target
* @return {Vec3}
*/
Vec3.prototype.scale = Vec3.prototype.mult

/**
* Calculate dot product
* @method dot
* @param {Vec3} v
* @return {Number}
*/
Vec3.prototype.dot = function (v) {
  return this.x * v.x +
         this.y * v.y +
         this.z * v.z
}

/**
* @method isZero
* @return bool
*/
Vec3.prototype.isZero = function () {
  return this.x === 0 && this.y === 0 && this.z === 0
}

/**
* Make the vector point in the opposite direction.
* @method negate
* @param {Vec3} target Optional target to save in
* @return {Vec3}
*/
Vec3.prototype.negate = function (target = new Vec3()) {
  target.x = -this.x
  target.y = -this.y
  target.z = -this.z
  return target
}

/**
* Compute two artificial tangents to the vector
* @method tangents
* @param {Vec3} t1 Vector object to save the first tangent in
* @param {Vec3} t2 Vector object to save the second tangent in
*/
const Vec3TangentsN = new Vec3()
const Vec3TangentsRandVec = new Vec3()
Vec3.prototype.tangents = function (t1, t2) {
  const { x, y, z } = this
  const norm = this.norm()
  if (norm > 0.0) {
    const n = Vec3TangentsN
    const inorm = 1 / norm
    const randVec = Vec3TangentsRandVec

    n.set(x * inorm, y * inorm, z * inorm)

    if (Math.abs(n.x) < 0.9) {
      randVec.set(1, 0, 0)
      n.cross(randVec, t1)
    } else {
      randVec.set(0, 1, 0)
      n.cross(randVec, t1)
    }
    n.cross(t1, t2)
  } else {
    // The normal length is zero, make something up
    t1.set(1, 0, 0)
    t2.set(0, 1, 0)
  }
}

/**
* Converts to a more readable format
* @method toString
* @return string
*/
Vec3.prototype.toString = function () {
  return `${this.x},${this.y},${this.z}`
}

/**
* Converts to an array
* @method toArray
* @return Array
*/
Vec3.prototype.toArray = function () {
  return [this.x, this.y, this.z]
}

/**
* Copies value of source to this vector.
* @method copy
* @param {Vec3} source
* @return {Vec3} this
*/
Vec3.prototype.copy = function ({ x, y, z }) {
  this.x = x
  this.y = y
  this.z = z
  return this
}

/**
* Do a linear interpolation between two vectors
* @method lerp
* @param {Vec3} v
* @param {Number} t A number between 0 and 1. 0 will make this function return u, and 1 will make it return v. Numbers in between will generate a vector in between them.
* @param {Vec3} target
*/
Vec3.prototype.lerp = function ({ x: vx, y: vy, z: vz }, t, target) {
  const { x, y, z } = this
  target.x = x + (vx - x) * t
  target.y = y + (vy - y) * t
  target.z = z + (vz - z) * t
}

/**
* Check if a vector equals is almost equal to another one.
* @method almostEquals
* @param {Vec3} v
* @param {Number} precision
* @return bool
*/
Vec3.prototype.almostEquals = function ({ x: vx, y: vy, z: vz }, precision = 1e-6) {
  const { x, y, z } = this

  if (
    Math.abs(x - vx) > precision ||
    Math.abs(y - vy) > precision ||
    Math.abs(z - vz) > precision
  ) {
    return false
  }
  return true
}

/**
* Check if a vector is almost zero
* @method almostZero
* @param {Number} precision
*/
Vec3.prototype.almostZero = function (precision = 1e-6) {
  const { x, y, z } = this

  if (
    Math.abs(x) > precision ||
    Math.abs(y) > precision ||
    Math.abs(z) > precision
  ) {
    return false
  }

  return true
}

const antipNeg = new Vec3()

/**
* Check if the vector is anti-parallel to another vector.
* @method isAntiparallelTo
* @param  {Vec3}  v
* @param  {Number}  precision Set to zero for exact comparisons
* @return {Boolean}
*/
Vec3.prototype.isAntiparallelTo = function (v, precision) {
  this.negate(antipNeg)
  return antipNeg.almostEquals(v, precision)
}

/**
* Clone the vector
* @method clone
* @return {Vec3}
*/
Vec3.prototype.clone = function () {
  return new Vec3(this.x, this.y, this.z)
}

// #############################################################################
//
//               Quaternion:
//
// #############################################################################

/**
* A Quaternion describes a rotation in 3D space. The Quaternion is mathematically defined as Q = x*i + y*j + z*k + w, where (i,j,k) are imaginary basis vectors. (x,y,z) can be seen as a vector related to the axis of rotation, while the real multiplier, w, is related to the amount of rotation.
* @class Quaternion
* @constructor
* @param {Number} x Multiplier of the imaginary basis vector i.
* @param {Number} y Multiplier of the imaginary basis vector j.
* @param {Number} z Multiplier of the imaginary basis vector k.
* @param {Number} w Multiplier of the real part.
* @see http://en.wikipedia.org/wiki/Quaternion
*/
function Quaternion (x, y, z, w) {
  /**
   * @property {Number} x
   */
  this.x = x !== undefined ? x : 0

  /**
   * @property {Number} y
   */
  this.y = y !== undefined ? y : 0

  /**
   * @property {Number} z
   */
  this.z = z !== undefined ? z : 0

  /**
   * The multiplier of the real quaternion basis vector.
   * @property {Number} w
   */
  this.w = w !== undefined ? w : 1
}

/**
* Set the value of the quaternion.
* @method set
* @param {Number} x
* @param {Number} y
* @param {Number} z
* @param {Number} w
*/
Quaternion.prototype.set = function (x, y, z, w) {
  this.x = x
  this.y = y
  this.z = z
  this.w = w
}

/**
* Convert to a readable format
* @method toString
* @return string
*/
Quaternion.prototype.toString = function () {
  return `${this.x},${this.y},${this.z},${this.w}`
}

/**
* Convert to an Array
* @method toArray
* @return Array
*/
Quaternion.prototype.toArray = function () {
  return [this.x, this.y, this.z, this.w]
}

/**
* Set the quaternion components given an axis and an angle.
* @method setFromAxisAngle
* @param {Vec3} axis
* @param {Number} angle in radians
*/
Quaternion.prototype.setFromAxisAngle = function (axis, angle) {
  const s = Math.sin(angle * 0.5)
  this.x = axis.x * s
  this.y = axis.y * s
  this.z = axis.z * s
  this.w = Math.cos(angle * 0.5)
}

/**
* Converts the quaternion to axis/angle representation.
* @method toAxisAngle
* @param {Vec3} targetAxis Optional. A vector object to reuse for storing the axis.
* @return Array An array, first elemnt is the axis and the second is the angle in radians.
*/
Quaternion.prototype.toAxisAngle = function (targetAxis = new Vec3()) {
  this.normalize() // if w>1 acos and sqrt will produce errors, this cant happen if quaternion is normalised
  const angle = 2 * Math.acos(this.w)
  const s = Math.sqrt(1 - this.w * this.w) // assuming quaternion normalised then w is less than 1, so term always positive.
  if (s < 0.001) { // test to avoid divide by zero, s is always positive due to sqrt
    // if s close to zero then direction of axis not important
    targetAxis.x = this.x // if it is important that axis is normalised then replace with x=1; y=z=0;
    targetAxis.y = this.y
    targetAxis.z = this.z
  } else {
    targetAxis.x = this.x / s // normalise axis
    targetAxis.y = this.y / s
    targetAxis.z = this.z / s
  }
  return [targetAxis, angle]
}

const sfvT1 = new Vec3()
const sfvT2 = new Vec3()

/**
* Set the quaternion value given two vectors. The resulting rotation will be the needed rotation to rotate u to v.
* @method setFromVectors
* @param {Vec3} u
* @param {Vec3} v
*/
Quaternion.prototype.setFromVectors = function (u, v) {
  if (u.isAntiparallelTo(v)) {
    const t1 = sfvT1
    const t2 = sfvT2

    u.tangents(t1, t2)
    this.setFromAxisAngle(t1, Math.PI)
  } else {
    const { x, y, z } = u.cross(v)
    this.x = x
    this.y = y
    this.z = z
    this.w = Math.sqrt(Math.pow(u.norm(), 2) * Math.pow(v.norm(), 2)) + u.dot(v)
    this.normalize()
  }
}

/**
* Quaternion multiplication
* @method mult
* @param {Quaternion} q
* @param {Quaternion} target Optional.
* @return {Quaternion}
*/
const QuaternionMultVa = new Vec3()
const QuaternionMultVb = new Vec3()
const QuaternionMultVaxvb = new Vec3()
Quaternion.prototype.mult = function (q, target = new Quaternion()) {
  const { x, y, z, w } = this
  const va = QuaternionMultVa
  const vb = QuaternionMultVb
  const vaxvb = QuaternionMultVaxvb

  va.set(x, y, z)
  vb.set(q.x, q.y, q.z)
  target.w = w * q.w - va.dot(vb)
  va.cross(vb, vaxvb)

  target.x = w * vb.x + q.w * va.x + vaxvb.x
  target.y = w * vb.y + q.w * va.y + vaxvb.y
  target.z = w * vb.z + q.w * va.z + vaxvb.z

  return target
}

/**
* Get the inverse quaternion rotation.
* @method inverse
* @param {Quaternion} target
* @return {Quaternion}
*/
Quaternion.prototype.inverse = function (target = new Quaternion()) {
  const { x, y, z, w } = this

  this.conjugate(target)

  const inorm2 = 1 / (x * x + y * y + z * z + w * w)
  target.x *= inorm2
  target.y *= inorm2
  target.z *= inorm2
  target.w *= inorm2

  return target
}

/**
* Get the quaternion conjugate
* @method conjugate
* @param {Quaternion} target
* @return {Quaternion}
*/
Quaternion.prototype.conjugate = function (target = new Quaternion()) {
  target.x = -this.x
  target.y = -this.y
  target.z = -this.z
  target.w = this.w

  return target
}

/**
* Normalize the quaternion. Note that this changes the values of the quaternion.
* @method normalize
*/
Quaternion.prototype.normalize = function () {
  const { x, y, z, w } = this
  let l = Math.sqrt(
    x * x +
    y * y +
    z * z +
    w * w
  )

  if (l === 0) {
    this.x = 0
    this.y = 0
    this.z = 0
    this.w = 0
  } else {
    l = 1 / l
    this.x *= l
    this.y *= l
    this.z *= l
    this.w *= l
  }
}

/**
* Approximation of quaternion normalization. Works best when quat is already almost-normalized.
* @method normalizeFast
* @see http://jsperf.com/fast-quaternion-normalization
* @author unphased, https://github.com/unphased
*/
Quaternion.prototype.normalizeFast = function () {
  const { x, y, z, w } = this
  const f = (3.0 - (x * x + y * y + z * z + w * w)) / 2.0
  if (f === 0) {
    this.x = 0
    this.y = 0
    this.z = 0
    this.w = 0
  } else {
    this.x *= f
    this.y *= f
    this.z *= f
    this.w *= f
  }
}

/**
* Multiply the quaternion by a vector
* @method vmult
* @param {Vec3} v
* @param {Vec3} target Optional
* @return {Vec3}
*/
Quaternion.prototype.vmult = function (v, target = new Vec3()) {
  const x = v.x
  const y = v.y
  const z = v.z

  const qx = this.x
  const qy = this.y
  const qz = this.z
  const qw = this.w

  // q*v
  const ix = qw * x + qy * z - qz * y
  const iy = qw * y + qz * x - qx * z
  const iz = qw * z + qx * y - qy * x
  const iw = -qx * x - qy * y - qz * z

  target.x = ix * qw + iw * -qx + iy * -qz - iz * -qy
  target.y = iy * qw + iw * -qy + iz * -qx - ix * -qz
  target.z = iz * qw + iw * -qz + ix * -qy - iy * -qx

  return target
}

/**
* Copies value of source to this quaternion.
* @method copy
* @param {Quaternion} source
* @return {Quaternion} this
*/
Quaternion.prototype.copy = function ({ x, y, z, w }) {
  this.x = x
  this.y = y
  this.z = z
  this.w = w
  return this
}

/**
* Convert the quaternion to euler angle representation. Order: YZX, as this page describes: http://www.euclideanspace.com/maths/standards/index.htm
* @method toEuler
* @param {Vec3} target
* @param string order Three-character string e.g. "YZX", which also is default.
*/
Quaternion.prototype.toEuler = function (target, order = 'YZX') {
  const { x, y, z, w } = this
  let heading
  let attitude
  let bank

  switch (order) {
    case 'YZX': {
      const test = x * y + z * w

      if (test > 0.499) { // singularity at north pole
        heading = 2 * Math.atan2(x, w)
        attitude = Math.PI / 2
        bank = 0
      }
      if (test < -0.499) { // singularity at south pole
        heading = -2 * Math.atan2(x, w)
        attitude = -Math.PI / 2
        bank = 0
      }
      if (isNaN(heading)) {
        const sqx = x * x
        const sqy = y * y
        const sqz = z * z
        heading = Math.atan2(2 * y * w - 2 * x * z, 1 - 2 * sqy - 2 * sqz) // Heading
        attitude = Math.asin(2 * test) // attitude
        bank = Math.atan2(2 * x * w - 2 * y * z, 1 - 2 * sqx - 2 * sqz) // bank
      }
      break
    }
    default:
      throw new Error(`Euler order ${order} not supported yet.`)
  }

  target.y = heading
  target.z = attitude
  target.x = bank
}

/**
* See http://www.mathworks.com/matlabcentral/fileexchange/20696-function-to-convert-between-dcm-euler-angles-quaternions-and-euler-vectors/content/SpinCalc.m
* @method setFromEuler
* @param {Number} x
* @param {Number} y
* @param {Number} z
* @param {String} order The order to apply angles: 'XYZ' or 'YXZ' or any other combination
*/
Quaternion.prototype.setFromEuler = function (x, y, z, order = 'XYZ') {
  const c1 = Math.cos(x / 2)
  const c2 = Math.cos(y / 2)
  const c3 = Math.cos(z / 2)
  const s1 = Math.sin(x / 2)
  const s2 = Math.sin(y / 2)
  const s3 = Math.sin(z / 2)

  if (order === 'XYZ') {
    this.x = s1 * c2 * c3 + c1 * s2 * s3
    this.y = c1 * s2 * c3 - s1 * c2 * s3
    this.z = c1 * c2 * s3 + s1 * s2 * c3
    this.w = c1 * c2 * c3 - s1 * s2 * s3
  } else if (order === 'YXZ') {
    this.x = s1 * c2 * c3 + c1 * s2 * s3
    this.y = c1 * s2 * c3 - s1 * c2 * s3
    this.z = c1 * c2 * s3 - s1 * s2 * c3
    this.w = c1 * c2 * c3 + s1 * s2 * s3
  } else if (order === 'ZXY') {
    this.x = s1 * c2 * c3 - c1 * s2 * s3
    this.y = c1 * s2 * c3 + s1 * c2 * s3
    this.z = c1 * c2 * s3 + s1 * s2 * c3
    this.w = c1 * c2 * c3 - s1 * s2 * s3
  } else if (order === 'ZYX') {
    this.x = s1 * c2 * c3 - c1 * s2 * s3
    this.y = c1 * s2 * c3 + s1 * c2 * s3
    this.z = c1 * c2 * s3 - s1 * s2 * c3
    this.w = c1 * c2 * c3 + s1 * s2 * s3
  } else if (order === 'YZX') {
    this.x = s1 * c2 * c3 + c1 * s2 * s3
    this.y = c1 * s2 * c3 + s1 * c2 * s3
    this.z = c1 * c2 * s3 - s1 * s2 * c3
    this.w = c1 * c2 * c3 - s1 * s2 * s3
  } else if (order === 'XZY') {
    this.x = s1 * c2 * c3 - c1 * s2 * s3
    this.y = c1 * s2 * c3 - s1 * c2 * s3
    this.z = c1 * c2 * s3 + s1 * s2 * c3
    this.w = c1 * c2 * c3 + s1 * s2 * s3
  }

  return this
}

Quaternion.prototype.clone = function () {
  return new Quaternion(this.x, this.y, this.z, this.w)
}

export { Quaternion, Vec3 }
